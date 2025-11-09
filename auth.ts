import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db"
import User from "./lib/models/User"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // This function runs when someone tries to log in
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        // 1. Find user by email, and explicitly ask for the password (we hid it by default in the model)
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
            // User not found
            return null;
        }

        // 2. Check if the password matches the encrypted one in the DB
        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isMatch) {
            // Wrong password
            return null;
        }

        // 3. Login successful, return safe user data
        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: '/login', // We will build a custom login page later
  },
  callbacks: {
    // This ensures the User ID is available in the session throughout the app
    async session({ session, token }) {
      if (token.sub && session.user) {
         // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
  },
})