"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || status === "loading") return;

    const isAuthenticated = status === "authenticated";

    if (requireAuth && !isAuthenticated) {
      router.replace('/signin');
      return;
    }

    if (!requireAuth && isAuthenticated) {
      if (window.location.pathname.includes('/signin') || 
          window.location.pathname.includes('/signup') || 
          window.location.pathname.includes('/auth')) {
        router.replace('/dashboard');
        return;
      }
    }
  }, [router, requireAuth, isMounted, status]);

  // Show loading spinner while checking authentication or mounting
  if (!isMounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && status !== "authenticated") {
    return null;
  }

  if (!requireAuth && status === "authenticated") {
    if (typeof window !== 'undefined' && 
        (window.location.pathname.includes('/signin') || 
         window.location.pathname.includes('/signup') || 
         window.location.pathname.includes('/auth'))) {
      return null;
    }
  }

  return <>{children}</>;
}