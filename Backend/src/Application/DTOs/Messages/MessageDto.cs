namespace Application.DTOs.Messages;

/// <summary>
/// DTO representing a message within conversation
/// </summary>
public class MessageDto
{
    public int Id { get; set; }
    public string SenderId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public List<MessagePhotoDto> Photos { get; set; } = new List<MessagePhotoDto>();
}
