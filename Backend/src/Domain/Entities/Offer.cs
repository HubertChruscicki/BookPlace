using Domain.Enums;

namespace Domain.Entities;

public class Offer
{
    public int Id { get; set; }
    public string HostId { get; set; } = string.Empty;
    public int OfferTypeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int MaxGuests { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public OfferStatus Status { get; set; }
    public bool IsArchive { get; set; } = false;
    
    public string AddressStreet { get; set; } = string.Empty;
    public string AddressCity { get; set; } = string.Empty;
    public string AddressZipCode { get; set; } = string.Empty;
    public string AddressCountry { get; set; } = string.Empty;
    public double? AddressLatitude { get; set; }
    public double? AddressLongitude { get; set; }
    
    public User Host { get; set; } = null!;
    public OfferType OfferType { get; set; } = null!;
    public ICollection<Amenity> Amenities { get; set; } = new List<Amenity>();
    public ICollection<OfferPhoto> Photos { get; set; } = new List<OfferPhoto>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
}
