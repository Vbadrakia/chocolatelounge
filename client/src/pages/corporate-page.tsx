import React from "react";
import Navbar from "../../components/navbar"; // Corrected to match the file name
import Footer from "../../components/Footer"; // Correct
import { Button } from "../../components/ui/button"; // Correct
import { Card, CardContent } from "../../components/ui/card"; // Correct
import { useToast } from "../../hooks/use-toast"; // Correct
import { Building2, Gift, Package, Mail, Phone } from "lucide-react";
import { Input } from "../../components/ui/input"; // Correct
import { Textarea } from "../../components/ui/textarea"; // Correct

export default function CorporatePage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Enquiry Submitted",
      description: "We'll get back to you within 24 hours!",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[400px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600857544200-b2f666a9a2ce)' }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 relative text-white">
          <h1 className="text-4xl md:text-5xl font-playfair mb-4">
            Corporate Gifting Solutions
          </h1>
          <div className="text-xl max-w-xl">
            Premium chocolate gifts for your business partners, clients, and employees
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Building2 className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-medium mb-2">Bulk Orders</h3>
                  <p className="text-muted-foreground">
                    Special pricing for large corporate orders with customizable options
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Gift className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-medium mb-2">Custom Branding</h3>
                  <p className="text-muted-foreground">
                    Add your company logo and personalized messages to gift boxes
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Package className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-medium mb-2">Nationwide Delivery</h3>
                  <p className="text-muted-foreground">
                    Reliable delivery service across the country for your convenience
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-playfair text-center mb-8">
              Get in Touch
            </h2>
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name">Company Name</label>
                      <Input id="name" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact">Contact Person</label>
                      <Input id="contact" required />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email">Email</label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone">Phone</label>
                      <Input id="phone" type="tel" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message">Message</label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your requirements..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Enquiry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-playfair mb-8">Direct Contact</h2>
            <div className="space-y-4">
              <p className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5" />
                corporate@luxurychocolates.com
              </p>
              <p className="flex items-center justify-center gap-2">
                <Phone className="h-5 w-5" />
                +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
