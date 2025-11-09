using Application.Common.Pagination;
using Application.DTOs.Reviews;
using MediatR;

namespace Application.Features.Reviews.Queries;

/// <summary>
/// Query to get paginated reviews for a specific offer with sorting options
/// </summary>
public class GetReviewsForOfferQuery : IRequest<PageResult<ReviewDto>>
{
    public int OfferId { get; set; }
    public string OrderBy { get; set; } = "CreatedAt";
    public bool OrderDescending { get; set; } = true;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}