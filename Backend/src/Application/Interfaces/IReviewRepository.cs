using Application.Common.Pagination;
using Application.Features.Reviews.Queries;
using Domain.Entities;

namespace Application.Interfaces;

/// <summary>
/// Repository interface for managing reviews
/// </summary>
public interface IReviewRepository
{
    Task<Review> CreateAsync(Review review);
    Task<bool> ExistsForBookingAsync(int bookingId);
    Task UpdateAsync(Review review);
    Task<Review?> GetReviewWithDetailsAsync(int reviewId);
    Task<Review?> GetByIdAsync(int id);
    
    /// <summary>
    /// Gets paginated reviews for a specific offer
    /// </summary>
    /// <param name="query">Query containing pagination and filtering parameters</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated reviews with guest information</returns>
    Task<PageResult<Review>> GetPaginatedReviewsByOfferAsync(
        GetReviewsForOfferQuery query,
        CancellationToken cancellationToken = default);
        
    /// <summary>
    /// Gets paginated reviews written by a specific user
    /// </summary>
    /// <param name="query">Query containing pagination and filtering parameters</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated reviews with offer information</returns>
    Task<PageResult<Review>> GetPaginatedReviewsByUserAsync(
        GetReviewsByUserQuery query,
        CancellationToken cancellationToken = default);
}
