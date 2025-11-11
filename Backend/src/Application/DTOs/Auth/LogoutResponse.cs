namespace Application.DTOs.Auth;

/// <summary>
/// Response model for successful logout operation.
/// Contains confirmation message and timestamp of logout.
/// </summary>
public class LogoutResponse
{
    public string Message { get; set; } = "Successfully logged out";
    public DateTime LoggedOutAt { get; set; } = DateTime.UtcNow;
}
