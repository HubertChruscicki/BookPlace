using System;

namespace Application.DTOs.Reviews;

/// <summary>
/// Dto for review
/// </summary>
public class ReviewDto
{
    public int Id { get; set; }
    public int BookingId { get; set; }
    public string GuestId { get; set; } = string.Empty;
    
    /// <summary>
    /// Concatenation of User.FirstName and User.LastName
    /// </summary>
    public string GuestName { get; set; } = string.Empty;
    public string? GuestProfilePictureUrl { get; set; }
    
    public int OfferId { get; set; }
    public int Rating { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    
    public List<ReviewPhotoResponseDto> Photos { get; set; } = new List<ReviewPhotoResponseDto>();
}

/// <summary>
/// DTO for review photos
/// </summary>
public class ReviewPhotoResponseDto
{
    public int Id { get; set; }
    public string OriginalUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
}
