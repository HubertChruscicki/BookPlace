namespace Domain.Entities;

public class MessagePhoto
{
    public int Id { get; set; }
    public int MessageId { get; set; }
    public string OriginalUrl { get; set; }
    public string ThumbnailUrl { get; set; }
    public Message Message { get; set; } = null!;
}