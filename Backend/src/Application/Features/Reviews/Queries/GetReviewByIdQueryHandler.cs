using Application.DTOs.Reviews;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Reviews.Queries;

/// <summary>
/// Handler for retrieving a specific review by ID
/// </summary>
public class GetReviewByIdQueryHandler 
    : IRequestHandler<GetReviewByIdQuery, ReviewDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    
    public GetReviewByIdQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the request to get a review by ID
    /// </summary>
    public async Task<ReviewDto> Handle(
        GetReviewByIdQuery request, CancellationToken cancellationToken)
    {
        var review = await _unitOfWork.Reviews.GetReviewWithDetailsAsync(request.ReviewId);
        
        if (review == null)
        {
            throw new InvalidOperationException($"Review with ID {request.ReviewId} not found.");
        }
        
        return _mapper.Map<ReviewDto>(review);
    }
}
