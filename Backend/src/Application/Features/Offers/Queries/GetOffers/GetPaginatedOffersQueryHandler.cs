using Application.Common.Pagination;
using Application.DTOs.Offers;
using Application.Interfaces;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Offers.Queries;

public class GetPaginatedOffersQueryHandler 
    : IRequestHandler<GetPaginatedOffersQuery, PageResult<OfferDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    
    public GetPaginatedOffersQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PageResult<OfferDto>> Handle(
        GetPaginatedOffersQuery request, CancellationToken ct)
    {
        var domainPageResult = await _unitOfWork.Offers.GetPaginatedOffersWithOnlyCoverAsync(request, ct);
        var dtoItems = _mapper.Map<List<OfferDto>>(domainPageResult.Items);
        
        return new PageResult<OfferDto>(
            dtoItems,
            domainPageResult.TotalItemsCount,
            domainPageResult.PageNumber,
            domainPageResult.PageSize
        );
    }

}