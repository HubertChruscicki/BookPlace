using Application.DTOs.Conversations;
using Application.Features.Conversations;

namespace Application.DTOs.Messages;


/// <summary>
/// Response DTO for sent message
/// </summary>
public class SendMessageResponseDto
{
    public int Id { get; set; }
    public int ConversationId { get; set; }
    public string SenderId { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public List<MessagePhotoDto> Photos { get; set; } = new List<MessagePhotoDto>();
}