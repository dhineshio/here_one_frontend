"use client";
import AuthGuard from "@/components/auth/auth-guard";
import ClientDialog from "@/components/client_dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";


export default function Home() {

  return (
    <AuthGuard requireAuth={true}>
      <ClientDialog />
    </AuthGuard>
  );
}
