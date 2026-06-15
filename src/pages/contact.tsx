import { AppLayout } from "@/components/layout/app-layout";
import { MessageSquare, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold">Contact Us</h1>
        </div>

        <p className="text-muted-foreground mb-12 text-lg">
          Have a question, feedback, or need support? We'd love to hear from you. 
          Fill out the form below, join our community, or email us directly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:knowledgerealm98@gmail.com" className="hover:text-primary underline transition-colors">
                    knowledgerealm98@gmail.com
                  </a>
                </p>
                <p className="text-sm text-muted-foreground mt-1">We usually respond within 24 hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Community Discord</h3>
                <p className="text-muted-foreground">Join our active learning community for real-time help, discussions, and updates.</p>
                <Button variant="link" className="px-0 h-auto font-medium mt-2">
                  Join the Server
                </Button>
              </div>
            </div>
            
            <div className="bg-card/50 border rounded-2xl p-6 mt-8">
              <h3 className="font-bold mb-2">How we handle messages</h3>
              <p className="text-sm text-muted-foreground">
                When you use our contact form, your message is routed directly to our team securely. We usually respond within 24-48 hours via the e-mail address you provide.
              </p>
            </div>
          </div>

          {/* Contact Form Placeholder */}
          <div className="bg-card border shadow-sm rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Send a Message
            </h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <Button type="submit" className="w-full font-bold">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
