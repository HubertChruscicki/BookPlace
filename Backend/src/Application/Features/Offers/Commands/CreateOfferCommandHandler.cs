using Application.DTOs.Offers;
using Application.Features.Offers.Commands;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;

namespace Application.Features.Offers.Commands;

/// <summary>
/// Handler for creating new offers
/// </summary>
public class CreateOfferCommandHandler : IRequestHandler<CreateOfferCommand, CreateOfferResponseDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IImageProcessingService _imageProcessingService;
    private readonly IMapper _mapper;

    public CreateOfferCommandHandler(
        IUnitOfWork unitOfWork,
        IImageProcessingService imageProcessingService,
        IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _imageProcessingService = imageProcessingService;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the creation of a new offer
    /// </summary>
    /// <param name="request">Command containing offer data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created offer response DTO</returns>
    /// <exception cref="InvalidOperationException">Thrown when business rules are violated</exception>
    public async Task<CreateOfferResponseDto> Handle(CreateOfferCommand request, CancellationToken cancellationToken)
    {
        var offerData = request.OfferData;

        var offerTypeExists = await _unitOfWork.Offers.OfferTypeExistsAsync(offerData.OfferTypeId);
        if (!offerTypeExists)
        {
            throw new InvalidOperationException($"Offer type with ID {offerData.OfferTypeId} does not exist");
        }

        var amenities = new List<Amenity>();
        if (offerData.AmenityIds.Any())
        {
            amenities = await _unitOfWork.Offers.GetAmenitiesByIdsAsync(offerData.AmenityIds);
            var foundAmenityIds = amenities.Select(a => a.Id).ToList();
            var missingAmenityIds = offerData.AmenityIds.Except(foundAmenityIds).ToList();
            
            if (missingAmenityIds.Any())
            {
                throw new InvalidOperationException($"Amenities with IDs [{string.Join(", ", missingAmenityIds)}] do not exist");
            }
        }

        if (offerData.Photos.Any())
        {
            var coverPhotos = offerData.Photos.Where(p => p.IsCover).ToList();
            if (coverPhotos.Count > 1)
            {
                throw new InvalidOperationException("Only one photo can be marked as cover");
            }

            if (!coverPhotos.Any())
            {
                offerData.Photos.First().IsCover = true;
            }

            for (int i = 0; i < offerData.Photos.Count; i++)
            {
                var photoDto = offerData.Photos[i];
                
                try
                {
                    Convert.FromBase64String(photoDto.Base64Data);
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
            var offer = Offer.Create(
                hostId: request.UserId,
                offerTypeId: offerData.OfferTypeId,
                title: offerData.Title,
                description: offerData.Description,
                pricePerNight: offerData.PricePerNight,
                maxGuests: offerData.MaxGuests,
                rooms: offerData.Rooms,
                singleBeds: offerData.SingleBeds,
                doubleBeds: offerData.DoubleBeds,
                sofas: offerData.Sofas,
                bathrooms: offerData.Bathrooms,
                addressStreet: offerData.AddressStreet,
                addressCity: offerData.AddressCity,
                addressZipCode: offerData.AddressZipCode,
                addressCountry: offerData.AddressCountry,
                addressLatitude: offerData.AddressLatitude,
                addressLongitude: offerData.AddressLongitude
            );

            foreach (var amenity in amenities)
            {
                offer.Amenities.Add(amenity);
            }

            var createdOffer = await _unitOfWork.Offers.CreateAsync(offer);

            if (offerData.Photos.Any())
            {
                for (int i = 0; i < offerData.Photos.Count; i++)
                {
                    var photoDto = offerData.Photos[i];
                    
                    try
                    {
                        var processedImage = await _imageProcessingService.ProcessImageAsync(
                            photoDto.Base64Data, 
                            createdOffer.Id,
                            i);

                        createdOffer.AddPhoto(
                            originalUrl: processedImage.OriginalUrl,
                            mediumUrl: processedImage.MediumUrl,
                            thumbnailUrl: processedImage.ThumbnailUrl,
                            isCover: photoDto.IsCover,
                            sortOrder: i
                        );
                    }
                    catch (Exception ex)
                    {
                        throw new ImageProcessingException(i, ex.Message, ex);
                    }
                }

                await _unitOfWork.Offers.UpdateAsync(createdOffer);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await _unitOfWork.CommitTransactionAsync();

            var response = _mapper.Map<CreateOfferResponseDto>(createdOffer);
            return response;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
