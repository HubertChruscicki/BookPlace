from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

class OfferViewAPI(ViewSet):
    @action(detail=False, methods=['get'], url_path='user/(?P<id>[^/.]+)')
    def user_offers(self, request, id=None):
        if id == "1":
            mock_data = [
                {
                    "id": "1",
                    "user_id": "1",
                    "offer_name": "Dom z basenem i sauną Zakopane",
                    "city": "Zakopane",
                    "country": "Polska",
                    "price_per_night": "450"
                },
                {
                    "id": "2",
                    "user_id": "1",
                    "offer_name": "Apartament w centrum Krakowa",
                    "city": "Kraków",
                    "country": "Polska",
                    "price_per_night": "350"
                }
            ]
            return Response(mock_data, status=status.HTTP_200_OK)

        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='city/(?P<city>[^/.]+)')
    def city_offers(self, request, city=None):
        mock_data = [
            {
                "id": "1",
                "user_id": "1",
                "offer_name": "Dom z basenem i sauną Zakopane",
                "city": "Zakopane",
                "country": "Polska",
                "price_per_night": "450"
            },
            {
                "id": "3",
                "user_id": "2",
                "offer_name": "Apartament 400m od skoczni narciarskiej",
                "city": "Zakopane",
                "country": "Polska",
                "price_per_night": "450"
            },
            {
                "id": "2",
                "user_id": "2",
                "offer_name": "Apartament w centrum Krakowa",
                "city": "Krakow",
                "country": "Polska",
                "price_per_night": "550"
            },
            {
                "id": "4",
                "user_id": "2",
                "offer_name": "Studio obok wawelu",
                "city": "Krakow",
                "country": "Polska",
                "price_per_night": "700"
            }
        ]

        filtered_offers = [offer for offer in mock_data if offer["city"].lower() == city.lower()]

        if not filtered_offers:
            return Response({"detail": "No offers found in this city."}, status=status.HTTP_404_NOT_FOUND)

        return Response(filtered_offers, status=status.HTTP_200_OK)

