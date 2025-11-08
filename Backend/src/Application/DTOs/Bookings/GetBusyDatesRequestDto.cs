using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Bookings;

/// <summary>
/// Request DTO for retrieving busy dates for an offer
/// </summary>
public class GetBusyDatesRequestDto
{
    [Required(ErrorMessage = "Month is required")]
    [Range(1, 12, ErrorMessage = "Month must be between 1 and 12")]
    public int Month { get; set; }

    [Required(ErrorMessage = "Year is required")]
    [Range(1900, 3000, ErrorMessage = "Year must be between 1900 and 3000")]
    public int Year { get; set; }
}
