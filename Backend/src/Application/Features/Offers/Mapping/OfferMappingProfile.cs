using Application.DTOs.Offers;
using AutoMapper;
using Domain.Entities;

namespace Application.Features.Offers.Mapping;

public class OfferMappingProfile : Profile
{
    public OfferMappingProfile()
    {
        // Encja -> DTO
        CreateMap<Offer, OfferDto>();
        // CreateMap<Offer, OfferDetailsDto>()
            // .ForMember(dest => dest.HostName, opt => opt.MapFrom(src => src.Host.Name));
            
        // Command -> Encja
        // CreateMap<CreateOfferCommand, Offer>();
        
        // DTO -> Command (jeśli potrzebne)
        // CreateMap<UpdateOfferDto, UpdateOfferCommand>();
    }
}