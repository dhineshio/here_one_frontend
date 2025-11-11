"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PreviewDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  previewUrl?: string;
  previewType?: 'video' | 'image' | 'audio';
}

export function PreviewDialog({
  open,
  onOpenChange,
  previewUrl,
  previewType = 'video',
}: PreviewDialogProps) {
  
  const renderPreview = () => {
    if (!previewUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          No preview available
        </div>
      );
    }

    switch (previewType) {
      case 'video':
        return (
          <video
            src={previewUrl}
            controls
            className="w-full h-full object-contain"
          />
        );
      case 'image':
        return (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        );
      case 'audio':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <audio src={previewUrl} controls className="w-full" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-4xl lg:max-w-6xl p-0 bg-background overflow-hidden h-[80vh]">
        {/* Header */}
        <div className="bg-background border-b py-4 px-6 flex items-center justify-between h-16">
          <DialogTitle className="text-lg font-semibold">
            Content Preview
          </DialogTitle>
        </div>

        <div className="flex h-[calc(80vh-10px)]">
          {/* Left Side - Preview */}
          <div className="w-sm bg-black/5 flex items-center justify-center ">
            {renderPreview()}
          </div>

          {/* Right Side - Content (Empty for now) */}
          <div className="flex-1 bg-background border-l p-6 overflow-y-auto">
            <div className="text-sm text-muted-foreground">
              {/* Content will be added here later */}
              Content section - to be implemented
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
