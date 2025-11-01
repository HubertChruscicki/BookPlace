using Application.Interfaces;
using Domain.Interfaces;

namespace BookPlace.Application.Interfaces;

/// <summary>
/// Unit of Work pattern interface for coordinating repositories and managing transactions
/// </summary>
public interface IUnitOfWork : IDisposable
{
    IOfferRepository Offers { get; }
    IActiveTokenRepository ActiveTokens { get; }
    
    /// <summary>
    /// Saves all pending changes to the database
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of affected entities</returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Begins a new database transaction
    /// </summary>
    Task BeginTransactionAsync();
    
    /// <summary>
    /// Commits the current transaction
    /// </summary>
    Task CommitTransactionAsync();
    
    /// <summary>
    /// Rolls back the current transaction
    /// </summary>
    Task RollbackTransactionAsync();
}

