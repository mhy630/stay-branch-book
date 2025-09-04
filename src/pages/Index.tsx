import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { BranchExplorer } from "@/components/BranchExplorer";
import { Seo } from "@/components/Seo";
import { WHATSAPP_NUMBER } from "@/config";

const Index = () => {
  const brand = "Raye Kam-Kiraye";
  const title = `${brand} — Affordable Apartments & Rooms across Branches`;
  const description =
    "Find budget-friendly branches, browse affordable apartments and rooms, and book via WhatsApp in one click.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand,
    url: typeof window !== "undefined" ? window.location.origin : undefined,
    sameAs: ["https://wa.me/" + WHATSAPP_NUMBER],
  } as const;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty(
      "--mx",
      `${((e.clientX - rect.left) / rect.width) * 100}%`
    );
    el.style.setProperty(
      "--my",
      `${((e.clientY - rect.top) / rect.height) * 100}%`
    );
  };

  return (
    <div>
      <Seo
        title={title}
        description={description}
        image={hero}
        jsonLd={jsonLd}
      />

      <section className="relative overflow-hidden">
        <div className="bg-hero">
          <div
            className="container mx-auto px-6 py-12 md:py-16"
            onMouseMove={onMouseMove}
          >
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div className="space-y-6 transition-transform duration-300 transform hover:-translate-y-1">
                <h1 className="mt-3 text-4xl md:text-5xl font-heading font-bold leading-tight text-foreground">
                  Raye-<span className="text-primary">Kam Kiraye</span>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-prose transition-transform duration-300 transform hover:-translate-y-1">
                  Why pay more for less? Stay Raye.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-2 border-green-500 text-green-500 bg-white hover:bg-green-50 hover:border-green-500 hover:text-green-500 transition-transform duration-300 transform hover:-translate-y-1"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        "Hi! I want to know more about availability."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat on WhatsApp
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-black transition-transform duration-300 transform hover:-translate-y-1"
                    asChild
                  >
                    <a href="#explore">Explore Branches</a>
                  </Button>
                </div>
              </div>
              <div className="relative w-full h-[70vh]">
                <img
                  src={hero}
                  alt="Modern apartment interior hero image"
                  loading="lazy"
                  className="w-full h-full rounded-lg shadow-elegant object-cover transition-transform duration-300 transform hover:-translate-y-1"
                />
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
