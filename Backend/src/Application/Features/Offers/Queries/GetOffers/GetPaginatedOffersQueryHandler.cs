using Application.Common.Pagination;
using Application.DTOs.Offers;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Offers.Queries;

public class GetPaginatedOffersQueryHandler 
    : IRequestHandler<GetPaginatedOffersQuery, PageResult<OfferDto>>
{
    private readonly IOfferRepository _offerRepository;
    private readonly IMapper _mapper;
    
    public GetPaginatedOffersQueryHandler(
        IOfferRepository offerRepository,
        IMapper mapper)
    {
        _offerRepository = offerRepository;
        _mapper = mapper;
    }

    public async Task<PageResult<OfferDto>> Handle(
        GetPaginatedOffersQuery request, CancellationToken ct)
    {
        var domainPageResult = await _offerRepository.GetPaginatedOffersWithOnlyCoverAsync(request, ct);
        var dtoItems = _mapper.Map<List<OfferDto>>(domainPageResult.Items);
        
        return new PageResult<OfferDto>(
            dtoItems,
            domainPageResult.TotalItemsCount,
            domainPageResult.PageNumber,
            domainPageResult.PageSize
        );
    }
    
}