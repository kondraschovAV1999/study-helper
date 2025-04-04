"use client";

// This component is used in the right side of the login/page.tsx, which is the dynamic part that changes between login and signup forms.
// It contains the logic to switch between the two forms based on user interaction with the toggle buttons.
import { useState } from 'react';
import { SignInForm } from './signIn-form';
import { SignUpForm } from './signUp-form';

export function RightSideAuthForm() {
  const [activeForm, setActiveForm] = useState<'signin' | 'signup'>('signin');

  return (
    //this is the container for the entire form, including the toggle buttons and the form itself.
    <div className="w-full max-w-xl">
      {/* Toggle Switches */}
      <div className="flex justify-center space-x-20 mb-10">
        <button
          onClick={() => setActiveForm('signin')}
          className={`w-48 py-3 text-lg font-medium rounded-lg transition-all ${
            activeForm === 'signin'
              ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveForm('signup')}
          className={`w-48 py-3 text-lg font-medium rounded-lg transition-all ${
            activeForm === 'signup'
              ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form Container */}
      {activeForm === 'signup' ? (
        <SignUpForm switchToSignin={() => setActiveForm('signin')} />
      ) : (
        <SignInForm switchToSignup={() => setActiveForm('signup')} />
      )}
    </div>
  );
}