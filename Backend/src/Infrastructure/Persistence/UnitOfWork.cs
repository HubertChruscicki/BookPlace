using Application.Interfaces;
using BookPlace.Application.Interfaces;
using Domain.Interfaces;
using Infrastructure.Persistance;
using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Persistence;

/// <summary>
/// Unit of Work implementation for coordinating repositories and managing transactions
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;

    // Lazy initialization repositoriów
    private IOfferRepository? _offers;
    private IActiveTokenRepository? _activeTokens;

    /// <summary>
    /// Initializes a new instance of UnitOfWork
    /// </summary>
    /// <param name="context">Database context</param>
    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Offers repository for managing offer entities
    /// </summary>
    public IOfferRepository Offers => _offers ??= new OfferRepository(_context);

    /// <summary>
    /// Active tokens repository for JWT token management
    /// </summary>
    public IActiveTokenRepository ActiveTokens => _activeTokens ??= new ActiveTokenRepository(_context);

    /// <summary>
    /// Saves all pending changes to the database
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of affected entities</returns>
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Begins a new database transaction
    /// </summary>
    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    /// <summary>
    /// Commits the current transaction
    /// </summary>
    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    /// <summary>
    /// Rolls back the current transaction
    /// </summary>
    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    /// <summary>
    /// Disposes the Unit of Work and its resources
    /// </summary>
    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
