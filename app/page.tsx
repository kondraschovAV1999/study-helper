// app.page.tsx -- Root page @ /
import Link from "next/link";
import { BookOpen, FileText, ClipboardList, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { LandingHeader } from "@/components/landing-header"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Create & Log in header */}
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
              <Link href="/auth?signup=true">
                <Button size="lg">Sign up for free</Button>
              </Link>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 w-full">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Study Guides Card */}
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 mx-auto">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-center">Study Guides</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <p>AI-generated custom study guides from your uploads</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <p>Key points organized for clarity and focus</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <p>Edit, expand, or simplify — your way</p>
                </div>
              </CardContent>
            </Card>

            {/* Flashcards Card */}
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 mx-auto">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-center">Flashcards</h3>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <p>Master topics faster with flashcards</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <p>Spaced reptition just for you</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <p>Generated from your own study materials</p>
                </div>
              </CardContent>
            </Card>

            {/* Practice Tests Card */}
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 mx-auto">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-center">Practice Tests</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <p>Ace your exams with practice tests</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <p>Get personalized difficulty adjustments</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <p>Instant feedback with concept</p>
                </div>
              </CardContent>
            </Card>
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
            <Link href="/auth">
              <Button size="lg" className="gap-2">
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