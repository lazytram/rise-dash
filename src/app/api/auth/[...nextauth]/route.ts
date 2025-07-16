import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

// Environment variables for NextAuth configuration

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.message || !credentials?.signature) {
            console.error("Missing credentials");
            return null;
          }

          const siwe = new SiweMessage(JSON.parse(credentials.message));
          const nextAuthUrl = new URL(
            process.env.NEXTAUTH_URL || "http://localhost:3000"
          );

          // Get nonce from the request headers or generate one
          let nonce: string;
          try {
            const csrfToken = await getCsrfToken({ req });
            nonce = csrfToken || "fallback-nonce";
          } catch {
            console.warn("Could not get CSRF token, using fallback");
            nonce = "fallback-nonce";
          }

          const result = await siwe.verify({
            signature: credentials.signature,
            domain: nextAuthUrl.host,
            nonce: nonce,
          });

          if (result.success) {
            console.log(
              "SIWE verification successful for address:",
              siwe.address
            );
            return {
              id: siwe.address,
            };
          }

          console.error("SIWE verification failed");
          return null;
        } catch (e) {
          console.error("SIWE verification error:", e);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
  session: {
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60, // 2 days
  },
  jwt: {
    maxAge: 2 * 24 * 60 * 60, // 2 days
  },
  callbacks: {
    async session({ session, token }) {
      session.address = token.sub;
      session.user.name = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.address = user.id;
      }
      return token;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 2 * 24 * 60 * 60, // 2 days
      },
    },
  },
});

export { handler as GET, handler as POST };
