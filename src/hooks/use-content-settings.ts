"use client";

import { useState } from "react";

export interface ContentSettings {
  audioLanguage: string;
  captionLength: string;
  descriptionLength: string;
  hashtagCount: number;
}

export function useContentSettings() {
  const [audioLanguage, setAudioLanguage] = useState<string>("");
  const [captionLength, setCaptionLength] = useState<string>("medium");
  const [descriptionLength, setDescriptionLength] = useState<string>("medium");
  const [hashtagCount, setHashtagCount] = useState<number>(15);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const settings: ContentSettings = {
    audioLanguage,
    captionLength,
    descriptionLength,
    hashtagCount,
  };

  return {
    audioLanguage,
    setAudioLanguage,
    captionLength,
    setCaptionLength,
    descriptionLength,
    setDescriptionLength,
    hashtagCount,
    setHashtagCount,
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
  };
}
