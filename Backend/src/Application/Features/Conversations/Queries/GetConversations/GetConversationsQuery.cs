using Application.Common.Pagination;
using Application.DTOs.Conversations;
using MediatR;

namespace Application.Features.Conversations.Queries;

/// <summary>
/// Query to get the paginated conversation inbox for a specific user.
/// </summary>
public class GetConversationsQuery : IRequest<PageResult<ConversationInboxDto>>
{
    public string UserId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}