import {
    List, ListItemButton, ListItemAvatar, Avatar, ListItemText,
    Typography, Box, Badge, Paper, alpha, useTheme
} from '@mui/material';
import { CalendarMonth, Circle, Home, RateReview } from '@mui/icons-material';
import type { ConversationSummary } from '../../../models/ChatModels';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import React from "react";

interface ChatSidebarProps {
    conversations: ConversationSummary[];
    selectedId: number | null;
    onSelect: (id: number) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ conversations, selectedId, onSelect }) => {
    const theme = useTheme();

    const formatDateRange = (checkIn: string, checkOut: string) => {
        const start = format(new Date(checkIn), 'dd.MM');
        const end = format(new Date(checkOut), 'dd.MM');
        return `${start} - ${end}`;
    };

    const formatTime = (dateString: string) => {
        return format(new Date(dateString), 'HH:mm', { locale: pl });
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box p={3} pb={2}>
                <Typography
                    sx={{ fontWeight: 700, fontSize: "1.4rem", color: 'text.primary', mb: 1 }}
                >
                    Chats
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    You have {conversations.filter(c => c.isUnread).length} unread messages
                </Typography>
            </Box>

            <List sx={{
                overflowY: 'auto',
                height: '100%',
                px: 2,
                pb: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5
            }}>
                {conversations.map((conv) => {
                    const isSelected = selectedId === conv.id;
                    const context = conv.context;

                    return (
                        <Paper
                            key={conv.id}
                            elevation={isSelected ? 4 : 0}
                            sx={{
                                borderRadius: 5,
                                overflow: 'hidden',
                                bgcolor: isSelected ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                transition: 'all 0.2s ease',
                                border: '1px solid',
                                borderColor: isSelected ? 'transparent' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <ListItemButton
                                onClick={() => onSelect(conv.id)}
                                sx={{ p: 2, alignItems: 'flex-start', gap: 2 }}
                            >
                                <ListItemAvatar sx={{ minWidth: 'auto', mt: 0.5 }}>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={
                                            conv.isUnread ?
                                                <Circle sx={{ fontSize: 14, color: '#086cf3', stroke: 'white', strokeWidth: 2 }} />
                                                : null
                                        }
                                    >
                                        <Avatar
                                            src={conv.recipient.profilePictureUrl || undefined}
                                            sx={{
                                                width: 52,
                                                height: 52,
                                                bgcolor: '#9ca3af',
                                                color: 'white',
                                                fontSize: '1.25rem',
                                                fontWeight: 500
                                            }}
                                        >
                                            {conv.recipient.fullName.charAt(0)}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>

                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.8}>
                                            <Typography variant="subtitle1" fontWeight={conv.isUnread ? 800 : 700} noWrap>
                                                {conv.recipient.fullName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                {formatTime(conv.lastMessage.sentAt)}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Box display="flex" flexDirection="column" gap={0.8}>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: 1,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                    py: 0.5,
                                                    px: 1,
                                                    borderRadius: 2,
                                                    width: 'fit-content'
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={0.5} sx={{ minWidth: 0 }}>
                                                    {context.type === 'Booking' ?
                                                        <Home sx={{ fontSize: 14, color: 'primary.main' }} /> :
                                                        <RateReview sx={{ fontSize: 14, color: 'primary.main' }} />
                                                    }
                                                    <Typography
                                                        variant="caption"
                                                        fontWeight={600}
                                                        color="primary.main"
                                                        noWrap
                                                        sx={{ maxWidth: '120px' }}
                                                    >
                                                        {context.bookingTitle}
                                                    </Typography>
                                                </Box>

                                                {context.type === 'Booking' && context.checkInDate && context.checkOutDate && (
                                                    <>
                                                        <Box sx={{ width: '1px', height: '12px', bgcolor: 'primary.light', opacity: 0.4 }} />
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <CalendarMonth sx={{ fontSize: 12, color: 'primary.main' }} />
                                                            <Typography variant="caption" color="primary.main" fontWeight={500}>
                                                                {formatDateRange(context.checkInDate, context.checkOutDate)}
                                                            </Typography>
                                                        </Box>
                                                    </>
                                                )}
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                color={conv.isUnread ? 'text.primary' : 'text.secondary'}
                                                fontWeight={conv.isUnread ? 600 : 400}
                                                noWrap
                                                sx={{
                                                    lineHeight: 1.4,
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {conv.lastMessage.content}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItemButton>
                        </Paper>
                    );
                })}
            </List>
        </Box>
    );
}

export default ChatSidebar;