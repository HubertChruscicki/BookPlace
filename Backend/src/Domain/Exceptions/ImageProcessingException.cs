using System;

namespace Domain.Exceptions;

/// <summary>
/// Exception thrown when image processing fails
/// </summary>
public class ImageProcessingException : Exception
{
    /// <summary>
    /// Initializes a new instance of the ImageProcessingException class
    /// </summary>
    /// <param name="message">The error message that explains the reason for the exception</param>
    /// <param name="innerException">The exception that is the cause of the current exception</param>
    public ImageProcessingException(string message, Exception? innerException = null) 
        : base(message, innerException)
    {
    }

    /// <summary>
    /// Initializes a new instance of the ImageProcessingException class for specific image processing failure
    /// </summary>
    /// <param name="photoIndex">The index of the photo that failed to process</param>
    /// <param name="reason">The reason for the failure</param>
    /// <param name="innerException">The original exception that caused the failure</param>
    public ImageProcessingException(int photoIndex, string reason, Exception? innerException = null)
        : base($"Failed to process image at index {photoIndex}: {reason}", innerException)
    {
        PhotoIndex = photoIndex;
        Reason = reason;
    }

    public int? PhotoIndex { get; }

    public string? Reason { get; }
}
