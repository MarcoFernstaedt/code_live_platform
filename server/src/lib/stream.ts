/**
 * Stream Chat Integration
 * ------------------------------------------------------------
 * Purpose:
 *   Provides a strongly typed interface for syncing users
 *   between the application's database and Stream Chat.
 *
 * Responsibilities:
 *   - Initialize the Stream Chat server client
 *   - Map internal user objects to Stream's expected format
 *   - Upsert users into Stream (create/update)
 *   - Delete users from Stream
 *
 * When it's used:
 *   - Called inside Inngest user-created and user-deleted jobs
 *   - Ensures Stream Chat always reflects the current user base
 *
 * Why this is separated:
 *   - Keeps Stream logic isolated from controllers & jobs
 *   - Ensures portability and strong typing across the backend
 */

import { StreamChat, type UserResponse } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

// ------------------------------------------------------------
// Validate environment configuration
// ------------------------------------------------------------
const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

// ------------------------------------------------------------
// Stream Chat Server Client
// ------------------------------------------------------------
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
export const streamClient = new StreamClient(apiKey, apiSecret); 

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
/**
 * AppUserForStream
 * Represents the minimal user information needed to sync
 * with Stream Chat. This comes directly from your DB user.
 *
 * clerkId → mapped to Stream's required `id` field
 * name    → used as display name in chat UI
 * avatar  → user's profile image
 * email   → optional metadata, not required by Stream
 */
export type AppUserForStream = {
  clerkId: string;
  name: string;
  avatar?: string;
  email?: string;
};

// ------------------------------------------------------------
// Internal: Convert App user → Stream user format
// ------------------------------------------------------------
/**
 * toStreamUser()
 * Normalizes application-level user information into the shape
 * required by the Stream Chat server client.
 */
const toStreamUser = (user: AppUserForStream): UserResponse => {
  return {
    id: user.clerkId,          // REQUIRED by Stream
    name: user.name,
    image: user.avatar,
    email: user.email,         // safe as custom metadata
  } as UserResponse;
};

// ------------------------------------------------------------
// Upsert Stream User (create or update)
// ------------------------------------------------------------
/**
 * upsertStreamUser()
 * Creates or updates a user inside Stream Chat.
 * Safe to call repeatedly—Stream handles idempotency.
 */
export const upsertStreamUser = async (userData: AppUserForStream) => {
  try {
    const streamUser = toStreamUser(userData);
    await chatClient.upsertUser(streamUser);
  } catch (err) {
    console.error("Error in upsertStreamUser:", err);
  }
};

// ------------------------------------------------------------
// Delete Stream User
// ------------------------------------------------------------
/**
 * deleteStreamUser()
 * Removes a Stream Chat user from the system.
 * Usually triggered when a Clerk user is deleted.
 */
export const deleteStreamUser = async (clerkId: string) => {
  try {
    await chatClient.deleteUser(clerkId);
  } catch (err) {
    console.error("Error in deleteStreamUser:", err);
  }
};