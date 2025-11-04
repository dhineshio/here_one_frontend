"use client";

import { Card } from "@/components/ui/card";
import { FileAudio, FileVideo, FileImage, ExternalLink } from "lucide-react";
import type { Job } from "@/lib/api-services";
import Image from "next/image";

interface JobCardProps {
  job: Job;
}

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'audio':
      return <FileAudio className="h-5 w-5 text-muted-foreground" />;
    case 'video':
      return <FileVideo className="h-5 w-5 text-muted-foreground" />;
    case 'image':
      return <FileImage className="h-5 w-5 text-muted-foreground" />;
    default:
      return <FileAudio className="h-5 w-5 text-muted-foreground" />;
  }
};

const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
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
      className="p-3 hover:bg-accent/50 transition-colors cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail Preview or Icon */}
        <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-accent flex items-center justify-center relative">
            {job.file_type === 'video' ? (
              <video 
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${job.source_url}`}
                className="object-cover w-full h-full"
                muted
                playsInline
              />
            ) : job.file_type === 'image' ? (
              <Image 
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${job.source_url}`}
                alt={job.original_filename}
                width={64}
                height={64}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              getFileIcon(job.file_type)
            )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <p 
              className="text-sm font-medium flex-1 truncate w-[200px] text-ellipsis" 
              title={job.original_filename}
            >
              {job.original_filename}
            </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatTime(job.created_at)}
          </p>
        </div>
      </div>
    </Card>
  );
}
