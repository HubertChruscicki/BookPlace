using Application.Common.Pagination;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistance;
using Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

/// <summary>
/// Repository implementation for conversation operations
/// </summary>
public class ConversationRepository : IConversationRepository
{
    private readonly ApplicationDbContext _context;

    public ConversationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Creates a new conversation
    /// </summary>
    public async Task<Conversation> CreateAsync(Conversation conversation)
    {
        var result = await _context.Conversations.AddAsync(conversation);
        return result.Entity;
    }

    /// <summary>
    /// Finds existing conversation by offer or review with participants
    /// </summary>
    public async Task<Conversation?> FindExistingConversationAsync(int? offerId, int? reviewId, string userId)
    {
        return await _context.Conversations
            .Include(c => c.Participants)
            .Where(c => (offerId.HasValue && c.OfferId == offerId) || 
                       (reviewId.HasValue && c.ReviewId == reviewId))
            .FirstOrDefaultAsync(c => c.Participants.Any(p => p.Id == userId));
    }

    /// <summary>
    /// Gets paginated conversations for a user with reverse pagination (newest on last page).
    /// Conversations are ordered by the last message timestamp.
    /// </summary>
    public async Task<PageResult<Conversation>> GetUserConversationsAsync(string userId, string role, int pageNumber, int pageSize, CancellationToken cancellationToken = default)
    {
        IQueryable<Conversation> query = _context.Conversations;
        
        query = query
            .Include(c => c.Participants)
            .Include(c => c.Booking)
                .ThenInclude(b=> b.Offer)
            .Include(c => c.Offer)
            .Include(c => c.Review)
                .ThenInclude(r=>r.Offer)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
                .ThenInclude(m => m.Sender)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
                .ThenInclude(m => m.Photos);
        
        query = query.Where(c => c.Participants.Any(p => p.Id == userId));
            
        if (role.Equals("host", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(c => 
                (c.OfferId != null && c.Offer.HostId == userId) ||
                (c.BookingId != null && c.Booking.Offer.HostId == userId)
            );
        }
        else if (role.Equals("guest", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(c => 
                !(
                    (c.OfferId != null && c.Offer.HostId == userId) ||
                    (c.BookingId != null && c.Booking.Offer.HostId == userId)
                )
            );
        }
            
        var sortedQuery = query.OrderBy(c =>
            c.Messages.OrderByDescending(m => m.SentAt)
                .Select(m => (DateTime?)m.SentAt)
                .FirstOrDefault() ?? DateTime.MinValue);   

        return await sortedQuery.ToPageResultAsync(pageNumber, pageSize, cancellationToken);
    }

    /// <summary>
    /// Gets conversation by context (BookingId or ReviewId) for a user.
    /// </summary>
    public async Task<Conversation?> GetConversationByContextAsync(string userId, int? bookingId, int? reviewId, CancellationToken cancellationToken = default)
    {
        var query = _context.Conversations
            .Include(c => c.Participants)
            .Where(c => c.Participants.Any(p => p.Id == userId));

        if (bookingId.HasValue)
        {
            query = query.Where(c => c.Offer != null && 
                               _context.Bookings.Any(b => b.Id == bookingId && b.OfferId == c.OfferId));
        }
        else if (reviewId.HasValue)
        {
            query = query.Where(c => c.ReviewId == reviewId);
        }
        else
        {
            return null;
        }

        return await query.FirstOrDefaultAsync(cancellationToken);
    }
    
    
    
}