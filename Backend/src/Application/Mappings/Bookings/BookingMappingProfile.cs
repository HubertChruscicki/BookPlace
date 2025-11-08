using Application.DTOs.Bookings;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings.Bookings;

/// <summary>
/// AutoMapper profile for mapping Booking entities
/// </summary>
public class BookingMappingProfile : Profile
{
    public BookingMappingProfile()
    {
        CreateMap<Booking, BookingDto>()
            .ForMember(dest => dest.OfferTitle,
                opt => opt.MapFrom(src => src.Offer.Title))
            .ForMember(dest => dest.OfferCity,
                opt => opt.MapFrom(src => src.Offer.AddressCity))
            .ForMember(dest => dest.OfferCoverPhotoUrl, opt => opt.MapFrom(src =>
                src.Offer.Photos.Any(p => p.IsCover)
                    ? src.Offer.Photos.First(p => p.IsCover).ThumbnailUrl
                    : null));
    }
}
