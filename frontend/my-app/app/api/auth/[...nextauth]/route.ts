import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { query } from "@/utils/db";

interface JwtUser {
  id: number | string;
  email: string;
  name: string;
}

const createBackendToken = (user: JwtUser) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || "SECRET_JWT", {
    expiresIn: "15m",
  });
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      try {
        console.log("user", user);
        console.log("calling signin", user);
        const result = await query("SELECT * FROM users WHERE email=$1", [
          user.email,
        ]);

        if (result.rows.length === 0) {
          await query(
            "INSERT INTO users(name, email, image,googleid) VALUES ($1,$2,$3,$4)",
            [user.name, user.email, user.image, user.id]
          );
        }

        return true;
      } catch (error) {
        console.log("Error in db", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      console.log("token", token);
      if (user) {
        token.user = {
          id: user.id || null,
          name: user.name,
          email: user.email,
        };
        token.backendToken = createBackendToken(token.user as JwtUser);
      }

      return token;
    },

    async session({ session, token }) {
      console.log("token", token);
      (session as any).user = token.user;
      (session as any).backendToken = token.backendToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
