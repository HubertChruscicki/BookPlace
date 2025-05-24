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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AuthProvider>
                <Routes>
                <Route path="/" element={<MainPage/>} />
                <Route path="/addReview/:id" element={<AddReviewPage/>} />
                <Route path="/offer/:id/*" element={<OfferPage/>}/>
                <Route path="/checkout/:id" element={<CheckoutPage/>} />
                <Route element={<RequireAuth />}>
                    <Route path="/addOffer" element={<AddOfferPage/>} />
                    <Route path="/reservations" element={<ReservationPage/>} />
                </Route>
                </Routes>
            </AuthProvider>
          </BrowserRouter>
      </ThemeProvider>
  </React.StrictMode>,
)
