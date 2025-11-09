namespace Domain.Entities;

public class Review
{
    public int Id { get; set; }
    public int BookingId { get; set; }
    public string GuestId { get; set; } = string.Empty;
    public int OfferId { get; set; }
    public int Rating { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsArchive { get; set; }
    
    public Booking Booking { get; set; } = null!;
    public User Guest { get; set; } = null!;
    public Offer Offer { get; set; } = null!;
    public ICollection<ReviewPhoto> Photos { get; set; } = new List<ReviewPhoto>();
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
    
    public static Review Create(int bookingId, string guestId, int offerId, int rating, string content)
    {
        if (rating < 1 || rating > 5)
            throw new ArgumentOutOfRangeException(nameof(rating), "Rating must be between 1 and 5.");
            
        if (string.IsNullOrWhiteSpace(content))
            throw new ArgumentException("Content cannot be empty.", nameof(content));

        return new Review
        {
            BookingId = bookingId,
            GuestId = guestId,
            OfferId = offerId,
            Rating = rating,
            Content = content,
            CreatedAt = DateTime.UtcNow
        };
    }
    
    public void AddPhoto(string originalUrl, string thumbnailUrl)
    {
        if (IsArchive)
            throw new InvalidOperationException("Cannot add photos to archived review.");
            
        var photo = new ReviewPhoto
        {
            ReviewId = this.Id,
            OriginalUrl = originalUrl,
            ThumbnailUrl = thumbnailUrl
        };
        Photos.Add(photo);
    }
    
    /// <summary>
    /// Archives the review (soft delete). Archived reviews cannot be modified.
    /// </summary>
    public void Archive()
    {
        IsArchive = true;
    }
}   
