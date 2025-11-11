"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import ProgressUpload from "@/components/file-upload/progress-upload";
import { AppLayout } from "@/components/layout/app-layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useClients } from "@/contexts/client-context";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import { useJobs } from "@/hooks/use-jobs";
import { useContentSettings } from "@/hooks/use-content-settings";
import { LanguageSelector } from "@/components/content-gen/language-selector";
import { Label } from "@/components/ui/label";
import { CaptionSelector } from "@/components/content-gen/caption-selector";
import { DescriptionSelector } from "@/components/content-gen/description-selector";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkle } from "lucide-react";
import { StyleSelector } from "@/components/content-gen/style-selector";
import { Counter } from "@/components/content-gen/counter";
import { JobCard } from "@/components/content-gen/job-card";

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
    captionStyle,
    setCaptionStyle,
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
          <div className="h-[calc(100vh-72px)] w-full md:w-sm border-r relative flex flex-col">
            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="space-y-4 pb-4">
                {/* File Upload */}
                <ProgressUpload
                  accept="video/*,audio/*,image/*"
                  maxSize={250 * 1024 * 1024}
                  clientId={activeClient?.id || null}
                  onUploadComplete={handleUploadComplete}
                  className="w-full"
                />
                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor="audioLanguage" className="text-muted-foreground text-xs">Audio Language</Label>
                    <LanguageSelector
                      value={audioLanguage}
                      onValueChange={setAudioLanguage}
                    />
                  </div>

                  <div className="space-y-0.5 mt-4">
                    <Label htmlFor="captionLength" className="text-muted-foreground text-xs mb-2">Content Settings</Label>
                    <CaptionSelector
                      value={captionLength}
                      onValueChange={setCaptionLength}
                    />
                    <DescriptionSelector
                      value={descriptionLength}
                      onValueChange={setDescriptionLength}
                    />
                    <StyleSelector
                      value={captionStyle}
                      onValueChange={setCaptionStyle}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Label htmlFor="hashtagCount" className=" text-xs text-muted-foreground">Hashtag Count</Label>
                    <Counter
                      value={hashtagCount}
                      setValue={setHashtagCount}
                    />
                  </div>
                </div>  
              </div>
            </div>
            
            {/* Fixed Bottom Section */}
            <div className="border-t p-4">
              <Textarea placeholder="Enter your prompt here" className="w-full h-20 resize-none"></Textarea>
              <Button className="mt-2 w-full mb-6" size="lg"><Sparkle className="mr-2 h-4 w-4" /> Generate</Button>
            </div>
          </div>

          {/* Job List */}
          <div className="flex-1 hidden md:block">
            <ScrollArea className="h-[calc(100vh-72px)]">
              <div className="space-y-6 pr-2 p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-sm text-destructive">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No jobs found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a file to get started
                  </p>
                </div>
              ) : (
                (() => {
                  // Group jobs by day
                  const groupedJobs = jobs.reduce((groups, job) => {
                    const date = new Date(job.created_at);
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    
                    let dayLabel;
                    if (date.toDateString() === today.toDateString()) {
                      dayLabel = 'Today';
                    } else if (date.toDateString() === yesterday.toDateString()) {
                      dayLabel = 'Yesterday';
                    } else {
                      dayLabel = date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      });
                    }
                    
                    if (!groups[dayLabel]) {
                      groups[dayLabel] = [];
                    }
                    groups[dayLabel].push(job);
                    return groups;
                  }, {} as Record<string, typeof jobs>);

                  return Object.entries(groupedJobs).map(([day, dayJobs]) => (
                    <div key={day} className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground">{day}</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {dayJobs.map((job) => (
                          <JobCard key={job.job_id} job={job} />
                        ))}
                      </div>
                    </div>
                  ));
                })()
              )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </AuthGuard>
    </AppLayout>

  );
}
