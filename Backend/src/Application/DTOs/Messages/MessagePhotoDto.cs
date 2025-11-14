namespace Application.DTOs.Messages;

/// <summary>
/// DTO representing a message photo
/// </summary>
public class MessagePhotoDto
{
    public int Id { get; set; }
    public string OriginalUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
}