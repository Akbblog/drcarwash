"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// This function will be called by our login form
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard", // Where to go after success
    });
  } catch (error) {
    // NextAuth throws a special error for redirects, we must let it pass through
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    throw error;
  }
}