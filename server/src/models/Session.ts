import { Schema, model, type Types } from "mongoose";

/**
 * ISession
 * ----------------------------------------------------
 * Represents a live or scheduled coding interview / practice
 * session between two users inside the platform.
 *
 * This model stores metadata required for:
 * - session coordination
 * - problem assignment
 * - Stream video call tracking
 * - matching host and participant users
 *
 * Fields:
 *  problem:   Title of the coding problem for the session
 *  difficulty:     Difficulty tier ("easy" | "medium" | "hard")
 *  status:         Lifecycle of the session ("active" or "completed")
 *  callId:         Stream (or other provider) call identifier used
 *                  for joining / resuming video calls
 *  host:           User initiating or hosting the session
 *  participant:    The user joining the host (null until matched)
 *
 * Notes:
 * - `host` and `participant` reference User documents via ObjectId.
 * - `callId` is created after the Stream call is created.
 * - `timestamps` automatically manage createdAt / updatedAt.
 */
export interface ISession {
  problem: string;
  difficulty: "easy" | "medium" | "hard";
  status: "active" | "completed";
  callId: string;
  host: Types.ObjectId;
  participant?: Types.ObjectId | null;
}

// ------------------------
//  Mongoose Schema
// ------------------------
const sessionSchema = new Schema<ISession>(
  {
    problem: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
      required: true,
    },

    callId: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,   // adds createdAt & updatedAt
    versionKey: false,  // removes __v
  }
);

// ------------------------
//  Model
// ------------------------
const Session = model<ISession>("Session", sessionSchema);

export default Session;