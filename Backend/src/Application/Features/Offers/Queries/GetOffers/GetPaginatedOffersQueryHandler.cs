using Application.Common.Pagination;
using Application.DTOs.Offers;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Offers.Queries.GetOffers;

public class GetPaginatedOffersQueryHandler 
    : IRequestHandler<GetPaginatedOffersQuery, PageResult<OfferSummaryDto>>
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

    public async Task<PageResult<OfferSummaryDto>> Handle(
        GetPaginatedOffersQuery request, CancellationToken ct)
    {
        
        if (request.CheckInDate.HasValue != request.CheckOutDate.HasValue)
        {
            throw new InvalidOperationException(
                "Both CheckInDate and CheckOutDate must be provided.");
        }

        if (request.CheckInDate.HasValue && request.CheckOutDate.HasValue)
        {
            var today = DateTime.UtcNow.Date; 

            if (request.CheckInDate.Value.Date < today)
            {
                throw new InvalidOperationException(
                    "Check-in date cannot be in the past.");
            }
            
            if (request.CheckInDate.Value >= request.CheckOutDate.Value)
            {
                throw new InvalidOperationException(
                    "Check-out date must be after check-in date.");
            }
        }
        
        var domainPageResult = await _unitOfWork.Offers.GetPaginatedOffersWithOnlyCoverAsync(request, ct);
        var dtoItems = _mapper.Map<List<OfferSummaryDto>>(domainPageResult.Items);
        
        return new PageResult<OfferSummaryDto>(
            dtoItems,
            domainPageResult.TotalItemsCount,
            domainPageResult.PageNumber,
            domainPageResult.PageSize
        );
    }

}