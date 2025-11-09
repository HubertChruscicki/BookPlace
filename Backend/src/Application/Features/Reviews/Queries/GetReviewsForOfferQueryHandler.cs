using Application.Common.Pagination;
using Application.DTOs.Reviews;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Reviews.Queries;

/// <summary>
/// Handler for retrieving paginated reviews for a specific offer
/// </summary>
public class GetReviewsForOfferQueryHandler 
    : IRequestHandler<GetReviewsForOfferQuery, PageResult<ReviewDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    
    public GetReviewsForOfferQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the request to get paginated reviews for an offer
    /// </summary>
    public async Task<PageResult<ReviewDto>> Handle(
        GetReviewsForOfferQuery request, CancellationToken cancellationToken)
    {
        var domainPageResult = await _unitOfWork.Reviews.GetPaginatedReviewsByOfferAsync(
            request, cancellationToken);
        
        var dtoItems = _mapper.Map<List<ReviewDto>>(domainPageResult.Items);
        
        return new PageResult<ReviewDto>(
            dtoItems,
            domainPageResult.TotalItemsCount,
            domainPageResult.PageNumber,
            domainPageResult.PageSize
        );
    }
}
