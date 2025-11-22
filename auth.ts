import NextAuth from "next-auth";
import connectDB from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

/* Token interface – includes optional role */
interface TokenType {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  role?: string;
}

/* NextAuth configuration */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      /** Authorizer – verifies user credentials with clear errors */
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing email or password");
          }

          // ensure DB connection
          await connectDB();

          const email = String(credentials.email).toLowerCase();

          // include password and role explicitly
          const user = await User.findOne({ email }).select("+password +role");

          // Helpful, non-sensitive server logs to diagnose sign-in issues
          if (!user) {
            console.info(`[auth][authorize] user not found for email=${email}`);
            throw new Error("Invalid email or password");
          }

          if (!user.password) {
            console.info(`[auth][authorize] user record missing password for id=${user._id}`);
            throw new Error("User account missing password");
          }

          // Normalize the incoming password minimally (avoid accidental surrounding whitespace)
          const incomingPassword = String(credentials.password);
          const incomingPasswordTrimmed = incomingPassword.trim();

          // Quick check: does stored password look like a bcrypt hash? (starts with $2a/$2b/$2y)
          if (typeof user.password === "string" && !user.password.startsWith("$2")) {
            console.warn(`[auth][authorize] stored password for user id=${user._id} does not look like a bcrypt hash`);
          }

          // First try exact password, then try trimmed version if first fails (covers accidental whitespace)
          let passwordsMatch = await bcrypt.compare(incomingPassword, user.password);
          if (!passwordsMatch && incomingPassword !== incomingPasswordTrimmed) {
            passwordsMatch = await bcrypt.compare(incomingPasswordTrimmed, user.password);
          }
          if (!passwordsMatch) {
            console.info(`[auth][authorize] invalid password attempt for user id=${user._id}`);
            throw new Error("Invalid email or password");
          }

          // Return the payload that will be stored in the JWT
          return {
            id: String(user._id),
            name: user.name || "",
            email: user.email,
            emailVerified: (user as any).emailVerified ?? null,
            role: user.role || "user",
          };
        } catch (err: any) {
          // Log for server diagnostics, surface a clear message to Auth.js
          console.error("[auth][authorize] error:", err?.message ?? err);
          // Re-throw to let Auth.js surface the error (and avoid returning null)
          throw new Error(err?.message ?? "Authentication error");
        }
      },
    }),
  ],

  /* Session handling : use JWT */
  session: { strategy: "jwt" },

  /* Encryption / secret handling */
  secret: process.env.AUTH_SECRET,

  /* Custom pages */
  pages: { signIn: "/login" },

  /* Callbacks – inject role into JWT & session */
  callbacks: {
    /** Called when a user signs in or the JWT is refreshed */
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as TokenType;
        token.id = u.id;
        token.name = u.name;
        token.email = u.email;
        token.emailVerified = u.emailVerified ?? null;
        token.role = u.role ?? "user";
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
        role: t.role ?? "user",
      };
      return session;
    },
  },
});