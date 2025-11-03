using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistance;
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
    /// Checks if a date range is available for booking for a specific offer
    /// </summary>
    /// <param name="offerId">The offer ID to check availability for</param>
    /// <param name="checkInDate">Check-in date</param>
    /// <param name="checkOutDate">Check-out date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if the date range is available, false otherwise</returns>
    public async Task<bool> IsDateRangeAvailableAsync(int offerId, DateTime checkInDate, DateTime checkOutDate, CancellationToken cancellationToken = default)
    {
        var conflictingBookings = await _context.Bookings
            .AsNoTracking()
            .Where(b => b.OfferId == offerId && 
                       b.Status == BookingStatus.Confirmed &&
                       !(checkOutDate <= b.CheckInDate || checkInDate >= b.CheckOutDate))
            .AnyAsync(cancellationToken);

        return !conflictingBookings;
    }
}
