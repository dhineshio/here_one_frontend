"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { JobCard } from "./job-card";
import type { Job } from "@/lib/api-services";

interface HistorySidebarProps {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function HistorySidebar({ jobs, isLoading, error, onRetry }: HistorySidebarProps) {
  return (
    <ScrollArea className="h-[calc(100vh-140px)]">
      <div className="space-y-2 pr-2">
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
              onClick={onRetry}
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
          jobs.map((job) => <JobCard key={job.job_id} job={job} />)
        )}
      </div>
    </ScrollArea>
  );
}
