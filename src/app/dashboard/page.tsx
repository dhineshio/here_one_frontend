"use client";

import { useAuth } from "@/hooks/use-auth";
import AuthGuard from "@/components/auth/auth-guard";
import { AppLayout } from "@/components/layout/app-layout";
import ProgressUpload from "@/components/file-upload/progress-upload";

export default function Dashboard() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }
 
  return (
    <AppLayout>
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen text-black dark:text-white">
        
        </div>
      </AuthGuard>
    </AppLayout>
  );
}
