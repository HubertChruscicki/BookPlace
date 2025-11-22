using Application.DTOs.Offers;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings.Offers;

/// <summary>
/// AutoMapper profile for Offer-related mappings
/// </summary>
public class OfferMappingProfile : Profile
{
    public OfferMappingProfile()
    {
        CreateMap<CreateOfferDto, Offer>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.HostId, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.IsArchive, opt => opt.Ignore())
            .ForMember(dest => dest.Host, opt => opt.Ignore())
            .ForMember(dest => dest.OfferType, opt => opt.Ignore())
            .ForMember(dest => dest.Amenities, opt => opt.Ignore())
            .ForMember(dest => dest.Photos, opt => opt.Ignore())
            .ForMember(dest => dest.Bookings, opt => opt.Ignore())
            .ForMember(dest => dest.Reviews, opt => opt.Ignore())
            .ForMember(dest => dest.Conversations, opt => opt.Ignore());

        CreateMap<Offer, CreateOfferResponseDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.FullAddress, opt => opt.MapFrom(src => 
                $"{src.AddressStreet}, {src.AddressCity}, {src.AddressZipCode}, {src.AddressCountry}"))
            .ForMember(dest => dest.OfferType, opt => opt.MapFrom(src => src.OfferType))
            .ForMember(dest => dest.Amenities, opt => opt.MapFrom(src => src.Amenities));

        CreateMap<Offer, OfferDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.FullAddress, opt => opt.MapFrom(src => 
                $"{src.AddressStreet}, {src.AddressCity}, {src.AddressZipCode}, {src.AddressCountry}"))
            .ForMember(dest => dest.OfferType, opt => opt.MapFrom(src => src.OfferType))
            .ForMember(dest => dest.Amenities, opt => opt.MapFrom(src => src.Amenities))
            .ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.Photos))
            .ForMember(dest => dest.Host, opt => opt.MapFrom(src => src.Host))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow)) // Tymczasowe mapowanie
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow)); // Tymczasowe mapowanie

        CreateMap<Offer, OfferSummaryDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.FullAddress, opt => opt.MapFrom(src => 
                $"{src.AddressStreet}, {src.AddressCity}, {src.AddressZipCode}, {src.AddressCountry}"))
            .ForMember(dest => dest.OfferType, opt => opt.MapFrom(src => src.OfferType))
            .ForMember(dest => dest.Amenities, opt => opt.MapFrom(src => src.Amenities))
            .ForMember(dest => dest.CoverPhoto, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsCover)))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow)) // Tymczasowe mapowanie
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow)); // Tymczasowe mapowanie

        CreateMap<OfferType, OfferTypeDto>();
        CreateMap<Amenity, AmenityDto>();
        CreateMap<OfferPhoto, OfferPhotoDto>();
        CreateMap<User, OfferHostDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.Name} {src.Surname}".Trim()));
    }
}
