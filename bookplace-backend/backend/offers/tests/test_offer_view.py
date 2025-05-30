import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import User
from offers.models import Offers, OfferTypes, OfferLocation, OfferDetails, OfferAmenities, OfferImages
from users.authentication import JWTAuthentication
from datetime import datetime, timedelta
from django.utils.dateparse import parse_datetime
from reservations.models import ReservationStatus, Reservations
import base64
import pytest

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_password():
    return "TajneHaslo123@#"

@pytest.fixture
def admin_user(db, test_password):
    user = User.objects.create_user(
        email="admin@example.com",
        password=test_password,
        first_name="Admin",
        last_name="User",
        phone="123456789",
        role=User.ROLE_ADMIN
    )
    return user

@pytest.fixture
def landlord_user(db, test_password):
    user = User.objects.create_user(
        email="landlord@example.com",
        password=test_password,
        first_name="Landlord",
        last_name="User",
        phone="987654321",
        role=User.ROLE_LANDLORD
    )
    return user

@pytest.fixture
def regular_user(db, test_password):
    user = User.objects.create_user(
        email="user@example.com",
        password=test_password,
        first_name="Regular",
        last_name="User",
        phone="555666777",
        role=User.ROLE_USER
    )
    return user

@pytest.fixture
def admin_token(admin_user):
    return JWTAuthentication.create_jwt(admin_user)

@pytest.fixture
def landlord_token(landlord_user):
    return JWTAuthentication.create_jwt(landlord_user)

@pytest.fixture
def user_token(regular_user):
    return JWTAuthentication.create_jwt(regular_user)

@pytest.fixture
def offer_type(db):
    return OfferTypes.objects.create(name="Apartament")

@pytest.fixture
def offer(db, landlord_user, offer_type):
    offer = Offers.objects.create(
        landlord=landlord_user,
        offer_type=offer_type,
        title="Testowa oferta",
        description="Opis testowej oferty",
        price_per_night=100,
        max_guests=2,
        is_active=True
    )

    OfferLocation.objects.create(
        offer_id=offer,
        country="Polska",
        city="Warszawa",
        address="Testowa 1",
        province="Mazowieckie",
        latitude=52.2297,
        longitude=21.0122
    )

    OfferDetails.objects.create(
        offer_id=offer,
        rooms=2,
        beds=1,
        double_beds=1,
        sofa_beds=0
    )

    OfferAmenities.objects.create(
        offer_id=offer,
        private_bathroom=True,
        kitchen=True,
        wifi=True,
        tv=True,
        fridge_in_room=True,
        air_conditioning=False,
        smoking_allowed=False,
        pets_allowed=False,
        parking=True,
        swimming_pool=False,
        sauna=False,
        jacuzzi=False
    )

    OfferImages.objects.create(
        offer_id=offer,
        is_main=True,
        image="images/test_image.jpg"
    )

    return offer

@pytest.fixture
def valid_offer_data(offer_type):
    sample_image_base64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q=="

    return {
        "title": "Nowa oferta testowa",
        "description": "Opis nowej oferty",
        "offer_type": offer_type.id,
        "price_per_night": 150,
        "max_guests": 3,
        "location": {
            "country": "Polska",
            "city": "Kraków",
            "address": "Testowa 2",
            "province": "Małopolskie",
            "latitude": 50.0647,
            "longitude": 19.9450
        },
        "details": {
            "rooms": 3,
            "beds": 2,
            "double_beds": 1,
            "sofa_beds": 1
        },
        "amenities": {
            "private_bathroom": True,
            "kitchen": True,
            "wifi": True,
            "tv": True,
            "fridge_in_room": True,
            "air_conditioning": True,
            "smoking_allowed": False,
            "pets_allowed": True,
            "parking": True,
            "swimming_pool": False,
            "sauna": False,
            "jacuzzi": False
        },
        "images": [
            {
                "is_main": True,
                "image": sample_image_base64
            }
        ]
    }

@pytest.fixture
def reservation_status(db):
    return ReservationStatus.objects.create(name="confirmed")

@pytest.fixture
def multiple_offers(db, landlord_user, offer_type):
    offers = []
    cities = ["Warszawa", "Kraków", "Gdańsk", "Kraków", "Warszawa"]
    prices = [100, 200, 150, 300, 120]
    wifi = [True, True, False, True, False]
    parking = [True, False, True, True, True]
    guests = [2, 4, 6, 2, 8]

    for i in range(5):
        offer = Offers.objects.create(
            landlord=landlord_user,
            offer_type=offer_type,
            title=f"Oferta {i+1}",
            description=f"Opis oferty {i+1}",
            price_per_night=prices[i],
            max_guests=guests[i],
            is_active=True
        )

        OfferLocation.objects.create(
            offer_id=offer,
            country="Polska",
            city=cities[i],
            address=f"Adres {i+1}",
            province="Mazowieckie",
            latitude=50.0 + i,
            longitude=20.0 + i
        )

        OfferDetails.objects.create(
            offer_id=offer,
            rooms=i+1,
            beds=i+1,
            double_beds=1,
            sofa_beds=0
        )

        OfferAmenities.objects.create(
            offer_id=offer,
            private_bathroom=True,
            kitchen=True,
            wifi=wifi[i],
            tv=True,
            fridge_in_room=True,
            air_conditioning=False,
            smoking_allowed=False,
            pets_allowed=False,
            parking=parking[i],
            swimming_pool=(i == 3),
            sauna=False,
            jacuzzi=False
        )

        OfferImages.objects.create(
            offer_id=offer,
            is_main=True,
            image=f"images/test_image_{i}.jpg"
        )

        offers.append(offer)

    return offers

