// app.page.tsx -- Root page @ /
// This is the main entry point for the app. It contains the landing page and the main content of the app.
import Link from "next/link";
import { BookOpen, FileText, ClipboardList, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing-header"
import { FeatureCard } from "@/components/feature-card";

const FEATURES = [
  {
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    title: "Study Guides",
    features: [
      "AI-generated custom study guides from your uploads",
      "Key points organized for clarity and focus",
      "Edit, expand, or simplify — your way"
    ]
  },
  {
    icon: <FileText className="w-6 h-6 text-primary" />,
    title: "Flashcards",
    features: [
      "Master topics faster with flashcards",
      "Spaced repetition just for you",
      "Generated from your own study materials"
    ]
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-primary" />,
    title: "Practice Tests",
    features: [
      "Ace your exams with practice tests",
      "Get personalized difficulty adjustments",
      "Instant feedback with concept"
    ]
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Create & Log in header using landing-header component*/}
      <LandingHeader/>

      {/* Main Content*/}
      <main className= "flex-1">
      {/* Hero Section */}
        <section className="text-center py-12 pt-24">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Need to Study?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Master whatever you're learning with AI-powered flashcards, practice tests, and personalized study activities.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="text-base">
                  Sign up for free
                </Button>
              </Link>
            </div>
        </section>

        {/* Features Section using feature-card component*/}
        <section className="py-16 px-4 w-full">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-background w-full">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Every subject, every test - one powerful AI study assistant
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Create your own study materials or let our AI generate them for you. Study anytime, anywhere with your personal learning companion.
            </p>
            <Link href="/login">
              <Button size="lg" className="text-base gap-2">
                Get Started
                <Sparkles className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}