using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Reviews;

/// <summary>
/// DTO for creating review
/// </summary>
public class CreateReviewRequestDto
{
    [Required(ErrorMessage = "BookingId is required.")]
    public int BookingId { get; set; }

    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
    public int Rating { get; set; }

    [Required(ErrorMessage = "Content is required.")]
    [StringLength(1000, ErrorMessage = "Content cannot exceed 1000 characters.")]
    public string Content { get; set; } = string.Empty;

    public List<ReviewPhotoRequestDto> Photos { get; set; } = new List<ReviewPhotoRequestDto>();
}

/// <summary>
/// Singular photo DTO for review creation
/// </summary>
public class ReviewPhotoRequestDto
{
    [Required(ErrorMessage = "Base64Data is required.")]
    public string Base64Data { get; set; } = string.Empty;
}
