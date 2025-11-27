import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { useConversations } from '../../../hooks/useChat';
import type { ConversationSummary } from '../../../models/ChatModels';
interface ChatClientProps {
    role: 'host' | 'guest';
}
const ChatClient: React.FC<ChatClientProps> = ({ role }) => {
    
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [searchParams] = useSearchParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { data: conversationsData, isLoading } = useConversations({
        PageNumber: 1,
        PageSize: 20,
        Role: role,
    });

    const conversations: ConversationSummary[] = conversationsData?.items || [];

    useEffect(() => {
        const paramId = searchParams.get('conversationId');
        if (paramId) {
            setSelectedConversationId(parseInt(paramId, 10));
        } else if (!selectedConversationId && conversations.length > 0 && !isMobile) {
            setSelectedConversationId(conversations[0].id);
        }
    }, [searchParams, conversations, isMobile, selectedConversationId]);

    const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

    const handleBackToInbox = () => {
        setSelectedConversationId(null);
    };

    if (isLoading && conversations.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: 'calc(90vh - 100px)',
                maxWidth: '1800px',
                margin: '0 auto',
                boxSizing: 'border-box',
            }}
        >
          

            <Paper
                elevation={0}
                sx={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 8,
                    overflow: 'hidden',
                    display: 'flex',
                    bgcolor: 'grey.100',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
            >
                <Grid container sx={{ height: '100%', width: '100%', flexWrap: 'nowrap' }}>
                    <Grid
                        size={{ xs: 12, md: 5, lg: 4 }}
                        sx={{
                            height: '100%',
                            display: isMobile && selectedConversationId ? 'none' : 'flex',
                            flexDirection: 'column',
                            borderRight: { md: '1px solid' },
                            borderColor: { md: 'rgba(0,0,0,0.06)' },
                        }}
                    >
                        <ChatSidebar
                            conversations={conversations}
                            selectedId={selectedConversationId}
                            onSelect={setSelectedConversationId}
                        />
                    </Grid>

                    <Grid
                        size={{ xs: 12, md: 7, lg: 8 }}
                        sx={{
                            height: '100%',
                            flexGrow: 1,
                            display: isMobile && !selectedConversationId ? 'none' : 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {selectedConversation ? (
                            <ChatWindow conversation={selectedConversation} onBack={handleBackToInbox} />
                        ) : (
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                height="100%"
                                flexDirection="column"
                                gap={2}
                            >
                                <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                    Select a conversation to start chatting
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default ChatClient;