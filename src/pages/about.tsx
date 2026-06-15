import { AppLayout } from "@/components/layout/app-layout";
import { Link } from "wouter";
import { Info } from "lucide-react";

export default function About() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Info className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold">About Us</h1>
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Welcome to our machine learning education platform. Our mission is to make ML concepts
            accessible, engaging, and practical for everyone, regardless of their background.
          </p>
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Our Vision</h2>
          <p>
            We believe that understanding artificial intelligence and machine learning is crucial for
            the future. By breaking down complex topics into bite-sized, interactive lessons, we aim
            to empower the next generation of builders, thinkers, and innovators.
          </p>
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Interactive, gamified learning experiences</li>
            <li>Comprehensive curriculum covering fundamentals to advanced topics</li>
            <li>Hands-on practice problems to reinforce concepts</li>
            <li>A supportive community of learners and educators</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
