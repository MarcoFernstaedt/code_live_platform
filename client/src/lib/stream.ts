import { StreamVideoClient, type User } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_API_KEY as string | undefined;

let client: StreamVideoClient | null = null;

export const initializeStreamClient = (
  user: User,
  token: string
): StreamVideoClient => {
  if (!apiKey) throw new Error("VITE_STREAM_API_KEY is not provided.");

  if (client && client.user?.id === user.id) return client;

  client = new StreamVideoClient({
    apiKey,
    user,
    token,
  });

  return client;
};

/** Call on logout / user switch */
export const resetStreamClient = async (): Promise<void> => {
  if (!client) return;

  try {
    await client.disconnectUser();
  } catch (err) {
    console.error("Error disconnecting Stream.", err);
  } finally {
    client = null;
  }
};