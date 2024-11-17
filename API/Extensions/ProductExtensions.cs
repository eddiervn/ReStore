using API.Entities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
            if(string.IsNullOrEmpty(orderBy)) return query.OrderBy(x => x.Name);

            query = orderBy switch
            {
                "price" => query.OrderBy(x => x.Price),
                "priceDesc" => query.OrderByDescending(x => x.Price),
                _ => query.OrderBy(x => x.Name)
            };

            return query;
        }

        // ---------------------------------------------------------------------------------------------------

        public static  IQueryable<Product> Search(this IQueryable<Product> query, string term)
        {
             if(string.IsNullOrEmpty(term)) return query.OrderBy(x => x.Name);
             string lowerCaseTrimmedTerm = term.ToLower().Trim();

             return query.Where(p => p.Name.ToLower().Contains(lowerCaseTrimmedTerm));
        }

        // ---------------------------------------------------------------------------------------------------

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
            var brandsList = new List<string>();
            var typesList = new List<string>();

            if(!string.IsNullOrEmpty(brands))
                brandsList.AddRange(brands.ToLower().Split(','));

            if(!string.IsNullOrEmpty(types))
                typesList.AddRange(types.ToLower().Split(','));

            query = query.Where(x => brandsList.Count == 0 || brandsList.Contains(x.Brand.ToLower()));
            query = query.Where(x => typesList.Count == 0 || typesList.Contains(x.Type.ToLower()));

            return query;
            
        }

       
    }
}