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
    
    public Booking Booking { get; set; } = null!;
    public User Guest { get; set; } = null!;
    public Offer Offer { get; set; } = null!;
    public ICollection<ReviewPhoto> Photos { get; set; } = new List<ReviewPhoto>();
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
}
