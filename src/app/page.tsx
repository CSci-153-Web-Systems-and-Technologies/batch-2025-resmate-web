'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, FileText, Edit3, MessageCircle } from "lucide-react";
import { FeatureCard } from './components/feature-card';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <section className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Resmate — Thesis submission, annotation, and feedback</h1>
          <p className="text-muted-foreground mb-6">Submit thesis documents, annotate inline feedback, and collaborate with examiners and peers — all in one place.</p>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>

            <Link href="/register">
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-br from-white/60 to-sky-50 rounded-2xl p-6 shadow-lg">
          <div className="w-full h-64 flex items-center justify-center">
            <svg viewBox="0 0 600 400" className="w-full h-full max-w-md" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="60" width="260" height="220" rx="12" fill="#eef2ff" />
              <rect x="320" y="40" width="240" height="300" rx="12" fill="#fff7ed" />
              <path d="M60 140h180" stroke="#7c3aed" strokeWidth="6" strokeLinecap="round"/>
              <path d="M60 180h140" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="450" cy="120" r="28" fill="#0ea5e9" />
              <path d="M430 110l36 20" stroke="#0369a1" strokeWidth="4" strokeLinecap="round"/>
              <text x="60" y="40" fill="#111827" fontSize="20" fontWeight="700">Submission</text>
              <text x="320" y="20" fill="#111827" fontSize="20" fontWeight="700">Annotation</text>
            </svg>
          </div>
        </div>
      </section>

      <section className="max-w-5xl w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard title="Document Submission" icon={<FileText className="h-5 w-5"/>}>
          Upload thesis drafts, manage versions, and track submissions.
        </FeatureCard>

        <FeatureCard title="Inline Annotation" icon={<Edit3 className="h-5 w-5"/>}>
          Annotate PDFs and text with comments, highlights, and suggestions.
        </FeatureCard>

        <FeatureCard title="Feedback & Collaboration" icon={<MessageCircle className="h-5 w-5"/>}>
          Receive structured feedback from advisors and peers with threaded discussions.
        </FeatureCard>
      </section>
    </main>
  )
}
