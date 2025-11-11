"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileAudio, FileVideo, FileImage, Clock, Download, Eye, Loader2, CheckCircle2, XCircle, Clock3, MoreVertical, Trash2 } from "lucide-react";
import type { Job } from "@/lib/api-services";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PreviewDialog } from "./preview-dialog";
import { Progress } from "radix-ui";

interface JobCardProps {
  job: Job;
}

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'audio':
      return <FileAudio className="h-8 w-8 text-muted-foreground" />;
    case 'video':
      return <FileVideo className="h-8 w-8 text-muted-foreground" />;
    case 'image':
      return <FileImage className="h-8 w-8 text-muted-foreground" />;
    default:
      return <FileAudio className="h-8 w-8 text-muted-foreground" />;
  }
};

const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } catch {
    return '';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return <CheckCircle2 className="h-2 w-2 text-accent-foreground" />;
    case 'processing':
      return <Loader2 className="h-2 w-2 text-accent-foreground animate-spin" />;
    case 'failed':
      return <XCircle className="h-2 w-2 text-accent-foreground" />;
    case 'pending':
      return <Clock3 className="h-2 w-2 text-accent-foreground" />;
    default:
      return <Clock3 className="h-2 w-2 text-accent-foreground" />;
  }
};

export function JobCard({ job }: JobCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleView = () => {
    setPreviewOpen(true);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete job:', job.job_id);
  };

  const getPreviewUrl = () => {
    if (job.source_url) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      return `${apiUrl}${job.source_url}`;
    }
    return undefined;
  };

  return (
    <Card 
      className="group hover:shadow-md transition-all overflow-hidden border p-0 gap-0!"
    >
      {/* Thumbnail Section */}
      <div className="relative w-full aspect-video bg-accent/50 overflow-hidden cursor-pointer" onClick={handleView}>
        {/* Three-dot menu */}
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background focus:border-none"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {job.file_type === 'video' ? (
          <video 
            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${job.source_url}`}
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
            muted
            playsInline
          />
        ) : job.file_type === 'image' ? (
          <Image 
            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${job.source_url}`}
            alt={job.original_filename}
            fill
            className="object-contain align-top group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-primary/10 to-background/5"
            unoptimized
          />
        ) : (
          <div className="w-full h-full aspect-video flex items-center justify-center">
            {getFileIcon(job.file_type)}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-2 space-y-2 border-t">
        {/* Status Badge */}
        <div>
          <Badge className={`bg-accent border-0 text-xs px-3! rounded-sm gap-1`}>
            {getStatusIcon(job.status)}
            <span className="capitalize text-accent-foreground">{job.status}</span>
          </Badge>
        </div>
        <h4 
          className="text-sm font-medium line-clamp-1" 
          title={job.original_filename}
        >
          {job.original_filename}
        </h4>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <span>{formatTime(job.created_at)}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        previewUrl={getPreviewUrl()}
        previewType={job.file_type as 'video' | 'image' | 'audio'}
      />
    </Card>
  );
}
