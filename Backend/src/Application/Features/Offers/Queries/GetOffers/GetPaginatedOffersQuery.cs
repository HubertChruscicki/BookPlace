using Application.Common.Pagination;
using Application.DTOs.Offers;
using Domain.Enums;
using MediatR;

namespace Application.Features.Offers.Queries.GetOffers;

/// <summary>
/// Query for retrieving paginated offers with filtering options
/// </summary>
public class GetPaginatedOffersQuery : IRequest<PageResult<OfferSummaryDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? City { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int? Guests { get; set; }
    public int? OfferTypeId { get; set; }
    public List<int>? AmenityIds { get; set; }
    public DateOnly? CheckInDate { get; set; }
    public DateOnly? CheckOutDate { get; set; }
    public OfferSortBy? SortBy { get; set; }
}
