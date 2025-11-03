using Application.Common.Pagination;
using Application.Features.Offers.Queries;
using Domain.Entities;

namespace Application.Interfaces;

public interface IOfferRepository
{
    Task<PageResult<Offer>> GetPaginatedOffersWithOnlyCoverAsync(
        GetPaginatedOffersQuery query,
        CancellationToken ct
    );

    /// <summary>
    /// Creates a new offer in the database
    /// </summary>
    /// <param name="offer">Offer entity to create</param>
    /// <returns>Created offer with assigned ID</returns>
    Task<Offer> CreateAsync(Offer offer);

    /// <summary>
    /// Updates an existing offer in the database
    /// </summary>
    /// <param name="offer">Offer entity to update</param>
    /// <returns>Updated offer</returns>
    Task<Offer> UpdateAsync(Offer offer);

    /// <summary>
    /// Checks if an offer type exists
    /// </summary>
    /// <param name="offerTypeId">ID of the offer type to check</param>
    /// <returns>True if exists, false otherwise</returns>
    Task<bool> OfferTypeExistsAsync(int offerTypeId);

    /// <summary>
    /// Gets amenities by their IDs
    /// </summary>
    /// <param name="amenityIds">List of amenity IDs</param>
    /// <returns>List of found amenities</returns>
    Task<List<Amenity>> GetAmenitiesByIdsAsync(List<int> amenityIds);

    /// <summary>
    /// Gets an offer by its ID
    /// </summary>
    /// <param name="id">Offer ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Offer if found, null otherwise</returns>
    Task<Offer?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
}