import * as Ably from "ably";
import {
  AllFeaturesEnabled,
  ChatClient,
  ChatClientProvider,
  ChatRoomProvider,
} from "@ably/chat";
import { TestMessages } from "@/components/test-messages";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

async function initAblyClient(authToken: string) {
  try {
    const response = await axios.get(
      "https://itec2025.onrender.com/socket/auth",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const clientId = response.data.userId;
    return new Ably.Realtime({
      clientId: clientId,
      key: process.env.NEXT_PUBLIC_ABLY_KEY,
    });
  } catch (error) {
    console.error("Error initializing Ably client:", error);
    return null; // Return null in case of error
  }
}

function App() {
  const [ablyClient, setAblyClient] = useState<Ably.Realtime | null>(null);
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);
  const router = useRouter();
  const { id } = router.query; // chatRoomId
  const { getToken } = useAuth(); // Get the Clerk token
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const authToken = await getToken();
      setToken(authToken);
    };

    fetchToken();
  }, [getToken]);

  useEffect(() => {
    const fetchClient = async () => {
      if (token) {
        const client = await initAblyClient(token);
        if (client) {
          setAblyClient(client);
        }
      }
    };

    fetchClient();
  }, [token]);

  // Create chat client when Ably client is ready
  useEffect(() => {
    if (ablyClient) {
      const newChatClient = new ChatClient(ablyClient, {});
      setChatClient(newChatClient);
    }
  }, [ablyClient]); // This ensures chatClient is created after ablyClient is set

  if (!chatClient) {
    return <div>Loading...</div>;
  }

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider id={id} options={AllFeaturesEnabled}>
        <div>
          <TestMessages chatRoomId={typeof id === "string" ? id : ""}/>
        </div>
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}

export default App;
