"use client";

import * as React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {  Camera, User } from "lucide-react";

const INDUSTRY_CHOICES = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "retail", label: "Retail" },
  { value: "education", label: "Education" },
  { value: "hospitality", label: "Hospitality" },
  { value: "real_estate", label: "Real Estate" },
  { value: "entertainment", label: "Entertainment" },
  { value: "food_beverage", label: "Food & Beverage" },
  { value: "fashion", label: "Fashion" },
  { value: "automotive", label: "Automotive" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Other" },
];

interface ClientFormData {
  // Basic Information
  clientName: string;
  industryType: string;
  preferredPostTime: string;
  companyName: string;
  industry: string;
  description: string;

  // Contact Information
  contactPersonName: string;
  contactEmail: string;
  contactPhone: string;
  email: string;
  phone: string;
  website: string;
  address: string;

  // Social Media Accounts
  facebookProfile: string;
  instagramProfile: string;
  youtubeUrl: string;
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

interface ClientDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ClientDialog({
  open,
  onOpenChange,
}: ClientDialogProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ClientFormData>({
    clientName: "",
    industryType: "",
    preferredPostTime: "",
    companyName: "",
    industry: "",
    description: "",
    contactPersonName: "",
    contactEmail: "",
    contactPhone: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    facebookProfile: "",
    instagramProfile: "",
    youtubeUrl: "",
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user selects a value
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
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

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!formData.industryType) {
      newErrors.industryType = "Industry type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contactPersonName.trim()) {
      newErrors.contactPersonName = "Contact person name is required";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate all steps before submission
    const step1Valid = validateStep1();
    const step2Valid = validateStep2();

    if (!step1Valid || !step2Valid) {
      // If validation fails, go back to the first invalid step
      if (!step1Valid) {
        setCurrentStep(1);
      } else if (!step2Valid) {
        setCurrentStep(2);
      }
      return;
    }

    // Close dialog after submission
    onOpenChange?.(false);
  };

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      setProfileImage(null);
      setErrors({});
      setFormData({
        clientName: "",
        industryType: "",
        preferredPostTime: "",
        companyName: "",
        industry: "",
        description: "",
        contactPersonName: "",
        contactEmail: "",
        contactPhone: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        facebookProfile: "",
        instagramProfile: "",
        youtubeUrl: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

        <div className="flex min-h-[550px]">
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

                  {/* Input Fields */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="clientName"
                        className="text-muted-foreground"
                      >
                        Client Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="clientName"
                        name="clientName"
                        placeholder="Enter client name"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className={cn(
                          errors.clientName && "border-destructive"
                        )}
                      />
                      {errors.clientName && (
                        <p className="text-sm text-destructive">
                          {errors.clientName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="industryType"
                        className="text-muted-foreground"
                      >
                        Industry Type{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.industryType}
                        onValueChange={(value) =>
                          handleSelectChange("industryType", value)
                        }
                      >
                        <SelectTrigger
                          id="industryType"
                          className={cn(
                            "w-full",
                            errors.industryType && "border-destructive"
                          )}
                        >
                          <SelectValue placeholder="Select industry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRY_CHOICES.map((industry) => (
                            <SelectItem
                              key={industry.value}
                              value={industry.value}
                            >
                              {industry.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.industryType && (
                        <p className="text-sm text-destructive">
                          {errors.industryType}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="preferredPostTime"
                        className="text-muted-foreground"
                      >
                        Preferred Post Time
                      </Label>
                      <Select
                        value={formData.preferredPostTime}
                        onValueChange={(value) =>
                          handleSelectChange("preferredPostTime", value)
                        }
                      >
                        <SelectTrigger
                          id="preferredPostTime"
                          className="w-full"
                        >
                          <SelectValue placeholder="Select preferred post time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">
                            Morning (6:00 AM - 12:00 PM)
                          </SelectItem>
                          <SelectItem value="afternoon">
                            Afternoon (12:00 PM - 6:00 PM)
                          </SelectItem>
                          <SelectItem value="evening">
                            Evening (6:00 PM - 12:00 AM)
                          </SelectItem>
                          <SelectItem value="night">
                            Night (12:00 AM - 6:00 AM)
                          </SelectItem>
                        </SelectContent>
                      </Select>
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

                  {/* Contact Fields */}
                  <div className="space-y-6 mt-8">
                    <div className="space-y-2">
                      <Label htmlFor="contactPersonName">
                        Contact Person Name{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contactPersonName"
                        name="contactPersonName"
                        placeholder="Enter contact person name"
                        value={formData.contactPersonName}
                        onChange={handleInputChange}
                        className={cn(
                          errors.contactPersonName && "border-destructive"
                        )}
                      />
                      {errors.contactPersonName && (
                        <p className="text-sm text-destructive">
                          {errors.contactPersonName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">
                        Contact Email{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        placeholder="Enter contact email"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className={cn(
                          errors.contactEmail && "border-destructive"
                        )}
                      />
                      {errors.contactEmail && (
                        <p className="text-sm text-destructive">
                          {errors.contactEmail}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">
                        Contact Phone{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        type="tel"
                        placeholder="Enter contact phone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className={cn(
                          errors.contactPhone && "border-destructive"
                        )}
                      />
                      {errors.contactPhone && (
                        <p className="text-sm text-destructive">
                          {errors.contactPhone}
                        </p>
                      )}
                    </div>
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
                        Connect your client&apos;s social media profiles
                      </p>
                    </div>
                  </div>

                  {/* Social Media Fields */}
                  <div className="space-y-6 mt-8">
                    <div className="space-y-2">
                      <Label htmlFor="facebookProfile">Facebook Profile</Label>
                      <Input
                        id="facebookProfile"
                        name="facebookProfile"
                        type="url"
                        placeholder="Enter Facebook profile URL"
                        value={formData.facebookProfile}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagramProfile">
                        Instagram Profile
                      </Label>
                      <Input
                        id="instagramProfile"
                        name="instagramProfile"
                        type="url"
                        placeholder="Enter Instagram profile URL"
                        value={formData.instagramProfile}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="youtubeUrl">YouTube URL</Label>
                      <Input
                        id="youtubeUrl"
                        name="youtubeUrl"
                        type="url"
                        placeholder="Enter YouTube channel URL"
                        value={formData.youtubeUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="p-4 bg-background border-t absolute bottom-0 left-0 right-0 flex justify-between">
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
                <Button type="button" onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
