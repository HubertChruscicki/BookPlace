using Application.Common.Pagination;
using Application.DTOs.Offers;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Offers.Queries.GetMyOffers;

/// <summary>
/// Handler for GetMyOffersQuery
/// </summary>
public class GetMyOffersQueryHandler 
    : IRequestHandler<GetMyOffersQuery, PageResult<OfferSummaryDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    
    public GetMyOffersQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PageResult<OfferSummaryDto>> Handle(
        GetMyOffersQuery request, CancellationToken ct)
    {
        var domainPageResult = await _unitOfWork.Offers.GetPaginatedOffersForHostAsync(request, ct);
        
        var dtoItems = _mapper.Map<List<OfferSummaryDto>>(domainPageResult.Items);
        
        return new PageResult<OfferSummaryDto>(
            dtoItems,
            domainPageResult.TotalItemsCount,
            domainPageResult.PageNumber,
            domainPageResult.PageSize
        );
    }
}