using API.Data;
using API.DTO;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Extensions;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
             Thread.Sleep(1000);
            _context = context;
        }

        [HttpGet(Name="GetBasket")] // giving a name to a route
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if(basket == null) return NoContent();

            return Ok( basket.MapBasketDto());
        }

        // api/basket?productId=3&quantity=2
        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity = 1)
        {
            // get basket
            var basket = await RetrieveBasket(GetBuyerId()) ?? CreateBasket();

            // get product
            var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == productId);
            if (product == null) return BadRequest(new ProblemDetails{Title = "Product not found"});

            // add item
           basket.AddItem(product, quantity);

            // save changes
           var result = await _context.SaveChangesAsync() > 0;

           if(result) return CreatedAtRoute("GetBasket", basket.MapBasketDto());

            return BadRequest(new ProblemDetails{Title = "Failed to add product to basket"});
        }

       

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity = 1)
        {
             var basket = await RetrieveBasket(GetBuyerId());
             if(basket == null) return NotFound();
             basket.RemoveItem(productId, quantity);

            // save changes
            var result = await _context.SaveChangesAsync() > 0;
            if(result)  return Ok();
            return BadRequest(new ProblemDetails{Title = "Failed to remove item form the basket"});
        }


        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete(Basket.BUYER_ID);
                return null;
            }

            return await _context.Baskets
            .Include(x => x.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies[Basket.BUYER_ID]);
        }

        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies[Basket.BUYER_ID];
        }

        private Basket CreateBasket()
        {

            string buyerId = User.Identity?.Name;
            if(string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
                Response.Cookies.Append(Basket.BUYER_ID, buyerId, cookieOptions);
            }
            
            var basket = new Basket{BuyerId = buyerId};
            _context.Add(basket);
            return basket;
        }

    }
}