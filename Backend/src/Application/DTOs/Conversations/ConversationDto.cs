using Application.DTOs.Messages;

namespace Application.DTOs.Conversations;

/// <summary>
/// DTO representing a conversation with its initial message
/// </summary>
public class ConversationDto
{
    public int Id { get; set; }
    public int? OfferId { get; set; }
    public int? ReviewId { get; set; }
    public MessageDto InitialMessage { get; set; } = null!;
    public List<string> ParticipantIds { get; set; } = new List<string>();
}

