using API.DTO;
using API.Entities;

namespace API.Extensions
{
    public static class BasketExtensions
    {
        public static BasketDto MapBasketDto(this Basket basket)
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