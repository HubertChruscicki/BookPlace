using Application.DTOs.Auth;
using MediatR;

namespace Application.Features.Authentication.PromoteToHost;

/// <summary>
/// Command to promote a Guest user to Host role, enabling them to create accommodation offers.
/// </summary>
public class PromoteToHostCommand : IRequest<AuthResponse>
{
    /// <summary>
    /// The unique identifier of the user to promote to Host role.
    /// </summary>
    public string UserId { get; set; } = string.Empty;
}
