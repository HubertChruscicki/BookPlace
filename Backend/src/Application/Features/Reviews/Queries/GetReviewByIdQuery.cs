using Application.DTOs.Reviews;
using MediatR;

namespace Application.Features.Reviews.Queries;

/// <summary>
/// Query to get a specific review by ID
/// </summary>
public class GetReviewByIdQuery : IRequest<ReviewDto>
{
    public int ReviewId { get; set; }
}
