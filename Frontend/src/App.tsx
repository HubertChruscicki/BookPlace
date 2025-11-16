import { Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage.tsx";
import MainLayout from './components/layout/MainLayout';
import SearchPage from "./pages/SearchPage.tsx";

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
                    <MainLayout>
                        <SearchPage />
                    </MainLayout>
                }
            />
        </Routes>
    );
}