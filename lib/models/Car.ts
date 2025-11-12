import mongoose, { Schema } from "mongoose";

const CarSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: false },
    licensePlate: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Important: Check if model exists before compiling to prevent hot-reload errors
export default mongoose.models?.Car || mongoose.model("Car", CarSchema);