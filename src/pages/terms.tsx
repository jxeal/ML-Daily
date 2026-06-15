import { AppLayout } from "@/components/layout/app-layout";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold">Terms of Service</h1>
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using our application, you accept and agree to be bound by the terms and
            provision of this agreement.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. User Account</h2>
          <p>
            You may be required to register with us in order to access certain services or areas of the Site. 
            You are responsible for maintaining the confidentiality of your account and password and for 
            restricting access to your computer.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Intellectual Property</h2>
          <p>
            The educational content, lessons, graphics, and interface are our proprietary property and 
            are protected by copyright and intellectual property laws.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Acceptable Use</h2>
          <p>
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Use the Service for any illegal purpose</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Limitation of Liability & Technical Disclaimer</h2>
          <p>
            The educational content, code snippets, and machine learning tutorials provided on this platform are for educational purposes only. We provide no guarantees regarding the accuracy or stability of code provided. Any code or model training run on your local hardware is done entirely at your own risk. We are not liable for any system crashes, hardware overheating, or data loss that may occur.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Anti-Scraping & Data Extraction</h2>
          <p>
            You are strictly prohibited from using automated systems, bots, spiders, or scrapers to extract curriculum text, code snippets, datasets, or user information from the Service, including for the purpose of training third-party machine learning models or large language models (LLMs).
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
