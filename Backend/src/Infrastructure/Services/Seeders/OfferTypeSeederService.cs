using Domain.Entities;
using Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Seeders;

public interface IOfferTypeSeederService
{
    Task SeedOfferTypesAsync();
}

public class OfferTypeSeederService : IOfferTypeSeederService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<OfferTypeSeederService> _logger;

    public OfferTypeSeederService(ApplicationDbContext context, ILogger<OfferTypeSeederService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedOfferTypesAsync()
    {
        if (await _context.OfferTypes.AnyAsync())
        {
            _logger.LogInformation("OfferTypes already exist, skipping seeding");
            return;
        }

        var offerTypes = new[]
        {
            new OfferType { Name = "Apartment" },
            new OfferType { Name = "Villa" },
            new OfferType { Name = "House" },
            new OfferType { Name = "Room" },
            new OfferType { Name = "Penthouse" },
            new OfferType { Name = "Manor" },
            new OfferType { Name = "House with Pool" },
            new OfferType { Name = "Forest House" },
            new OfferType { Name = "Lakeside House" },
            new OfferType { Name = "Seaside House" },
            new OfferType { Name = "Mountain House" },
            new OfferType { Name = "Riverside House" },
            new OfferType { Name = "Hotel" },
            new OfferType { Name = "Hostel" },
            new OfferType { Name = "Resort" },
            new OfferType { Name = "Camping Cabin" },
            new OfferType { Name = "Camping Trailer" },
            new OfferType { Name = "Yacht" },
            new OfferType { Name = "Tent" },
            new OfferType { Name = "Summer House" },
            new OfferType { Name = "Bungalow" },
            new OfferType { Name = "Beach Hut" },
            new OfferType { Name = "Mill" },
            new OfferType { Name = "Castle" },
            new OfferType { Name = "Tower" },
            new OfferType { Name = "Treehouse" },
            new OfferType { Name = "Igloo" },
        };

        await _context.OfferTypes.AddRangeAsync(offerTypes);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Seeded {Count} offer types", offerTypes.Length);
    }
}
