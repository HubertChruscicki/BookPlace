using Application.Common.Pagination;
using Application.Features.Offers.Queries.GetOffers;
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
        var offerQuery = _context.Offers
            .AsNoTracking()
            .Include(o => o.OfferType)
            .Include(o => o.Host)
            .Include(o => o.Photos.Where(p => p.IsCover))
            .Include(o => o.Bookings)
            .Where(o => o.Status == Domain.Enums.OfferStatus.Active && !o.IsArchive);

        if (!string.IsNullOrEmpty(query.City))
        {
            offerQuery = offerQuery.Where(o => 
                o.AddressCity.ToLower().Contains(query.City.ToLower()));
        }

        if (query.MinPrice.HasValue)
        {
            offerQuery = offerQuery.Where(o => o.PricePerNight >= query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            offerQuery = offerQuery.Where(o => o.PricePerNight <= query.MaxPrice.Value);
        }

        if (query.CheckInDate.HasValue && query.CheckOutDate.HasValue)
        {
            var totalOffersBeforeFilter = await _context.Offers
                .Where(o => o.Status == Domain.Enums.OfferStatus.Active && !o.IsArchive)
                .CountAsync(ct);
            
            Console.WriteLine($"[DEBUG] Total active offers before date filtering: {totalOffersBeforeFilter}");
            Console.WriteLine($"[DEBUG] Filtering offers with CheckIn: {query.CheckInDate.Value:yyyy-MM-dd HH:mm:ss}, CheckOut: {query.CheckOutDate.Value:yyyy-MM-dd HH:mm:ss}");
            
            offerQuery = offerQuery.Where(o => !o.Bookings.Any(b =>
                (b.Status == BookingStatus.Pending || 
                 b.Status == BookingStatus.Confirmed ||
                 b.Status == BookingStatus.Completed) &&
                b.CheckInDate < query.CheckOutDate.Value &&
                b.CheckOutDate > query.CheckInDate.Value));
                
            var totalOffersAfterFilter = await offerQuery.CountAsync(ct);
            Console.WriteLine($"[DEBUG] Total offers after date filtering: {totalOffersAfterFilter}");
        }

        return await offerQuery.ToPageResultAsync(query.PageNumber, query.PageSize, ct);
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

    /// <summary>
    /// Gets an offer by its ID
    /// </summary>
    /// <param name="id">Offer ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Offer if found, null otherwise</returns>
    public async Task<Offer?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Offers
            .Include(o => o.OfferType)
            .Include(o => o.Amenities)
            .Include(o => o.Photos.OrderBy(p => p.SortOrder))
            .Include(o => o.Host)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
    }
}
