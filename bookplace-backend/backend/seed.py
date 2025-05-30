import os
import sys
import random
import django
from django.core.files import File
from django.contrib.auth.hashers import make_password
from django.conf import settings
from datetime import timedelta

# Ustawienie środowiska Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from faker import Faker
from django.contrib.auth import get_user_model
from offers.models import (
    OfferTypes, Offers, OfferLocation, OfferDetails,
    OfferAmenities, OfferImages
)
from reservations.models import ReservationStatus

fake = Faker('pl_PL')
User = get_user_model()

def create_users():
    """Tworzenie użytkowników: 1 admin, 3 landlordów, 5 userów"""
    print("Tworzenie użytkowników...")

    # Przygotowanie hasła
    hashed_password = make_password("TajneHaslo69!")

    # Admin
    admin = User.objects.create(
        email="admin@example.com",
        password=hashed_password,
        first_name="Admin",
        last_name="Adminowski",
        phone="765332567",
        role=User.ROLE_ADMIN,
        is_staff=True,
        is_superuser=True
    )
    print(f"Utworzono admina: {admin.email}")

    # Landlordzi
    landlords = []
    for i in range(1, 4):
        landlord = User.objects.create(
            email=f"landlord{i}@example.com",
            password=hashed_password,
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            role=User.ROLE_LANDLORD,
            phone=f"53244521{i}"
        )
        landlords.append(landlord)
        print(f"Utworzono landlorda: {landlord.email}")

    # Zwykli użytkownicy
    users = []
    for i in range(1, 6):
        user = User.objects.create(
            email=f"user{i}@example.com",
            password=hashed_password,
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            role=User.ROLE_USER,
            phone=f"53566790{i}"
        )
        users.append(user)
        print(f"Utworzono użytkownika: {user.email}")

    return admin, landlords, users

def create_offer_types():
    """Tworzenie typów ofert"""
    print("Tworzenie typów ofert...")

    types = [
        "Apartament", "Dom", "Pokój", "Willa", "Bungalow",
        "Domek letniskowy", "Hostel", "Hotel", "Resort", "Chata"
    ]

    offer_types = []
    for type_name in types:
        offer_type = OfferTypes.objects.create(name=type_name)
        offer_types.append(offer_type)
        print(f"Utworzono typ oferty: {type_name}")

    return offer_types

def create_reservation_statuses():
    """Tworzenie statusów rezerwacji"""
    print("Tworzenie statusów rezerwacji...")

    statuses = ["confirmed", "archive", "cancelled"]

    for status_name in statuses:
        status = ReservationStatus.objects.create(name=status_name)
        print(f"Utworzono status rezerwacji: {status_name}")

def ensure_media_dir():
    """Upewnienie się, że katalogi mediów istnieją"""
    os.makedirs(os.path.join(settings.MEDIA_ROOT, 'images'), exist_ok=True)

def create_offers(landlords, offer_types):
    """Tworzenie 200 ofert dla landlordów"""
    print("Tworzenie ofert...")

    ensure_media_dir()

    apartment_names = [
        "Słoneczny Zakątek", "Widok na Góry", "Morska Bryza", "Centrum Miasta",
        "Nadrzeczna Przystań", "Leśna Chata", "Apartament w Centrum", "Nadmorska Willa",
        "Miejska Oaza", "Cichy Kąt", "Królewskie Pokoje", "Luksusowy Apartament"
    ]

    cities = ["Warszawa", "Kraków", "Gdańsk", "Wrocław", "Poznań", "Zakopane",
              "Sopot", "Szczecin", "Łódź", "Lublin", "Białystok", "Katowice"]

    countries = ["Polska", "Niemcy", "Francja", "Włochy", "Hiszpania",
                "Czechy", "Słowacja", "Węgry", "Austria", "Chorwacja"]

    total_offers = 200

    for i in range(total_offers):
        # Wybieramy landlorda rotacyjnie aby równo rozdzielić oferty
        landlord = landlords[i % len(landlords)]

        offer = Offers.objects.create(
            landlord=landlord,
            offer_type=random.choice(offer_types),
            title=random.choice(apartment_names) + " " + fake.word().capitalize(),
            description="\n\n".join(fake.paragraphs(nb=5)),
            price_per_night=random.randint(100, 1500),
            max_guests=random.randint(1, 10),
            is_active=True
        )

        # Lokalizacja
        OfferLocation.objects.create(
            offer_id=offer,
            country=random.choice(countries),
            city=random.choice(cities),
            address=fake.street_address(),
            province=fake.administrative_unit(),
            latitude=float(fake.latitude()),
            longitude=float(fake.longitude())
        )

        # Szczegóły
        OfferDetails.objects.create(
            offer_id=offer,
            rooms=random.randint(1, 8),
            beds=random.randint(1, 6),
            double_beds=random.randint(0, 3),
            sofa_beds=random.randint(0, 2)
        )

        # Udogodnienia
        OfferAmenities.objects.create(
            offer_id=offer,
            private_bathroom=random.choice([True, False]),
            kitchen=random.choice([True, False]),
            wifi=random.choice([True, True, True, False]),  # Częściej True
            tv=random.choice([True, True, False]),
            fridge_in_room=random.choice([True, False]),
            air_conditioning=random.choice([True, False]),
            smoking_allowed=random.choice([False, False, True]),  # Częściej False
            pets_allowed=random.choice([False, False, True]),
            parking=random.choice([True, False]),
            swimming_pool=random.choice([False, False, True]),
            sauna=random.choice([False, False, True]),
            jacuzzi=random.choice([False, False, True])
        )

        # Dodawanie zdjęć
        available_images = list(range(5, 58))
        selected_images = random.sample(available_images, 6)

        for j, img_num in enumerate(selected_images):
            is_main = (j == 0)  # Pierwsze zdjęcie jest główne

            # Przygotowanie ścieżki - imitacja istniejącego pliku
            image_path = f"images/{img_num}.jpg"

            offer_image = OfferImages(
                offer_id=offer,
                is_main=is_main,
                image=image_path
            )
            offer_image.save()

        print(f"Utworzono ofertę {offer.id}: {offer.title} ({offer.offer_type.name}) - {landlord.email}")

def main():
    print("Rozpoczynanie seedowania bazy danych...")

    # Utworzenie użytkowników
    admin, landlords, users = create_users()

    # Utworzenie typów ofert
    offer_types = create_offer_types()

    # Utworzenie statusów rezerwacji
    create_reservation_statuses()

    # Utworzenie ofert
    create_offers(landlords, offer_types)

    print("Seedowanie bazy danych zakończone!")

if __name__ == "__main__":
    main()