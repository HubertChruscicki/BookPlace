from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
class ReservationViewAPI(ViewSet):
    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def user_reservations(self, request, user_id=None):
        if user_id == "1":
            mock_data = [
                {"id": "10", "user_id": "1", "offer_id": "2", "check_in": "2025-06-01", "check_out": "2025-06-10"},
                {"id": "11", "user_id": "1", "offer_id": "3", "check_in": "2025-07-15", "check_out": "2025-07-20"}
            ]
            return Response(mock_data, status=status.HTTP_200_OK)

        return Response({"detail": "No reservations found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='offer/(?P<offer_id>[^/.]+)')
    def offer_reservations(self, request, offer_id=None):
        mock_data = [
            {"id": "10", "user_id": "1", "offer_id": "1", "check_in": "2025-06-01", "check_out": "2025-06-10"},
            {"id": "12", "user_id": "2", "offer_id": "1", "check_in": "2025-08-05", "check_out": "2025-08-12"}
        ]
        filtered_reservations = [res for res in mock_data if res["offer_id"] == offer_id]

        if not filtered_reservations:
            return Response({"detail": "No reservations found for this offer."}, status=status.HTTP_404_NOT_FOUND)

        return Response(filtered_reservations, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='book')
    def book_reservation(self, request):
        try:
            data = request.data
            if not isinstance(data.get("user_id"), int) or not isinstance(data.get("offer_id"), int):
                raise ValueError("Invalid format. 'user_id' and 'offer_id' must be integers.")

            if not isinstance(data.get("check_in"), str) or not isinstance(data.get("check_out"), str):
                raise ValueError("Invalid format. 'check_in' and 'check_out' must be date strings.")

            return Response({"message": "Reservation created successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# test 201
# {
#     "user_id": 1,
#     "offer_id": 2,
#     "check_in": "2025-06-01",
#     "check_out": "2025-06-10"
# }
#
# test 500
# {
#     "user_id": "abc",
#     "offer_id": 2,
#     "check_in": "2025-06-01",
#     "check_out": "2025-06-10"
# }