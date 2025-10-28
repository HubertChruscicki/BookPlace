using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Auth;

/// <summary>
/// Request model for logging out a user and invalidating their tokens.
/// Contains both access and refresh tokens to ensure complete session termination.
/// </summary>
public class LogoutRequest
{
    [Required(ErrorMessage = "Access token is required")]
    public string AccessToken { get; set; } = string.Empty;

    [Required(ErrorMessage = "Refresh token is required")]
    public string RefreshToken { get; set; } = string.Empty;
}
