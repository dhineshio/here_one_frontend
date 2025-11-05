"use client";

import { Card } from "@/components/ui/card";
import { FileAudio, FileVideo, FileImage, Clock, Download, Eye, Loader2, CheckCircle2, XCircle, Clock3 } from "lucide-react";
import type { Job } from "@/lib/api-services";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
      return <CheckCircle2 className="h-3 w-3" />;
    case 'processing':
      return <Loader2 className="h-3 w-3 animate-spin" />;
    case 'failed':
      return <XCircle className="h-3 w-3" />;
    case 'pending':
      return <Clock3 className="h-3 w-3" />;
    default:
      return <Clock3 className="h-3 w-3" />;
  }
};

export function JobCard({ job }: JobCardProps) {
  const handleClick = () => {
    if (job.source_url) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      window.open(`${apiUrl}${job.source_url}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className="group hover:shadow-md transition-all cursor-pointer gap-0! overflow-hidden border p-0"
      onClick={handleClick}
    >
      {/* Thumbnail Section */}
      <div className="relative w-full aspect-video bg-accent/50 overflow-hidden">
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
      <div className="p-2 space-y-2">
        {/* Status Badge */}
        <div>
          <Badge className={`bg-gray-500/10 border-0 text-xs px-2! rounded-xs gap-1`}>
            {getStatusIcon(job.status)}
            <span className="capitalize">{job.status}</span>
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
    </Card>
  );
}
