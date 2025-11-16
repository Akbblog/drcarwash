import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  },
  authProvider: {
    type: String,
    default: 'credentials',
  },
  // --- SERVICE & SUBSCRIPTION DETAILS ---
  // (This is the single, correct definition)
  isSubscribed: {
    type: Boolean,
    default: false,
  },
  stripeCustomerId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  
  // --- NEW FIELD FOR WAITING LIST ---
  isOnWaitingList: { type: Boolean, default: false },

  // --- SERVICE DETAILS ---
  address: { type: String },
  city: { type: String },
  zip: { type: String },
  notes: { type: String },
  preferredDay1: { type: String },
  preferredTime1: { type: String },
  preferredDay2: { type: String },
  preferredTime2: { type: String },
  phone: { type: String },

}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);