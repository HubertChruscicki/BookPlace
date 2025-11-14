using Application.DTOs.Conversations;
using MediatR;

namespace Application.Features.Conversations.Queries;

/// <summary>
/// Query to check if a conversation exists for a given context.
/// </summary>
public class GetConversationByContextQuery : IRequest<GetConversationByContextResponseDto?>
{
    public string UserId { get; set; } = string.Empty;
    public int? BookingId { get; set; }
    public int? ReviewId { get; set; }
}