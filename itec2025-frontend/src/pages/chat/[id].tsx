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
import { Messages } from "@/components/messages";

async function initAblyClient(authToken: string) {
  try {
    const response = await axios.get(
      "https://itec2025.onrender.com/socket/auth",
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    return new Ably.Realtime({
      clientId: response.data.userId,
      key: "oUmUXw.lX0mkA:AdvoJuOfsDia7Mo3m5t13Zd9Iuewfy0AAZ5v0M8pDP4",
    });
  } catch (err) {
    console.error("Error initializing Ably client:", err);
    return null;
  }
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
        {/* <ChatUI
          roomId={id as string}
          clientId={clientId}
          ablyClient={ablyClient}
        /> */}
        <Messages chatRoomId={id} clientId={clientId} />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
