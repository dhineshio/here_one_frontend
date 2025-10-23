"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkAuth = () => {
      const isAuth = AuthService.isAuthenticated();
      setIsAuthenticated(isAuth);
      setIsLoading(false);

      if (requireAuth && !isAuth) {
        router.replace('/signin');
        return;
      }

      if (!requireAuth && isAuth) {
        if (window.location.pathname.includes('/signin') || 
            window.location.pathname.includes('/signup') || 
            window.location.pathname.includes('/auth')) {
          router.replace('/dashboard');
          return;
        }
      }
    };

    checkAuth();
  }, [router, requireAuth, isMounted]);

  // Show loading spinner while checking authentication or mounting
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    if (typeof window !== 'undefined' && 
        (window.location.pathname.includes('/signin') || 
         window.location.pathname.includes('/signup') || 
         window.location.pathname.includes('/auth'))) {
      return null;
    }
  }

  return <>{children}</>;
}