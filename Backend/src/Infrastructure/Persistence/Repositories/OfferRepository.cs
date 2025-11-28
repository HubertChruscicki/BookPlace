using Application.Common.Pagination;
using Application.Features.Offers.Queries.GetMyOffers;
using Application.Features.Offers.Queries.GetOffers;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistance;
using Infrastructure.Persistence.Extensions;
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
            .Include(o => o.Amenities)
            .Include(o => o.Bookings)
            .Where(o => o.Status == OfferStatus.Active && !o.IsArchive);

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

        if (query.Guests.HasValue)
        {
            offerQuery = offerQuery.Where(o => o.MaxGuests >= query.Guests.Value);
        }

        if (query.OfferTypeId.HasValue)
        {
            offerQuery = offerQuery.Where(o => o.OfferTypeId == query.OfferTypeId.Value);
        }

        if (query.AmenityIds != null && query.AmenityIds.Any())
        {
            offerQuery = offerQuery.Where(o => 
                query.AmenityIds.All(amenityId => o.Amenities.Any(a => a.Id == amenityId)));
        }

        if (query.CheckInDate.HasValue && query.CheckOutDate.HasValue)
        {
            offerQuery = offerQuery.Where(o => !o.Bookings.Any(b =>
                (b.Status == BookingStatus.Pending || 
                 b.Status == BookingStatus.Confirmed ||
                 b.Status == BookingStatus.Completed) &&
                b.CheckInDate < query.CheckOutDate.Value &&
                b.CheckOutDate > query.CheckInDate.Value));
        }

        offerQuery = query.SortBy switch
        {
            OfferSortBy.PriceAsc => offerQuery.OrderBy(o => o.PricePerNight),
            OfferSortBy.PriceDesc => offerQuery.OrderByDescending(o => o.PricePerNight),
            _ => offerQuery.OrderByDescending(o => o.Id) // Default: newest first (by Id)
        };

        return await offerQuery.ToPageResultAsync(query.PageNumber, query.PageSize, ct);
    }

    /// <summary>
    /// Gets paginated offers belonging to a specific Host
    /// </summary>
    public async Task<PageResult<Offer>> GetPaginatedOffersForHostAsync(
        GetMyOffersQuery query,
        CancellationToken ct
    )
    {
        var offerQuery = _context.Offers
            .AsNoTracking()
            .Include(o => o.OfferType) 
            .Include(o => o.Photos.Where(p => p.IsCover)) 
            .Where(o => o.HostId == query.UserId);

        if (query.IncludeArchived != true)
        {
            offerQuery = offerQuery.Where(o => !o.IsArchive);
        }

        if (query.Status.HasValue)
        {
            offerQuery = offerQuery.Where(o => o.Status == query.Status.Value);
        }

        offerQuery = offerQuery.OrderByDescending(o => o.Id); 
        
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
    public async Task CreateAsync(Offer offer)
    {
        await _context.Offers.AddAsync(offer);
    }

    /// <summary>
    /// Updates an existing offer in the database
    /// </summary>
    /// <param name="offer">Offer entity to update</param>
    /// <returns>Updated offer</returns>
    public async Task UpdateAsync(Offer offer)
    {
        _context.Offers.Update(offer); 
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
            .AsNoTracking()
            .Include(o => o.OfferType)
            .Include(o => o.Host)
            .Include(o => o.Amenities)
            .Include(o => o.Photos.OrderBy(p => p.SortOrder))
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
    }

    /// <summary>
    /// Gets all offer types
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of all offer types</returns>
    public async Task<List<OfferType>> GetAllOfferTypesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.OfferTypes
            .AsNoTracking()
            .OrderBy(ot => ot.Name)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets all amenities
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of all amenities</returns>
    public async Task<List<Amenity>> GetAllAmenitiesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Amenities
            .AsNoTracking()
            .OrderBy(a => a.Name)
            .ToListAsync(cancellationToken);
    }
}
