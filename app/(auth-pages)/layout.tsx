"use client";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
<div className="min-h-screen flex bg-gray-50 dark:bg-black">
  {/* Left side - Image with text overlay */}
  <div className="hidden md:flex md:w-2/3 relative">
    {/* Background image */}
    <img 
      src="https://images.unsplash.com/photo-1690788210614-9052cffd8a14?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Person working on laptop"
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-white/20 dark:from-gray-900/40 dark:to-black/40" />
    {/* Text content */}
    <div className="relative z-10 flex items-right p-20 w-full">
        <div className="max-w-lg space-y-6">
         <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Study Smarter, Not Harder
        </h1>
        </div>
    </div>
    </div>

      {/* Right side - Dynamic content (login/signup forms or forgot-password form*/}
      <div className="w-full md:w-1/3 flex items-center justify-center p-4 md:p-8 bg-background overflow-y-auto">
        {children}
      </div>
    </div>
  );
}