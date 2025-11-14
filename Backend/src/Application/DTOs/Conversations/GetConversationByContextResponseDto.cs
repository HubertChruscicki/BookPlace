namespace Application.DTOs.Conversations;

/// <summary>
/// Response DTO for a successful context check.
/// Returns the ID of the existing conversation.
/// </summary>
public class GetConversationByContextResponseDto
{
    public int ConversationId { get; set; }
}