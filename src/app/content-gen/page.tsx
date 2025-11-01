"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import ProgressUpload from "@/components/file-upload/progress-upload";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { History, ChevronDown, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ContentGen() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState<string>("");
  const [recognizeSpeakers, setRecognizeSpeakers] = useState(false);
  const [transcribeToEnglish, setTranscribeToEnglish] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Detect screen size and set initial state
  useEffect(() => {
    const checkScreenSize = () => {
      const isLg = window.innerWidth >= 1024;
      setIsLargeScreen(isLg);
      setIsHistoryOpen(isLg);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const HistoryContent = () => (
    <>
      <div className="space-y-4"></div>
    </>
  );

  return (
    <AppLayout>
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen text-black dark:text-white flex">
          <div className="flex-1 space-y-4 relative overflow-y-scroll">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            >
              <History />
            </Button>
            <ScrollArea className="h-[calc(100vh-72px)] w-full">
              <div className="w-full p-4 md:p-6 lg:p-8  flex flex-col items-center mt-10 lg:mt-0 space-y-5">
                <ProgressUpload
                  accept="video/*,audio/*,image/*"
                  maxSize={250 * 1024 * 1024}
                />
                <div className="w-full max-w-2xl space-y-2">
                  <Select
                    value={audioLanguage}
                    onValueChange={setAudioLanguage}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select audio language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                      <SelectItem value="zh">Chinese (Mandarin)</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="pa">Punjabi</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="ur">Urdu</SelectItem>
                      <SelectItem value="tr">Turkish</SelectItem>
                      <SelectItem value="nl">Dutch</SelectItem>
                      <SelectItem value="pl">Polish</SelectItem>
                      <SelectItem value="sv">Swedish</SelectItem>
                      <SelectItem value="da">Danish</SelectItem>
                      <SelectItem value="no">Norwegian</SelectItem>
                      <SelectItem value="fi">Finnish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full max-w-2xl border-b pb-4">
                  <Collapsible
                    open={isSettingsOpen}
                    onOpenChange={setIsSettingsOpen}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-between"
                      >
                        <span>Speaker Recognition & More Settings</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isSettingsOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4 border rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={recognizeSpeakers}
                          onCheckedChange={(checked) =>
                            setRecognizeSpeakers(checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="recognize-speakers"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Recognize Speakers
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={transcribeToEnglish}
                          onCheckedChange={(checked) =>
                            setTranscribeToEnglish(checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="transcribe-english"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Transcribe to English
                        </Label>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                <div className="w-full max-w-2xl">
                  <Button
                    className="w-full h-12 text-lg font-semibold"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Mobile/Tablet: Sheet Overlay */}
          <div className="lg:hidden">
            <Sheet
              open={isHistoryOpen && !isLargeScreen}
              onOpenChange={setIsHistoryOpen}
            >
              <SheetContent side="right" className="w-[19rem]">
                <SheetHeader>
                  <SheetTitle>History</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <HistoryContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop (lg+): Sidebar with shrink effect */}
          <div className="hidden lg:block relative">
            <div
              className={`h-[calc(100vh-72px)] bg-accent/40 transition-all duration-300 ease-in-out overflow-hidden ${
                isHistoryOpen ? "w-[19rem]" : "w-0"
              }`}
            >
              <div
                className={`w-[19rem] h-full p-4 ${
                  isHistoryOpen ? "opacity-100 delay-150" : "opacity-0 delay-0"
                }`}
              >
                <h2 className="text-lg font-semibold mb-4">History</h2>
                <HistoryContent />
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    </AppLayout>
  );
}
