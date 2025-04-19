from rest_framework.routers import DefaultRouter

from .views_collection.offer_view import OfferViewAPI
from .views_collection.offer_details_view import OfferDetailsViewAPI
from .views_collection.offer_location_view  import OfferLocationViewAPI
from .views_collection.offer_images_view  import OfferImagesViewAPI
from .views_collection.offfer_types_view  import OfferTypeViewAPI
from .views_collection.offer_amenities_view import OfferAmenitiesViewAPI

router = DefaultRouter()

router.register(r'offers', OfferViewAPI, basename='offers')
router.register(r'offer-type', OfferTypeViewAPI, basename='offers-type')
router.register(r'offer-details', OfferDetailsViewAPI, basename='offers-details')
router.register(r'offer-images', OfferImagesViewAPI, basename='offers-images')
router.register(r'offer-location', OfferLocationViewAPI, basename='offers-location')
router.register(r'offer-amenities', OfferAmenitiesViewAPI, basename='offers-amenities')

