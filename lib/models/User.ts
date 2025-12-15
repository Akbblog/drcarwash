// lib/models/User.ts
import mongoose, { Document, Schema, Model } from "mongoose";

/* ─────────────────────────────────────────────────────────────────────
   1️⃣  TypeScript interface for a user document
   ───────────────────────────────────────────────────────────────────── */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  authProvider: string;
  isSubscribed: boolean;
  stripeCustomerId?: string;

  // Service details
  address?: string;
  city?: string;
  zip?: string;
  notes?: string;
  preferredDay1?: string;
  preferredTime1?: string;
  preferredDay2?: string;
  preferredTime2?: string;

  // Waitlist status
  waitlistStatus: "none" | "joined";
  waitlistJoinedAt?: Date | null;
  membershipEnabled: boolean;
  membershipStartDate?: Date | null;

  // Phone & role
  phone?: string;
  role: "user" | "editor" | "admin";
}

/* ─────────────────────────────────────────────────────────────────────
   2️⃣  Build the schema
   ───────────────────────────────────────────────────────────────────── */
const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true, lowercase: true },

    password: { type: String },

    image: { type: String },

    authProvider: { type: String, default: "credentials" },

    isSubscribed: { type: Boolean, default: false },

    stripeCustomerId: { type: String, unique: true, sparse: true },

    // --- SERVICE DETAILS ---
    address: { type: String },
    city: { type: String },
    zip: { type: String },
    notes: { type: String },

    preferredDay1: { type: String },
    preferredTime1: { type: String },

    preferredDay2: { type: String },
    preferredTime2: { type: String },

    // --- WAITLIST STATUS ---
    waitlistStatus: {
      type: String,
      enum: ["none", "joined"],
      default: "none",
    },

    // WHEN USER JOINED THE WAITLIST
    waitlistJoinedAt: { type: Date, default: null },

    membershipEnabled: { type: Boolean, default: false },
    membershipStartDate: { type: Date, default: null },

    // --- PHONE & ROLE ---
    phone: { type: String },

    role: {
      type: String,
      enum: ["user", "editor", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

/* ─────────────────────────────────────────────────────────────────────
   3️⃣  Export a singleton model
   ───────────────────────────────────────────────────────────────────── */
export const User: Model<IUser> =
  (mongoose.models?.User as Model<IUser>) ?? mongoose.model<IUser>("User", UserSchema);

export default User;