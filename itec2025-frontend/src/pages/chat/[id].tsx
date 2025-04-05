import * as Ably from "ably";
import {
  AllFeaturesEnabled,
  ChatClient,
  ChatClientProvider,
  ChatRoomProvider,
} from "@ably/chat";
import { Messages } from "@/components/Messages";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

async function initAblyClient(authToken) {
  console.log("Auth Token:", authToken);
  try {
    const response = await axios.get("http://localhost:3001/socket/auth", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const clientId = response.data.userId;

    return new Ably.Realtime({
      clientId: clientId,
      key: "oUmUXw.lX0mkA:AdvoJuOfsDia7Mo3m5t13Zd9Iuewfy0AAZ5v0M8pDP4",
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
  const [token, setToken] = useState(null);

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
          <Messages />
        </div>
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}

export default App;
