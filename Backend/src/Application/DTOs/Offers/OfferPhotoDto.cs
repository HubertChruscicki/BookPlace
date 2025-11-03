namespace Application.DTOs.Offers;

/// <summary>
/// DTO for offer photo URLs
/// </summary>
public class OfferPhotoDto
{
    public int Id { get; set; }
    public string OriginalUrl { get; set; } = string.Empty;
    public string MediumUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public bool IsCover { get; set; }
    public int SortOrder { get; set; }
}
