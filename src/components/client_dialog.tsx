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
import { useClients } from "@/contexts/client-context";
import ClientService, { CreateClientRequest } from "@/lib/api-services";

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
  client_name: string;
  industry_type: string;
  preferred_post_time: string;

  // Contact Information
  contact_person: string;
  contact_email: string;
  contact_phone: string;

  // Social Media Accounts (only 3 for now)
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
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
  const { refreshClients } = useClients();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    client_name: "",
    industry_type: "",
    preferred_post_time: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
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

    if (!formData.client_name.trim()) {
      newErrors.client_name = "Client name is required";
    }

    if (!formData.industry_type) {
      newErrors.industry_type = "Industry type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contact_person.trim()) {
      newErrors.contact_person = "Contact person name is required";
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = "Please enter a valid email address";
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

  const handleSubmit = async () => {
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

    try {
      setIsSubmitting(true);
      setErrors({});

      // Prepare data for API
      const clientData: CreateClientRequest = {
        client_name: formData.client_name.trim(),
        contact_person: formData.contact_person.trim(),
        contact_email: formData.contact_email.trim(),
        industry_type: formData.industry_type,
        // Optional fields
        ...(formData.contact_phone.trim() && { contact_phone: formData.contact_phone.trim() }),
        ...(formData.preferred_post_time && { preferred_post_time: formData.preferred_post_time }),
        ...(profileImage && { brand_logo: profileImage }), // Include base64 image data
        ...(formData.facebook_url.trim() && { facebook_url: formData.facebook_url.trim() }),
        ...(formData.instagram_url.trim() && { instagram_url: formData.instagram_url.trim() }),
        ...(formData.youtube_url.trim() && { youtube_url: formData.youtube_url.trim() }),
      };

      const response = await ClientService.createClient(clientData);

      if (response.success) {
        // Refresh the client list
        await refreshClients();
        // Close dialog after successful submission
        onOpenChange?.(false);
      } else {
        setErrors({ submit: response.message });
      }
    } catch (error: any) {
      console.error('Error creating client:', error);
      setErrors({ 
        submit: error?.message || 'Failed to create client. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      setProfileImage(null);
      setErrors({});
      setIsSubmitting(false);
      setFormData({
        client_name: "",
        industry_type: "",
        preferred_post_time: "",
        contact_person: "",
        contact_email: "",
        contact_phone: "",
        facebook_url: "",
        instagram_url: "",
        youtube_url: "",
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
                        htmlFor="client_name"
                        className="text-muted-foreground"
                      >
                        Client Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="client_name"
                        name="client_name"
                        placeholder="Enter client name"
                        value={formData.client_name}
                        onChange={handleInputChange}
                        className={cn(
                          errors.client_name && "border-destructive"
                        )}
                      />
                      {errors.client_name && (
                        <p className="text-sm text-destructive">
                          {errors.client_name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="industry_type"
                        className="text-muted-foreground"
                      >
                        Industry Type{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.industry_type}
                        onValueChange={(value) =>
                          handleSelectChange("industry_type", value)
                        }
                      >
                        <SelectTrigger
                          id="industry_type"
                          className={cn(
                            "w-full",
                            errors.industry_type && "border-destructive"
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
                      {errors.industry_type && (
                        <p className="text-sm text-destructive">
                          {errors.industry_type}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="preferred_post_time"
                        className="text-muted-foreground"
                      >
                        Preferred Post Time
                      </Label>
                      <Input
                        id="preferred_post_time"
                        name="preferred_post_time"
                        type="time"
                        placeholder="HH:MM"
                        value={formData.preferred_post_time}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use 24-hour format (e.g., 14:30 for 2:30 PM)
                      </p>
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
                      <Label htmlFor="contact_person">
                        Contact Person Name{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contact_person"
                        name="contact_person"
                        placeholder="Enter contact person name"
                        value={formData.contact_person}
                        onChange={handleInputChange}
                        className={cn(
                          errors.contact_person && "border-destructive"
                        )}
                      />
                      {errors.contact_person && (
                        <p className="text-sm text-destructive">
                          {errors.contact_person}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_email">
                        Contact Email{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        placeholder="Enter contact email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        className={cn(
                          errors.contact_email && "border-destructive"
                        )}
                      />
                      {errors.contact_email && (
                        <p className="text-sm text-destructive">
                          {errors.contact_email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">
                        Contact Phone
                      </Label>
                      <Input
                        id="contact_phone"
                        name="contact_phone"
                        type="tel"
                        placeholder="Enter contact phone (optional)"
                        value={formData.contact_phone}
                        onChange={handleInputChange}
                        className={cn(
                          errors.contact_phone && "border-destructive"
                        )}
                      />
                      {errors.contact_phone && (
                        <p className="text-sm text-destructive">
                          {errors.contact_phone}
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
                      <Label htmlFor="facebook_url">Facebook Profile</Label>
                      <Input
                        id="facebook_url"
                        name="facebook_url"
                        type="url"
                        placeholder="Enter Facebook profile URL"
                        value={formData.facebook_url}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram_url">
                        Instagram Profile
                      </Label>
                      <Input
                        id="instagram_url"
                        name="instagram_url"
                        type="url"
                        placeholder="Enter Instagram profile URL"
                        value={formData.instagram_url}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="youtube_url">YouTube URL</Label>
                      <Input
                        id="youtube_url"
                        name="youtube_url"
                        type="url"
                        placeholder="Enter YouTube channel URL"
                        value={formData.youtube_url}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className="absolute bottom-20 left-6 right-6">
                <div className="bg-destructive/15 border border-destructive/20 rounded-md p-3">
                  <p className="text-sm text-destructive">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="p-4 bg-background border-t absolute bottom-0 left-0 right-0 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
              >
                Back
              </Button>

              {currentStep < steps.length ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
