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
    /// <param name="offerId">ID of the offer this image belongs to</param>
    /// <param name="photoIndex">Index of the photo for this offer (0-based)</param>
    /// <returns>Result containing URLs for different image sizes</returns>
    Task<ProcessedImageResult> ProcessImageAsync(string base64Data, int offerId, int photoIndex);
}

/// <summary>
/// Result of image processing containing URLs for different sizes
/// </summary>
public class ProcessedImageResult
{
    /// <summary>
    /// URL to the original size image (max 2048px)
    /// </summary>
    public string OriginalUrl { get; set; } = string.Empty;

    /// <summary>
    /// URL to the medium size image (800px)
    /// </summary>
    public string MediumUrl { get; set; } = string.Empty;

    /// <summary>
    /// URL to the thumbnail size image (200px)
    /// </summary>
    public string ThumbnailUrl { get; set; } = string.Empty;
}
