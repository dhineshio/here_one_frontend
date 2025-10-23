import AuthGuard from "@/components/auth/auth-guard";
import { AppLayout } from "@/components/layout/app-layout";

export default function Home() {
  return (
    <AppLayout>
      <AuthGuard requireAuth={false}>
        <div className="min-h-screen text-black dark:text-white">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Home
          </h1>
        </div>
      </AuthGuard>
    </AppLayout>
  );
}
