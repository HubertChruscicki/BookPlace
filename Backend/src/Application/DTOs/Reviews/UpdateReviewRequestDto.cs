using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Reviews;

/// <summary>
/// Request DTO for updating an existing review
/// </summary>
public class UpdateReviewRequestDto
{
    [Required(ErrorMessage = "Rating is required")]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }

    [Required(ErrorMessage = "Content is required")]
    [MinLength(10, ErrorMessage = "Content must be at least 10 characters long")]
    [MaxLength(1000, ErrorMessage = "Content cannot exceed 1000 characters")]
    public string Content { get; set; } = string.Empty;
}
