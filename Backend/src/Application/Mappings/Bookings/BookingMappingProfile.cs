using Application.DTOs.Bookings;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings.Bookings;

/// <summary>
/// AutoMapper profile for booking-related mappings
/// </summary>
public class BookingMappingProfile : Profile
{
    public BookingMappingProfile()
    {
        CreateMap<Booking, BookingDto>()
            .ForMember(dest => dest.OfferTitle, opt => opt.MapFrom(src => src.Offer != null ? src.Offer.Title : null))
            .ForMember(dest => dest.OfferCity, opt => opt.MapFrom(src => src.Offer != null ? src.Offer.AddressCity : null))
            .ForMember(dest => dest.OfferCoverPhotoUrl, opt => opt.MapFrom(src => 
                src.Offer != null && src.Offer.Photos.Any(p => p.IsCover) 
                    ? src.Offer.Photos.First(p => p.IsCover).OriginalUrl 
                    : null));
    }
}
