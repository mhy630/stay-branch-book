import hero from "@/assets/hero-apartment.jpg";
import { Button } from "@/components/ui/button";
import { BranchExplorer } from "@/components/BranchExplorer";
import { Seo } from "@/components/Seo";
import { WHATSAPP_NUMBER } from "@/config";

const Index = () => {
  const brand = "Raye Kam-Kiraye";
  const title = `${brand} — Affordable Apartments & Rooms across Branches`;
  const description = "Find budget-friendly branches, browse affordable apartments and rooms, and book via WhatsApp in one click.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand,
    url: typeof window !== 'undefined' ? window.location.origin : undefined,
    sameAs: ["https://wa.me/" + WHATSAPP_NUMBER],
  } as const;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div>
      <Seo title={title} description={description} image={hero} jsonLd={jsonLd} />

      <section className="relative overflow-hidden">
        <div className="bg-hero">
          <div className="container mx-auto px-6 py-20 md:py-28" onMouseMove={onMouseMove}>
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">Affordable stays, easy booking</p>
                <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight text-foreground">
                  Affordable stays with <span className="text-primary">Raye</span> Kam-Kiraye
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-prose">Discover budget-friendly apartments and rooms across our branches. Quality accommodation at prices that won't break the bank. Book easily via WhatsApp.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button variant="whatsapp" size="lg" asChild>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to know more about availability.')}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="#explore">Explore Branches</a>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img src={hero} alt="Modern apartment interior hero image" loading="lazy" className="w-full rounded-lg shadow-elegant" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="explore">
        <BranchExplorer />
      </div>
    </div>
  );
};

export default Index;
