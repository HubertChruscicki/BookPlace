using Application.Common.Pagination;
using Domain.Entities;

namespace Application.Interfaces;

/// <summary>
/// Repository interface for message operations
/// </summary>
public interface IMessageRepository
{
    Task<Message> CreateAsync(Message message);
    Task UpdateAsync(Message message);
    Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(int conversationId);
    Task<Message?> GetByIdWithPhotosAsync(int messageId);
    Task<PageResult<Message>> GetConversationMessagesAsync(int conversationId, string userId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
}
