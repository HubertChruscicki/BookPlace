using Application.Common.Pagination;
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
    /// Gets a booking by ID with all related data (Offer, Guest, Host)
    /// </summary>
    /// <param name="bookingId">The booking ID to retrieve</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Booking with related data or null if not found</returns>
    Task<Booking?> GetByIdWithDetailsAsync(int bookingId, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Checks if a date range is available for booking for a specific offer
    /// </summary>
    /// <param name="offerId">The offer ID to check availability for</param>
    /// <param name="checkInDate">Check-in date</param>
    /// <param name="checkOutDate">Check-out date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if the date range is available, false otherwise</returns>
    Task<bool> IsDateRangeAvailableAsync(int offerId, DateTime checkInDate, DateTime checkOutDate, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Gets all busy date ranges for a specific offer
    /// </summary>
    /// <param name="offerId">The offer ID to get busy dates for</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of busy date ranges</returns>
    Task<List<(DateTime StartDate, DateTime EndDate)>> GetBusyDatesAsync(int offerId, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Gets busy dates for a specific offer filtered by month and year
    /// </summary>
    /// <param name="offerId">The offer ID to get busy dates for</param>
    /// <param name="month">Month to filter (1-12)</param>
    /// <param name="year">Year to filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of busy dates as strings</returns>
    Task<List<string>> GetBusyDatesForMonthAsync(int offerId, int month, int year, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Gets a paginated list of user bookings with filtering options
    /// </summary>
    /// <param name="userId">The user ID to get bookings for</param>
    /// <param name="pageNumber">The page number to retrieve</param>
    /// <param name="pageSize">The number of bookings per page</param>
    /// <param name="role">The user role ("guest" or "host")</param>
    /// <param name="status">The booking status to filter by</param>
    /// <param name="offerId">The offer ID to filter by</param>
    /// <param name="dateFrom">The start date for filtering by check-in date</param>
    /// <param name="dateTo">The end date for filtering by check-in date</param>
    /// <returns>A paginated result of bookings</returns>
    Task<PageResult<Booking>> GetPaginatedBookingsAsync(
        string userId,
        int pageNumber,
        int pageSize,
        string? role = null,
        string? status = null,
        int? offerId = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null,
        CancellationToken cancellationToken = default);
}
