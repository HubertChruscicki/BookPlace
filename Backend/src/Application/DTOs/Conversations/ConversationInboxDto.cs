using Application.DTOs.Messages;

namespace Application.DTOs.Conversations;

/// <summary>
/// DTO for a user summary (e.g., recipient in an inbox).
/// </summary>
public class UserSummaryDto
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
}

/// <summary>
/// DTO representing a single item in the user's conversation inbox.
/// </summary>
public class ConversationInboxDto
{
    public int Id { get; set; }
    public UserSummaryDto Recipient { get; set; } = null!;
    public MessageDto LastMessage { get; set; } = null!;
    public bool IsUnread { get; set; }
}