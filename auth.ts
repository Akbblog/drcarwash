import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

// --- Type for JWT token ---
interface TokenType {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        await connectDB();

        const user = await User.findOne({ email: String(credentials.email) }).select("+password");

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          String(credentials.password),
          user.password
        );

        if (!passwordsMatch) return null;

        // ✅ emailVerified must be Date | null
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          emailVerified: null, // NextAuth expects Date | null
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as TokenType;
        token.id = u.id;
        token.name = u.name;
        token.email = u.email;
        token.emailVerified = u.emailVerified ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      const t = token as unknown as TokenType;
      session.user = {
        id: t.id,
        name: t.name,
        email: t.email,
        emailVerified: t.emailVerified ?? null, // ✅ now Date | null
      };
      return session;
    },
  },
});

// app/auth.ts  (only the changed part is shown, keep the rest untouched)

interface TokenType {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role?: string;      // <-- NEW
}

// …

callbacks: {
  async jwt({ token, user }) {
    if (user) {
      const u = user as unknown as TokenType & { role?: string }; // ← new cast
      token.id = u.id;
      token.name = u.name;
      token.email = u.email;
      token.emailVerified = u.emailVerified ?? null;
      token.role = u.role ?? "user"; // <-- NEW
    }
    return token;
  },

  async session({ session, token }) {
    const t = token as unknown as TokenType & { role?: string }; // ← new cast
    session.user = {
      id: t.id,
      name: t.name,
      email: t.email,
      emailVerified: t.emailVerified ?? null,
      role: t.role ?? "user", // <-- NEW
    };
    return session;
  },
},
