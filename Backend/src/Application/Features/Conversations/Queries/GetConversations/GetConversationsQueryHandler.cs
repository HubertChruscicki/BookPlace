using Application.Common.Pagination;
using Application.DTOs.Conversations;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Conversations.Queries;

/// <summary>
/// Handler for retrieving paginated user conversations with reverse pagination (newest on last page).
/// </summary>
public class GetConversationsQueryHandler : IRequestHandler<GetConversationsQuery, PageResult<ConversationInboxDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetConversationsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the query to get paginated conversations for a user.
    /// Uses reverse pagination - newest conversations appear on the last page.
    /// </summary>
    /// <param name="request">Query containing user ID and pagination details</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated result with conversation inbox items</returns>
    public async Task<PageResult<ConversationInboxDto>> Handle(GetConversationsQuery request, CancellationToken cancellationToken)
    {
        var conversationsResult = await _unitOfWork.Conversations.GetUserConversationsAsync(
            request.UserId,
            request.Role,
            request.PageNumber,
            request.PageSize,
            cancellationToken);
        
        var mappedItems = _mapper.Map<List<ConversationInboxDto>>(conversationsResult.Items);
        
        foreach (var item in mappedItems)
        {
            var conversation = conversationsResult.Items.First(c => c.Id == item.Id);
            var recipientUser = conversation.Participants
                .FirstOrDefault(p => p.Id != request.UserId);

            item.Recipient = _mapper.Map<UserSummaryDto>(recipientUser) ?? new UserSummaryDto();

            item.IsUnread = conversation.Messages
                .Any(m => m.SenderId != request.UserId && !m.IsRead);
        }
        
        return new PageResult<ConversationInboxDto>(
            mappedItems, 
            conversationsResult.TotalItemsCount, 
            conversationsResult.PageNumber, 
            conversationsResult.PageSize);
    }
}
