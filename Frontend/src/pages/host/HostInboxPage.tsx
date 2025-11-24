import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Badge,
  Chip,
} from '@mui/material';
import { 
  ChatBubbleOutline, 
  Send,
  MarkChatRead,
} from '@mui/icons-material';
import type { ChatConversation } from '../../models/HostModels.ts';

export default function HostInboxPage() {
  const mockConversations: ChatConversation[] = [
    {
      id: '1',
      guestName: 'Jan Kowalski',
      guestProfilePictureUrl: '',
      offerId: 'offer-1',
      offerTitle: 'Apartament w centrum Krakowa',
      lastMessage: 'Dzień dobry, czy mogę zapytać o udogodnienia?',
      lastMessageDate: '2024-01-10T14:30:00Z',
      unreadCount: 2,
      status: 'active',
    },
    {
      id: '2',
      guestName: 'Anna Nowak',
      guestProfilePictureUrl: '',
      offerId: 'offer-2',
      offerTitle: 'Dom wakacyjny nad morzem',
      lastMessage: 'Dziękuję za szybką odpowiedź!',
      lastMessageDate: '2024-01-09T16:15:00Z',
      unreadCount: 0,
      status: 'resolved',
    },
  ];

  const handleOpenChat = (conversationId: string) => {
    console.log('Otwórz chat:', conversationId);
  };

  const handleMarkAsRead = (conversationId: string) => {
    console.log('Oznacz jako przeczytane:', conversationId);
  };

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('pl-PL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      return 'wczoraj';
    } else if (diffDays < 7) {
      return `${diffDays} dni temu`;
    } else {
      return date.toLocaleDateString('pl-PL');
    }
  };

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
        Wiadomości
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          color: 'grey.600',
          mb: 4,
        }}
      >
        Komunikuj się z gośćmi
      </Typography>

      {mockConversations.length === 0 ? (
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
            <ChatBubbleOutline 
              sx={{ 
                fontSize: 80, 
                color: 'grey.300', 
                mb: 2 
              }} 
            />
            <Typography variant="h5" sx={{ mb: 2, color: 'grey.600' }}>
              Brak wiadomości
            </Typography>
            <Typography variant="body1" color="grey.500">
              Wiadomości od gości będą wyświetlane tutaj
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <List sx={{ p: 0 }}>
            {mockConversations.map((conversation, index) => (
              <React.Fragment key={conversation.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'grey.50',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={conversation.unreadCount}
                      color="primary"
                    >
                      <Avatar src={conversation.guestProfilePictureUrl}>
                        {conversation.guestName.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {conversation.guestName}
                        </Typography>
                        <Chip
                          label={conversation.status === 'active' ? 'Aktywny' : 'Rozwiązany'}
                          size="small"
                          color={conversation.status === 'active' ? 'primary' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography 
                          variant="body2" 
                          color="primary.main" 
                          sx={{ fontWeight: 500, mb: 0.5 }}
                        >
                          {conversation.offerTitle}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="grey.600"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '300px',
                          }}
                        >
                          {conversation.lastMessage}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="grey.500"
                          sx={{ display: 'block', mt: 0.5 }}
                        >
                          {formatLastMessageTime(conversation.lastMessageDate)}
                        </Typography>
                      </Box>
                    }
                  />

                  <Box display="flex" gap={1}>
                    {conversation.unreadCount > 0 && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<MarkChatRead />}
                        onClick={() => handleMarkAsRead(conversation.id)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                        }}
                      >
                        Oznacz
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Send />}
                      onClick={() => handleOpenChat(conversation.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                      }}
                    >
                      Odpowiedz
                    </Button>
                  </Box>
                </ListItem>
                
                {index < mockConversations.length - 1 && (
                  <Box sx={{ px: 3 }}>
                    <Box sx={{ borderBottom: '1px solid', borderColor: 'grey.200' }} />
                  </Box>
                )}
              </React.Fragment>
            ))}
          </List>
        </Card>
      )}
    </Box>
  );
}
