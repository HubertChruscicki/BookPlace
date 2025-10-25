using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Seeders;

public interface IDatabaseSeederService
{
    Task SeedAllAsync();
}

public class DatabaseSeederService : IDatabaseSeederService
{
    private readonly IRoleSeederService _roleSeederService;
    private readonly ILogger<DatabaseSeederService> _logger;

    public DatabaseSeederService(
        IRoleSeederService roleSeederService,
        ILogger<DatabaseSeederService> logger)
    {
        _roleSeederService = roleSeederService;
        _logger = logger;
    }

    public async Task SeedAllAsync()
    {
        _logger.LogInformation("Starting database seeding...");

        try
        {
            // Seed roles first - they are foundation for other data
            await _roleSeederService.SeedRolesAsync();
            _logger.LogInformation("Roles seeding completed successfully");

            // Future seeders can be added here:
            // await _userSeederService.SeedDefaultUsersAsync();
            // await _offerTypeSeederService.SeedOfferTypesAsync();
            // await _amenitySeederService.SeedAmenitiesAsync();

            _logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during database seeding");
            throw;
        }
    }
}
