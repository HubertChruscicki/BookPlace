using Application.Common.Pagination;
using Application.Features.Offers.Queries;
using Domain.Entities;

namespace Application.Interfaces;

public interface IOfferRepository
{
    Task<PageResult<Offer>> GetPaginatedAsync(
        GetPaginatedOffersQuery query,
        CancellationToken ct
    );
}