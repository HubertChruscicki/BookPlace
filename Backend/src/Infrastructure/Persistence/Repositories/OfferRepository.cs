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

    /// <summary>
    /// Initializes a new instance of the OfferRepository class.
    /// </summary>
    public OfferRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    /// <summary>
    /// Gets paginated offers with only cover photos.
    /// </summary>
    /// <param name="query">The pagination and filtering query.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>A paginated result of offers.</returns>
    public async Task<PageResult<Offer>> GetPaginatedOffersWithOnlyCoverAsync(
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

    /// <summary>
    /// Creates a new offer in the database
    /// </summary>
    /// <param name="offer">Offer entity to create</param>
    /// <returns>Created offer with assigned ID</returns>
    public async Task<Offer> CreateAsync(Offer offer)
    {
        _context.Offers.Add(offer);
        await _context.SaveChangesAsync();

        return await _context.Offers
            .Include(o => o.OfferType)
            .Include(o => o.Amenities)
            .Include(o => o.Photos)
            .FirstAsync(o => o.Id == offer.Id);
    }

    /// <summary>
    /// Updates an existing offer in the database
    /// </summary>
    /// <param name="offer">Offer entity to update</param>
    /// <returns>Updated offer</returns>
    public async Task<Offer> UpdateAsync(Offer offer)
    {
        _context.Offers.Update(offer);
        await _context.SaveChangesAsync();

        // Reload with related entities for response mapping
        return await _context.Offers
            .Include(o => o.OfferType)
            .Include(o => o.Amenities)
            .Include(o => o.Photos)
            .FirstAsync(o => o.Id == offer.Id);
    }

    /// <summary>
    /// Checks if an offer type exists
    /// </summary>
    /// <param name="offerTypeId">ID of the offer type to check</param>
    /// <returns>True if exists, false otherwise</returns>
    public async Task<bool> OfferTypeExistsAsync(int offerTypeId)
    {
        return await _context.OfferTypes
            .AsNoTracking()
            .AnyAsync(ot => ot.Id == offerTypeId);
    }

    /// <summary>
    /// Gets amenities by their IDs
    /// </summary>
    /// <param name="amenityIds">List of amenity IDs</param>
    /// <returns>List of found amenities</returns>
    public async Task<List<Amenity>> GetAmenitiesByIdsAsync(List<int> amenityIds)
    {
        return await _context.Amenities
            .Where(a => amenityIds.Contains(a.Id))
            .ToListAsync();
    }
}
