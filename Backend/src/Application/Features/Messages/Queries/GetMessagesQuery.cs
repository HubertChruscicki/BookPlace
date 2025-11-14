using Application.Common.Pagination;
using Application.DTOs.Messages;
using MediatR;

namespace Application.Features.Messages.Queries;

/// <summary>
/// Query to get paginated historical messages for a specific conversation.
/// </summary>
public class GetMessagesQuery : IRequest<PageResult<MessageDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int ConversationId { get; set; }
    public string UserId { get; set; } = string.Empty;
}