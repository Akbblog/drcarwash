// app/auth.ts
/* ──────────────────────────────────────────────────────────────────────────────
   Updated to include user roles in JWT & session
   ────────────────────────────────────────────────────────────────────────────── */
import NextAuth from "next-auth";
import connectDB from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

/* ──────────────────────────────────────────────────────────────────────────────
   Token interface – now includes an optional role
   ────────────────────────────────────────────────────────────────────────────── */
interface TokenType {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role?: string; // <-- NEW
}

/* ──────────────────────────────────────────────────────────────────────────────
   NextAuth configuration
   ────────────────────────────────────────────────────────────────────────────── */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      /** Authorizer – verifies user credentials */
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        /* Make sure MongoDB connection is ready */
        await connectDB();

        /* Pull the user *and* the role field explicitly */
        const user = await User.findOne({
          email: String(credentials.email),
        }).select("+password +role"); // ⚠️  added +role

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          String(credentials.password),
          user.password
        );
        if (!passwordsMatch) return null;

        /* Return the payload that will be stored in the JWT */
        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          emailVerified: null, // NextAuth expects Date | null
          role: user.role,     // <-- NEW
        };
      },
    }),
  ],

  /* ---------------------------------------------
     Session handling : use JWT instead of the DB
     --------------------------------------------- */
  session: { strategy: "jwt" },

  /* ---------------------------------------------
     Encryption / secret handling
     --------------------------------------------- */
  secret: process.env.AUTH_SECRET,

  /* ---------------------------------------------
     Custom pages
     --------------------------------------------- */
  pages: { signIn: "/login" },

  /* ---------------------------------------------
     Callbacks – inject role into JWT & session
     --------------------------------------------- */
  callbacks: {
    /** Called when a user signs in or the JWT is refreshed */
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as TokenType;
        token.id = u.id;
        token.name = u.name;
        token.email = u.email;
        token.emailVerified = u.emailVerified ?? null;
        token.role = u.role ?? "user"; // <-- NEW
      }
      return token;
    },

    /** Called on every page that accesses `useSession` */
    async session({ session, token }) {
      const t = token as unknown as TokenType;
      (session as any).user = {
        id: t.id,
        name: t.name,
        email: t.email,
        emailVerified: t.emailVerified ?? null,
        role: t.role ?? "user", // <-- NEW
      };
      return session;
    },
  },
});