@pytest.fixture
def offer_with_reservation(db, landlord_user, offer_type, regular_user, reservation_status):
    offer = Offers.objects.create(
        landlord=landlord_user,
        offer_type=offer_type,
        title="Oferta z rezerwacją",
        description="Opis oferty z rezerwacją",
        price_per_night=150,
        max_guests=2,
        is_active=True
    )

    OfferLocation.objects.create(
        offer_id=offer,
        country="Polska",
        city="Warszawa",
        address="Rezerwacyjna 123",
        province="Mazowieckie",
        latitude=52.2300,
        longitude=21.0125
    )

    OfferDetails.objects.create(
        offer_id=offer,
        rooms=2,
        beds=1,
        double_beds=1,
        sofa_beds=0
    )

    OfferAmenities.objects.create(
        offer_id=offer,
        private_bathroom=True,
        kitchen=True,
        wifi=True,
        tv=True,
        fridge_in_room=True,
        air_conditioning=False,
        smoking_allowed=False,
        pets_allowed=False,
        parking=True,
        swimming_pool=False,
        sauna=False,
        jacuzzi=False
    )

    start_date = datetime.now() + timedelta(days=7)
    end_date = start_date + timedelta(days=5)

    reservation = Reservations.objects.create(
        offer_id=offer,
        user=regular_user,
        start_date=start_date,
        end_date=end_date,
        status_id=reservation_status,
        total_price=750
    )

    return {
        'offer': offer,
        'reservation': reservation,
        'reserved_start': start_date,
        'reserved_end': end_date
    }

@pytest.mark.django_db
class TestOfferViewAPI:
    def test_list_offers_anonymous(self, api_client, offer):
        """Unauthorized user should be able to list offers"""

        url = "/api/v1/offers/"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

    def test_retrieve_offer_anonymous(self, api_client, offer):
        """Unauthorized user should be able to retrieve offer details"""

        url = f"/api/v1/offers/{offer.id}/"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == offer.id
        assert response.data['title'] == offer.title
        assert 'location' in response.data
        assert 'details' in response.data
        assert 'amenities' in response.data
        assert 'images' in response.data

    def test_retrieve_nonexistent_offer(self, api_client):
        """Retrieving a non-existent offer should return 404"""

        url = f"/api/v1/offers/99999/"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_add_offer_as_landlord(self, api_client, landlord_token, valid_offer_data):
        """Landlord should be able to add offers"""

        url = "/api/v1/offers/add-offer/"
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {landlord_token}")
        response = api_client.post(url, data=valid_offer_data, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == valid_offer_data['title']
        assert Offers.objects.filter(title=valid_offer_data['title']).exists()

    def test_add_offer_as_regular_user(self, api_client, user_token, valid_offer_data):
        """User should not be able to add offers"""

        url = "/api/v1/offers/add-offer/"
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {user_token}")
        response = api_client.post(url, data=valid_offer_data, format='json')

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_add_offer_anonymous(self, api_client, valid_offer_data):
        """Unauthorized user should not be able to add offers"""

        url = "/api/v1/offers/add-offer/"
        response = api_client.post(url, data=valid_offer_data, format='json')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_add_offer_invalid_data(self, api_client, landlord_token):
        """Validation test during adding an offer - empty title"""

        url = "/api/v1/offers/add-offer/"
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {landlord_token}")
        invalid_data = {
            "title": "",
            "description": "Test"

        }
        response = api_client.post(url, data=invalid_data, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_load_offers(self, api_client, multiple_offers):
        """Basic test for loading offers with pagination"""

        url = "/api/v1/offers/load-offers/"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] >= 5
        assert 'results' in response.data
        assert len(response.data['results']) > 0

    def test_load_offers_with_pagination(self, api_client, multiple_offers):
        """Test offer paggination with limit and offset"""

        url = "/api/v1/offers/load-offers/?limit=2"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] >= 5
        assert len(response.data['results']) == 2
        assert response.data['next'] is not None

        url = "/api/v1/offers/load-offers/?limit=2&offset=2"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2
        assert response.data['previous'] is not None

    def test_filter_offers_by_city(self, api_client, multiple_offers):
        """Test filtring offers by city"""

        url = "/api/v1/offers/load-offers/?city=Kraków"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 2
        for result in response.data['results']:
            assert result['city'] == "Kraków"

    def test_filter_offers_by_amenities(self, api_client, multiple_offers):
        """Test amenities filtering in offers"""

        url = "/api/v1/offers/load-offers/?wifi=true"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 3

        url = "/api/v1/offers/load-offers/?wifi=true&parking=true"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 2

    def test_check_availability_available(self, api_client, offer, reservation_status):
        """Test availability check for an available offer"""

        start_date = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        end_date = (datetime.now() + timedelta(days=5)).strftime('%Y-%m-%d')

        url = f"/api/v1/offers/{offer.id}/check-availability/?start={start_date}&end={end_date}"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['available'] is True

    def test_check_availability_unavailable(self, api_client, offer_with_reservation, reservation_status): #FIXME
        """Test booked offer availability check"""

        offer = offer_with_reservation['offer']
        reserved_start = offer_with_reservation['reserved_start']

        start_date = (reserved_start + timedelta(days=1)).strftime('%Y-%m-%d')
        end_date = (reserved_start + timedelta(days=3)).strftime('%Y-%m-%d')

        url = f"/api/v1/offers/{offer.id}/check-availability/?start={start_date}&end={end_date}"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['available'] is False

    def test_offer_card_format(self, api_client, offer):
        """Test offer card format"""

        url = "/api/v1/offers/load-offers/"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        result = response.data['results'][0]

        assert 'id' in result
        assert 'title' in result
        assert 'type' in result
        assert 'price_per_night' in result
        assert 'rating' in result
        assert 'city' in result
        assert 'country' in result
        assert 'img_url' in result