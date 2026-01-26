import React from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail } from "lucide-react";
import { Helmet } from "react-helmet-async";

import { useForm, ValidationError } from "@formspree/react";
import { toast } from "sonner";

const Contact = () => {
  const [state, handleSubmit] = useForm("mzdrdqlo");

  React.useEffect(() => {
    if (state.succeeded) {
      toast.success("Message sent! We'll get back to you soon.");
      console.log("Form submitted successfully");
    }
    if (state.errors) {
      console.error("Formspree Error Details:", state.errors);
      // Safe fallback for error message display
      toast.error("Failed to send message. Please check the console for details.");
    }
  }, [state.succeeded, state.errors]);

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      content: "San Francisco, Camotes, Cebu, Philippines",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+63 123 456 7890",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@sanfrancisco.com",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact Us | San Francisco - Discover Paradise in Cebu</title>
      </Helmet>

      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-playfair text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about the Town of San Francisco? We'd love to hear from you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* LEFT: FORM */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-card p-8 rounded-lg shadow-medium">
                <h2 className="text-2xl font-bold font-playfair text-foreground mb-6">
                  Send us a Message
                </h2>

                {/* ✅ FORM SUBMISSION GOES TO FORMSPREE */}
                <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                  {/* optional: fixed email subject for inbox readability */}
                  <input
                    type="hidden"
                    name="_subject"
                    value="New message from Suroy-Suroy San Francisco Contact Form"
                  />

                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="mt-2"
                    />
                    <ValidationError prefix="Name" field="name" errors={state.errors} />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="_replyto"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      className="mt-2"
                    />
                    <ValidationError prefix="Email" field="_replyto" errors={state.errors} />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What's this about?"
                      required
                      className="mt-2"
                    />
                    <ValidationError prefix="Subject" field="subject" errors={state.errors} />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more..."
                      rows={6}
                      required
                      className="mt-2"
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={state.submitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    {state.submitting ? "Sending..." : "Send Message"}
                  </Button>

                  {state.succeeded && (
                    <p className="text-sm text-muted-foreground text-center">
                      Thanks! Your message has been sent.
                    </p>
                  )}
                </form>
              </div>
            </motion.div>

            {/* RIGHT SIDE */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-card p-8 rounded-lg shadow-medium">
                <h2 className="text-2xl font-bold font-playfair text-foreground mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.title} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                        <p className="text-muted-foreground">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card p-8 rounded-lg shadow-medium">
                <h2 className="text-2xl font-bold font-playfair text-foreground mb-4">
                  Visit Us
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Planning a trip to San Francisco, Camotes? Our tourism office can help you plan
                  the perfect itinerary and provide information about local accommodations,
                  transportation, and activities.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Office Hours: Monday - Friday, 8:00 AM - 5:00 PM (Philippine Time)
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
