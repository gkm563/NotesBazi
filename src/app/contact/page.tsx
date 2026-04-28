import { Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have questions about NotesBazi? Want to report a bug or suggest a feature? 
            We're here to help the UIT Prayagraj community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-indigo-600 text-white rounded-3xl p-4">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription className="text-indigo-100">Feel free to reach out via any channel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="flex gap-4 items-center">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-100">Email us at</p>
                    <p className="font-bold">support@notesbazi.com</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-100">Location</p>
                    <p className="font-bold">United Institute of Technology, Prayagraj</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-100">Feedback</p>
                    <p className="font-bold">Via our online form</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Response Time</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                We usually respond to all feedback within 24-48 hours. Your input helps us make NotesBazi better for everyone!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl bg-white dark:bg-slate-800 rounded-3xl p-4">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="Gautam" className="rounded-2xl py-6" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Kumar" className="rounded-2xl py-6" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="gautam@uit.com" className="rounded-2xl py-6" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Bug Report / Suggestion" className="rounded-2xl py-6" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="How can we help you?" className="rounded-2xl min-h-[150px] p-4" />
                  </div>
                  <Button className="w-full sm:w-auto px-10 py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg shadow-indigo-500/20">
                    Send Message <Send size={20} className="ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
