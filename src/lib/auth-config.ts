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
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email is required");
        }

        // If tokens are provided (from OTP verification), use them
        if (credentials.accessToken && credentials.refreshToken) {
          return {
            id: credentials.email as string,
            email: credentials.email as string,
            name: credentials.email as string,
            accessToken: credentials.accessToken as string,
            refreshToken: credentials.refreshToken as string,
          };
        }

        // This shouldn't be reached in the new flow, but kept for backwards compatibility
        if (!credentials?.password) {
          throw new Error("Password is required");
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
          // Create a fresh axios instance to avoid session interceptor issues
          const axios = (await import('axios')).default;
          const backendApi = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // Send OAuth data to your backend for processing
          const response = await backendApi.post("/api/auth/oauth-signin", {
            provider: account.provider,
            email: user.email,
            full_name: user.name,
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
          if (error instanceof Error) {
            console.error("Error message:", error.message);
          }
          // Log the full error response if available
          const axiosError = error as { response?: { data: unknown; status: number } };
          if (axiosError?.response) {
            console.error("Backend error response:", axiosError.response.data);
            console.error("Backend error status:", axiosError.response.status);
          }
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
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days - makes cookie persistent across browser restarts
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;
