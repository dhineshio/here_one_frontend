"use client";
import AuthGuard from "@/components/auth/auth-guard";
import ClientDialog from "@/components/client_dialog";

export default function Home() {
  return (
    <AuthGuard requireAuth={true}>
      <div></div>
    </AuthGuard>
  );
}
