import React, { useState, useEffect } from "react";
import { Message, useMessages } from "@ably/chat";
import { useAuth } from "@clerk/nextjs";
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

interface MessagesProps {
  chatRoomId: string;
  clientId: string;
}

export function Messages({ chatRoomId, clientId }: MessagesProps) {
  const { getToken } = useAuth();
  const [message, setMessage] = useState("My first message with Ably Chat!");
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<
    { clerkId: string; firstName: string; lastName: string; imageUrl: string }[]
  >([]);

  const { send } = useMessages({
    listener: (event) => {
      setMessages((prev) => [...prev, event.message]);
    },
  });

  useEffect(() => {
    if (chatRoomId) {
      fetchMessages();
      fetchParticipants();
    }
  }, [chatRoomId]);

  function fetchMessages() {
    fetch(`https://itec2025.onrender.com/getChatroomMessages?chatRoomId=${encodeURIComponent(chatRoomId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.result)) {
          setMessages(data.result);
        }
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }

  function fetchParticipants() {
    fetch(`https://itec2025.onrender.com/getEventParticipants?chatRoomId=${chatRoomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.participants)) {
          setParticipants(data.participants);
        }
      })
      .catch((err) => console.error("Error fetching participants:", err));
  }

  async function sendMessage(text: string) {
    const token = await getToken();
    fetch("https://itec2025.onrender.com/addMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: text,
        chatRoomId,
      }),
    })
      .then((res) => res.json())
      .then(() => setMessage(""))
      .catch((err) => console.error("Error sending message:", err));
  }

  const handleSend = async () => {
    try {
      await send({ text: message });
      await sendMessage(message);
    } catch (err) {
      console.error("error sending message", err);
    }
  };

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      background: { default: "#f5f5f5" },
    },
  });

  const Container = styled(Box)({ display: "flex", height: "100vh" });
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
    marginBottom: "80px",
  });
  const InputSection = styled(Box)({
    position: "fixed",
    bottom: 0,
    left: 300,
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
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "background-color 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
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
            <Contact>
              <AvatarGroup max={4}>
                {participants.map((p) => (
                  <Avatar
                    key={p.clerkId}
                    src={p.imageUrl}
                    title={`${p.firstName} ${p.lastName}`}
                  />
                ))}
              </AvatarGroup>
              <Box flex={1}>
                <Box fontWeight="bold">Event Participants</Box>
                <Box fontSize="0.875rem" color="text.secondary">
                  {participants.length} joined
                </Box>
              </Box>
            </Contact>
          </ContactList>
        </Sidebar>

        <MainChat>
          <ChatHeader>
            <Box display="flex" alignItems="center" gap={2}>
              <AvatarGroup max={4}>
                {participants.map((p) => (
                  <Avatar
                    key={p.clerkId}
                    src={p.imageUrl}
                    title={`${p.firstName} ${p.lastName}`}
                  />
                ))}
              </AvatarGroup>
              <Box>
                <Box fontWeight="bold">Group Chat</Box>
                <Box fontSize="0.875rem" color="text.secondary">
                  {participants.length} members
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
                  {msg.text}
                </MessageBubble>
              </Box>
            ))}
          </MessageArea>

          <InputSection>
            <IconButton><FiPaperclip /></IconButton>
            <MessageInput
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton><FiSmile /></IconButton>
            <IconButton onClick={handleSend}><FiSend /></IconButton>
          </InputSection>
        </MainChat>
      </Container>
    </ThemeProvider>
  );
}
