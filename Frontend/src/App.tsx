import { Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage.tsx";
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/features/auth/ProtectedRoute';
import SearchPage from "./pages/SearchPage.tsx";
import OfferPage from "./pages/OfferPage.tsx";
import BookingCheckoutPage from './pages/booking/BookingCheckoutPage.tsx';
import BookingConfirmationPage from "./pages/booking/BookingConfirmationPage.tsx";
import MyBookingsPage from "./pages/MyBookingsPage.tsx";
import BookingDetailsPage from "./pages/booking/BookingDetailsPage.tsx";
import HostDashboardPage from './pages/host/HostDashboardPage.tsx';
import HostBookingsPage from './pages/host/HostBookingsPage.tsx';
import HostCalendarPage from './pages/host/HostCalendarPage.tsx';
import HostOffersPage from './pages/host/HostOffersPage.tsx';
import HostInboxPage from './pages/host/HostInboxPage.tsx';
import HeaderHostNavigation from './components/common/header/HeaderHostNavigation';

export default function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <MainLayout>
                        <LandingPage />
                    </MainLayout>
                }
            />
            <Route
                path="/search"
                element={
                    <MainLayout showSearch={true}>
                        <SearchPage />
                    </MainLayout>
                }
            />
            <Route
                path="/offer/:offerId"
                element={
                    <MainLayout showSearch={true}>
                        <OfferPage/>
                    </MainLayout>
                }
            />
            <Route
                path="/booking/checkout"
                element={
                    <MainLayout>
                        <BookingCheckoutPage />
                    </MainLayout>
                }
            />
            <Route
                path="/booking/confirmation"
                element={
                    <MainLayout>
                        <BookingConfirmationPage/>
                    </MainLayout>
                }
            />
            <Route
                path="/my-bookings"
                element={
                        <MainLayout>
                            <MyBookingsPage />
                        </MainLayout>
                }
            />
            <Route
                path="/my-bookings/:bookingId"
                element={
                        <MainLayout>
                            <BookingDetailsPage />
                        </MainLayout>
                }
            />
            
            <Route element={<ProtectedRoute allowedRoles={['Host']} />}>
                <Route
                    path="/host/dashboard"
                    element={
                        <MainLayout centerContent={<HeaderHostNavigation />}>
                            <HostDashboardPage />
                        </MainLayout>
                    }
                />
                <Route
                    path="/host/bookings"
                    element={
                        <MainLayout centerContent={<HeaderHostNavigation />}>
                            <HostBookingsPage />
                        </MainLayout>
                    }
                />
                <Route
                    path="/host/calendar"
                    element={
                        <MainLayout centerContent={<HeaderHostNavigation />}>
                            <HostCalendarPage />
                        </MainLayout>
                    }
                />
                <Route
                    path="/host/offers"
                    element={
                        <MainLayout centerContent={<HeaderHostNavigation />}>
                            <HostOffersPage />
                        </MainLayout>
                    }
                />
                <Route
                    path="/host/inbox"
                    element={
                        <MainLayout centerContent={<HeaderHostNavigation />}>
                            <HostInboxPage />
                        </MainLayout>
                    }
                />
            </Route>
        </Routes>
    );
}