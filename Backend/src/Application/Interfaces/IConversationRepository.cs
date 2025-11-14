using Application.Common.Pagination;
using Domain.Entities;

namespace Application.Interfaces;

/// <summary>
/// Repository interface for conversation operations
/// </summary>
public interface IConversationRepository
{
    Task<Conversation> CreateAsync(Conversation conversation);
    Task<Conversation?> FindExistingConversationAsync(int? offerId, int? reviewId, string userId);
    Task<PageResult<Conversation>> GetUserConversationsAsync(string userId, string role, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
    Task<Conversation?> GetConversationByContextAsync(string userId, int? bookingId, int? reviewId, CancellationToken cancellationToken = default);
}
