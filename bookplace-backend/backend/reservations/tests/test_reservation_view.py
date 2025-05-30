import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from datetime import datetime, timedelta
from users.models import User
from offers.models import Offers, OfferTypes
from reservations.models import Reservations, ReservationStatus

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_password():
    return "StrongPassword123!"

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
def another_landlord_user(db, test_password):
    user = User.objects.create_user(
        email="landlord2@example.com",
        password=test_password,
        first_name="Another",
        last_name="Landlord",
        phone="555666777",
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
        phone="111222333",
        role=User.ROLE_USER
    )
    return user

@pytest.fixture
def another_user(db, test_password):
    user = User.objects.create_user(
        email="another@example.com",
        password=test_password,
        first_name="Another",
        last_name="User",
        phone="444555666",
        role=User.ROLE_USER
    )
    return user

@pytest.fixture
def admin_token(admin_user):
    from users.authentication import JWTAuthentication
    return JWTAuthentication.create_jwt(admin_user)

@pytest.fixture
def landlord_token(landlord_user):
    from users.authentication import JWTAuthentication
    return JWTAuthentication.create_jwt(landlord_user)

@pytest.fixture
def another_landlord_token(another_landlord_user):
    from users.authentication import JWTAuthentication
    return JWTAuthentication.create_jwt(another_landlord_user)

@pytest.fixture
def user_token(regular_user):
    from users.authentication import JWTAuthentication
    return JWTAuthentication.create_jwt(regular_user)

@pytest.fixture
def another_user_token(another_user):
    from users.authentication import JWTAuthentication
    return JWTAuthentication.create_jwt(another_user)

@pytest.fixture
def offer_type(db):
    return OfferTypes.objects.create(name="Apartament")

