using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Persistence.Repositories;

/// <summary>
/// Repository implementation for managing active JWT tokens in the database.
/// Handles token whitelist operations and user session management.
/// </summary>
public class ActiveTokenRepository : IActiveTokenRepository
{
    private readonly ApplicationDbContext _context;
    public ActiveTokenRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ActiveToken activeToken)
    {
        _context.ActiveTokens.Add(activeToken);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveByJtisAsync(IList<string> jtis)
    {
        var tokensToRemove = await _context.ActiveTokens
            .Where(at => jtis.Contains(at.Jti))
            .ToListAsync();

        if (tokensToRemove.Any())
        {
            _context.ActiveTokens.RemoveRange(tokensToRemove);
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveAllByUserIdAsync(string userId)
    {
        var tokensToRemove = await _context.ActiveTokens
            .Where(at => at.UserId == userId)
            .ToListAsync();

        if (tokensToRemove.Any())
        {
            _context.ActiveTokens.RemoveRange(tokensToRemove);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> IsTokenActiveAsync(string jti)
    {
        return await _context.ActiveTokens
            .AnyAsync(at => at.Jti == jti && at.ExpiresAt > DateTime.UtcNow);
    }

    public async Task<IList<ActiveToken>> GetByUserIdAsync(string userId)
    {
        return await _context.ActiveTokens
            .Where(at => at.UserId == userId && at.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();
    }

    public async Task RemoveExpiredTokensAsync()
    {
        var expiredTokens = await _context.ActiveTokens
            .Where(at => at.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync();

        if (expiredTokens.Any())
        {
            _context.ActiveTokens.RemoveRange(expiredTokens);
            await _context.SaveChangesAsync();
        }
    }
}
