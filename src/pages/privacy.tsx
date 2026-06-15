import { AppLayout } from "@/components/layout/app-layout";
import { Shield } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold">Privacy Policy</h1>
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create or modify your
            account, contact customer support, or otherwise communicate with us. This information may
            include: name, email, avatar, and learning progress.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Track your learning progress and award achievements</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse
            and unauthorized access, disclosure, alteration and destruction.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please <Link href="/contact" className="text-primary underline hover:italic">contact us</Link>.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Cookies and Tracking Technologies</h2>
          <p>
            We may use cookies and similar tracking technologies (such as session identifiers) to keep you logged into your account and to analyze platform traffic. You can control cookie preferences through your browser settings, though disabling them may limit your ability to use certain features of the platform.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Your Data Rights and Deletion</h2>
          <p>
            You have the right to access, update, or delete the personal information we hold about you. If you wish to delete your account and remove your data (including your email and learning progress) from our servers, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
