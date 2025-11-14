namespace Domain.Entities;

public class Message
{
    public int Id { get; set; }
    public int ConversationId { get; set; }
    public string SenderId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public bool IsRead { get; set; }
    public ICollection<MessagePhoto> Photos { get; set; } = new List<MessagePhoto>();
    public Conversation Conversation { get; set; } = null!;
    public User Sender { get; set; } = null!;
    
    public static Message Create(int conversationId, string senderId, string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new ArgumentException("Content cannot be empty.", nameof(content));

        return new Message
        {
            ConversationId = conversationId,
            SenderId = senderId,
            Content = content,
            SentAt = DateTime.UtcNow,
            IsRead = false
        };
    }
    
    public void AddPhoto(string originalUrl, string thumbnailUrl)
    {
        var photo = new MessagePhoto
        {
            MessageId = this.Id,
            OriginalUrl = originalUrl,
            ThumbnailUrl = thumbnailUrl
        };
        Photos.Add(photo);
    }
    public void MarkAsRead()
    {
        IsRead = true;
    }
}
