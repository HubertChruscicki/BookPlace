using Application.DTOs.Conversations;
using Application.Features.Conversations.Commands;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Application.Interfaces;

namespace Application.Features.Commands.Conversations;

/// <summary>
/// Handler for InitiateConversationCommand
/// </summary>
public class InitiateConversationCommandHandler : IRequestHandler<InitiateConversationCommand, ConversationDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IImageProcessingService _imageProcessingService;

    public InitiateConversationCommandHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IAuthorizationService authorizationService,
        IHttpContextAccessor httpContextAccessor,
        IImageProcessingService imageProcessingService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _authorizationService = authorizationService;
        _httpContextAccessor = httpContextAccessor;
        _imageProcessingService = imageProcessingService;
    }

    public async Task<ConversationDto> Handle(InitiateConversationCommand request, CancellationToken cancellationToken)
    {
        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null)
        {
            throw new UnauthorizedAccessException("User context not found");
        }

        if (request.BookingId.HasValue && request.ReviewId.HasValue)
        {
            throw new InvalidOperationException("Cannot specify both BookingId and ReviewId");
        }

        if (!request.BookingId.HasValue && !request.ReviewId.HasValue)
        {
            throw new InvalidOperationException("Either BookingId or ReviewId must be specified");
        }

        var existingConversation = await _unitOfWork.Conversations
            .FindExistingConversationAsync(request.BookingId, request.ReviewId, request.SenderId);

        if (existingConversation != null)
        {
            throw new InvalidOperationException("Conversation already exists for this context");
        }

        if (request.Photos.Any())
        {
            for (int i = 0; i < request.Photos.Count; i++)
            {
                try
                {
                    Convert.FromBase64String(request.Photos[i].Base64Data);
                }
                catch (FormatException ex)
                {
                    throw new ImageProcessingException(i, $"Invalid Base64 format: {ex.Message}", ex);
                }
            }
        }

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var conversation = new Conversation
            {
                OfferId = request.BookingId,
                ReviewId = request.ReviewId
            };

            await _unitOfWork.Conversations.CreateAsync(conversation);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var message = Message.Create(conversation.Id, request.SenderId, request.MessageContent);
            
            if (request.Photos.Any())
            {
                for (int i = 0; i < request.Photos.Count; i++)
                {
                    var photoDto = request.Photos[i];
                    try
                    {
                        var processedImage = await _imageProcessingService.ProcessImageAsync(
                            photoDto.Base64Data,
                            "messages",
                            message.Id,
                            i);

                        message.AddPhoto(
                            originalUrl: processedImage.OriginalUrl,
                            thumbnailUrl: processedImage.ThumbnailUrl
                        );
                    }
                    catch (Exception ex)
                    {
                        throw new ImageProcessingException(i, ex.Message, ex);
                    }
                }
            }

            conversation.Messages.Add(message);
            conversation.Participants.Add(new User { Id = request.SenderId });

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await _unitOfWork.CommitTransactionAsync();

            return _mapper.Map<ConversationDto>(conversation);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}