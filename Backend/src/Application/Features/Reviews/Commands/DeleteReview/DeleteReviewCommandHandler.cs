using Application.Features.Reviews.Commands;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Reviews.Commands;

/// <summary>
/// Handler for deleting a review with authorization
/// </summary>
public class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeleteReviewCommandHandler(
        IUnitOfWork unitOfWork,
        IAuthorizationService authorizationService,
        IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _authorizationService = authorizationService;
        _httpContextAccessor = httpContextAccessor;
    }

    /// <summary>
    /// Archives a review (soft delete) after checking ownership authorization
    /// </summary>
    public async Task Handle(DeleteReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _unitOfWork.Reviews.GetByIdAsync(request.ReviewId);
        if (review == null)
        {
            throw new KeyNotFoundException($"Review with ID {request.ReviewId} not found");
        }
        
        if (review.IsArchive)
        {
            throw new InvalidOperationException("Review is already archived");
        }

        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null)
        {
            throw new UnauthorizedAccessException("User context not available");
        }

        var authorizationResult = await _authorizationService.AuthorizeAsync(user, review, "ReviewOwnerPolicy");
        if (!authorizationResult.Succeeded)
        {
            throw new UnauthorizedAccessException("You can only delete your own reviews");
        }

        review.Archive();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
