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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { History, ChevronDown, Sparkles, FileAudio, FileVideo, FileImage, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useClients } from "@/contexts/client-context";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import { TranscribeService, type Job } from "@/lib/api-services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ContentGen() {
  const { activeClient } = useClients();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState<string>("");
  const [captionLength, setCaptionLength] = useState<string>("medium");
  const [descriptionLength, setDescriptionLength] = useState<string>("medium");
  const [hashtagCount, setHashtagCount] = useState<number>(15);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);

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

  // Fetch jobs
  const fetchJobs = async () => {
    if (!activeClient) return;
    
    try {
      setIsLoadingJobs(true);
      setJobsError(null);
      const response = await TranscribeService.getJobs({
        client_id: activeClient.id,
        limit: 50,
        offset: 0,
      });
      
      if (response.success !== false) {
        setJobs(response.jobs);
      } else {
        setJobsError(response.message || "Failed to load jobs");
      }
    } catch (error: unknown) {
      // Handle different error formats
      let errorMessage = "Something went wrong";
      
      // Log errors in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log("Error details:", error);
        if (error && typeof error === 'object') {
          console.log("Error keys:", Object.keys(error));
        }
      }
      
      if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
          errorMessage = (error.data as { message: string }).message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setJobsError(errorMessage);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Fetch jobs when active client changes
  useEffect(() => {
    if (activeClient) {
      fetchJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  // Handle upload completion
  const handleUploadComplete = (jobId: string, file: FileWithPreview) => {
    console.log("File uploaded successfully:", { jobId, fileName: file.file.name });
    // Refresh jobs list after upload
    fetchJobs();
  };

  // Helper functions
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'audio':
        return <FileAudio className="h-5 w-5" />;
      case 'video':
        return <FileVideo className="h-5 w-5" />;
      case 'image':
        return <FileImage className="h-5 w-5" />;
      default:
        return <FileAudio className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string, progress: number) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success">
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="info">
            Processing {progress}
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const HistoryContent = () => (
    <ScrollArea className="h-[calc(100vh-140px)]">
      <div className="space-y-3 pr-4">
        {isLoadingJobs ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : jobsError ? (
          <div className="text-center py-8">
            <p className="text-sm text-destructive">{jobsError}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchJobs}
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
          jobs.map((job) => (
            <Card key={job.job_id} className="py-4">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {getFileIcon(job.file_type)}
                    <CardTitle className="text-sm truncate">
                      {job.original_filename}
                    </CardTitle>
                  </div>
                  {getStatusBadge(job.status, job.progress)}
                </div>
                <CardDescription className="text-xs">
                  {formatDate(job.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="space-y-1 text-xs text-muted-foreground">
                  {job.processing_time && (
                    <p>Processing time: {job.processing_time}</p>
                  )}
                  {job.video_url && job.status === 'completed' && (
                    <a 
                      href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${job.video_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline block"
                    >
                      View/Download
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );

  return (
    <AppLayout>
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen text-black dark:text-white flex">
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
              <div className="w-full p-4 md:p-6 lg:p-8  flex flex-col items-center mt-10 lg:mt-0 space-y-5">
                <ProgressUpload
                  accept="video/*,audio/*,image/*"
                  maxSize={250 * 1024 * 1024}
                  clientId={activeClient?.id || null}
                  onUploadComplete={handleUploadComplete}
                />
                <div className="w-full max-w-2xl space-y-2">
                  <Select
                    value={audioLanguage}
                    onValueChange={setAudioLanguage}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select audio language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                      <SelectItem value="zh">Chinese (Mandarin)</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="pa">Punjabi</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="ur">Urdu</SelectItem>
                      <SelectItem value="tr">Turkish</SelectItem>
                      <SelectItem value="nl">Dutch</SelectItem>
                      <SelectItem value="pl">Polish</SelectItem>
                      <SelectItem value="sv">Swedish</SelectItem>
                      <SelectItem value="da">Danish</SelectItem>
                      <SelectItem value="no">Norwegian</SelectItem>
                      <SelectItem value="fi">Finnish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full max-w-2xl border-b pb-4">
                  <Collapsible
                    open={isSettingsOpen}
                    onOpenChange={setIsSettingsOpen}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-between"
                      >
                        <span>Content Settings</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isSettingsOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-6 border rounded-lg p-6">
                      {/* Caption Length */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Caption Length</Label>
                        <RadioGroup
                          value={captionLength}
                          onValueChange={setCaptionLength}
                          className="grid grid-cols-3 gap-3"
                        >
                          <div>
                            <RadioGroupItem
                              value="short"
                              id="caption-short"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="caption-short"
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                            >
                              <span className="text-sm font-semibold">Short</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="medium"
                              id="caption-medium"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="caption-medium"
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                            >
                              <span className="text-sm font-semibold">Medium</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="long"
                              id="caption-long"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="caption-long"
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                            >
                              <span className="text-sm font-semibold">Long</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Description Length */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Description Length</Label>
                        <RadioGroup
                          value={descriptionLength}
                          onValueChange={setDescriptionLength}
                          className="grid grid-cols-3 gap-3"
                        >
                          <div>
                            <RadioGroupItem
                              value="short"
                              id="description-short"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="description-short"
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                            >
                              <span className="text-sm font-semibold">Short</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="medium"
                              id="description-medium"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="description-medium"
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                            >
                              <span className="text-sm font-semibold">Medium</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="long"
                              id="description-long"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="description-long"
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                            >
                              <span className="text-sm font-semibold">Long</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Hashtag Count */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold">Hashtag Count</Label>
                          <Input
                            type="number"
                            min="1"
                            max="30"
                            value={hashtagCount}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value >= 1 && value <= 30) {
                                setHashtagCount(value);
                              }
                            }}
                            className="w-20 text-center"
                          />
                        </div>
                        <Slider
                          value={[hashtagCount]}
                          onValueChange={(value) => setHashtagCount(value[0])}
                          min={1}
                          max={30}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1</span>
                          <span>30</span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                <div className="w-full max-w-2xl">
                  <Button
                    className="w-full h-12 text-lg font-semibold"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </div>
            </ScrollArea>
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
              className={`h-[calc(100vh-72px)] bg-accent/40 transition-all duration-300 ease-in-out overflow-hidden ${
                isHistoryOpen ? "w-[22rem]" : "w-0"
              }`}
            >
              <div
                className={`w-[22rem] h-full p-4 ${
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
