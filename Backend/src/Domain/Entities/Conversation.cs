namespace Domain.Entities;
public class Conversation
{
    public int Id { get; set; }
    public int? OfferId { get; set; }
    public int? ReviewId { get; set; }
    
    public Offer? Offer { get; set; }
    public Review? Review { get; set; }
    public ICollection<User> Participants { get; set; } = new List<User>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
