import ChatClient from "../components/features/chat/ChatClient.tsx";
import {Box, Typography} from "@mui/material";
import {theme} from "../theme.ts";

export default function InboxPage() {
    return(
        <Box>
            <Box
                sx={{ my: 3 }}
            >
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, fontSize: "1.4rem", color: 'text.primary', mb: 1 }}
                >
                    Inbox
                </Typography>
                <Typography
                    sx={{ fontWeight: 500, fontSize: "1rem", color: theme.palette.text.secondary, mb: 1 }}>
                    Your chats with hosts and other guests
                </Typography>
            </Box>
            
            <ChatClient role="guest" />;
        </Box>
    )
}