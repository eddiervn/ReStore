using API.Data;
using API.Entities;
using API.Extensions;
using API.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;

         // ---------------------------------------------------------------------------------------------------

        public ProductsController(StoreContext context)
        {
             Thread.Sleep(1000);
            _context = context;
        }

         // ---------------------------------------------------------------------------------------------------

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetAllProducts([FromQuery]ProductParams productParams)
        {
            var query =  _context.Products
            .Filter(productParams.Brands, productParams.Types)
            .Search(productParams.SearchTerm)
            .Sort(productParams.OrderBy)
            .AsQueryable();

            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

           Response.AddPaginationHeader(products.MetaData);

            return Ok(products);
        }

         // ---------------------------------------------------------------------------------------------------

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.SingleOrDefaultAsync(x => x.Id == id);
            if(product == null) return NotFound();
            return Ok(product);
        }

         // ---------------------------------------------------------------------------------------------------

         [HttpGet("filters")]
         public async Task<IActionResult> GetFilters()
         {
            var brands = await _context.Products.Select(x => x.Brand).Distinct().OrderBy(x => x).ToListAsync();
            var types = await _context.Products.Select(x => x.Type).Distinct().OrderBy(x => x).ToListAsync();
            return Ok(new {brands, types});
         }
    }
}