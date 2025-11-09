using Domain.Interfaces;

namespace Application.Interfaces;

/// <summary>
/// Unit of Work pattern interface for coordinating repositories and managing transactions
/// </summary>
public interface IUnitOfWork
{
    IBookingRepository Bookings { get; }
    IOfferRepository Offers { get; }
    IReviewRepository Reviews { get; }
    IActiveTokenRepository ActiveTokens { get; }

    /// <summary>
    /// Saves all changes to the database
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of changed records</returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}


