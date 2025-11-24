import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { CalendarMonth, Add } from '@mui/icons-material';

export default function HostCalendarPage() {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: 'grey.900',
          mb: 1,
        }}
      >
        Kalendarz
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          color: 'grey.600',
          mb: 4,
        }}
      >
        Zarządzaj dostępnością swoich ofert
      </Typography>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'grey.200',
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <CalendarMonth 
            sx={{ 
              fontSize: 80, 
              color: 'grey.300', 
              mb: 2 
            }} 
          />
          <Typography variant="h5" sx={{ mb: 2, color: 'grey.600' }}>
            Kalendarz w przygotowaniu
          </Typography>
          <Typography variant="body1" color="grey.500" sx={{ mb: 3 }}>
            Tutaj będzie można zarządzać dostępnością ofert,<br />
            blokować daty i ustawiać specjalne ceny.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            disabled
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Dodaj blokadę daty
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
