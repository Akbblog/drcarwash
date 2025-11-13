import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongoClient';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

// Helper function to safely determine the cookie domain for production
const getCookieDomain = (url: string | undefined) => {
  if (!url) return undefined;
  try {
    const { hostname } = new URL(url);
    // For production domains (e.g., example.com), we use .example.com
    // For localhost, this will be undefined, which is correct.
    if (hostname !== 'localhost' && hostname.includes('.')) {
      const parts = hostname.split('.');
      return `.${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
    }
  } catch (e) {
    console.error("Invalid NEXTAUTH_URL for cookie domain:", e);
    return undefined;
  }
  return undefined;
};


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email as string,
        }).select('+password');

        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (passwordsMatch) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        }
        
        return null;
      },
    }),
  ],
  
  // --- COOKIE CONFIGURATION FIX ---
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: getCookieDomain(process.env.NEXTAUTH_URL)
      },
    },
  },
  // --- END COOKIE CONFIGURATION FIX ---

  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },


  callbacks: {
    // 6. This set of callbacks ensures the 'role' is on the session
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        // @ts-ignore
        session.user.id = token.sub;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },
 
});