using Domain.Entities;
using Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Seeders;

public interface IAmenitySeederService
{
    Task SeedAmenitiesAsync();
}

public class AmenitySeederService : IAmenitySeederService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AmenitySeederService> _logger;

    public AmenitySeederService(ApplicationDbContext context, ILogger<AmenitySeederService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAmenitiesAsync()
    {
        if (await _context.Amenities.AnyAsync())
        {
            _logger.LogInformation("Amenities already exist, skipping seeding");
            return;
        }

        var amenities = new[]
        {
            new Amenity { Name = "Wi-Fi" },
            new Amenity { Name = "TV" },
            new Amenity { Name = "Jacuzzi" },
            new Amenity { Name = "Air Conditioning" },
            new Amenity { Name = "Pool" },
            new Amenity { Name = "Parking" },
            new Amenity { Name = "Kitchen" },
            new Amenity { Name = "Dishwasher" },
            new Amenity { Name = "Washing Machine" },
            new Amenity { Name = "Hair Dryer" },
            new Amenity { Name = "Private Bathroom" },
            new Amenity { Name = "Shampoo" },
            new Amenity { Name = "Bathtub" },
            new Amenity { Name = "Shower" },
            new Amenity { Name = "Balcony" },
            new Amenity { Name = "Terrace" },
            new Amenity { Name = "Garden" },
            new Amenity { Name = "Garden Loungers" },
            new Amenity { Name = "Barbecue" },
            new Amenity { Name = "Fireplace" },
            new Amenity { Name = "Sauna" },
            new Amenity { Name = "Gym" },
            new Amenity { Name = "Billiards" },
            new Amenity { Name = "Ping Pong" },
            new Amenity { Name = "Board Games" },
            new Amenity { Name = "Volleyball Court" },
            new Amenity { Name = "24h Reception" },
            new Amenity { Name = "Host Greeting" },
            new Amenity { Name = "Pet Friendly" },
            new Amenity { Name = "Baby Crib" },
            new Amenity { Name = "Playground" },
            new Amenity { Name = "Bicycles" },
            new Amenity { Name = "Kayaks" },
            new Amenity { Name = "Gaming Console" },
            new Amenity { Name = "Refrigerator" },
            new Amenity { Name = "Microwave" },
            new Amenity { Name = "Coffee Machine" },
            new Amenity { Name = "Safe" },
            new Amenity { Name = "Lockbox" },
            new Amenity { Name = "Iron" },
            new Amenity { Name = "Sea View" },
            new Amenity { Name = "Mountain View" },
            new Amenity { Name = "Lake View" },
            new Amenity { Name = "Beach Access" },
            new Amenity { Name = "Close to City Center" },
            new Amenity { Name = "Close to Public Transport" }
        };

        await _context.Amenities.AddRangeAsync(amenities);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Seeded {Count} amenities", amenities.Length);
    }
}
