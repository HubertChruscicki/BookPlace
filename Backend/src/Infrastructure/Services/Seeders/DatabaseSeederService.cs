using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Seeders;

public interface IDatabaseSeederService
{
    Task SeedAllAsync();
}

public class DatabaseSeederService : IDatabaseSeederService
{
    private readonly IRoleSeederService _roleSeederService;
    private readonly IOfferTypeSeederService _offerTypeSeederService;
    private readonly IAmenitySeederService _amenitySeederService;
    private readonly ILogger<DatabaseSeederService> _logger;

    public DatabaseSeederService(
        IRoleSeederService roleSeederService,
        IOfferTypeSeederService offerTypeSeederService,
        IAmenitySeederService amenitySeederService,
        ILogger<DatabaseSeederService> logger)
    {
        _roleSeederService = roleSeederService;
        _offerTypeSeederService = offerTypeSeederService;
        _amenitySeederService = amenitySeederService;
        _logger = logger;
    }

    public async Task SeedAllAsync()
    {
        _logger.LogInformation("Starting database seeding...");
        try
        {
            await _roleSeederService.SeedRolesAsync();
            _logger.LogInformation("Roles seeding completed successfully");

            // Seed offer types - needed for offers
            await _offerTypeSeederService.SeedOfferTypesAsync();
            _logger.LogInformation("Offer types seeding completed successfully");

            // Seed amenities - needed for offers
            await _amenitySeederService.SeedAmenitiesAsync();
            _logger.LogInformation("Amenities seeding completed successfully");

            _logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during database seeding");
            throw;
        }
    }
}
