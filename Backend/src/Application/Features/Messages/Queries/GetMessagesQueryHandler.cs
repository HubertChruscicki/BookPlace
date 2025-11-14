using Application.Common.Pagination;
using Application.DTOs.Messages;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Messages.Queries;

/// <summary>
/// Handler for retrieving paginated messages from a conversation with reverse pagination (newest on last page).
/// </summary>
public class GetMessagesQueryHandler : IRequestHandler<GetMessagesQuery, PageResult<MessageDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetMessagesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the query to get paginated messages for a conversation.
    /// Uses reverse pagination - newest messages appear on the last page.
    /// </summary>
    /// <param name="request">Query containing conversation ID, user ID and pagination details</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated result with messages</returns>
    public async Task<PageResult<MessageDto>> Handle(GetMessagesQuery request, CancellationToken cancellationToken)
    {
        var messagesResult = await _unitOfWork.Messages.GetConversationMessagesAsync(
            request.ConversationId,
            request.UserId,
            request.PageNumber,
            request.PageSize,
            cancellationToken);

        var mappedItems = _mapper.Map<List<MessageDto>>(messagesResult.Items);
        
        return new PageResult<MessageDto>(
            mappedItems, 
            messagesResult.TotalItemsCount, 
            messagesResult.PageNumber, 
            messagesResult.PageSize);
    }
}
