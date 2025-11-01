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
            .ForMember(dest => dest.OfferTypeName, opt => opt.MapFrom(src => src.OfferType.Name))
            .ForMember(dest => dest.AmenityNames, opt => opt.MapFrom(src => 
                src.Amenities.Select(a => a.Name).ToList()));

        CreateMap<OfferPhoto, OfferPhotoDto>();
    }
}
