using Application.Common.Pagination;
using Application.DTOs.Offers;
using MediatR;

namespace Application.Features.Offers.Queries;

/// <summary>
/// Query for retrieving paginated offers with filtering options
/// </summary>
public class GetPaginatedOffersQuery : IRequest<PageResult<OfferDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? City { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}
