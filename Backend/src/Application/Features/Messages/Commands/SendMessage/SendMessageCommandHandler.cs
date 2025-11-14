using Application.DTOs.Messages;
using Application.DTOs.Conversations;
using Application.Features.Messages.Commands.SendMessage;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;

namespace Application.Features.Messages.Commands.SendMessage;

/// <summary>
/// Handler for SendMessageCommand
/// </summary>
public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, SendMessageResponseDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IImageProcessingService _imageProcessingService;

    public SendMessageCommandHandler(
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

    public async Task<SendMessageResponseDto> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null)
        {
            throw new UnauthorizedAccessException("User context not found");
        }

        // Validate images if any
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
            // Create message
            var message = Message.Create(request.ConversationId, request.SenderId, request.Content);

            await _unitOfWork.Messages.CreateAsync(message);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Process photos if any
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

                await _unitOfWork.Messages.UpdateAsync(message);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            await _unitOfWork.CommitTransactionAsync();

            // Get message with all details for response
            var messageWithDetails = await _unitOfWork.Messages.GetByIdWithPhotosAsync(message.Id);
            var response = _mapper.Map<SendMessageResponseDto>(messageWithDetails);

            return response;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
