import { useEffect, useState } from "react";
import { StreamChat, type Channel as StreamChannel } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, resetStreamClient } from "../lib/stream";
import sessionApi from "../api/sessions";
import type { Session } from "../types";

// These are type-only to keep runtime clean; adjust paths if your SDK exports differ.
import type { Call, StreamVideoClient } from "@stream-io/video-client";

type StreamTokenResponse = {
  token: string;
  userId: string;
  userName: string;
  userImage?: string;
};

type UseStreamClientReturn = {
  streamClient: StreamVideoClient | null;
  call: Call | null;
  chatClient: StreamChat | null;
  channel: StreamChannel | null;
  isInitializingCall: boolean;
};

function useStreamClient(
  session: Session | null | undefined,
  loadingSession: boolean,
  isHost: boolean,
  isParticipant: boolean
): UseStreamClientReturn {
  const [streamClient, setStreamClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [isInitializingCall, setIsInitializingCall] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    let videoCall: Call | null = null;
    let chatClientInstance: StreamChat | null = null;

    const initCall = async () => {
      // Default: do not block UI with spinner unless we're actually attempting init
      setIsInitializingCall(false);

      if (!session?.callId) return;
      if (loadingSession) return;
      if (!isHost && !isParticipant) return;
      if (session.status === "completed") return;

      setIsInitializingCall(true);

      try {
        const tokenRes = (await sessionApi.getStreamToken()) as StreamTokenResponse;
        const { token, userId, userName, userImage } = tokenRes;

        const client = (await initializeStreamClient(
          { id: userId, name: userName, image: userImage },
          token
        )) as StreamVideoClient;

        if (cancelled) return;
        setStreamClient(client);

        videoCall = client.call("default", session.callId) as Call;
        await videoCall.join({ create: true });
        if (cancelled) return;
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY as string | undefined;
        if (!apiKey) throw new Error("Missing VITE_STREAM_API_KEY");

        chatClientInstance = StreamChat.getInstance(apiKey);
        await chatClientInstance.connectUser(
          { id: userId, name: userName, image: userImage },
          token
        );
        if (cancelled) return;
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch();
        if (cancelled) return;
        setChannel(chatChannel);
      } catch (err) {
        if (!cancelled) {
          toast.error("Failed to join video call");
          // keep console.error for debugging unexpected SDK failures
          // eslint-disable-next-line no-console
          console.error("useStreamClient init error:", err);
        }
      } finally {
        if (!cancelled) setIsInitializingCall(false);
      }
    };

    void initCall();

    return () => {
      cancelled = true;

      void (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await resetStreamClient();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("useStreamClient cleanup error:", err);
        }
      })();

      // Clear local state so UI doesn't show stale call/channel on route changes
      setCall(null);
      setChannel(null);
      setChatClient(null);
      setStreamClient(null);
      setIsInitializingCall(false);
    };
  }, [session?.callId, session?.status, loadingSession, isHost, isParticipant]);

  return { streamClient, call, chatClient, channel, isInitializingCall };
}

export default useStreamClient;
