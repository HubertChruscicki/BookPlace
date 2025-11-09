using Application.DTOs.Reviews;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http; // Potrzebne do IHttpContextAccessor
using System.Security.Claims;

namespace Application.Features.Reviews.Commands;

/// <summary>
/// Handler dla CreateReviewCommand
/// </summary>
public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, ReviewDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IImageProcessingService _imageProcessingService;

    public CreateReviewCommandHandler(
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

    public async Task<ReviewDto> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {
        var booking = await _unitOfWork.Bookings.GetByIdAsync(request.ReviewData.BookingId);
        if (booking == null)
        {
            throw new KeyNotFoundException($"Booking with ID {request.ReviewData.BookingId} not found.");
        }

        var user = _httpContextAccessor.HttpContext?.User;
        
        if (user == null)
        {
            throw new UnauthorizedAccessException("User context not found");
        }
        
        var authorizationResult = await _authorizationService
            .AuthorizeAsync(user, booking, "ReviewEligibilityPolicy");

        if (!authorizationResult.Succeeded)
        {
            throw new UnauthorizedAccessException("You are not not eligible to create a review for that offer");
        }

        for (int i = 0; i < request.ReviewData.Photos.Count; i++)
        {
            try
            {
                Convert.FromBase64String(request.ReviewData.Photos[i].Base64Data);
            }
            catch (FormatException ex)
            {
                throw new ImageProcessingException(i, $"Invalid Base64 format: {ex.Message}", ex);
            }
        }

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var review = Review.Create(
                bookingId: booking.Id,
                guestId: request.UserId,
                offerId: booking.OfferId,
                rating: request.ReviewData.Rating,
                content: request.ReviewData.Content
            );

            var createdReview = await _unitOfWork.Reviews.CreateAsync(review);
            
            if (request.ReviewData.Photos.Any())
            {
                for (int i = 0; i < request.ReviewData.Photos.Count; i++)
                {
                    var photoDto = request.ReviewData.Photos[i];
                    try
                    {
                        var processedImage = await _imageProcessingService.ProcessImageAsync(
                            photoDto.Base64Data,
                            "reviews",
                            createdReview.Id,
                            i);

                        createdReview.AddPhoto(
                            originalUrl: processedImage.OriginalUrl,
                            thumbnailUrl: processedImage.ThumbnailUrl
                        );
                    }
                    catch (Exception ex)
                    {
                        throw new ImageProcessingException(i, ex.Message, ex);
                    }
                }
                await _unitOfWork.Reviews.UpdateAsync(createdReview);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await _unitOfWork.CommitTransactionAsync();

            var resultReview = await _unitOfWork.Reviews.GetReviewWithDetailsAsync(createdReview.Id);
            return _mapper.Map<ReviewDto>(resultReview);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
