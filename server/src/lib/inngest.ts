import { Inngest } from "inngest";
import connectDB from "./db.ts";
import User from "../models/User.ts";

export const inngest = new Inngest({
  id: "InterviewLab",
});

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
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

    await User.create(newUser);

    return { status: "ok" };
  }
);

const deleteUserFromDb = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;

    await User.deleteOne({ clerkId: id })

    return { status: "ok" };
  }
);

export const functions = [ syncUser, deleteUserFromDb ] ;
