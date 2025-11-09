using MediatR;

namespace Application.Features.Reviews.Commands;

/// <summary>
/// Command for deleting a review
/// </summary>
public class DeleteReviewCommand : IRequest
{
    public int ReviewId { get; set; }
}
