using Application.Interfaces;
using Domain.Interfaces;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Persistence;

/// <summary>
/// Unit of Work implementation for coordinating repositories and managing transactions
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;

    private IBookingRepository? _bookings;
    private IOfferRepository? _offers;
    private IReviewRepository? _reviews;
    private IActiveTokenRepository? _activeTokens;
    private IConversationRepository? _conversations;
    private IMessageRepository? _messages;

    /// <summary>
    /// Initializes a new instance of UnitOfWork
    /// </summary>
    /// <param name="context">Database context</param>
    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IBookingRepository Bookings =>
        _bookings ??= new BookingRepository(_context);

    public IOfferRepository Offers =>
        _offers ??= new OfferRepository(_context);
    
    public IReviewRepository Reviews =>
        _reviews ??= new ReviewRepository(_context);

    public IActiveTokenRepository ActiveTokens =>
        _activeTokens ??= new ActiveTokenRepository(_context);
    
    public IConversationRepository Conversations =>
        _conversations ??= new ConversationRepository(_context);

    public IMessageRepository Messages =>
        _messages ??= new MessageRepository(_context);

    /// <summary>
    /// Saves all changes to the database
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of changed records</returns>
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }
    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
