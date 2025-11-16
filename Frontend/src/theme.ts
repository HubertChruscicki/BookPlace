import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
    // =========================================================================
    // PALETTE (Colors)
    // =========================================================================
    palette: {
        primary: {
            main: '#086cf3',       // $primary-blue
            light: '#3b82f6',      // $primary-blue-light
            dark: '#1d4ed8',       // $primary-blue-dark
        },
        secondary: {
            main: '#fbbf24',       // $accent-yellow
        },
        background: {
            default: '#f3f4f6',   // $color-gray-100
            paper: '#ffffff',     // $color-white
        },
        text: {
            primary: '#111827',   // $text-primary
            secondary: '#6b7280', // $text-secondary
        },
    },

    // =========================================================================
    // TYPOGRAPHY
    // =========================================================================
    typography: {
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'sans-serif'
        ].join(','),

        // Mapping your font sizes
        h1: { fontSize: '1.875rem', fontWeight: 700 }, // $font-size-3xl, $font-weight-bold
        h2: { fontSize: '1.5rem', fontWeight: 700 },   // $font-size-2xl, $font-weight-bold
        h3: { fontSize: '1.25rem', fontWeight: 500 },  // $font-size-xl, $font-weight-medium
        h4: { fontSize: '1.125rem', fontWeight: 500 }, // $font-size-lg, $font-weight-medium
        body1: { fontSize: '1rem', fontWeight: 400 },    // $font-size-base, $font-weight-normal
        body2: { fontSize: '0.875rem', fontWeight: 400 }, // $font-size-sm, $font-weight-normal

        // Setting default weights
        fontWeightRegular: 400, // $font-weight-normal
        fontWeightMedium: 500,  // $font-weight-medium
        fontWeightBold: 700,    // $font-weight-bold
    },



    // =========================================================================
    // SPACING
    // =========================================================================
    spacing: 8,

    // =========================================================================
    // BREAKPOINTS
    // =========================================================================
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,     
            md: 960,     
            lg: 1366,    
            xl: 1920,
        },
    },

    // =========================================================================
    // COMPONENTS
    // =========================================================================
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    },
                },
            },
        },
    },
});