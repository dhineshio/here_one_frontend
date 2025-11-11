"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, Star } from "lucide-react";
import { CaptionsIcon } from "lucide-react";

interface StyleSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CAPTION_STYLES = [
  { value: "hook", label: "Hook" },
  { value: "storytelling", label: "Storytelling" },
  { value: "question", label: "Question Based" },
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
  { value: "humorous", label: "Humorous" },
  { value: "emotional", label: "Emotional" },
  { value: "educational", label: "Educational" },
];

export function StyleSelector({ value, onValueChange }: StyleSelectorProps) {
  const selectedStyle = CAPTION_STYLES.find(style => style.value === value);
  const displayText = selectedStyle ? selectedStyle.label : "Select Style";
  
  const [isMdOrLarger, setIsMdOrLarger] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMdOrLarger(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="w-full space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="text-foreground bg-accent/50 hover:bg-accent cursor-pointer w-full justify-between rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0">
          <div className="flex items-center">
            <Star className="mr-2 h-4 w-4" /> {displayText}
          </div>
          <ChevronRight />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side={isMdOrLarger ? "right" : "bottom"}
          align="start"
          className="w-[--radix-dropdown-menu-trigger-width]"
        >
          {CAPTION_STYLES.map((style) => (
            <DropdownMenuItem className="text-foreground" key={style.value} onClick={() => onValueChange(style.value)}>
              {style.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
