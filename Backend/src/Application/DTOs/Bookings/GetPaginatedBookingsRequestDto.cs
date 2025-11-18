using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Bookings;

/// <summary>
/// Request DTO for retrieving paginated bookings with filtering options
/// </summary>
public class GetPaginatedBookingsRequestDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0")]
    public int PageNumber { get; set; } = 1;

    [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
    public int PageSize { get; set; } = 10;
    
    [RegularExpression("^(|guest|host)$", ErrorMessage = "Role must be 'guest', 'host', or empty")]
    public string Role { get; set; } = string.Empty;
    
    [RegularExpression("^(|Pending|Confirmed|CancelledByHost|CancelledByGuest|Completed)$", ErrorMessage = "Invalid status value")]
    public string? Status { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Offer ID must be greater than 0")]
    public int? OfferId { get; set; }
    public DateOnly? DateFrom { get; set; }
    public DateOnly? DateTo { get; set; }
}
