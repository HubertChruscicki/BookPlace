using Application.Common.Pagination;
using Application.DTOs.Offers;
using MediatR;

namespace Application.Features.Offers.Queries;

public record GetPaginatedOffersQuery(
    int PageNumber = 1,
    int PageSize = 10,
    string? City = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null
) : IRequest<PageResult<OfferDto>>;