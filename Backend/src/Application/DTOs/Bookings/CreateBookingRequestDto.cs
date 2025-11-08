using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Bookings;

/// <summary>
/// Request DTO for creating a new booking
/// </summary>
public class CreateBookingRequestDto
{
    /// <summary>
    /// ID of the offer to book
    /// </summary>
    [Required(ErrorMessage = "Offer ID is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Offer ID must be greater than 0")]
    public int OfferId { get; set; }
    
    /// <summary>
    /// Check-in date for the booking
    /// </summary>
    [Required(ErrorMessage = "Check-in date is required")]
    public DateTime CheckInDate { get; set; }
    
    /// <summary>
    /// Check-out date for the booking
    /// </summary>
    [Required(ErrorMessage = "Check-out date is required")]
    public DateTime CheckOutDate { get; set; }
    
    /// <summary>
    /// Number of guests for the booking
    /// </summary>
    [Required(ErrorMessage = "Number of guests is required")]
    [Range(1, 50, ErrorMessage = "Number of guests must be between 1 and 50")]
    public int NumberOfGuests { get; set; }
}
