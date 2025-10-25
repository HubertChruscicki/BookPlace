namespace Application.DTOs.Auth;

/// <summary>
/// Response model containing authentication tokens and user information after successful authentication.
/// </summary>
public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserInfo User { get; set; } = null!;
}

/// <summary>
/// User profile information included in authentication responses.
/// </summary>
public class UserInfo
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public List<string> Roles { get; set; } = new();
}

