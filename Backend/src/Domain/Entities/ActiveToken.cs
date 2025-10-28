using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Entities;

/// <summary>
/// Represents an active (whitelisted) JWT token for a user session.
/// Only tokens present in this table are considered valid for authentication.
/// Implements whitelist-based token validation instead of blacklist approach.
/// </summary>
public class ActiveToken
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string Jti { get; set; } = string.Empty;

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public TokenType TokenType { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime ExpiresAt { get; set; }

    public User User { get; set; } = null!;
}
