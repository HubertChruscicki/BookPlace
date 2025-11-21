import { Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage.tsx";
import MainLayout from './components/layout/MainLayout';
import SearchPage from "./pages/SearchPage.tsx";
import OfferPage from "./pages/OfferPage.tsx";

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
        </Routes>
    );
}