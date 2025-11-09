using Application.Common.Pagination;
using Application.DTOs.Reviews;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Reviews.Queries;

/// <summary>
/// Handler for retrieving paginated reviews written by a specific user
/// </summary>
public class GetReviewsByUserQueryHandler 
    : IRequestHandler<GetReviewsByUserQuery, PageResult<ReviewDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    
    public GetReviewsByUserQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the request to get paginated reviews written by a user
    /// </summary>
    public async Task<PageResult<ReviewDto>> Handle(
        GetReviewsByUserQuery request, CancellationToken cancellationToken)
    {
        var domainPageResult = await _unitOfWork.Reviews.GetPaginatedReviewsByUserAsync(
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
