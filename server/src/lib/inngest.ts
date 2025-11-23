/**
 * Inngest User Sync Functions
 * ------------------------------------------------------------
 * Purpose:
 *   Keep MongoDB users and Stream Chat users in sync with Clerk
 *   by reacting to Clerk webhooks using Inngest background jobs.
 *
 * Overview:
 *   - `syncUser` runs when a Clerk user is created.
 *       → Creates the user in MongoDB
 *       → Upserts the user in Stream Chat
 *
 *   - `deleteUserFromDb` runs when a Clerk user is deleted.
 *       → Removes the user from MongoDB
 *       → Deletes the user from Stream Chat
 *
 * Why Inngest:
 *   - Decouples webhook processing from request/response lifecycle
 *   - Ensures reliability (automatic retries, durable execution)
 *   - Prevents missed syncs if your server is busy or reloading
 *
 * Event Triggers:
 *   clerk/user.created
 *   clerk/user.deleted
 *
 * Data Flow:
 *   Clerk → Inngest → MongoDB → Stream Chat
 */

import { Inngest } from "inngest";
import connectDB from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

// ------------------------------------------------------------
// Create Inngest client
// ------------------------------------------------------------
export const inngest = new Inngest({
  id: "InterviewLab",
});

// ------------------------------------------------------------
// Sync user on Clerk user creation
// ------------------------------------------------------------
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },

  /**
   * Handler: create new user in DB +
   * upsert user in Stream Chat.
   */
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      avatar: image_url,
    };

    // Save user in MongoDB
    await User.create(newUser);

    // Sync user into Stream Chat
    await upsertStreamUser(newUser);

    return { status: "ok" };
  }
);

// ------------------------------------------------------------
// Delete user from DB + Stream on Clerk deletion
// ------------------------------------------------------------
const deleteUserFromDb = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },

  /**
   * Handler: remove user from MongoDB +
   * delete Stream Chat user.
   */
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;

    // Remove from MongoDB
    await User.deleteOne({ clerkId: id });

    // Remove from Stream Chat
    await deleteStreamUser(id.toString());

    return { status: "ok" };
  }
);

// Export functions for Inngest route binding
export const functions = [syncUser, deleteUserFromDb];