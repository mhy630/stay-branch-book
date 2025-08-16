import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Seo } from "@/components/Seo";
import { WHATSAPP_NUMBER } from "@/config";

const About = () => {
  const title = "About Raye Kam-Kiraye — Affordable Accommodation Solutions";
  const description = "Learn about our mission to provide quality, budget-friendly accommodation across multiple branches. Affordable stays without compromising on comfort.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Raye Kam-Kiraye",
    url: typeof window !== 'undefined' ? window.location.origin : undefined,
    description: "Affordable accommodation solutions across multiple branches",
    sameAs: ["https://wa.me/" + WHATSAPP_NUMBER],
  } as const;

  return (
    <div>
      <Seo title={title} description={description} jsonLd={jsonLd} />
      
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-primary">Raye</span> Kam-Kiraye
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Making quality accommodation accessible to everyone through our network of affordable branches across the city.
          </p>
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              At <span className="text-primary font-semibold">Raye</span> Kam-Kiraye, we believe that everyone deserves access to clean, comfortable, and affordable accommodation. We've built our business around one simple principle: quality doesn't have to be expensive.
            </p>
            <p className="text-lg text-muted-foreground">
              We've carefully selected and maintained properties across multiple branches to ensure you get the best value for your money without compromising on essential amenities and comfort.
            </p>
          </div>
          <div className="bg-gradient-subtle rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <p className="text-muted-foreground">Affordable Properties</p>
            <div className="text-4xl font-bold text-primary mb-2 mt-6">10+</div>
            <p className="text-muted-foreground">City Branches</p>
            <div className="text-4xl font-bold text-primary mb-2 mt-6">1000+</div>
            <p className="text-muted-foreground">Happy Guests</p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">💰 Affordability First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We keep our prices low by working directly with property owners and eliminating unnecessary middlemen costs.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">🏠 Quality Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Every property is personally inspected to ensure cleanliness, safety, and essential amenities are maintained.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">📱 Easy Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Simple WhatsApp booking process means no hidden fees, no complicated platforms, just direct communication.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-muted/50 rounded-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-lg text-muted-foreground mb-4">
            <span className="text-primary font-semibold">Raye</span> Kam-Kiraye was founded with a simple observation: finding affordable, decent accommodation shouldn't be a luxury. Too many people were paying premium prices for basic needs or compromising on safety and cleanliness to save money.
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            We started by partnering with reliable property owners who shared our vision of providing honest, affordable accommodation. Today, we operate across multiple branches, each carefully selected for accessibility, safety, and value.
          </p>
          <p className="text-lg text-muted-foreground">
            Our direct booking approach through WhatsApp ensures transparent pricing and personal service, making your accommodation search as stress-free as possible.
          </p>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Affordable Stay?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our branches and discover quality accommodation that fits your budget. Get in touch via WhatsApp for instant availability and booking.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="whatsapp" size="lg" asChild>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to know more about your affordable accommodation options.')}`} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/">Browse Properties</a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;