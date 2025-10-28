using Domain.Entities;

namespace Domain.Interfaces;

/// <summary>
/// Repository interface for managing active JWT tokens in the database.
/// Provides methods for token whitelist operations and session management.
/// </summary>
public interface IActiveTokenRepository
{
    /// <summary>
    /// Adds a token to the active tokens whitelist.
    /// </summary>
    /// <param name="activeToken">The active token entity to add</param>
    Task AddAsync(ActiveToken activeToken);

    /// <summary>
    /// Removes tokens from the whitelist by their JTI values.
    /// </summary>
    /// <param name="jtis">List of JWT IDs to remove</param>
    Task RemoveByJtisAsync(IList<string> jtis);

    /// <summary>
    /// Removes all active tokens for a specific user.
    /// Used during logout or when invalidating all user sessions.
    /// </summary>
    /// <param name="userId">ID of the user whose tokens should be removed</param>
    Task RemoveAllByUserIdAsync(string userId);

    /// <summary>
    /// Checks if a token with the given JTI exists and is active.
    /// </summary>
    /// <param name="jti">JWT ID to check</param>
    /// <returns>True if token exists in whitelist, false otherwise</returns>
    Task<bool> IsTokenActiveAsync(string jti);

    /// <summary>
    /// Gets all active tokens for a specific user.
    /// </summary>
    /// <param name="userId">ID of the user</param>
    /// <returns>List of active tokens for the user</returns>
    Task<IList<ActiveToken>> GetByUserIdAsync(string userId);

    Task RemoveExpiredTokensAsync();
}
