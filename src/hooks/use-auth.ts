"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Custom hook for authentication
 * Provides easy access to session data and auth utilities
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;
  const accessToken = session?.accessToken;
  const refreshToken = session?.refreshToken;

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  };

  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    user,
    accessToken,
    refreshToken,
    requireAuth,
  };
}
