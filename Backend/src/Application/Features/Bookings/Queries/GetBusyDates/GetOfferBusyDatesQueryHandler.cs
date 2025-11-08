using Application.Interfaces;
using MediatR;

namespace Application.Features.Bookings.Queries.GetBusyDates;

/// <summary>
/// Handler for getting busy dates for a specific offer in given month/year
/// </summary>
public class GetOfferBusyDatesQueryHandler : IRequestHandler<GetOfferBusyDatesQuery, List<string>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetOfferBusyDatesQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    
    /// <summary>
    /// Handles the query to get busy dates for an offer in specific month/year
    /// </summary>
    /// <param name="request">The query request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of busy dates as strings in format "yyyy-MM-dd"</returns>
    public async Task<List<string>> Handle(GetOfferBusyDatesQuery request, CancellationToken cancellationToken)
    {
        var offer = await _unitOfWork.Offers.GetByIdAsync(request.OfferId, cancellationToken);
        if (offer == null)
        {
            throw new KeyNotFoundException($"Offer with ID {request.OfferId} not found");
        }

        var busyDates = await _unitOfWork.Bookings.GetBusyDatesForMonthAsync(
            request.OfferId, 
            request.Month, 
            request.Year, 
            cancellationToken);

        return busyDates;
    }
}
