namespace API.Helpers
{
    public class PaginationParams
    {
        private const int MAX_PAGE_SIZE = 30;
        private int _pageSize = 6; // default

        public int PageNumber { get; set; } = 1;
        public int PageSize 
        {
            get => _pageSize;
            set => _pageSize = value > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : value;
        }
    }
}