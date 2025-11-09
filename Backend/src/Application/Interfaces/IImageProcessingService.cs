namespace Application.Interfaces;

/// <summary>
/// Service for processing and resizing images
/// </summary>
public interface IImageProcessingService
{
    /// <summary>
    /// Processes a base64 encoded image and creates multiple sizes
    /// </summary>
    /// <param name="base64Data">Base64 encoded image data</param>
    /// <param name="entityType">Type of entity (ex. offer / review)</param>
    /// <param name="entityId">ID of the entity this image belongs to</param>
    /// <param name="photoIndex">Index of the photo for this offer (0-based)</param>
    /// <returns>Result containing URLs for different image sizes</returns>
    Task<ProcessedImageResult> ProcessImageAsync(string base64Data, string entityType, int entityId, int photoIndex);

}

/// <summary>
/// Result of image processing containing URLs for different sizes
/// </summary>
public class ProcessedImageResult
{
    public string OriginalUrl { get; set; } = string.Empty;
    public string MediumUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
}
