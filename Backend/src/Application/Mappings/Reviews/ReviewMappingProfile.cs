using Application.DTOs.Reviews;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings.Reviews;

/// <summary>
/// AutoMapper profile for review mappings
/// </summary>
public class ReviewMappingProfile : Profile
{
    public ReviewMappingProfile()
    {
        CreateMap<Review, ReviewDto>()
            .ForMember(dest => dest.GuestName, 
                      opt => opt.MapFrom(src => $"{src.Guest.Name} {src.Guest.Surname}"))
            .ForMember(dest => dest.GuestProfilePictureUrl, 
                      opt => opt.MapFrom(src => src.Guest.ProfilePictureUrl))
            .ForMember(dest => dest.Photos, 
                      opt => opt.MapFrom(src => src.Photos));

        CreateMap<ReviewPhoto, ReviewPhotoResponseDto>();
    }
}
