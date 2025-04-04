"use client";

import { useState } from "react";

interface AuthFormHandlerProps {
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
}

export function AuthFormHandler({ action, children }: AuthFormHandlerProps) {
  const [error, setError] = useState<string>("");

  const handleSubmit = (formData: FormData) => {
    setError("");

    // Client-side password validation for signup
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    return action(formData).catch((err) => {
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        return;
      }
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    });
  };

  return (
    <form action={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}
      {children}
    </form>
  );
}