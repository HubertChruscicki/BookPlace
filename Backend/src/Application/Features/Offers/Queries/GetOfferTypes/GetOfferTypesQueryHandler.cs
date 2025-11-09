using Application.DTOs.Offers;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Offers.Queries.GetOfferTypes;

/// <summary>
/// Handler for getting all available offer types
/// </summary>
public class GetOfferTypesQueryHandler : IRequestHandler<GetOfferTypesQuery, List<OfferTypeDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetOfferTypesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the request to get all offer types
    /// </summary>
    /// <param name="request">The query request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of offer type DTOs</returns>
    public async Task<List<OfferTypeDto>> Handle(GetOfferTypesQuery request, CancellationToken cancellationToken)
    {
        var offerTypes = await _unitOfWork.Offers.GetAllOfferTypesAsync(cancellationToken);
        return _mapper.Map<List<OfferTypeDto>>(offerTypes);
    }
}
