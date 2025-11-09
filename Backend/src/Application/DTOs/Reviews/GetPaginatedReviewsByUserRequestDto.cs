using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Reviews;

/// <summary>
/// Request DTO for getting paginated reviews written by a specific user
/// </summary>
public class GetPaginatedReviewsByUserRequestDto
{
    /// <summary>
    /// Field to sort by: CreatedAt (default) or Rating
    /// </summary>
    [RegularExpression("^(CreatedAt|Rating)$", ErrorMessage = "OrderBy must be either 'CreatedAt' or 'Rating'.")]
    public string OrderBy { get; set; } = "CreatedAt";
    
    /// <summary>
    /// Sort order: true for descending (default), false for ascending
    /// </summary>
    public bool OrderDescending { get; set; } = true;
    
    /// <summary>
    /// Page number (minimum 1)
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0.")]
    public int PageNumber { get; set; } = 1;
    
    /// <summary>
    /// Page size (between 1 and 50)
    /// </summary>
    [Range(1, 50, ErrorMessage = "Page size must be between 1 and 50.")]
    public int PageSize { get; set; } = 10;
}
