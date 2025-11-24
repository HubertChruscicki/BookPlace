import { Box, Typography, Grid } from '@mui/material';
import {
    BookOnline,
    TrendingUp,
    Home,
    People,
    Star,
    CalendarToday,
} from '@mui/icons-material';
import DashboardStatsCard from '../../components/features/host/DashboardStatsCard.tsx';

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
        guests: { value: 15, isPositive: true },
    };

    return (
        <Box>
            <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
            >
                Dashboard
            </Typography>

            <Typography
                variant="body1"
                sx={{ color: 'text.secondary', mb: 4 }}
            >
                Overview of your activity on BookPlace
            </Typography>

            <Grid container spacing={3}>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <DashboardStatsCard
                        title="Total Bookings"
                        value={stats.totalBookings}
                        icon={BookOnline}
                        colorVariant="blue"
                        trend={trends.bookings}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <DashboardStatsCard
                        title="Monthly Revenue"
                        value={`$${stats.monthlyRevenue}`}
                        icon={TrendingUp}
                        colorVariant="mint"
                        subtitle="Current month"
                        trend={trends.revenue}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <DashboardStatsCard
                        title="Active Offers"
                        value={stats.activeOffers}
                        icon={Home}
                        colorVariant="orange"
                        subtitle="Live listings"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <DashboardStatsCard
                        title="Total Guests"
                        value={stats.totalGuests}
                        icon={People}
                        colorVariant="cyan"
                        trend={trends.guests}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <DashboardStatsCard
                        title="Average Rating"
                        value={stats.averageRating}
                        icon={Star}
                        colorVariant="pink"
                        trend={trends.rating}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <DashboardStatsCard
                        title="Occupancy Rate"
                        value={`${stats.occupancyRate}%`}
                        icon={CalendarToday}
                        colorVariant="purple"
                        trend={trends.occupancy}
                    />
                </Grid>

            </Grid>
        </Box>
    );
}