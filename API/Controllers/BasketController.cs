using API.Data;
using API.DTO;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        const string BUYER_ID = "buyerId";

        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
             Thread.Sleep(1000);
            _context = context;
        }

        [HttpGet(Name="GetBasket")] // giving a name to a route
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();
            if(basket == null) return NoContent();

            return Ok( MapBasketDto(basket));
        }

        // api/basket?productId=3&quantity=2
        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity = 1)
        {
            // get basket
            var basket = await RetrieveBasket() ?? CreateBasket();

            // get product
            var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == productId);
            if (product == null) return NotFound();

            // add item
           basket.AddItem(product, quantity);

            // save changes
           var result = await _context.SaveChangesAsync() > 0;

           if(result) return CreatedAtRoute("GetBasket", MapBasketDto(basket));

            return BadRequest(new ProblemDetails{Title = "Failed to add product to basket"});
        }

       

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity = 1)
        {
             var basket = await RetrieveBasket();
             if(basket == null) return NotFound();
             basket.RemoveItem(productId, quantity);

            // save changes
            var result = await _context.SaveChangesAsync() > 0;
            if(result)  return Ok();
            return BadRequest(new ProblemDetails{Title = "Failed to remove item form the basket"});
        }


        private async Task<Basket> RetrieveBasket()
        {
            return await _context.Baskets
            .Include(x => x.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies[BUYER_ID]);
        }

        private Basket CreateBasket()
        {
            string buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
            Response.Cookies.Append(BUYER_ID, buyerId);
            var basket = new Basket{BuyerId = buyerId};
            _context.Add(basket);
            return basket;
        }

        private BasketDto MapBasketDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(x => new  BasketItemDto{
                    ProductId = x.ProductId,
                    Name = x.Product.Name,
                    Type = x.Product.Type,
                    Brand = x.Product.Brand,
                    PictureUrl = x.Product.PictureUrl,
                    Price = x.Product.Price,
                    Quantity = x.Quantity
                }).ToList()
            };
        }
    }
}