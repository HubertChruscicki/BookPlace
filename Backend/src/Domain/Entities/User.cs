using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? ProfilePictureUrl { get; set; }
    
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
    public ICollection<Booking> GuestBookings { get; set; } = new List<Booking>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Message> SentMessages { get; set; } = new List<Message>();
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
}
