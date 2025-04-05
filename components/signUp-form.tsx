"use client";
{
  /* This component is used in the RightSideAuthForm component to render the sign-up form. */
}
{
  /* Signup form is available via toggle buttons in the RightSideAuthForm component */
}

import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signUpAction } from "@/app/actions";
import { useState } from "react";

interface SignUpFormProps {
  switchToSignin: () => void;
}

{
  /* Form Fields for signing up */
}
{
  /* The switchToSignin function is passed as a prop to switch to the login form when needed */
}
export function SignUpForm({ switchToSignin }: SignUpFormProps) {
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = await signUpAction(formData);
    if (result && result.success === false) {
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 p-10 bg-background rounded-xl shadow-lg border">
        <h2 className="text-4xl font-bold text-center">Sign up</h2>

        {/* First name & lastname fields*/}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-lg font-medium mb-2">
                First Name
              </Label>
              <Input
                name="firstName"
                type="text"
                placeholder="John"
                className="w-full bg-secondary border rounded-lg p-6 text-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <Label className="block text-lg font-medium mb-2">
                Last Name
              </Label>
              <Input
                name="lastName"
                type="text"
                placeholder="Doe"
                className="w-full bg-secondary border rounded-lg p-6 text-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Birthday Selector */}
          <div className="space-y-2">
            <Label className="block text-lg font-medium">Birthday</Label>
            <div className="grid grid-cols-3 gap-4">
              {/* Month */}
              <select
                name="birthMonth"
                className="bg-secondary border rounded-lg p-3 text-lg focus:ring-2 focus:ring-primary"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Month
                </option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>

              {/* Day */}
              <select
                name="birthDay"
                className="bg-secondary border rounded-lg p-3 text-lg focus:ring-2 focus:ring-primary"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Day
                </option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              {/* Year */}
              <select
                name="birthYear"
                className="bg-secondary border rounded-lg p-3 text-lg focus:ring-2 focus:ring-primary"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Year
                </option>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Email */}
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
              autoComplete="new-password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <Label className="block text-lg font-medium mb-2">
              Confirm Password
            </Label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="w-full bg-secondary border rounded-lg p-6 text-lg focus:ring-2 focus:ring-primary"
              autoComplete="new-password"
              required
            />
          </div>
        </div>
        {error && <p className="text-red-600">{error}</p>}

        {/* Submit Button */}
        <SubmitButton
          className="w-full py-6 px-6 text-xl font-medium rounded-lg shadow-md transition-colors mt-6"
          pendingText="Creating account..."
        >
          Create Account
        </SubmitButton>

        {/* Switch to Login */}
        <p className="text-center text-base text-muted-foreground mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={switchToSignin}
            className="text-primary hover:underline font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
}
