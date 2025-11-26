import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, Avatar, TextField, IconButton,
    Stack, CircularProgress, Chip, Divider, alpha, useTheme
} from '@mui/material';
import { Send, AttachFile, Home, RateReview, CalendarMonth, ArrowBack } from '@mui/icons-material';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { ConversationSummary } from '../../../models/ChatModels';
import { useChatMessages, useSendMessage } from '../../../hooks/useChat';
import { useAuth } from '../../../hooks/useAuth';

interface ChatWindowProps {
    conversation: ConversationSummary;
    onBack?: () => void;
}

export default function ChatWindow({ conversation, onBack }: ChatWindowProps) {
    const { user } = useAuth();
    const theme = useTheme();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const context = conversation.context;

    const { data: messagesData, isLoading, isFetching } = useChatMessages(conversation.id, {
        PageNumber: 1,
        PageSize: 50
    });

    const { mutate: sendMessage, isPending: isSending } = useSendMessage();

    const handleSend = () => {
        if (!newMessage.trim()) return;
        sendMessage({ conversationId: conversation.id, content: newMessage });
        setNewMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messagesData, conversation.id]);

    const messages = messagesData?.items || [];

    const getContextIcon = () => {
        if (context.type === 'Booking') return <Home fontSize="small" />;
        return <RateReview fontSize="small" />;
    };

    const formatDateRange = (checkIn: string, checkOut: string) => {
        const start = format(new Date(checkIn), 'dd.MM');
        const end = format(new Date(checkOut), 'dd.MM');
        return `${start} - ${end}`;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <IconButton onClick={onBack} size="small" sx={{ bgcolor: 'white', boxShadow: 1 }}>
                            <ArrowBack />
                        </IconButton>
                    </Box>

                    <Avatar
                        src={conversation.recipient.profilePictureUrl || undefined}
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: '#9ca3af',
                            color: 'white',
                            fontSize: '1.2rem',
                            fontWeight: 500
                        }}
                    >
                        {conversation.recipient.fullName.charAt(0)}
                    </Avatar>

                    <Box>
                        <Typography variant="subtitle1" fontWeight={800}>
                            {conversation.recipient.fullName}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip
                                icon={getContextIcon()}
                                label={context.bookingTitle}
                                size="small"
                                sx={{
                                    height: 24,
                                    fontSize: '0.75rem',
                                    borderRadius: 4,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: 'primary.dark',
                                    fontWeight: 600,
                                    '& .MuiChip-icon': { color: 'primary.main' }
                                }}
                            />
                            {context.type === 'Booking' && context.checkInDate && context.checkOutDate && (
                                <Chip
                                    icon={<CalendarMonth sx={{ fontSize: 14 }} />}
                                    label={formatDateRange(context.checkInDate, context.checkOutDate)}
                                    size="small"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem',
                                        borderRadius: 4,
                                        bgcolor: 'white',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        color: 'text.secondary'
                                    }}
                                />
                            )}
                        </Stack>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ opacity: 0.5 }} />

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                {(isLoading || isFetching) && messages.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === user?.id;
                        return (
                            <Box
                                key={msg.id}
                                display="flex"
                                flexDirection="column"
                                alignItems={isMe ? 'flex-end' : 'flex-start'}
                            >
                                <Box
                                    sx={{
                                        maxWidth: { xs: '85%', sm: '65%' },
                                        p: 2,
                                        px: 2.5,
                                        borderRadius: 3,
                                        borderBottomRightRadius: isMe ? 4 : 24,
                                        borderBottomLeftRadius: isMe ? 24 : 4,
                                        borderTopRightRadius: 24,
                                        borderTopLeftRadius: 24,

                                        bgcolor: isMe ? '#086cf3' : 'white',
                                        color: isMe ? 'white' : 'text.primary',

                                        boxShadow: isMe
                                            ? '0 4px 12px rgba(8, 108, 243, 0.25)'
                                            : '0 2px 8px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                                        {msg.content}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, px: 1, fontWeight: 500 }}>
                                    {format(new Date(msg.sentAt), 'HH:mm', { locale: pl })}
                                </Typography>
                            </Box>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>

            <Box p={2} pb={3}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <IconButton size="medium" sx={{ bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: 'grey.50' } }}>
                        <AttachFile fontSize="small" />
                    </IconButton>

                    <TextField
                        fullWidth
                        placeholder="Type a message..."
                        variant="outlined"
                        size="small"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 8,
                                bgcolor: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                '& fieldset': { border: 'none' },
                                '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.08)' },
                                '&.Mui-focused': { boxShadow: '0 4px 12px rgba(8, 108, 243, 0.15)' },
                            }
                        }}
                    />

                    <IconButton
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        sx={{
                            bgcolor: '#086cf3',
                            color: 'white',
                            width: 44,
                            height: 44,
                            boxShadow: '0 4px 12px rgba(8, 108, 243, 0.4)',
                            '&:hover': { bgcolor: '#0654bd' }
                        }}
                    >
                        {isSending ? <CircularProgress size={20} color="inherit" /> : <Send fontSize="small" sx={{ ml: 0.5 }} />}
                    </IconButton>
                </Stack>
            </Box>
        </Box>
    );
}