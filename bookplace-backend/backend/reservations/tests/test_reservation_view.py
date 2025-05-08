import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.utils import timezone

from django.contrib.auth import get_user_model
from offers.models import Offers
from ..models import Reservations, ReservationStatus

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return User.objects.create_user(
        email="user@example.com",
        password="pass1234",
        role=User.ROLE_USER
    )


@pytest.fixture
def landlord():
    return User.objects.create_user(
        email="landlord@example.com",
        password="pass1234",
        role=User.ROLE_LANDLORD
    )


@pytest.fixture
def admin():
    return User.objects.create_user(
        email="admin@example.com",
        password="pass1234",
        role=User.ROLE_ADMIN
    )


@pytest.fixture
def offer(landlord):
    return Offers.objects.create(
        title="Test Offer",
        owner=landlord,
        price=100
    )


@pytest.fixture
def confirmed_status():
    return ReservationStatus.objects.create(name="confirmed")


@pytest.mark.django_db
class TestReservationEndpoints:

    def test_list_no_reservations_returns_empty_list(self, api_client, user, offer):
        api_client.force_authenticate(user=user)
        url = reverse('reservations-list', kwargs={'offer_pk': offer.pk})
        resp = api_client.get(url)
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['results'] == []

    def test_make_reservation_creates_and_returns_201(self,
                                                      api_client,
                                                      user,
                                                      offer,
                                                      confirmed_status):
        api_client.force_authenticate(user=user)
        url = reverse('reservations-make-reservation', kwargs={'offer_pk': offer.pk})
        start = (timezone.now() + timezone.timedelta(days=1)).isoformat()
        end = (timezone.now() + timezone.timedelta(days=2)).isoformat()
        payload = {
            "start_date": start,
            "end_date": end,
            "guests_number": 2
        }
        resp = api_client.post(url, payload, format='json')
        assert resp.status_code == status.HTTP_201_CREATED
        data = resp.data
        # Check that the created reservation points to our user
        assert data['user'] == user.pk
        assert "id" in data
        # DB side
        res = Reservations.objects.get(pk=data['id'])
        assert res.offer_id_id == offer.pk
        assert res.status_id == confirmed_status

    def test_make_reservation_as_admin_forbidden(self, api_client, admin, offer):
        api_client.force_authenticate(user=admin)
        url = reverse('reservations-make-reservation', kwargs={'offer_pk': offer.pk})
        resp = api_client.post(url, {}, format='json')
        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_retrieve_reservation_returns_200(self,
                                             api_client,
                                             user,
                                             offer,
                                             confirmed_status):
        # prepare
        res = Reservations.objects.create(
            user=user,
            offer_id=offer,
            status_id=confirmed_status,
            start_date=timezone.now() + timezone.timedelta(days=1),
            end_date=timezone.now() + timezone.timedelta(days=2),
        )
        api_client.force_authenticate(user=user)
        url = reverse('reservations-detail', kwargs={'offer_pk': offer.pk, 'pk': res.pk})
        resp = api_client.get(url)
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['id'] == res.pk

    def test_info_action_returns_minimal_fields(self,
                                                api_client,
                                                user,
                                                offer,
                                                confirmed_status):
        res = Reservations.objects.create(
            user=user,
            offer_id=offer,
            status_id=confirmed_status,
            start_date=timezone.now() + timezone.timedelta(days=3),
            end_date=timezone.now() + timezone.timedelta(days=4),
        )
        api_client.force_authenticate(user=user)
        url = reverse('reservations-info', kwargs={'offer_pk': offer.pk, 'pk': res.pk})
        resp = api_client.get(url)
        assert resp.status_code == status.HTTP_200_OK
        # Only id, start_date, end_date, status
        assert set(resp.data.keys()) == {"id", "start_date", "end_date", "status"}

    def test_landlord_list_and_retrieve(self,
                                        api_client,
                                        landlord,
                                        offer,
                                        confirmed_status):
        # create two reservations: one for this landlord as user, one by other user on their offer
        other = User.objects.create_user(email="other@example.com", password="p")
        res1 = Reservations.objects.create(
            user=landlord,
            offer_id=offer,
            status_id=confirmed_status,
            start_date=timezone.now() + timezone.timedelta(days=1),
            end_date=timezone.now() + timezone.timedelta(days=2),
        )
        res2 = Reservations.objects.create(
            user=other,
            offer_id=offer,
            status_id=confirmed_status,
            start_date=timezone.now() + timezone.timedelta(days=3),
            end_date=timezone.now() + timezone.timedelta(days=4),
        )
        api_client.force_authenticate(user=landlord)
        list_url = reverse('reservations-landlord', kwargs={'offer_pk': offer.pk})
        resp = api_client.get(list_url)
        assert resp.status_code == status.HTTP_200_OK
        ids = {obj['id'] for obj in resp.data['results']}
        assert res1.pk in ids and res2.pk in ids

        detail_url = reverse('reservations-landlord-retrieve', kwargs={'offer_pk': offer.pk, 'id': res2.pk})
        resp2 = api_client.get(detail_url)
        assert resp2.status_code == status.HTTP_200_OK
        assert resp2.data['id'] == res2.pk