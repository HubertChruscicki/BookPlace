using Application.DTOs.Reviews;
using MediatR;

namespace Application.Features.Reviews.Commands;

/// <summary>
/// Command for review creation
/// </summary>
public class CreateReviewCommand : IRequest<ReviewDto>
{
    public string UserId { get; set; } = string.Empty;
    public CreateReviewRequestDto ReviewData { get; set; } = null!;
}
