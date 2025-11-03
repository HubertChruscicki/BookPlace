using Domain.Entities;

namespace Application.Interfaces;

/// <summary>
/// Repository interface for managing Booking entities
/// </summary>
public interface IBookingRepository
{
    /// <summary>
    /// Adds a new booking to the repository
    /// </summary>
    /// <param name="booking">The booking to add</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task AddAsync(Booking booking, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Checks if a date range is available for booking for a specific offer
    /// </summary>
    /// <param name="offerId">The offer ID to check availability for</param>
    /// <param name="checkInDate">Check-in date</param>
    /// <param name="checkOutDate">Check-out date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if the date range is available, false otherwise</returns>
    Task<bool> IsDateRangeAvailableAsync(int offerId, DateTime checkInDate, DateTime checkOutDate, CancellationToken cancellationToken = default);
}
