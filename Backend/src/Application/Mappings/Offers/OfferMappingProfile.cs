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
    }
}
