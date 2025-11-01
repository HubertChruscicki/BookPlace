using Application.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace Infrastructure.Services;

/// <summary>
/// Service for processing and resizing images
/// </summary>
public class ImageProcessingService : IImageProcessingService
{
    private const int OriginalMaxSize = 2048;
    private const int MediumSize = 1024;
    private const int ThumbnailSize = 2056;
    private const int JpegQuality = 85;

    /// <summary>
    /// Processes a base64 encoded image and creates multiple sizes
    /// </summary>
    /// <param name="base64Data">Base64 encoded image data</param>
    /// <param name="offerId">ID of the offer this image belongs to</param>
    /// <param name="photoIndex">Index of the photo for this offer (0-based)</param>
    /// <returns>Result containing URLs for different image sizes</returns>
    /// <exception cref="InvalidOperationException">Thrown when image processing fails</exception>
    public async Task<ProcessedImageResult> ProcessImageAsync(string base64Data, int offerId, int photoIndex)
    {
        try
        {
            var imageBytes = Convert.FromBase64String(base64Data);
            using var image = Image.Load(imageBytes);
            
            // Generate our own filename format: offer_{offerId}_photo_{photoIndex}_{timestamp}
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var baseFileName = $"offer_{offerId}_photo_{photoIndex}_{timestamp}";
            var fileExtension = ".jpg"; // Always save as JPEG for consistency
            
            var uploadsPath = Path.Combine("wwwroot", "uploads", "offers", offerId.ToString());
            Directory.CreateDirectory(uploadsPath);
            
            var originalPath = await ProcessAndSaveImage(image, uploadsPath, $"{baseFileName}_original{fileExtension}", OriginalMaxSize);
            var mediumPath = await ProcessAndSaveImage(image, uploadsPath, $"{baseFileName}_medium{fileExtension}", MediumSize);
            var thumbnailPath = await ProcessAndSaveImage(image, uploadsPath, $"{baseFileName}_thumb{fileExtension}", ThumbnailSize);
            
            var baseUrl = $"/uploads/offers/{offerId}/";
            
            return new ProcessedImageResult
            {
                OriginalUrl = baseUrl + Path.GetFileName(originalPath),
                MediumUrl = baseUrl + Path.GetFileName(mediumPath),
                ThumbnailUrl = baseUrl + Path.GetFileName(thumbnailPath)
            };
        }
        catch (UnknownImageFormatException ex)
        {
            throw new Domain.Exceptions.ImageProcessingException("Unsupported image format. Please upload JPEG, PNG, or other supported formats.", ex);
        }
        catch (ArgumentException ex)
        {
            throw new Domain.Exceptions.ImageProcessingException("Invalid base64 image data provided.", ex);
        }
        catch (Exception ex)
        {
            throw new Domain.Exceptions.ImageProcessingException($"Failed to process image: {ex.Message}", ex);
        }
    }

    /// <summary>
    /// Processes and saves an image with specified maximum size
    /// </summary>
    /// <param name="image">Source image</param>
    /// <param name="directory">Target directory</param>
    /// <param name="fileName">Target filename</param>
    /// <param name="maxSize">Maximum width or height</param>
    /// <returns>Full path to saved file</returns>
    private static async Task<string> ProcessAndSaveImage(Image image, string directory, string fileName, int maxSize)
    {
        var fullPath = Path.Combine(directory, fileName);
        
        using var processedImage = image.Clone(context => { });
        
        var size = processedImage.Size;
        if (size.Width > maxSize || size.Height > maxSize)
        {
            var ratio = Math.Min((double)maxSize / size.Width, (double)maxSize / size.Height);
            var newWidth = (int)(size.Width * ratio);
            var newHeight = (int)(size.Height * ratio);
            
            processedImage.Mutate(x => x.Resize(newWidth, newHeight));
        }
        
        var encoder = new JpegEncoder { Quality = JpegQuality };
        await processedImage.SaveAsync(fullPath, encoder);
        
        return fullPath;
    }
}

