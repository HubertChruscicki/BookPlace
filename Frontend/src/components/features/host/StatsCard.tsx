import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  subtitle, 
  trend 
}: StatsCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.200',
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography
            variant="body2"
            sx={{
              color: 'grey.600',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {title}
          </Typography>
          <Avatar
            sx={{
              bgcolor: 'primary.50',
              color: 'primary.main',
              width: 40,
              height: 40,
            }}
          >
            {icon}
          </Avatar>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'grey.900',
            mb: 1,
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: 'grey.600',
              mb: trend ? 1 : 0,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {trend && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography
              variant="body2"
              sx={{
                color: trend.isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'grey.600',
              }}
            >
              vs ostatni miesiąc
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
