import { Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage.tsx";
import MainLayout from './components/layout/MainLayout';

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
        </Routes>
    );
}