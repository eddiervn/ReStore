namespace API.Entities
{
    public class Basket
    {
        public const string BUYER_ID = "buyerId";

        public int Id { get; set; }
        public string BuyerId { get; set; }

        public List<BasketItem> Items { get; set; } = new ();

        public void AddItem(Product product, int quantity)
        {
            var existingItem = Items.FirstOrDefault(x => x.ProductId == product.Id);

            if(existingItem!=null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                Items.Add(new BasketItem
                {
                    Product = product, 
                    Quantity = quantity
                });
            }
        }

        public void RemoveItem(int productId, int quantity)
        {
            var itemToRemove = Items.FirstOrDefault(x => x.ProductId == productId);
            if(itemToRemove== null)
                return;

            if(quantity >= itemToRemove.Quantity)
                Items.Remove(itemToRemove);
            else
                itemToRemove.Quantity -= quantity;
        }
    }
}