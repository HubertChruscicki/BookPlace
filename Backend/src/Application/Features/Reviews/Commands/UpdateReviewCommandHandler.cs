using Application.DTOs.Reviews;
using Application.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Reviews.Commands;

/// <summary>
/// Handler for updating an existing review with authorization
/// </summary>
public class UpdateReviewCommandHandler : IRequestHandler<UpdateReviewCommand, ReviewDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateReviewCommandHandler(
        IUnitOfWork unitOfWork, 
        IMapper mapper,
        IAuthorizationService authorizationService,
        IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _authorizationService = authorizationService;
        _httpContextAccessor = httpContextAccessor;
    }

    /// <summary>
    /// Updates an existing review after checking ownership authorization
    /// </summary>
    public async Task<ReviewDto> Handle(UpdateReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _unitOfWork.Reviews.GetByIdAsync(request.ReviewId);
        if (review == null)
        {
            throw new KeyNotFoundException($"Review with ID {request.ReviewId} not found");
        }
        
        if (review.IsArchive)
        {
            throw new InvalidOperationException("Cannot update archived review");
        }

        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null)
        {
            throw new UnauthorizedAccessException("User context not available");
        }

        var authorizationResult = await _authorizationService.AuthorizeAsync(user, review, "ReviewOwnerPolicy");
        if (!authorizationResult.Succeeded)
        {
            throw new UnauthorizedAccessException("You can only update your own reviews");
        }

        review.Rating = request.ReviewData.Rating;
        review.Content = request.ReviewData.Content;

        await _unitOfWork.Reviews.UpdateAsync(review);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<ReviewDto>(review);
    }
}
