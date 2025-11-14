using Application.DTOs.Conversations;
using Application.Interfaces;
using MediatR;

namespace Application.Features.Conversations.Queries;

/// <summary>
/// Handler for finding conversation by context (BookingId or ReviewId).
/// </summary>
public class GetConversationByContextQueryHandler : IRequestHandler<GetConversationByContextQuery, GetConversationByContextResponseDto?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetConversationByContextQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Handles the query to find an existing conversation by context.
    /// </summary>
    /// <param name="request">Query containing user ID and context (BookingId or ReviewId)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Response with conversation ID if found, null otherwise</returns>
    public async Task<GetConversationByContextResponseDto?> Handle(GetConversationByContextQuery request, CancellationToken cancellationToken)
    {
        var conversation = await _unitOfWork.Conversations.GetConversationByContextAsync(
            request.UserId,
            request.BookingId,
            request.ReviewId,
            cancellationToken);

        if (conversation == null)
        {
            return null;
        }

        return new GetConversationByContextResponseDto
        {
            ConversationId = conversation.Id
        };
    }
}
