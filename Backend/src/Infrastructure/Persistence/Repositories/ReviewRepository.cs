using Application.Common.Pagination;
using Application.Features.Reviews.Queries;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistance;
using Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

/// <summary>
/// Repository implementation for managing reviews
/// </summary>
public class ReviewRepository : IReviewRepository
{
    private readonly ApplicationDbContext _context;

    public ReviewRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Gets paginated reviews for a specific offer with sorting options
    /// </summary>
    /// <param name="query">Query containing pagination and filtering parameters</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated reviews with guest information</returns>
    public async Task<PageResult<Review>> GetPaginatedReviewsByOfferAsync(
        GetReviewsForOfferQuery query,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Review> reviewQuery = _context.Reviews
            .Include(r => r.Guest)
            .Include(r => r.Photos)
            .Where(r => r.OfferId == query.OfferId && !r.IsArchive)
            .AsNoTracking();

        if (query.OrderBy == "Rating")
        {
            reviewQuery = query.OrderDescending 
                ? reviewQuery.OrderByDescending(r => r.Rating)
                : reviewQuery.OrderBy(r => r.Rating);
        }
        else
        {
            reviewQuery = query.OrderDescending 
                ? reviewQuery.OrderByDescending(r => r.CreatedAt)
                : reviewQuery.OrderBy(r => r.CreatedAt);
        }

        return await reviewQuery.ToPageResultAsync(
            query.PageNumber,
            query.PageSize,
            cancellationToken
        );
    }

    /// <summary>
    /// Gets paginated reviews written by a specific user with sorting options
    /// </summary>
    /// <param name="query">Query containing pagination and filtering parameters</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated reviews with offer information</returns>
    public async Task<PageResult<Review>> GetPaginatedReviewsByUserAsync(
        GetReviewsByUserQuery query,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Review> reviewQuery = _context.Reviews
            .Include(r => r.Guest) 
            .Include(r => r.Photos)
            .Include(r => r.Offer) 
                .ThenInclude(o => o.OfferType)
            .Where(r => r.GuestId == query.UserId && !r.IsArchive)
            .AsNoTracking();

        if (query.OrderBy == "Rating")
        {
            reviewQuery = query.OrderDescending 
                ? reviewQuery.OrderByDescending(r => r.Rating)
                : reviewQuery.OrderBy(r => r.Rating);
        }
        else 
        {
            reviewQuery = query.OrderDescending 
                ? reviewQuery.OrderByDescending(r => r.CreatedAt)
                : reviewQuery.OrderBy(r => r.CreatedAt);
        }

        return await reviewQuery.ToPageResultAsync(
            query.PageNumber,
            query.PageSize,
            cancellationToken
        );
    }

    /// <summary>
    /// Creates a new review
    /// </summary>
    public async Task CreateAsync(Review review)
    {
        await _context.Reviews.AddAsync(review);
    }
    
    /// <summary>
    /// Updates an existing review
    /// </summary>
    public async Task UpdateAsync(Review review)
    {
        _context.Reviews.Update(review);
    }
    public async Task<bool> ExistsForBookingAsync(int bookingId)
    {
        return await _context.Reviews.AnyAsync(r => r.BookingId == bookingId && !r.IsArchive);
    }

    
    /// <summary>
    /// Gets review with all details (photos, booking, offer) - only non-archived reviews
    /// </summary>
    public async Task<Review?> GetReviewWithDetailsAsync(int reviewId)
    {
        return await _context.Reviews
            .Include(r => r.Photos)
            .Include(r => r.Booking)
                .ThenInclude(b => b.Offer)
            .Include(r => r.Guest)
            .FirstOrDefaultAsync(r => r.Id == reviewId && !r.IsArchive);
    }

    /// <summary>
    /// Gets review by ID
    /// </summary>
    /// <summary>
    /// Gets review by ID
    /// </summary>
    public async Task<Review?> GetByIdAsync(int id)
    {
        return await _context.Reviews.FindAsync(id);
    }

}
