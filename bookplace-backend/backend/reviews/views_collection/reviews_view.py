from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

class ReviewViewAPI(ViewSet):
    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def user_reviews(self, request, user_id=None):
        if user_id == "1":
            mock_data = [
                {"id": "1", "user_id": "1", "offer_id": "2", "rating": 5, "comment": "Ladnie czysto schludnie!"},
                {"id": "2", "user_id": "1", "offer_id": "3", "rating": 1, "comment": "Brud smród."}
            ]
            return Response(mock_data, status=status.HTTP_200_OK)

        return Response({"detail": "No reviews found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='offer/(?P<offer_id>[^/.]+)')
    def offer_reviews(self, request, offer_id=None):
        mock_data = [
            {"id": "1", "user_id": "1", "offer_id": "1", "rating": 5, "comment": "Świetne miejsce!"},
            {"id": "3", "user_id": "2", "offer_id": "1", "rating": 3, "comment": "Ładne, ale hałaśliwe sąsiedztwo."}
        ]
        filtered_reviews = [review for review in mock_data if review["offer_id"] == offer_id]

        if not filtered_reviews:
            return Response({"detail": "No reviews found for this offer."}, status=status.HTTP_404_NOT_FOUND)

        return Response(filtered_reviews, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='add')
    def add_review(self, request):
        try:
            data = request.data
            if not isinstance(data.get("user_id"), int) or not isinstance(data.get("offer_id"), int):
                raise ValueError("Invalid format. 'user_id' and 'offer_id' must be integers.")

            if not isinstance(data.get("rating"), int) or not (1 <= data["rating"] <= 5):
                raise ValueError("Invalid rating. It must be an integer between 1 and 5.")

            return Response({"message": "Review added successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# test 201
# {
#     "user_id": 1,
#     "offer_id": 2,
#     "rating": 5,
#     "comment": "Bardzo dobra lokalizacja!"
# }
# test 500
# {
#     "user_id": "abc",
#     "offer_id": 2,
#     "rating": 5,
#     "comment": "Świetna lokalizacja!"
# }