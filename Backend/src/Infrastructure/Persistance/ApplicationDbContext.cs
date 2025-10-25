using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistance;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<OfferType> OfferTypes { get; set; }
    public DbSet<Amenity> Amenities { get; set; }
    public DbSet<Offer> Offers { get; set; }
    public DbSet<OfferPhoto> OfferPhotos { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<ReviewPhoto> ReviewPhotos { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Offer>()
            .HasMany(o => o.Amenities)
            .WithMany(a => a.Offers);

        builder.Entity<Conversation>()
            .HasMany(c => c.Participants)
            .WithMany(u => u.Conversations);

        builder.Entity<Offer>()
            .HasOne(o => o.Host)
            .WithMany(u => u.Offers)
            .HasForeignKey(o => o.HostId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Booking>()
            .HasOne(b => b.Guest)
            .WithMany(u => u.GuestBookings)
            .HasForeignKey(b => b.GuestId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Review>()
            .HasOne(r => r.Guest)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.GuestId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.SentMessages)
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Offer>()
            .Property(o => o.PricePerNight)
            .HasPrecision(18, 2);

        builder.Entity<Booking>()
            .Property(b => b.TotalPrice)
            .HasPrecision(18, 2);

        builder.Entity<Conversation>()
            .ToTable(t => t.HasCheckConstraint("CK_Conversation_Reference", 
                "(\"OfferId\" IS NOT NULL AND \"ReviewId\" IS NULL) OR (\"OfferId\" IS NULL AND \"ReviewId\" IS NOT NULL)"));
    }
}
