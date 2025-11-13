import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import connectDB from './lib/db';
import User from './lib/models/User';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        // 2. Find user, ALSO get role
        const user = await User.findOne({
          email: credentials.email,
        }).select('+password +role'); // <-- 3. ADD +role HERE

        if (!user) return null;

        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isMatch) return null;

        // 4. Return the user, including the role
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // <-- 5. ADD THIS
        };
      },
    }),
  ],
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
   session: {
     strategy: 'jwt',
   },
});