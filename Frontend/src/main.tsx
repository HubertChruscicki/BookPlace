import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {AuthProvider} from "./contexts/auth/AuthContext.tsx";
import './styles/index.scss';
import {ThemeProvider} from "@mui/material";
import {theme} from "./theme.ts";
import App from "./App.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <AuthProvider>
                        <App/>
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
);