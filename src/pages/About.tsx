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
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            About <span className="text-primary">Raye</span> Kam-Kiraye
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're more than accommodation - we're your trusted friends in hospitality, creating warm, welcoming experiences at honest, affordable prices.
          </p>
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              At <span className="text-primary font-semibold">Raye</span> Kam-Kiraye, we believe everyone deserves a warm welcome and a place that feels like home. We've built our business on genuine hospitality, trustworthy service, and honest pricing that everyone can afford.
            </p>
            <p className="text-lg text-muted-foreground">
              Our friendly approach means treating every guest like family, while our commitment to affordability ensures quality stays are accessible to all.
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
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Why Trust Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">🤝 Genuine Hospitality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We treat every guest like family, creating a warm, welcoming environment that makes you feel instantly at home.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">💰 Honest Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Transparent, affordable rates with no hidden costs - what you see is what you pay, always.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">🛡️ Trustworthy Service</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Reliable, consistent quality across all locations with personal attention to your needs and comfort.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-muted/50 rounded-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-heading font-bold mb-6">Our Story</h2>
          <p className="text-lg text-muted-foreground mb-4">
            <span className="text-primary font-semibold">Raye</span> Kam-Kiraye was born from a simple belief: hospitality should be warm, welcoming, and affordable for everyone. We saw too many travelers feeling like just another transaction rather than valued guests.
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            We built our network of trusted partners who share our commitment to genuine hospitality and honest pricing. Each location is carefully chosen not just for affordability, but for the warm, friendly atmosphere we're known for.
          </p>
          <p className="text-lg text-muted-foreground">
            Today, we're proud to be the trustworthy choice for guests who want to feel genuinely welcomed while staying within their budget.
          </p>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">Ready to Experience Our Hospitality?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover a welcoming place to stay that feels like home, with honest pricing and friendly service. Contact us on WhatsApp for a warm, personal booking experience.
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