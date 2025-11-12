import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please provide your name"] },
    email: { type: String, required: [true, "Please provide your email"], unique: true },
    password: { type: String, select: false },
    image: { type: String },

    // --- NEW ADDRESS FIELDS ---
    address: { type: String },
    city: { type: String },
    zip: { type: String },
    notes: { type: String }, // Gate codes, parking info, etc.
    // --------------------------

    // Scheduling Fields
    preferredDay1: { type: String },
    preferredTime1: { type: String },
    preferredDay2: { type: String }, // <-- NEW
    preferredTime2: { type: String }, // <-- NEW

    // Stripe Data
    stripeCustomerId: { type: String, unique: true, sparse: true },
    subscriptionId: { type: String },
    isSubscribed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models?.User || mongoose.model("User", UserSchema);