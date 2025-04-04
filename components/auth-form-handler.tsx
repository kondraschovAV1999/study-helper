"use client";

import { signInAction, signUpAction } from "@/app/actions";
import { useState } from "react";

interface AuthFormHandlerProps {
  type: "signin" | "signup";
  children: React.ReactNode;
}

export function AuthFormHandler({ type, children }: AuthFormHandlerProps) {
  const [error, setError] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    setError("");

    // Client-side password validation for signup
    if (type === "signup") {
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    const action = type === "signin" ? signInAction : signUpAction;
    const result = await action(formData);
    if (typeof result === 'string') {
      window.location.href = result;
    }
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