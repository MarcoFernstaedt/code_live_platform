import mongoose, { model, Schema } from "mongoose";

interface IUser {
  name: string;
  email: string;
  avatar?: string;
  clerkId: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
    clerkId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
