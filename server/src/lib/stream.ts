import { StreamChat, type UserResponse } from "stream-chat";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

// Your app's user shape you pass in
export type AppUserForStream = {
  clerkId: string;
  name: string;
  avatar?: string;
  email?: string;
};

// Map to Stream's expected shape
const toStreamUser = (user: AppUserForStream): UserResponse => {
  return {
    id: user.clerkId,          // REQUIRED by Stream
    name: user.name,
    image: user.avatar,
    email: user.email,         // custom field is fine
  } as UserResponse;
}

export const upsertStreamUser = async (userData: AppUserForStream) => {
  try {
    const streamUser = toStreamUser(userData);
    await chatClient.upsertUser(streamUser);
  } catch (err) {
    console.error("Error in upsertStreamUser:", err);
  }
};

export const deleteStreamUser = async (clerkId: string) => {
  try {
    await chatClient.deleteUser(clerkId);
  } catch (err) {
    console.error("Error in deleteStreamUser:", err);
  }
};