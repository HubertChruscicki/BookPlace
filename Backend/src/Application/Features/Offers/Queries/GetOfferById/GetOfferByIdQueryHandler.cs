using Application.DTOs.Offers;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Offers.Queries.GetOfferById;

/// <summary>
/// Handler for retrieving a single offer by ID with all details
/// </summary>
public class GetOfferByIdQueryHandler : IRequestHandler<GetOfferByIdQuery, OfferDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    
    public GetOfferByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the GetOfferByIdQuery and returns full offer details
    /// </summary>
    /// <param name="request">Query containing offer ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Complete offer details with all photos and amenities</returns>
    /// <exception cref="KeyNotFoundException">Thrown when offer is not found or is archived</exception>
    public async Task<OfferDto> Handle(GetOfferByIdQuery request, CancellationToken cancellationToken)
    {
        var offer = await _unitOfWork.Offers.GetByIdAsync(request.OfferId, cancellationToken);
        
        if (offer == null || offer.IsArchive)
        {
            throw new KeyNotFoundException($"Offer with ID {request.OfferId} not found");
        }

        return _mapper.Map<OfferDto>(offer);
    }
}
