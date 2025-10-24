"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import ProgressUpload from "@/components/file-upload/progress-upload";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { History } from "lucide-react";

export default function ContentGen() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Detect screen size and set initial state
  useEffect(() => {
    const checkScreenSize = () => {
      const isLg = window.innerWidth >= 1024;
      setIsLargeScreen(isLg);
      setIsHistoryOpen(isLg);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const HistoryContent = () => (
    <>
      <div className="space-y-4"></div>
    </>
  );

  return (
    <AppLayout>
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen text-black dark:text-white flex">
          <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-4 relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            >
              <History />
            </Button>
            <div className="w-full flex justify-center mt-10 lg:mt-0">
              <ProgressUpload />
            </div>
          </div>

          {/* Mobile/Tablet: Sheet Overlay */}
          <div className="lg:hidden">
            <Sheet
              open={isHistoryOpen && !isLargeScreen}
              onOpenChange={setIsHistoryOpen}
            >
              <SheetContent side="right" className="w-[19rem]">
                <SheetHeader>
                  <SheetTitle>History</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <HistoryContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop (lg+): Sidebar with shrink effect */}
          <div className="hidden lg:block relative">
            <div
              className={`h-[calc(100vh-72px)] bg-accent/20 transition-all duration-300 ease-in-out overflow-hidden ${
                isHistoryOpen ? "w-[19rem]" : "w-0"
              }`}
            >
              <div
                className={`w-[19rem] h-full p-4 ${
                  isHistoryOpen ? "opacity-100 delay-150" : "opacity-0 delay-0"
                }`}
              >
                <h2 className="text-lg font-semibold mb-4">History</h2>
                <HistoryContent />
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    </AppLayout>
  );
}
