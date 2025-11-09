using Application.Common.Pagination;
using Application.Features.Offers.Queries.GetOffers;
using Domain.Entities;

namespace Application.Interfaces;

public interface IOfferRepository
{
    Task<PageResult<Offer>> GetPaginatedOffersWithOnlyCoverAsync(
        GetPaginatedOffersQuery query,
        CancellationToken ct
    );
    Task<Offer> CreateAsync(Offer offer);
    Task<Offer> UpdateAsync(Offer offer);
    Task<bool> OfferTypeExistsAsync(int offerTypeId);
    Task<List<Amenity>> GetAmenitiesByIdsAsync(List<int> amenityIds);
    Task<Offer?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<List<OfferType>> GetAllOfferTypesAsync(CancellationToken cancellationToken = default);
    Task<List<Amenity>> GetAllAmenitiesAsync(CancellationToken cancellationToken = default);
}