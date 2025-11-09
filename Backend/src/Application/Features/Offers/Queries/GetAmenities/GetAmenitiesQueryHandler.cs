using Application.DTOs.Offers;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Offers.Queries.GetAmenities;

/// <summary>
/// Handler for getting all available amenities
/// </summary>
public class GetAmenitiesQueryHandler : IRequestHandler<GetAmenitiesQuery, List<AmenityDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAmenitiesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the request to get all amenities
    /// </summary>
    /// <param name="request">The query request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of amenity DTOs</returns>
    public async Task<List<AmenityDto>> Handle(GetAmenitiesQuery request, CancellationToken cancellationToken)
    {
        var amenities = await _unitOfWork.Offers.GetAllAmenitiesAsync(cancellationToken);
        return _mapper.Map<List<AmenityDto>>(amenities);
    }
}
