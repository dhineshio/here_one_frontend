"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeftIcon } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthService from "@/lib/auth";

function VerifyOTPContent() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [otpType, setOtpType] = useState<"registration" | "signin">("registration");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const typeParam = searchParams.get("type") as "registration" | "signin";
    
    if (!emailParam || !typeParam) {
      router.push("/signin");
      return;
    }
    
    setEmail(emailParam);
    setOtpType(typeParam);
  }, [searchParams, router]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let response;
      
      // Call the appropriate verification endpoint based on type
      if (otpType === "registration") {
        response = await AuthService.verifyRegistrationOTP({
          email,
          otp_code: otp,
        });
      } else {
        response = await AuthService.verifySignInOTP({
          email,
          otp_code: otp,
        });
      }

      // On success, we get access_token and refresh_token
      if (response.success && response.access_token && response.refresh_token) {
        // Sign in with NextAuth using a custom credentials provider
        // We'll pass the tokens to NextAuth to create a session
        const result = await signIn("credentials", {
          email,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/dashboard");
        } else {
          setError("Failed to create session. Please try again.");
          setIsLoading(false);
        }
      }
    } catch (err) {
      const errorMessage = (err as Error)?.message || "Failed to verify code. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");

    try {
      await AuthService.requestOTP({
        email,
        otp_type: otpType,
      });
      
      // Show success message (you could add a success state if desired)
      setOtp("");
    } catch (err) {
      const errorMessage = (err as Error)?.message || "Failed to resend code. Please try again.";
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="mx-auto flex h-screen w-full">
      {/* Left Side - OTP Verification Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-8">
        <div className="w-full md:w-sm space-y-8">
          <div className="flex items-center gap-2">
            <Image
              src="/images/cs_icon.svg"
              alt="Logo"
              width={28}
              height={28}
            />
            <h2 className="text-xl font-bold text-primary">CreatorScribe</h2>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Verify your account</h2>
            <p className="text-sm">
              We&apos;ve sent a verification code to your email address.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleVerifyOTP}>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                {error}
              </div>
            )}
            <div className="flex flex-col items-center space-y-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading}
              >
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot
                    index={0}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                  <InputOTPSlot
                    index={1}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                  <InputOTPSlot
                    index={2}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                  <InputOTPSlot
                    index={3}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                  <InputOTPSlot
                    index={4}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                  <InputOTPSlot
                    index={5}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to {email}
              </p>
            </div>
            <Button 
              type="submit"
              className="w-full py-6! mt-6 cursor-pointer"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            </p>
            <a
              href="/signin"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeftIcon className="size-4" />
              Back to sign in
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Primary Background */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-primary p-8">
        <div className="text-center space-y-6 max-w-md">
          <Image
            src="/images/auth_bg.png"
            alt="Logo"
            width={1000}
            height={1000}
          />
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">
              Connect with CreatorScribe
            </h1>
            <p className="text-sm text-primary-foreground/90">
              Connect with Creators and get your content created
            </p>
          </div>
          <div className="pt-4">
            <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
              <div className="h-px w-12 bg-primary-foreground/30"></div>
              <span className="text-sm">Secure & Reliable</span>
              <div className="h-px w-12 bg-primary-foreground/30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTP() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
