"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import ProgressUpload from "@/components/file-upload/progress-upload";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { History, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useClients } from "@/contexts/client-context";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import type { Job } from "@/lib/api-services";
import { useJobs } from "@/hooks/use-jobs";
import { useContentSettings } from "@/hooks/use-content-settings";
import { HistorySidebar } from "@/components/content-gen/history-sidebar";
import { ContentSettings } from "@/components/content-gen/content-settings";
import { LanguageSelector } from "@/components/content-gen/language-selector";

export default function ContentGen() {
  const { activeClient } = useClients();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Custom hooks for cleaner state management
  const { jobs, isLoading, error, fetchJobs, refetch } = useJobs({
    clientId: activeClient?.id,
    pollingInterval: 10000,
  });

  const {
    audioLanguage,
    setAudioLanguage,
    captionLength,
    setCaptionLength,
    descriptionLength,
    setDescriptionLength,
    hashtagCount,
    setHashtagCount,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useContentSettings();

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

  // Handle upload completion
  const handleUploadComplete = (jobId: string, file: FileWithPreview) => {
    console.log("File uploaded successfully:", { jobId, fileName: file.file.name });
    
    // Silently fetch to get the actual data from server
    setTimeout(() => fetchJobs(false), 1000);
  };

  return (
    <AppLayout>
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen text-black dark:text-white flex">
          {/* Main Content Area */}
          <div className="flex-1 space-y-4 relative overflow-y-scroll">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            >
              <History />
            </Button>
            
            <ScrollArea className="h-[calc(100vh-72px)] w-full">
              <div className="w-full p-4 md:p-6 lg:p-8 flex flex-col items-center mt-10 lg:mt-0 space-y-5">
                {/* File Upload */}
                <ProgressUpload
                  accept="video/*,audio/*,image/*"
                  maxSize={250 * 1024 * 1024}
                  clientId={activeClient?.id || null}
                  onUploadComplete={handleUploadComplete}
                />

                {/* Language Selector */}
                <LanguageSelector
                  value={audioLanguage}
                  onValueChange={setAudioLanguage}
                />

                {/* Content Settings */}
                <ContentSettings
                  isOpen={isSettingsOpen}
                  onOpenChange={setIsSettingsOpen}
                  captionLength={captionLength}
                  onCaptionLengthChange={setCaptionLength}
                  descriptionLength={descriptionLength}
                  onDescriptionLengthChange={setDescriptionLength}
                  hashtagCount={hashtagCount}
                  onHashtagCountChange={setHashtagCount}
                />

                {/* Generate Button */}
                <div className="w-full max-w-2xl">
                  <Button className="w-full h-12 text-lg font-semibold" size="lg">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Mobile/Tablet: Sheet Overlay */}
          <div className="lg:hidden">
            <Sheet open={isHistoryOpen && !isLargeScreen} onOpenChange={setIsHistoryOpen}>
              <SheetContent side="right" className="w-[19rem]">
                <SheetHeader>
                  <SheetTitle>History</SheetTitle>
                </SheetHeader>
                <div className="mt-4 p-2">
                  <HistorySidebar
                    jobs={jobs}
                    isLoading={isLoading}
                    error={error}
                    onRetry={refetch}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop (lg+): Sidebar */}
          <div className="hidden lg:block relative">
            <div
              className={`h-[calc(100vh-72px)] bg-accent/40 transition-all duration-300 ease-in-out overflow-hidden ${
                isHistoryOpen ? "w-[22rem]" : "w-0"
              }`}
            >
              <div
                className={`w-[22rem] h-full p-4 transition-opacity duration-300 ${
                  isHistoryOpen ? "opacity-100 delay-150" : "opacity-0 delay-0"
                }`}
              >
                <HistorySidebar
                  jobs={jobs}
                  isLoading={isLoading}
                  error={error}
                  onRetry={refetch}
                />
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    </AppLayout>
  );
}
