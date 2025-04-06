import React, { useState, useEffect, useRef } from "react";
import { Message, useMessages } from "@ably/chat";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Avatar,
  AvatarGroup,
  IconButton,
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
import dayjs from "dayjs";

interface MessagesProps {
  chatRoomId: string;
  clientId: string;
}

interface ChatMessage {
  senderId: string;
  text: string;
  timestamp?: string;
  dateSent?: string;
}

export function Messages({ chatRoomId, clientId }: MessagesProps) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("My first message with Ably Chat!");
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<
    { clerkId: string; firstName: string; lastName: string; imageUrl: string }[]
  >([]);
  const [eventTitle, setEventTitle] = useState("");

  const { send } = useMessages({
    listener: (event) => {
      setMessages((prev) => [...prev, event.message]);
    },
  });

  useEffect(() => {
    if (chatRoomId) {
      fetchMessages();
      fetchParticipants();
      fetchEventTitle();
    }
  }, [chatRoomId]);

  function fetchEventTitle() {
    fetch(`https://itec2025.onrender.com/getChatMembers?chatRoomId=${chatRoomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result?.title) {
          setEventTitle(data.result.title);
        }
      });
  }

  function fetchMessages() {
    fetch(`https://itec2025.onrender.com/getChatroomMessages?chatRoomId=${chatRoomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.result)) {
          setMessages(data.result);
        }
      });
  }

  function fetchParticipants() {
    fetch(`https://itec2025.onrender.com/getChatMembers?chatRoomId=${chatRoomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.participants)) {
          setParticipants(data.participants);
        }
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
        chatRoomId,
        senderId: user?.id,
      }),
    }).then(() => setMessage(""));
  }

  const handleSend = async () => {
    await send({ text: message });
    await sendMessage(message);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const token = await getToken();

    const res = await fetch("https://itec2025.onrender.com/uploadFile", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      await send({ text: `Uploaded file: ${file.name}` });
      await sendMessage(`Uploaded file: ${file.name}`);
    } else {
      alert("File upload failed");
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
  const ContactList = styled(Box)({ flex: 1, overflowY: "auto" });
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
    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
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
            <ProfileImage src={user?.imageUrl} />
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
                  <Avatar key={p.clerkId} src={p.imageUrl} />
                ))}
              </AvatarGroup>
              <Box>
                <Box fontWeight="bold">{eventTitle || "Group Chat"}</Box>
                <Box fontSize="0.875rem" color="text.secondary">
                  {participants.length} members
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
            {messages.map((msgRaw, index) => {
              const msg = msgRaw as unknown as ChatMessage;
              const isOwn = msg.senderId === user?.id;
              const sender = participants.find((p) => p.clerkId === msg.senderId);
              const senderName = isOwn
                ? "You"
                : sender
                ? `${sender.firstName} ${sender.lastName}`
                : "Unknown";
              const timestamp = msg.timestamp || msg.dateSent;
              const time = timestamp ? dayjs(timestamp).format("HH:mm") : "";

              return (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="column"
                  alignItems={isOwn ? "flex-end" : "flex-start"}
                >
                  <Box fontSize="0.75rem" color="text.secondary" mb={0.5} textAlign={isOwn ? "right" : "left"}>
                    {senderName} · {time}
                  </Box>
                  <MessageBubble isOwn={isOwn}>{msg.text}</MessageBubble>
                </Box>
              );
            })}
          </MessageArea>

          <InputSection>
            <IconButton onClick={() => fileInputRef.current?.click()}>
              <FiPaperclip />
            </IconButton>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: "none" }}
              accept=".pdf,.jpg,.jpeg,.png"
            />
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
