import { Box, Typography } from '@mui/material';
import {
    BookOnline,
    TrendingUp,
    Home,
    People,
    Star,
    CalendarToday,
} from '@mui/icons-material';
import StatsCard from '../../components/features/host/StatsCard.tsx';

export default function HostDashboardPage() {
    const stats = {
        totalBookings: 127,
        monthlyRevenue: 8450,
        activeOffers: 12,
        occupancyRate: 78,
        averageRating: 4.8,
        totalGuests: 312,
    };

    const trends = {
        bookings: { value: 12, isPositive: true },
        revenue: { value: 8, isPositive: true },
        occupancy: { value: -3, isPositive: false },
        rating: { value: 2, isPositive: true },
    };

    return (
        <Box>

            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1,
                }}
            >
                Panel główny
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    color: 'text.secondary',
                    mb: 4,
                }}
            >
                Przegląd Twojej działalności w BookPlace
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)'
                    },
                    gap: 3,
                }}
            >
                <StatsCard
                    title="Łączne rezerwacje"
                    value={stats.totalBookings}
                    icon={<BookOnline color="primary" />}
                    subtitle="Wszystkich rezerwacji"
                    trend={trends.bookings}
                />

                <StatsCard
                    title="Przychód miesięczny"
                    value={`${stats.monthlyRevenue.toLocaleString('pl-PL')} zł`}
                    icon={<TrendingUp color="primary" />} 
                    subtitle="Obecny miesiąc"
                    trend={trends.revenue}
                />

                <StatsCard
                    title="Aktywne oferty"
                    value={stats.activeOffers}
                    icon={<Home color="primary" />}
                    subtitle="Opublikowane oferty"
                />

                <StatsCard
                    title="Obłożenie"
                    value={`${stats.occupancyRate}%`}
                    icon={<CalendarToday color="primary" />} 
                    subtitle="Średnie obłożenie"
                    trend={trends.occupancy}
                />

                <StatsCard
                    title="Średnia ocena"
                    value={stats.averageRating}
                    icon={<Star color="primary" />} 
                    subtitle="Ze wszystkich ofert"
                    trend={trends.rating}
                />

                <StatsCard
                    title="Łączni goście"
                    value={stats.totalGuests}
                    icon={<People color="primary" />} 
                    subtitle="Obsłużonych gości"
                />
            </Box>
        </Box>
    );
}