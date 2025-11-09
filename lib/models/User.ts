import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true, // No two users can have the same email
    },
    password: {
      type: String,
      select: false, // Don't return password by default in queries
    },
    image: {
      type: String,
    },
    // We will add Stripe Customer ID here later
    stripeCustomerId: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// If the model already exists (hot reload), use it; otherwise create a new one.
export default mongoose.models?.User || mongoose.model("User", UserSchema);