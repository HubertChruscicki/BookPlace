using Application.DTOs.Reviews;
using MediatR;

namespace Application.Features.Reviews.Commands;

/// <summary>
/// Command for updating an existing review
/// </summary>
public class UpdateReviewCommand : IRequest<ReviewDto>
{
    public int ReviewId { get; set; }
    public UpdateReviewRequestDto ReviewData { get; set; } = null!;
}