@pytest.fixture
def landlord_offer(db, landlord_user, offer_type):
    from offers.models import OfferLocation, OfferDetails, OfferAmenities

    offer = Offers.objects.create(
        landlord=landlord_user,
        offer_type=offer_type,
        title="Mieszkanie Landlorda",
        description="Opis mieszkania landlorda",
        price_per_night=100,
        max_guests=4,
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
        beds=2,
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

    return offer

@pytest.fixture
def another_landlord_offer(db, another_landlord_user, offer_type):
    from offers.models import OfferLocation, OfferDetails, OfferAmenities

    offer = Offers.objects.create(
        landlord=another_landlord_user,
        offer_type=offer_type,
        title="Mieszkanie Drugiego Landlorda",
        description="Opis mieszkania drugiego landlorda",
        price_per_night=150,
        max_guests=2,
        is_active=True
    )

    OfferLocation.objects.create(
        offer_id=offer,
        country="Polska",
        city="Kraków",
        address="Testowa 2",
        province="Małopolskie",
        latitude=50.0647,
        longitude=19.9450
    )

    OfferDetails.objects.create(
        offer_id=offer,
        rooms=1,
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
        air_conditioning=True,
        smoking_allowed=False,
        pets_allowed=False,
        parking=False,
        swimming_pool=False,
        sauna=False,
        jacuzzi=False
    )

    return offer

@pytest.fixture
def confirmed_status(db):
    return ReservationStatus.objects.create(name="confirmed")

@pytest.fixture
def cancelled_status(db):
    return ReservationStatus.objects.create(name="cancelled")

@pytest.fixture
def user_reservation(db, regular_user, landlord_offer, confirmed_status):
    start_date = datetime.now() + timedelta(days=10)
    end_date = start_date + timedelta(days=5)

    reservation = Reservations.objects.create(
        user=regular_user,
        offer_id=landlord_offer,
        start_date=start_date,
        end_date=end_date,
        status_id=confirmed_status,
        total_price=landlord_offer.price_per_night * 5,
        guests_number=2
    )

    return reservation

@pytest.fixture
def another_user_reservation(db, another_user, landlord_offer, confirmed_status):
    start_date = datetime.now() + timedelta(days=20)
    end_date = start_date + timedelta(days=3)

    reservation = Reservations.objects.create(
        user=another_user,
        offer_id=landlord_offer,
        start_date=start_date,
        end_date=end_date,
        status_id=confirmed_status,
        total_price=landlord_offer.price_per_night * 3,
        guests_number=1
    )

    return reservation

@pytest.fixture
def landlord_reservation(db, landlord_user, another_landlord_offer, confirmed_status):
    start_date = datetime.now() + timedelta(days=15)
    end_date = start_date + timedelta(days=2)

    reservation = Reservations.objects.create(
        user=landlord_user,
        offer_id=another_landlord_offer,
        start_date=start_date,
        end_date=end_date,
        status_id=confirmed_status,
        total_price=another_landlord_offer.price_per_night * 2,
        guests_number=2
    )

    return reservation

@pytest.mark.django_db
class TestReservationViewAPI:
    def test_list_reservations_as_user(self, api_client, user_token, user_reservation, another_user_reservation):
        """User should see only their own reservations"""

        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {user_token}")
        url = "/api/v1/reservations/"

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['id'] == user_reservation.id

    def test_list_reservations_as_admin(self, api_client, admin_token, user_reservation, another_user_reservation, landlord_reservation):
        """Admin should see all reservations"""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {admin_token}")
        url = "/api/v1/reservations/"

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 3
        assert len(response.data['results']) == 3

    def test_retrieve_reservation_as_owner(self, api_client, user_token, user_reservation):
        """User should be able to retrieve their own reservation details"""

        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {user_token}")
        url = f"/api/v1/reservations/{user_reservation.id}/"

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == user_reservation.id
        assert 'landlord' in response.data
        assert 'total_price' in response.data

    def test_retrieve_reservation_as_not_owner(self, api_client, another_user_token, user_reservation):
        """User should not be able to retrieve another user's reservation"""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {another_user_token}")
        url = f"/api/v1/reservations/{user_reservation.id}/"

        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_landlord_view_reservations(self, api_client, landlord_token, user_reservation, another_user_reservation):
        """Landlord sholud see reservations of their offers"""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {landlord_token}")
        url = "/api/v1/reservations/landlord/"

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 2
        ids = [res['id'] for res in response.data['results']]
        assert user_reservation.id in ids
        assert another_user_reservation.id in ids

    def test_landlord_cannot_see_other_offers_reservations(self, api_client, another_landlord_token, user_reservation):
        """Landlord should not see reservations of another landlord's offer"""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {another_landlord_token}")
        url = "/api/v1/reservations/landlord/"

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 0

    def test_landlord_view_own_reservation(self, api_client, landlord_token, landlord_reservation):
        """Landlord should be able to see their own reservations as a user"""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {landlord_token}")
        url = "/api/v1/reservations/"

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['results'][0]['id'] == landlord_reservation.id

    def test_make_reservation_success(self, api_client, user_token, landlord_offer, confirmed_status):
        """User should be able to book an available offer"""

        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {user_token}")
        url = "/api/v1/reservations/make-reservation/"

        start_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        end_date = (datetime.now() + timedelta(days=33)).strftime('%Y-%m-%d')

        data = {
            'offer_id': landlord_offer.id,
            'start_date': start_date,
            'end_date': end_date,
            'guests_number': 2
        }

        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert 'id' in response.data
        assert Reservations.objects.filter(id=response.data['id']).exists()

    def test_make_reservation_overlapping_dates(self, api_client, user_token, landlord_offer, user_reservation):
        """Cannot book an offer in a time slot that overlaps with an existing reservation"""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {user_token}")
        url = "/api/v1/reservations/make-reservation/"

        start_date = (user_reservation.start_date + timedelta(days=1)).strftime('%Y-%m-%d')
        end_date = (user_reservation.end_date + timedelta(days=1)).strftime('%Y-%m-%d')

        data = {
            'offer_id': landlord_offer.id,
            'start_date': start_date,
            'end_date': end_date,
            'guests_number': 2
        }

        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "time slot is already booked" in str(response.data)

    def test_landlord_cannot_reserve_own_offer(self, api_client, landlord_token, landlord_offer):
        """Landlord should not be able to book their own offer"""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {landlord_token}")
        url = "/api/v1/reservations/make-reservation/"

        start_date = (datetime.now() + timedelta(days=40)).strftime('%Y-%m-%d')
        end_date = (datetime.now() + timedelta(days=43)).strftime('%Y-%m-%d')

        data = {
            'offer_id': landlord_offer.id,
            'start_date': start_date,
            'end_date': end_date,
            'guests_number': 2
        }

        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Landlord cannot book their own offer" in str(response.data)

    def test_filter_landlord_reservations(self, api_client, landlord_token, user_reservation, another_user_reservation):
        """Test landlord can filter reservations by offer_id"""

        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {landlord_token}")
        url = f"/api/v1/reservations/landlord/?offer_id={user_reservation.offer_id.id}"

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 2

    def test_get_unavailable_dates(self, api_client, landlord_offer, user_reservation):
        """Test retrieve unavailable dates for a reservation"""

        month = user_reservation.start_date.month
        year = user_reservation.start_date.year

        url = f"/api/v1/reservations/{landlord_offer.id}/unavailable-dates/?month={month}&year={year}"

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0

        expected_date = user_reservation.start_date.strftime('%Y-%m-%d')
        assert expected_date in response.data

    def test_admin_access(self, api_client, admin_token, user_reservation):
        """Admin sholud be able to access a reservation"""
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {admin_token}")
        url = f"/api/v1/reservations/{user_reservation.id}/"

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == user_reservation.id