"use client";
{
  /* This component is used in the RightSideAuthForm component to render the sign-up form. */
}
{
  /* Signup form is available via toggle buttons in the RightSideAuthForm component */
}

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";
import { signInAction } from "@/app/actions";
import { useState } from "react";
import { redirect } from "next/navigation";

interface SigninFormProps {
  switchToSignup: () => void;
}

{
  /* Form Fields for logging in */
}
{
  /* The switchToSignup function is passed as a prop to switch to the signup form when needed */
}
export function SignInForm({ switchToSignup }: SigninFormProps) {
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const result = await signInAction(formData);
    if (result?.success === false) {
      setError(result.message);
    } else if (result?.success === true) {
      setError("");
      redirect("/protected");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 p-10 bg-background rounded-xl shadow-lg border">
        {error && <p className="text-red-600">{error}</p>}
        <h2 className="text-4xl font-bold text-center">Sign In</h2>

        {/* Email */}
        <div className="space-y-6">
          <div>
            <Label className="block text-lg font-medium mb-2">Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-secondary border rounded-lg p-6 text-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label className="block text-lg font-medium mb-2">Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full bg-secondary border rounded-lg p-6 text-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Remember me checkbox*/}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center">
            <Input
              name="remember"
              type="checkbox"
              className="mr-3 h-5 w-5 rounded text-primary focus:ring-primary"
            />
            <Label
              htmlFor="remember"
              className="text-base text-muted-foreground"
            >
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-base text-primary hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <SubmitButton
          className="w-full py-6 px-6 text-xl font-medium rounded-lg shadow-md transition-colors mt-6"
          pendingText="Signing in..."
        >
          Sign In
        </SubmitButton>

        {/* Switch to Signup */}
        <p className="text-center text-base text-muted-foreground mt-6">
          New to our platform?{" "}
          <button
            type="button"
            onClick={switchToSignup}
            className="text-primary hover:underline font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>
    </form>
  );
}
