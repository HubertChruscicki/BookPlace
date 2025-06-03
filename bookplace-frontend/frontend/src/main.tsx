import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import OfferPage from "./pages/OfferPage.tsx";
import {theme} from "./theme/theme.ts";
import {ThemeProvider} from "@mui/material";
import AddOfferPage from "./pages/AddOfferPage.tsx";
import AddReviewPage from "./pages/AddReviewPage.tsx";
import {AuthProvider} from "./Auth/AuthProvider.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import ReservationPage from "./pages/ReservationPage.tsx";
import {RequireAuth} from "./Auth/RequireAuth.tsx";
import LandlordOffersPage from "./pages/LandlordOffersPage.tsx";
import LandlordReservationsPage from "./pages/LandlordReservationsPage.tsx";
import LandlordMessagesPage from "./pages/LandlordMessagesPage.tsx";
import LandlordCalnedarPage from "./pages/LandlordCalnedarPage.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
              <BrowserRouter>
                <AuthProvider>
                    <Routes>
                    <Route path="/" element={<MainPage/>} />
                    <Route path="/addReview/:id" element={<AddReviewPage/>} />
                    <Route path="/offer/:id/*" element={<OfferPage/>}/>
                    <Route path="/checkout/:id" element={<CheckoutPage/>} />
                    <Route path="/reservations" element={<ReservationPage/>} />
                    <Route element={<RequireAuth requiredRole={["landlord"]}/>}>
                        <Route path="/landlord">
                            <Route path="calendar" element={<LandlordCalnedarPage/>}/>
                            <Route path="offers" element={<LandlordOffersPage/>} />
                            <Route path="messages" element={<LandlordMessagesPage/>} />
                            <Route path="reservations/:status" element={<LandlordReservationsPage />} />
                            <Route path="reservations" element={<LandlordReservationsPage />} />
                            <Route path="addOffer" element={<AddOfferPage/>} />
                        </Route>
                    </Route>
                    </Routes>
                </AuthProvider>
              </BrowserRouter>
          </ThemeProvider>
      </QueryClientProvider>
  </React.StrictMode>,
)
