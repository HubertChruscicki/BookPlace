import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    subtitle?: string;
    colorVariant: 'blue' | 'mint' | 'purple' | 'orange' | 'pink' | 'cyan';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const cardStyles = {
    blue: {
        bgcolor: '#2196F3',
        color: '#fff',
        iconColor: 'rgba(255, 255, 255, 0.2)',
    },
    mint: {
        bgcolor: '#4DB6AC',
        color: '#fff',
        iconColor: 'rgba(255, 255, 255, 0.2)',
    },
    purple: {
        bgcolor: '#7E57C2',
        color: '#fff',
        iconColor: 'rgba(255, 255, 255, 0.2)',
    },
    orange: {
        bgcolor: '#FFB74D',
        color: '#fff',
        iconColor: 'rgba(255, 255, 255, 0.2)',
    },
    pink: {
        bgcolor: '#EF5350',
        color: '#fff',
        iconColor: 'rgba(255, 255, 255, 0.2)',
    },
    cyan: {
        bgcolor: '#26C6DA',
        color: '#fff',
        iconColor: 'rgba(255, 255, 255, 0.2)',
    }
};

export default function DashboardStatsCard({
                                               title,
                                               value,
                                               icon: Icon,
                                               subtitle,
                                               colorVariant,
                                               trend
                                           }: StatsCardProps) {
    const styles = cardStyles[colorVariant];

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                bgcolor: styles.bgcolor,
                color: styles.color,
                height: '220px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                boxShadow: `0 8px 24px ${alpha(styles.bgcolor, 0.3)}`,
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 16px 32px ${alpha(styles.bgcolor, 0.4)}`,
                },
            }}
        >
            <CardContent
                sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1
                }}
            >

                <Box>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            fontSize: '3.5rem',
                            lineHeight: 1,
                            mb: 1,
                            textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        }}
                    >
                        {value}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            opacity: 0.9,
                            fontSize: '1.1rem',
                            letterSpacing: 0.5
                        }}
                    >
                        {title}
                    </Typography>
                </Box>

                <Box>
                    {trend && (
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                width: 'fit-content',
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 3,
                                mb: 0.5,
                                backdropFilter: 'blur(4px)'
                            }}
                        >
                            {trend.isPositive ?
                                <TrendingUp sx={{ fontSize: 20, color: '#fff' }} /> :
                                <TrendingDown sx={{ fontSize: 20, color: '#fff' }} />
                            }
                            <Typography variant="body1" fontWeight={700}>
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                                vs last month
                            </Typography>
                        </Box>
                    )}

                    {subtitle && !trend && (
                        <Typography variant="body2" sx={{ opacity: 0.8, display: 'block', fontWeight: 500 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        right: 20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: styles.iconColor,
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                >
                    <Icon sx={{ fontSize: 140 }} />
                </Box>

            </CardContent>
        </Card>
    );
}