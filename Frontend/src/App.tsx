import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage.tsx";
import MainLayout from './components/layout/MainLayout';

export default function App() {
    return (
        <Routes>
            <Route 
                path="/" 
                element={
                    <MainLayout>
                        <HomePage />
                    </MainLayout>
                } 
            />
        </Routes>
    );
}