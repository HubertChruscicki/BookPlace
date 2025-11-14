using Application.DTOs.Messages;
using Application.DTOs.Conversations;
using MediatR;

namespace Application.Features.Messages.Commands.SendMessage;

/// <summary>
/// Command for sending a message to conversation
/// </summary>
public class SendMessageCommand : IRequest<SendMessageResponseDto>
{
    public int ConversationId { get; set; }
    public string SenderId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<MessagePhotoRequestDto> Photos { get; set; } = new List<MessagePhotoRequestDto>();
}
