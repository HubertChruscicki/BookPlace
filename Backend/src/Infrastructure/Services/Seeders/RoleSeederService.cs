using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Seeders;

public interface IRoleSeederService
{
    Task SeedRolesAsync();
}

public class RoleSeederService : IRoleSeederService
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<RoleSeederService> _logger;

    public RoleSeederService(RoleManager<IdentityRole> roleManager, ILogger<RoleSeederService> logger)
    {
        _roleManager = roleManager;
        _logger = logger;
    }

    public async Task SeedRolesAsync()
    {
        var roles = new[] { "Guest", "Host" };

        foreach (var role in roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
                _logger.LogInformation("Created role: {Role}", role);
            }
        }
    }
}
