"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { Check, Camera, User } from "lucide-react";

interface ClientFormData {
  // Basic Information
  companyName: string;
  industry: string;
  description: string;

  // Contact Information
  email: string;
  phone: string;
  website: string;
  address: string;

  // Social Media Accounts
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

const steps = [
  { id: 1, name: "Basic Information" },
  { id: 2, name: "Contact Information" },
  { id: 3, name: "Social Media Accounts" },
];

export default function ClientDialog() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    companyName: "",
    industry: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Client</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm md:max-w-2xl lg:max-w-3xl! p-0 bg-background overflow-hidden">
        <div className="bg-background border-b py-4 px-6">
          <DialogTitle className="text-lg font-semibold flex items-center gap-4">
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar className="w-6 h-6">
                <AvatarImage src="https://github.com/shacn.png" alt="@shadcn" />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </div>
            Add New Client
          </DialogTitle>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex min-h-[450px]">
            {/* Left Side - Stepper */}
            <div className="hidden md:block w-64 bg-accent/30 p-6 border-r">
              <nav aria-label="Progress">
                <ol className="space-y-6">
                  {steps.map((step, index) => (
                    <li key={step.id}>
                      <div className="flex items-start group">
                        <div className="w-full flex items-center">
                          <div className="mr-2 w-4">
                            <p className="text-sm font-medium transition-colors text-muted-foreground">
                              {step.id}
                            </p>
                          </div>
                          <p
                            className={cn(
                              "text-sm font-medium transition-colors",
                              currentStep >= step.id
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {step.name}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* Right Side - Form Content */}
            <div className="flex-1 p-6 relative">
              <div className="space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Basic Information
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Enter the basic details about your client
                        </p>
                      </div>

                      {/* Profile Picture Picker */}
                      <div className="flex justify-center mr-1 md:mr-4">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border bg-accent/50 flex items-center justify-center">
                            {profileImage ? (
                              <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Avatar className="w-full h-full">
                                <AvatarFallback className="text-4xl">
                                  <User />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                          <label
                            htmlFor="profile-upload"
                            className="absolute bottom-0.5 border-2 border-border right-0.5 w-8 h-8 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                          >
                            <Camera className="w-5 h-5 text-primary-foreground" />
                            <input
                              id="profile-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleProfileImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Contact Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Enter the contact details about your client
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Social Media Accounts */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Social Media Accounts
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Connect your client's social media profiles
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="p-4  border-t absolute bottom-0 left-0 right-0 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>

                {currentStep < steps.length ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
