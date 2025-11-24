import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { styled, useTheme, alpha, Paper, useMediaQuery } from '@mui/material';
import type { BookingItem } from '../../../models/BookingModels';

const StyledCalendarWrapper = styled(Paper)(({ theme }) => ({
    borderRadius: 24,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: `1px solid ${theme.palette.grey[200]}`,
    padding: theme.spacing(2),
    overflow: 'hidden',
    backgroundColor: '#fff',

    '.fc': {
        fontFamily: theme.typography.fontFamily,
    },

    '.fc-toolbar-title': {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: theme.palette.text.primary,
    },

    '.fc-button': {
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        color: '#fff',
        borderRadius: 25,
        fontWeight: 600,
        textTransform: 'capitalize',
        padding: '8px 16px !important',
        transition: 'all 0.2s',
        boxShadow: 'none !important',
        opacity: 1,

        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            borderColor: theme.palette.primary.dark,
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3) !important',
        },
        '&.fc-button-active': {
            backgroundColor: theme.palette.primary.dark,
            borderColor: theme.palette.primary.dark,
        }
    },

    '.fc-button-group': {
        display: 'inline-flex',
    },
    '.fc-button-group > .fc-button': {
        margin: 0,
        border: `1px solid ${theme.palette.primary.main} !important`,
        backgroundColor: theme.palette.primary.main,
        color: '#fff',

        borderRadius: 0,

        '&:first-of-type': {
            borderTopLeftRadius: 25,
            borderBottomLeftRadius: 25,
            borderRight: 'none !important',
        },

        '&:last-of-type': {
            borderTopRightRadius: 25,
            borderBottomRightRadius: 25,
            marginLeft: '-1px !important',
        },

        '&:not(:first-of-type)': {
            marginLeft: '-1px !important',
        },

        '&:hover, &.fc-button-active': {
            zIndex: 2,
        }
    },

    '.fc-scrollgrid': {
        border: 'none',
    },
    '.fc-col-header-cell': {
        border: 'none',
        padding: '12px 0',
        '& .fc-col-header-cell-cushion': {
            color: theme.palette.text.secondary,
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: 1,
        }
    },
    '.fc-daygrid-day': {
        border: `1px solid ${theme.palette.grey[100]}`,
    },
    '.fc-day-today': {
        backgroundColor: alpha(theme.palette.text.secondary, 0.15) + ' !important',
    },

    '.fc-event': {
        border: 'none',
        borderRadius: 8,
        padding: '2px 4px',
        margin: '2px 4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'scale(1.02)',
            zIndex: 5,
        }
    },
    '.fc-daygrid-event-dot': {
        border: `4px solid ${theme.palette.primary.main}`,
    },
    '.fc-event-time': {
        fontWeight: 600,
        fontSize: '0.75rem',
    },
    '.fc-event-title': {
        fontWeight: 600,
        fontSize: '0.8rem',
    },
}));

interface HostCalendarProps {
    bookings: BookingItem[];
    onDateRangeChange: (start: Date, end: Date) => void;
    onEventClick?: (bookingId: string) => void;
}

export default function HostCalendar({ bookings, onDateRangeChange, onEventClick }: HostCalendarProps) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const events = useMemo(() => bookings
        .filter(booking => booking.status !== 'Cancelled')
        .map(booking => {
            const isPast = new Date(booking.checkOutDate) < new Date();

            let bgColor = theme.palette.primary.main;
            let textColor = '#fff';

            if (isPast) {
                bgColor = theme.palette.grey[400];
            } else if (booking.status === 'Confirmed') {
                bgColor = theme.palette.success.main;
            } else {
                bgColor = theme.palette.primary.main;
            }

            const endDay = new Date(booking.checkOutDate);
            endDay.setDate(endDay.getDate() + 1);

            return {
                id: booking.id.toString(),
                title: `${booking.offer.title}`,
                start: booking.checkInDate,
                end: endDay.toISOString().split('T')[0],
                backgroundColor: bgColor,
                textColor: textColor,
                extendedProps: {
                    price: booking.totalPrice,
                    status: booking.status
                }
            };
        }), [bookings, theme]);

    const responsiveToolbar = useMemo(() => {
        if (isDesktop) {
            return {
                left: 'today',
                center: 'title',
                right: 'prev,next'
            };
        } else {
            return {
                left: 'title',
                center: '',
                right: 'prev,next'
            };
        }
    }, [isDesktop]);

    const dynamicHeight = isDesktop ? "800px" : "600px";

    return (
        <StyledCalendarWrapper elevation={0}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"

                headerToolbar={responsiveToolbar}

                events={events}
                datesSet={(dateInfo) => {
                    onDateRangeChange(dateInfo.start, dateInfo.end);
                }}
                eventClick={(info) => {
                    if (onEventClick) onEventClick(info.event.id);
                }}

                height={dynamicHeight}
                contentHeight={600}
                firstDay={1}
                locale="en-GB"
            />
        </StyledCalendarWrapper>
    );
}