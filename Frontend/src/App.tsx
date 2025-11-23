import { Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage.tsx";
import MainLayout from './components/layout/MainLayout';
import SearchPage from "./pages/SearchPage.tsx";
import OfferPage from "./pages/OfferPage.tsx";
import BookingCheckoutPage from './pages/BookingCheckoutPage.tsx';
import BookingConfirmationPage from "./pages/BookingConfirmationPage.tsx";
import MyBookingsPage from "./pages/MyBookingsPage.tsx";
import BookingDetailsPage from "./pages/BookingDetailsPage.tsx";

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
        </Routes>
    );
}