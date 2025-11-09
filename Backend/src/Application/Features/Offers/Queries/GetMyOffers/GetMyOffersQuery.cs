using Application.Common.Pagination;
using Application.DTOs.Offers;
using Domain.Enums;
using MediatR;

namespace Application.Features.Offers.Queries.GetMyOffers;

/// <summary>
/// Query for retrieving paginated offers for the currently authenticated Host
/// </summary>
public class GetMyOffersQuery : IRequest<PageResult<OfferSummaryDto>>
{
    public string UserId { get; set; } = string.Empty; 
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public OfferStatus? Status { get; set; }
    public bool? IncludeArchived { get; set; }
}