namespace Application.Common.Pagination;

public class PageResult<T>
{
    public List<T> Items { get; init; }
    public int TotalPages { get; init; }
    public int TotalItemsCount { get; init; }
    public int PageNumber { get; init; }
    public int PageSize { get; init; }

    public PageResult(List<T> items, int totalItemsCount, int pageNumber, int pageSize)
    {
        Items = items;
        TotalItemsCount = totalItemsCount;
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalPages = (int)Math.Ceiling(totalItemsCount / (double)pageSize);
    }
}