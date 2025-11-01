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
    public int Rooms { get; set; }
    public int SingleBeds { get; set; }
    public int DoubleBeds { get; set; }
    public int Sofas { get; set; }
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

    /// <summary>
    /// Creates a new offer instance with the specified host and initial data
    /// </summary>
    /// <param name="hostId">The ID of the host creating the offer</param>
    /// <param name="offerTypeId">The type of accommodation</param>
    /// <param name="title">The offer title</param>
    /// <param name="description">The offer description</param>
    /// <param name="pricePerNight">Price per night in currency</param>
    /// <param name="maxGuests">Maximum number of guests</param>
    /// <param name="rooms">Number of rooms</param>
    /// <param name="singleBeds">Number of single beds</param>
    /// <param name="doubleBeds">Number of double beds</param>
    /// <param name="sofas">Number of sofas</param>
    /// <param name="bathrooms">Number of bathrooms</param>
    /// <param name="addressStreet">Street address</param>
    /// <param name="addressCity">City</param>
    /// <param name="addressZipCode">ZIP code</param>
    /// <param name="addressCountry">Country</param>
    /// <param name="addressLatitude">Latitude coordinate</param>
    /// <param name="addressLongitude">Longitude coordinate</param>
    /// <returns>New offer instance with Active status</returns>
    public static Offer Create(
        string hostId,
        int offerTypeId,
        string title,
        string description,
        decimal pricePerNight,
        int maxGuests,
        int rooms,
        int singleBeds,
        int doubleBeds,
        int sofas,
        int bathrooms,
        string addressStreet,
        string addressCity,
        string addressZipCode,
        string addressCountry,
        double? addressLatitude = null,
        double? addressLongitude = null)
    {
        return new Offer
        {
            HostId = hostId,
            OfferTypeId = offerTypeId,
            Title = title,
            Description = description,
            PricePerNight = pricePerNight,
            MaxGuests = maxGuests,
            Rooms = rooms,
            SingleBeds = singleBeds,
            DoubleBeds = doubleBeds,
            Sofas = sofas,
            Bathrooms = bathrooms,
            Status = OfferStatus.Active,
            IsArchive = false,
            AddressStreet = addressStreet,
            AddressCity = addressCity,
            AddressZipCode = addressZipCode,
            AddressCountry = addressCountry,
            AddressLatitude = addressLatitude,
            AddressLongitude = addressLongitude
        };
    }

    /// <summary>
    /// Adds a photo to the offer with processed URLs for different sizes
    /// </summary>
    /// <param name="originalUrl">URL to original size image</param>
    /// <param name="mediumUrl">URL to medium size image</param>
    /// <param name="thumbnailUrl">URL to thumbnail size image</param>
    /// <param name="isCover">Whether this photo is the cover image</param>
    /// <param name="sortOrder">Display order of the photo</param>
    public void AddPhoto(string originalUrl, string mediumUrl, string thumbnailUrl, bool isCover = false, int sortOrder = 0)
    {
        var photo = new OfferPhoto
        {
            OfferId = Id,
            OriginalUrl = originalUrl,
            MediumUrl = mediumUrl,
            ThumbnailUrl = thumbnailUrl,
            IsCover = isCover,
            SortOrder = sortOrder
        };

        Photos.Add(photo);
    }
}
