import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "./axios";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Call your existing backend API
          const response = await api.post("/api/auth/signin", {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data.success) {
            return {
              id: credentials.email as string,
              email: credentials.email as string,
              name: credentials.email as string,
            };
          }

          return null;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Authentication failed";
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    signOut: "/signin",
    error: "/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Handle OAuth sign-in (Google/Facebook)
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          // Send OAuth data to your backend for processing
          const response = await api.post("/api/auth/oauth-signin", {
            provider: account.provider,
            email: user.email,
            name: user.name,
            image: user.image,
            oauth_id: account.providerAccountId,
            access_token: account.access_token,
          });

          if (response.data.success) {
            // Store tokens from your backend
            if (response.data.access_token && response.data.refresh_token) {
              user.accessToken = response.data.access_token;
              user.refreshToken = response.data.refresh_token;
            }
            return true;
          }
          return false;
        } catch (error) {
          console.error("OAuth sign-in error:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;
