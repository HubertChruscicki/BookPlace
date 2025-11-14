using Application.DTOs.Messages;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings.Messages;

/// <summary>
/// AutoMapper profile for message-related mappings
/// </summary>
public class MessageMappingProfile : Profile
{
    public MessageMappingProfile()
    {
        CreateMap<Message, MessageDto>()
            .ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.Photos));

        CreateMap<Message, SendMessageResponseDto>()
            .ForMember(dest => dest.SenderName,
                      opt => opt.MapFrom(src => $"{src.Sender.Name} {src.Sender.Surname}"));

        CreateMap<MessagePhoto, MessagePhotoDto>();
    }
}
