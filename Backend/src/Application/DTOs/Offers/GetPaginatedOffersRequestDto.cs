using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Application.DTOs.Offers;

/// <summary>
/// Request DTO for retrieving paginated offers with filtering options
/// </summary>
public class GetPaginatedOffersRequestDto
{
    /// <summary>
    /// Page number for pagination (default: 1)
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0")]
    public int PageNumber { get; set; } = 1;

    /// <summary>
    /// Number of items per page (default: 10, max: 100)
    /// </summary>
    [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
    public int PageSize { get; set; } = 10;

    /// <summary>
    /// Filter by city name
    /// </summary>
    public string? City { get; set; }

    /// <summary>
    /// Filter by minimum price per night
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "Minimum price must be greater than or equal to 0")]
    public decimal? MinPrice { get; set; }

    /// <summary>
    /// Filter by maximum price per night
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "Maximum price must be greater than or equal to 0")]
    public decimal? MaxPrice { get; set; }

    /// <summary>
    /// Filter by number of guests
    /// </summary>
    [Range(1, 50, ErrorMessage = "Number of guests must be between 1 and 50")]
    public int? Guests { get; set; }

    /// <summary>
    /// Filter by offer type ID
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Offer type ID must be greater than 0")]
    public int? OfferTypeId { get; set; }

    /// <summary>
    /// Filter by amenities (list of amenity IDs)
    /// </summary>
    public List<int>? Amenities { get; set; }

    /// <summary>
    /// Check-in date for availability filtering (format: YYYY-MM-DD)
    /// </summary>
    /// <example>2025-11-18</example>
    public DateOnly? CheckInDate { get; set; }

    /// <summary>
    /// Check-out date for availability filtering (format: YYYY-MM-DD)
    /// </summary>
    /// <example>2025-11-20</example>
    public DateOnly? CheckOutDate { get; set; }

    /// <summary>
    /// Sort offers by specified criteria (default: PriceAsc)
    /// </summary>
    public OfferSortBy SortBy { get; set; } = OfferSortBy.PriceAsc;
}
