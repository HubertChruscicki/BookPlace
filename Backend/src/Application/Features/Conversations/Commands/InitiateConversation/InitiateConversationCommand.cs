using Application.DTOs.Conversations;
using Application.DTOs.Messages;
using MediatR;

namespace Application.Features.Conversations.Commands;

/// <summary>
/// Command to initiate a new conversation
/// </summary>
public class InitiateConversationCommand : IRequest<ConversationDto>
{
    public string SenderId { get; set; } = string.Empty;
    public string MessageContent { get; set; } = string.Empty;
    public int? BookingId { get; set; }
    public int? ReviewId { get; set; }
    public List<MessagePhotoRequestDto> Photos { get; set; } = new List<MessagePhotoRequestDto>();
}