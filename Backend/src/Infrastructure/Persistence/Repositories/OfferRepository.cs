using Application.Common.Pagination;
using Application.Features.Offers.Queries;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistance;
using Infrastructure.Persistance.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class OfferRepository : IOfferRepository
{
    private readonly ApplicationDbContext _context;
    
    public async Task<PageResult<Offer>> GetPaginatedAsync(
        GetPaginatedOffersQuery query,
        CancellationToken ct
    )
    {
        IQueryable<Offer> offerQuery = _context.Offers
            .Include(o => o.OfferType) //TODO WSZYSTKIE RELACJE
            .AsNoTracking();
        
        if (!string.IsNullOrEmpty(query.City))
        {
            offerQuery = offerQuery.Where(o => o.AddressCity == query.City);
        }
        if (query.MinPrice.HasValue)
        {
            offerQuery = offerQuery.Where(o => o.PricePerNight >= query.MinPrice.Value);
        }
        // ... inne filtry
        
        // offerQuery = offerQuery.OrderByDescending(o => o.CreatedAt);
        
        return await offerQuery.ToPageResultAsync(
            query.PageNumber,
            query.PageSize,
            ct
        );
    }
}
