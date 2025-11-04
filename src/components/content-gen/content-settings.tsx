"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

interface ContentSettingsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  captionLength: string;
  onCaptionLengthChange: (value: string) => void;
  descriptionLength: string;
  onDescriptionLengthChange: (value: string) => void;
  hashtagCount: number;
  onHashtagCountChange: (value: number) => void;
}

const LengthOption = ({ value, id, label }: { value: string; id: string; label: string }) => (
  <div>
    <RadioGroupItem value={value} id={id} className="peer sr-only" />
    <Label
      htmlFor={id}
      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
    >
      <span className="text-sm font-semibold">{label}</span>
    </Label>
  </div>
);

export function ContentSettings({
  isOpen,
  onOpenChange,
  captionLength,
  onCaptionLengthChange,
  descriptionLength,
  onDescriptionLengthChange,
  hashtagCount,
  onHashtagCountChange,
}: ContentSettingsProps) {
  return (
    <div className="w-full max-w-2xl border-b pb-4">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between"
          >
            <span>Content Settings</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
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
              onValueChange={onCaptionLengthChange}
              className="grid grid-cols-3 gap-3"
            >
              <LengthOption value="short" id="caption-short" label="Short" />
              <LengthOption value="medium" id="caption-medium" label="Medium" />
              <LengthOption value="long" id="caption-long" label="Long" />
            </RadioGroup>
          </div>

          {/* Description Length */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Description Length</Label>
            <RadioGroup
              value={descriptionLength}
              onValueChange={onDescriptionLengthChange}
              className="grid grid-cols-3 gap-3"
            >
              <LengthOption value="short" id="description-short" label="Short" />
              <LengthOption value="medium" id="description-medium" label="Medium" />
              <LengthOption value="long" id="description-long" label="Long" />
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
                    onHashtagCountChange(value);
                  }
                }}
                className="w-20 text-center"
              />
            </div>
            <Slider
              value={[hashtagCount]}
              onValueChange={(value) => onHashtagCountChange(value[0])}
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
  );
}
