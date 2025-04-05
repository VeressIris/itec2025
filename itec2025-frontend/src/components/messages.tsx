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

  // Setup some state for the messages and a listener for chat messages using the useMessages hook
  const [message, setMessage] = useState("My first message with Ably Chat!");
  const [messages, setMessages] = useState<Message[]>([]);
  const { send } = useMessages({
    listener: (event) => {
      console.log("received message", event.message);
      setMessages((prev) => [...prev, event.message]);
    },
  });

  useEffect(() => {
    // Fetch messages when the component mounts
    fetchMessages();
  }, [chatRoomId]);

  function fetchMessages() {
    fetch(
      `https://itec2025.onrender.com/getChatroomMessages?chatRoomId=${encodeURIComponent(
        chatRoomId
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        return response.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.result)) {
          setMessages(data.result);
        } else {
          setMessages([]); // If messages are missing or invalid, set to empty array
        }
      })

      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
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
        chatRoomId: chatRoomId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send message");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Message sent:", data);
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  }

  // This function takes the message from the input field and sends it to the chat using the send function
  // returned from the useMessages hook
  const handleSend = async () => {
    try {
      await send({ text: message });
      await sendMessage(message);
      console.log("sent message", message);
      setMessage("");
    } catch (error) {
      console.error("error sending message", error);
    }
  };

  const contacts = [
    {
      id: 1,
      name: "Project Team",
      members: [
        {
          id: 1,
          name: "John Doe",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        },
        {
          id: 2,
          name: "Jane Smith",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        },
        {
          id: 3,
          name: "Mike Johnson",
          image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
        },
        {
          id: 4,
          name: "Sarah Wilson",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        },
      ],
      lastMessage: "Mike: Welcome everyone!",
      online: true,
    },
  ];
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
              <IconButton>
                <FiVideo />
              </IconButton>
              <IconButton>
                <FiPhone />
              </IconButton>
              <IconButton>
                <FiMoreVertical />
              </IconButton>
            </Box>
          </ChatHeader>

          <MessageArea>
            {messages.map((msg, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection="column"
                alignItems={
                  msg.clientId === clientId ? "flex-end" : "flex-start"
                }
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
            <IconButton>
              <FiPaperclip />
            </IconButton>
            <MessageInput
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton>
              <FiSmile />
            </IconButton>
            <IconButton onClick={handleSend}>
              <FiSend />
            </IconButton>
          </InputSection>
        </MainChat>
      </Container>
    </ThemeProvider>
  );
}
