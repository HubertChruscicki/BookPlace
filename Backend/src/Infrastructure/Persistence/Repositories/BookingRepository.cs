using Application.Common.Pagination;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistance;
using Infrastructure.Persistance.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

/// <summary>
/// Repository implementation for managing Booking entities
/// </summary>
public class BookingRepository : IBookingRepository
{
    private readonly Infrastructure.Persistance.ApplicationDbContext _context;

    public BookingRepository(Infrastructure.Persistance.ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Adds a new booking to the repository
    /// </summary>
    /// <param name="booking">The booking to add</param>
    /// <param name="cancellationToken">Cancellation token</param>
    public async Task AddAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        await _context.Bookings.AddAsync(booking, cancellationToken);
    }

    /// <summary>
    /// Gets a booking by ID with all related data (Offer, Guest, Host, Photos)
    /// </summary>
    /// <param name="bookingId">The booking ID to retrieve</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Booking with related data or null if not found</returns>
    public async Task<Booking?> GetByIdAsync(int bookingId, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .Include(b => b.Offer)
                .ThenInclude(o => o.Host)
            .Include(b => b.Offer)
                .ThenInclude(o => o.Photos)
            .Include(b => b.Guest)
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == bookingId, cancellationToken);
    }
    
    /// <summary>
    /// Gets a booking by ID with related data for update operations (with tracking)
    /// </summary>
    /// <param name="bookingId">The booking ID to retrieve</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Tracked Booking with related data or null if not found</returns>
    public async Task<Booking?> GetByIdForUpdateAsync(int bookingId, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .Include(b => b.Offer)
            .Include(b => b.Offer)
            .ThenInclude(o => o.Photos)
            .FirstOrDefaultAsync(b => b.Id == bookingId, cancellationToken);
    }

    /// <summary>
    /// Checks if a date range is available for booking for a specific offer
    /// </summary>
    /// <param name="offerId">The offer ID to check availability for</param>
    /// <param name="checkInDate">Check-in date</param>
    /// <param name="checkOutDate">Check-out date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if the date range is available, false otherwise</returns>
    public async Task<bool> IsDateRangeAvailableAsync(int offerId, DateTime checkInDate, DateTime checkOutDate, CancellationToken cancellationToken = default)
    {
        var overlappingBookings = await _context.Bookings
            .Where(b => b.OfferId == offerId 
                && (b.Status == BookingStatus.Confirmed || b.Status == BookingStatus.Pending)
                && b.CheckInDate < checkOutDate 
                && b.CheckOutDate > checkInDate)
            .AnyAsync(cancellationToken);

        return !overlappingBookings;
    }

    /// <summary>
    /// Gets all busy date ranges for a specific offer
    /// </summary>
    /// <param name="offerId">The offer ID to get busy dates for</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of busy date ranges</returns>
    public async Task<List<(DateTime StartDate, DateTime EndDate)>> GetBusyDatesAsync(int offerId, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .Where(b => b.OfferId == offerId && b.Status == BookingStatus.Confirmed)
            .Select(b => new ValueTuple<DateTime, DateTime>(b.CheckInDate, b.CheckOutDate))
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets busy dates for a specific offer filtered by month and year
    /// </summary>
    /// <param name="offerId">The offer ID to get busy dates for</param>
    /// <param name="month">Month to filter (1-12)</param>
    /// <param name="year">Year to filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of busy dates as strings</returns>
    public async Task<List<string>> GetBusyDatesForMonthAsync(int offerId, int month, int year, CancellationToken cancellationToken = default)
    {
        var startOfMonth = DateTime.SpecifyKind(new DateTime(year, month, 1), DateTimeKind.Utc);
        var endOfMonth = DateTime.SpecifyKind(startOfMonth.AddMonths(1), DateTimeKind.Utc);

        var bookings = await _context.Bookings
            .Where(b => b.OfferId == offerId 
                && b.Status == BookingStatus.Confirmed
                && b.CheckInDate <= endOfMonth 
                && b.CheckOutDate >= startOfMonth)
            .Select(b => new { b.CheckInDate, b.CheckOutDate })
            .ToListAsync(cancellationToken);

        var busyDates = new List<string>();
        foreach (var booking in bookings)
        {
            var current = booking.CheckInDate > startOfMonth ? booking.CheckInDate : startOfMonth;
            var end = booking.CheckOutDate < endOfMonth ? booking.CheckOutDate : endOfMonth;

            while (current <= end)
            {
                busyDates.Add(current.ToString("yyyy-MM-dd"));
                current = current.AddDays(1);
            }
        }

        return busyDates.Distinct().OrderBy(d => d).ToList();
    }

    /// <summary>
    /// Gets a paginated list of bookings for a user with filtering options
    /// </summary>
    /// <param name="userId">The user ID to get bookings for</param>
    /// <param name="pageNumber">The page number to retrieve</param>
    /// <param name="pageSize">The number of bookings per page</param>
    /// <param name="role">The user role ("guest" or "host")</param>
    /// <param name="status">The booking status to filter by</param>
    /// <param name="offerId">The offer ID to filter by</param>
    /// <param name="dateFrom">The start date to filter by check-in date</param>
    /// <param name="dateTo">The end date to filter by check-in date</param>
    /// <returns>A paginated result of bookings</returns>
    public async Task<PageResult<Booking>> GetPaginatedBookingsAsync(
        string userId,
        int pageNumber,
        int pageSize,
        string? role = null,
        string? status = null,
        int? offerId = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Bookings
            .Include(b => b.Offer)
                .ThenInclude(o => o.OfferType)
            .Include(b => b.Offer)
                .ThenInclude(o => o.Photos)
            .Include(b => b.Guest)
            .AsNoTracking();

        query = query.Where(b => b.GuestId == userId || b.Offer.HostId == userId);
        
        if (!string.IsNullOrEmpty(role))
        {
            if (role.Equals("guest", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(b => b.GuestId == userId);
            }
            else if (role.Equals("host", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(b => b.Offer.HostId == userId);
            }
            else
            {
                query = query.Where(b => b.GuestId == userId);
            }
        }
        else
        {
            query = query.Where(b => b.GuestId == userId || b.Offer.HostId == userId);
        }

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<BookingStatus>(status, true, out var bookingStatus))
        {
            query = query.Where(b => b.Status == bookingStatus);
        }

        if (offerId.HasValue)
        {
            query = query.Where(b => b.OfferId == offerId.Value);
        }

        if (dateFrom.HasValue)
        {
            query = query.Where(b => b.CheckInDate >= dateFrom.Value);
        }

        if (dateTo.HasValue)
        {
            query = query.Where(b => b.CheckInDate <= dateTo.Value);
        }

        query = query.OrderByDescending(b => b.CreatedAt);

        return await query.ToPageResultAsync(pageNumber, pageSize, cancellationToken);
    }
}
