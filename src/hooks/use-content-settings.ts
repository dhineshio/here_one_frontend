"use client";

import { useState } from "react";

export interface ContentSettings {
  audioLanguage: string;
  captionLength: string;
  descriptionLength: string;
  captionStyle: string;
  hashtagCount: number;
}

export function useContentSettings() {
  const [audioLanguage, setAudioLanguage] = useState<string>("");
  const [captionLength, setCaptionLength] = useState<string>("");
  const [descriptionLength, setDescriptionLength] = useState<string>("");
  const [captionStyle, setCaptionStyle] = useState<string>("");
  const [hashtagCount, setHashtagCount] = useState<number>(15);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const settings: ContentSettings = {
    audioLanguage,
    captionLength,
    descriptionLength,
    captionStyle,
    hashtagCount,
  };

  return {
    audioLanguage,
    setAudioLanguage,
    captionLength,
    setCaptionLength,
    descriptionLength,
    setDescriptionLength,
    captionStyle,
    setCaptionStyle,
    hashtagCount,
    setHashtagCount,
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
  };
}
