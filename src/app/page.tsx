import AuthGuard from "@/components/auth/auth-guard";

export default function Home() {
  return (
    <AuthGuard requireAuth={true}>
      <div>Home</div>
    </AuthGuard>
  );
}
