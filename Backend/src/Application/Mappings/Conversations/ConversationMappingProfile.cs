using Application.DTOs.Conversations;
using Application.DTOs.Messages;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings.Conversations;

/// <summary>
/// AutoMapper profile for conversation-related mappings
/// </summary>
public class ConversationMappingProfile : Profile
{
    public ConversationMappingProfile()
    {
        CreateMap<Conversation, ConversationDto>()
            .ForMember(dest => dest.InitialMessage, 
                      opt => opt.MapFrom(src => src.Messages.OrderBy(m => m.SentAt).FirstOrDefault()))
            .ForMember(dest => dest.ParticipantIds,
                      opt => opt.MapFrom(src => src.Participants.Select(p => p.Id).ToList()));

        CreateMap<Conversation, ConversationInboxDto>()
            .ForMember(dest => dest.Recipient, opt => opt.Ignore()) // Będzie ustawione ręcznie w HandlerZe
            .ForMember(dest => dest.LastMessage, opt => opt.MapFrom(src => 
                src.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault()))
            .ForMember(dest => dest.IsUnread, opt => opt.Ignore()); // Będzie ustawione ręcznie w HandlerZe

        CreateMap<Message, MessageDto>()
            .ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.Photos));
        
        CreateMap<MessagePhoto, MessagePhotoDto>();
        
        CreateMap<User, UserSummaryDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.Name} {src.Surname}"));
    }
}
