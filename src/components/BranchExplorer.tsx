import { useMemo, useState, useEffect } from "react";
import { useBranches, type Branch, type Apartment, type Room } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bath, BedDouble, Building2, MapPin, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WHATSAPP_NUMBER } from "@/config";

const makeWhatsAppLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const BranchExplorer = () => {
  const { branches, loading, error } = useBranches();
  const [active, setActive] = useState("");

  // Set default active branch when branches are loaded
  useEffect(() => {
    if (branches.length > 0 && !active) {
      setActive(branches[0].id);
    }
  }, [branches, active]);

  const activeBranch = useMemo(() => branches.find(b => b.id === active) ?? branches[0], [active, branches]);

  if (loading) {
    return (
      <section className="container mx-auto py-12 md:py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading branches...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto py-12 md:py-16">
        <div className="text-center">
          <p className="text-destructive">Error loading branches: {error}</p>
        </div>
      </section>
    );
  }

  if (branches.length === 0) {
    return (
      <section className="container mx-auto py-12 md:py-16">
        <div className="text-center">
          <p className="text-muted-foreground">No branches available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-12 md:py-16">
      <header className="mb-8 text-center">
        <p className="text-sm text-muted-foreground">Explore our locations</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Branches and Apartments</h2>
      </header>

      <Tabs value={active} onValueChange={setActive} className="w-full">
        <TabsList className="mx-auto">
          {branches.map((b) => (
            <TabsTrigger key={b.id} value={b.id}>{b.name}</TabsTrigger>
          ))}
        </TabsList>
        {branches.map((b) => (
          <TabsContent key={b.id} value={b.id} className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {b.apartments?.map((apt) => (
                <ApartmentCard key={apt.id} branchName={b.name} apartment={apt} />
              ))}
              {(!b.apartments || b.apartments.length === 0) && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No apartments available in this branch.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

const ApartmentCard = ({ apartment, branchName }: { apartment: Apartment; branchName: string }) => {
  const aptMsg = `Hello! I'm interested in booking the apartment \"${apartment.name}\" at the ${branchName} branch.`;
  return (
    <Card className="group overflow-hidden transition-transform duration-300 hover:-translate-y-0.5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{apartment.name}</span>
          <Building2 className="opacity-60" />
        </CardTitle>
        <CardDescription className="line-clamp-2">{apartment.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2"><BedDouble className="opacity-70" />{apartment.bedrooms} bd</div>
          <div className="flex items-center gap-2"><Bath className="opacity-70" />{apartment.bathrooms} ba</div>
          <div className="flex items-center gap-2"><MapPin className="opacity-70" />{branchName}</div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">From <span className="font-semibold text-foreground">${apartment.price_per_night}</span>/night (entire apartment)</p>

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="rooms">
            <AccordionTrigger>View rooms & book individually</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3">
                {apartment.rooms?.map((room) => {
                  const msg = `Hello! I'm interested in booking the \"${room.name}\" in \"${apartment.name}\" at the ${branchName} branch.`;
                  return (
                    <li key={room.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="space-y-1">
                        <p className="font-medium">{room.name}</p>
                        <p className="text-sm text-muted-foreground">Sleeps {room.capacity} • ${room.price_per_night}/night</p>
                      </div>
                      <Button variant="default" asChild>
                        <a href={makeWhatsAppLink(msg)} target="_blank" rel="noopener noreferrer" aria-label={`Book ${room.name} on WhatsApp`}>
                          Book Room
                        </a>
                      </Button>
                    </li>
                  );
                })}
                {(!apartment.rooms || apartment.rooms.length === 0) && (
                  <p className="text-sm text-muted-foreground">No individual rooms available for booking.</p>
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Entire apartment</p>
          <p className="text-lg font-semibold">${apartment.price_per_night}/night</p>
        </div>
        <Button variant="default" asChild>
          <a href={makeWhatsAppLink(aptMsg)} target="_blank" rel="noopener noreferrer" aria-label={`Book apartment ${apartment.name} on WhatsApp`}>
            Book Apartment
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
