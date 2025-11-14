using Application.Common.Pagination;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistance;
using Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

/// <summary>
/// Repository implementation for message operations
/// </summary>
public class MessageRepository : IMessageRepository
{
    private readonly ApplicationDbContext _context;

    public MessageRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Creates a new message
    /// </summary>
    public async Task<Message> CreateAsync(Message message)
    {
        var result = await _context.Messages.AddAsync(message);
        return result.Entity;
    }

    /// <summary>
    /// Updates an existing message
    /// </summary>
    public Task UpdateAsync(Message message)
    {
        _context.Messages.Update(message);
        return Task.CompletedTask;
    }

    /// <summary>
    /// Gets messages for a conversation with photos ordered by sent time
    /// </summary>
    public async Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(int conversationId)
    {
        return await _context.Messages
            .Include(m => m.Photos)
            .Include(m => m.Sender)
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.SentAt)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Gets a message by ID with photos
    /// </summary>
    public async Task<Message?> GetByIdWithPhotosAsync(int messageId)
    {
        return await _context.Messages
            .Include(m => m.Photos)
            .Include(m => m.Sender)
            .FirstOrDefaultAsync(m => m.Id == messageId);
    }

    /// <summary>
    /// Gets paginated messages for a conversation with reverse pagination (newest on last page).
    /// Validates user access to the conversation.
    /// </summary>
    public async Task<PageResult<Message>> GetConversationMessagesAsync(int conversationId, string userId, int pageNumber, int pageSize, CancellationToken cancellationToken = default)
    {
        var hasAccess = await _context.Conversations
            .Where(c => c.Id == conversationId)
            .AnyAsync(c => c.Participants.Any(p => p.Id == userId), cancellationToken);

        if (!hasAccess)
        {
            throw new UnauthorizedAccessException("User does not have access to this conversation");
        }

        var query = _context.Messages
            .Include(m => m.Photos)
            .Include(m => m.Sender)
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.SentAt); 

        return await query.ToPageResultAsync(pageNumber, pageSize, cancellationToken);
    }
}
