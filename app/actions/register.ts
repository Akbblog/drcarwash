"use server";

import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const emailRaw = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Normalize email to lowercase to keep lookups consistent
  const email = emailRaw ? String(emailRaw).toLowerCase().trim() : "";

  if (!name || !email || !password) {
    return { error: "Please fill in all fields" };
  }

  try {
    await connectDB();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "Email already registered. Please log in." };
    }

    // 2. Hash the password (encrypt it so it's safe in the DB)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create the new user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Registration failed" };
  }
}