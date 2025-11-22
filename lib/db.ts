// lib/db.ts
import mongoose from "mongoose";

/* ─────────────────────────────────────────────────────────────────────
   1️⃣ Grab the URI from the environment
   ───────────────────────────────────────────────────────────────────── */
const MONGODB_URI = process.env.MONGODB_URI as string; // validated below at runtime

/* ─────────────────────────────────────────────────────────────────────
   If the URI is missing, throw an explicit error
   ───────────────────────────────────────────────────────────────────── */
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

/* ─────────────────────────────────────────────────────────────────────
   2️⃣ Caching logic (dev hot‑reload friendly)
   ───────────────────────────────────────────────────────────────────── */
type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

/* -----  Use a typed reference to the global object  ----- */
const globalNamespace: any = global as any;

// If we've already stored a connection somewhere in the global
const cached = (globalNamespace.mongoose as Cached) || {
  conn: null,
  promise: null,
} as Cached;

// Persist the cache on the global object for next reloads
if (!globalNamespace.mongoose) {
  globalNamespace.mongoose = cached;
}

/* ─────────────────────────────────────────────────────────────────────
   3️⃣  Main connector
   ───────────────────────────────────────────────────────────────────── */
export async function connectDB(): Promise<typeof mongoose> {
  // Use cached connection if available
  if (cached.conn) return cached.conn;

  // Create the connection promise once
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((instance) => {
        console.log("✅ New connection to MongoDB established");
        return instance;
      });
  }

  // Resolve, cache, return
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

/* ─────────────────────────────────────────────────────────────────────
   4️⃣ Export the helper conventionally
   ───────────────────────────────────────────────────────────────────── */
export default connectDB;