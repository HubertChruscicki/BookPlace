using Application.Common.Pagination;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistance.Extensions;

public static class QueryableExtensions
{
    public static async Task<PageResult<T>> ToPageResultAsync<T>(
        this IQueryable<T> query,
        int pageNumber,
        int pageSize,
        CancellationToken ct)
    {
        var totalItemsCount = await query.CountAsync(ct);

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PageResult<T>(items, totalItemsCount, pageNumber, pageSize);
    }
}