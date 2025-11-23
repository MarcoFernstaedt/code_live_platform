import { Schema, model } from "mongoose";

/**
 * IUser
 * ----------------------------------------------------
 * Represents an application user authenticated via Clerk.
 * This model stores essential profile + identity data
 * that your backend needs beyond Clerk's managed auth.
 *
 * Fields:
 * - name:      User’s full display name
 * - email:     Primary unique email (matches Clerk email)
 * - avatar:    Profile image URL (optional)
 * - clerkId:   Clerk user ID used for cross-system sync
 *
 * Notes:
 * - Data is synced via Inngest when Clerk users are created/deleted
 * - `clerkId` is the primary foreign key for relationships
 * - `timestamps` automatically adds createdAt / updatedAt
 */
export interface IUser {
  name: string;
  email: string;
  avatar?: string;
  clerkId: string;
}

// ------------------------
// Mongoose Schema
// ------------------------
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
      trim: true,
    },

    clerkId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
    versionKey: false, // removes __v
  }
);

// ------------------------
// Model
// ------------------------
const User = model<IUser>("User", userSchema);

export default User;