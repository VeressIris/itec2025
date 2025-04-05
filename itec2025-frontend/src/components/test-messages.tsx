import React, { useEffect, useState } from "react";
import { Message, useMessages } from "@ably/chat";
import { useAuth } from "@clerk/nextjs";

export function TestMessages({ chatRoomId }: { chatRoomId: string }) {
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
    // fetch("https://itec2025.onrender.com/addMessage", {
    fetch("http://localhost:3001/addMessage", {
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
    if (!message.trim()) return; 
    try {
      await send({ text: message });
      await sendMessage(message);
      console.log("sent message", message);
      setMessage("");
    } catch (error) {
      console.error("error sending message", error);
    }
  };
  

  return (
    <div
      style={{
        maxWidth: "600px",
        minWidth: "400px",
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Container for the messages */}
      <div
        className="messages-container"
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          marginBottom: "20px",
          padding: "16px",
          backgroundColor: "#f8f9fa",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className="message"
            style={{
              backgroundColor: "white",
              padding: "10px 15px",
              borderRadius: "12px",
              marginBottom: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              maxWidth: "80%",
            }}
          >
            <div
              style={{ fontSize: "0.8em", color: "#666", marginBottom: "4px" }}
            >
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
            <div style={{ wordBreak: "break-word", color: "#333" }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div
        className="input-container"
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #e0e0e0",
            fontSize: "16px",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
