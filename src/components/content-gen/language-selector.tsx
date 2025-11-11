"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, GlobeIcon } from "lucide-react";
interface LanguageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
];

export function LanguageSelector({ value, onValueChange }: LanguageSelectorProps) {
  const selectedLanguage = LANGUAGES.find(lang => lang.value === value);
  const displayText = selectedLanguage ? selectedLanguage.label : "Select Language";
  
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
              <GlobeIcon className="mr-2 h-4 w-4" /> {displayText}
            </div>
            <ChevronRight />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side={isMdOrLarger ? "right" : "bottom"}
          align="start"
          className="w-[--radix-dropdown-menu-trigger-width]"
        >
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem className="text-foreground" key={lang.value} onClick={() => onValueChange(lang.value)}>
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
