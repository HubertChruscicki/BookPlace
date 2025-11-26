namespace Application.DTOs.Conversations;

/// <summary>
/// DTO representing the context/subject of a conversation (booking or review).
/// </summary>
public class ConversationContextDto
{
    /// <summary>
    /// Type of conversation context (Booking, Review).
    /// </summary>
    public string Type { get; set; } = string.Empty;
    
    /// <summary>
    /// Booking ID when conversation is related to a booking.
    /// </summary>
    public int? BookingId { get; set; }
    
    /// <summary>
    /// Booking title (offer title) when conversation is related to a booking.
    /// </summary>
    public string? BookingTitle { get; set; }
    
    /// <summary>
    /// Check-in date when conversation is related to a booking.
    /// </summary>
    public DateOnly? CheckInDate { get; set; }
    
    /// <summary>
    /// Check-out date when conversation is related to a booking.
    /// </summary>
    public DateOnly? CheckOutDate { get; set; }
    
    /// <summary>
    /// Review ID when conversation is related to a review.
    /// </summary>
    public int? ReviewId { get; set; }
}

