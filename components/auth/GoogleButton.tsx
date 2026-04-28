"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { extractErrorMessage } from "@/lib/api/client";

interface GoogleButtonProps {
  mode: "signin" | "signup";
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              width?: number | string;
              locale?: string;
            }
          ) => void;
        };
      };
    };
  }
}

export function GoogleButton({ mode, onError }: GoogleButtonProps) {
  const t = useTranslations(mode === "signin" ? "Auth.signIn" : "Auth.signUp");
  const { googleSignIn } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
      return;
    }

    // Check if script already loaded
    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Don't remove on unmount - other pages might use it
    };
  }, [clientId]);

  useEffect(() => {
    if (!scriptLoaded || !clientId || !buttonRef.current || !window.google) {
      return;
    }

    const handleCredentialResponse = async (response: { credential: string }) => {
      setIsLoading(true);
      try {
        await googleSignIn(response.credential);
      } catch (err) {
        const errorMsg = extractErrorMessage(err);
        if (onError) {
          onError(errorMsg);
        } else {
          console.error("Google sign-in failed:", errorMsg);
        }
        setIsLoading(false);
      }
    };

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
    });

    // Clear previous content
    buttonRef.current.innerHTML = "";

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: mode === "signup" ? "signup_with" : "signin_with",
      shape: "rectangular",
      width: buttonRef.current.offsetWidth || 320,
    });
  }, [scriptLoaded, clientId, googleSignIn, onError, mode]);

  if (!clientId) {
    return null;
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="w-full py-3 flex items-center justify-center gap-2 border border-border rounded-lg bg-background">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">{t("google")}...</span>
        </div>
      ) : (
        <div ref={buttonRef} className="w-full flex justify-center" />
      )}
    </div>
  );
}
