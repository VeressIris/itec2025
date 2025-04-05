import * as Ably from "ably";
import {
  AllFeaturesEnabled,
  ChatClient,
  ChatClientProvider,
  ChatRoomProvider,
} from "@ably/chat";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import React from "react";

import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  FiVideo,
  FiPhone,
  FiMoreVertical,
  FiPaperclip,
  FiSmile,
  FiSend,
} from "react-icons/fi";
import { BsCircleFill } from "react-icons/bs";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    background: { default: "#f5f5f5" },
  },
});

const Container = styled(Box)({
  display: "flex",
  height: "100vh",
});

const Sidebar = styled(Box)({
  width: "300px",
  borderRight: "1px solid rgba(0, 0, 0, 0.12)",
  display: "flex",
  flexDirection: "column",
});

const MainChat = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  position: "relative",
});

const ProfileSection = styled(Box)({
  padding: "20px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const ContactList = styled(Box)({
  flex: 1,
  overflowY: "auto",
});

const Contact = styled(Box)({
  padding: "15px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
});

const ChatHeader = styled(Box)({
  padding: "15px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const MessageArea = styled(Box)({
  flexGrow: 1,
  overflowY: "auto",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "80px", // Reserve space for fixed input bar
});

const InputSection = styled(Box)({
  position: "fixed",
  bottom: 0,
  left: 300, // Width of Sidebar
  right: 0,
  backgroundColor: "#f5f5f5",
  padding: "20px",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const MessageInput = styled("input")({
  flex: 1,
  padding: "10px",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  borderRadius: "4px",
  outline: "none",
});

const IconButton = styled(Box)({
  cursor: "pointer",
  padding: "8px",
  borderRadius: "50%",
  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
});

const ProfileImage = styled("img")({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
});

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOwn",
})(({ isOwn }: { isOwn: boolean }) => ({
  maxWidth: "70%",
  padding: "10px",
  borderRadius: "12px",
  backgroundColor: isOwn ? "#1976d2" : "#fff",
  color: isOwn ? "#fff" : "#000",
  alignSelf: isOwn ? "flex-end" : "flex-start",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
}));

async function initAblyClient(authToken: string) {
  try {
    const response = await axios.get("https://itec2025.onrender.com/socket/auth", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return new Ably.Realtime({
      clientId: response.data.userId,
      key: "oUmUXw.lX0mkA:AdvoJuOfsDia7Mo3m5t13Zd9Iuewfy0AAZ5v0M8pDP4",
    });
  } catch (err) {
    console.error("Error initializing Ably client:", err);
    return null;
  }
}

function ChatUI({ roomId, clientId, ablyClient }: { roomId: string; clientId: string; ablyClient: Ably.Realtime }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [channel, setChannel] = useState<Ably.Types.RealtimeChannelCallbacks | null>(null);

  useEffect(() => {
    if (!roomId || !clientId || !ablyClient) return;

    const ch = ablyClient.channels.get(roomId);
    setChannel(ch);

    const onMessage = (msg: Ably.Types.Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    ch.subscribe("message", onMessage);

    return () => {
      ch.unsubscribe("message", onMessage);
    };
  }, [roomId, clientId, ablyClient]);

  const sendMessage = () => {
    if (text.trim() && channel) {
      channel.publish("message", { text, clientId });
      setText("");
    }
  };

  const contacts = [
    {
      id: 1,
      name: "Project Team",
      members: [
        { id: 1, name: "John Doe", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
        { id: 2, name: "Jane Smith", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
        { id: 3, name: "Mike Johnson", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36" },
        { id: 4, name: "Sarah Wilson", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" }
      ],
      lastMessage: "Mike: Welcome everyone!",
      online: true,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Sidebar>
          <ProfileSection>
            <ProfileImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" />
            <Box>
              <Box fontWeight="bold">My Profile</Box>
              <Box display="flex" alignItems="center" gap={1}>
                <BsCircleFill size={8} color="#4caf50" />
                <Box fontSize="0.875rem">Online</Box>
              </Box>
            </Box>
          </ProfileSection>
          <ContactList>
            {contacts.map((contact) => (
              <Contact key={contact.id}>
                <AvatarGroup max={3}>
                  {contact.members.map((m) => (
                    <Avatar key={m.id} src={m.image} />
                  ))}
                </AvatarGroup>
                <Box flex={1}>
                  <Box fontWeight="bold">{contact.name}</Box>
                  <Box fontSize="0.875rem" color="text.secondary">
                    {contact.lastMessage}
                  </Box>
                </Box>
              </Contact>
            ))}
          </ContactList>
        </Sidebar>

        <MainChat>
          <ChatHeader>
            <Box display="flex" alignItems="center" gap={2}>
              <AvatarGroup max={3}>
                {contacts[0].members.map((m) => (
                  <Avatar key={m.id} src={m.image} />
                ))}
              </AvatarGroup>
              <Box>
                <Box fontWeight="bold">{contacts[0].name}</Box>
                <Box fontSize="0.875rem" color="text.secondary">
                  {contacts[0].members.length} members
                </Box>
              </Box>
            </Box>
            <Box display="flex" gap={2}>
              <IconButton><FiVideo /></IconButton>
              <IconButton><FiPhone /></IconButton>
              <IconButton><FiMoreVertical /></IconButton>
            </Box>
          </ChatHeader>

          <MessageArea>
            {messages.map((msg, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection="column"
                alignItems={msg.clientId === clientId ? "flex-end" : "flex-start"}
              >
                <Box fontSize="0.75rem" color="text.secondary" mb={0.5}>
                  {msg.clientId === clientId ? "You" : msg.clientId}
                </Box>
                <MessageBubble isOwn={msg.clientId === clientId}>
                  {msg.data.text}
                </MessageBubble>
              </Box>
            ))}
          </MessageArea>

          <InputSection>
            <IconButton><FiPaperclip /></IconButton>
            <MessageInput
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <IconButton><FiSmile /></IconButton>
            <IconButton onClick={sendMessage}><FiSend /></IconButton>
          </InputSection>
        </MainChat>
      </Container>
    </ThemeProvider>
  );
}

export default function App() {
  const [ablyClient, setAblyClient] = useState<Ably.Realtime | null>(null);
  const [clientId, setClientId] = useState<string>("");
  const { getToken } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    getToken().then(async (token) => {
      if (token) {
        const ably = await initAblyClient(token);
        if (ably) {
          setAblyClient(ably);
          setClientId(ably.auth.clientId as string);
        }
      }
    });
  }, [getToken]);

  if (!ablyClient || !id || !clientId) return <div>Loading chat...</div>;

  return (
    <ChatClientProvider client={new ChatClient(ablyClient)}>
      <ChatRoomProvider id={id as string} options={AllFeaturesEnabled}>
        <ChatUI roomId={id as string} clientId={clientId} ablyClient={ablyClient} />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}