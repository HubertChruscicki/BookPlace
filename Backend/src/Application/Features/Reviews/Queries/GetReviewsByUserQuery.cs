using Application.Common.Pagination;
using Application.DTOs.Reviews;
using MediatR;

namespace Application.Features.Reviews.Queries;

/// <summary>
/// Query to get paginated reviews written by a specific user
/// </summary>
public class GetReviewsByUserQuery : IRequest<PageResult<ReviewDto>>
{
    public string UserId { get; set; } = string.Empty;
    public string OrderBy { get; set; } = "CreatedAt";
    public bool OrderDescending { get; set; } = true;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
