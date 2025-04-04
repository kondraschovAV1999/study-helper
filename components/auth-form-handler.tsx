"use client";

import { signInAction, signUpAction } from "@/app/actions";

interface AuthFormHandlerProps {
  type: "signin" | "signup";
  children: React.ReactNode;
}

export function AuthFormHandler({ type, children }: AuthFormHandlerProps) {
  const handleSubmit = async (formData: FormData) => {
    const action = type === "signin" ? signInAction : signUpAction;
    const result = await action(formData);
    if (typeof result === 'string') {
      window.location.href = result;
    }
  };

  return (
    <form action={handleSubmit}>
      {children}
    </form>
  );
} 