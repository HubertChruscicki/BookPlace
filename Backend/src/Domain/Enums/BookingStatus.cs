namespace Domain.Entities;
public enum BookingStatus
{
    Pending = 1,
    Confirmed = 2,
    CancelledByHost = 3,
    CancelledByGuest = 4,
    Completed = 5
}
