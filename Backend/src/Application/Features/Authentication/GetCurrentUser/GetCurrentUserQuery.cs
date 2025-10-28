using Application.DTOs.Auth;
using MediatR;

namespace Application.Features.Authentication.GetCurrentUser;

/// <summary>
/// Query to retrieve detailed profile information for the current authenticated user.
/// </summary>
public class GetCurrentUserQuery : IRequest<UserInfo>
{
    /// <summary>
    /// The unique identifier of the user to retrieve information for.
    /// </summary>
    public string UserId { get; set; } = string.Empty;
}
