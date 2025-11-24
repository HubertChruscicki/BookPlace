using Application.DTOs.Bookings;
using Application.DTOs.Offers;
using Domain.Entities;

namespace Application.Mappings.Bookings;

/// <summary>
/// AutoMapper profile for mapping Booking entities
/// </summary>
public class BookingMappingProfile : Profile
{
    public BookingMappingProfile()
    {
        CreateMap<Offer, BookingOfferDto>()
            .ForMember(dest => dest.FullAddress, opt => opt.MapFrom(src => 
                $"{src.AddressStreet}, {src.AddressCity}, {src.AddressZipCode}, {src.AddressCountry}"))
            .ForMember(dest => dest.CoverPhotoUrl, opt => opt.MapFrom(src =>
                src.Photos.Any(p => p.IsCover)
                    ? src.Photos.First(p => p.IsCover).ThumbnailUrl
                    : null))
            .ForMember(dest => dest.OfferType, opt => opt.MapFrom(src => src.OfferType.Name));

        CreateMap<Booking, BookingDto>()
            .ForMember(dest => dest.Offer, opt => opt.MapFrom(src => src.Offer))
            .ForMember(dest => dest.Host, opt => opt.MapFrom(src => src.Offer.Host))
            .ForMember(dest => dest.Guest, opt => opt.MapFrom(src => src.Guest));

        CreateMap<User, BookingGuestDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.Name} {src.Surname}"))
            .ForMember(dest => dest.AvatarUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl));

        CreateMap<User, OfferHostDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.Name} {src.Surname}"))
            .ForMember(dest => dest.AvatarUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl));
