import { useMemo, useState } from "react";
import { useBackendData, type BackendBranch, type BackendApartment } from "@/hooks/useBackendData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bath, BedDouble, Building2, MapPin, Eye } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WHATSAPP_NUMBER } from "@/config";
import { useNavigate } from "react-router-dom";

const makeWhatsAppLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const BranchExplorer = () => {
  const { branches, loading } = useBackendData();
  const [active, setActive] = useState("");

  // Set first branch as active when data loads
  useMemo(() => {
    if (branches.length > 0 && !active) {
      setActive(branches[0].id);
    }
  }, [branches, active]);

  const activeBranch = useMemo(() => branches.find(b => b.id === active) ?? branches[0], [active, branches]);

  if (loading) {
    return (
      <section className="container mx-auto py-12 md:py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading branches and apartments...</p>
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
              {b.apartments.map((apt) => (
                <ApartmentCard key={apt.id} branchName={b.name} apartment={apt} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

const ApartmentCard = ({ apartment, branchName }: { apartment: BackendApartment; branchName: string }) => {
  const navigate = useNavigate();
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
                 {apartment.rooms.map((room) => {
                   const msg = `Hello! I'm interested in booking the \"${room.name}\" in \"${apartment.name}\" at the ${branchName} branch.`;
                   return (
                     <li key={room.id} className="flex items-center justify-between rounded-md border p-3">
                       <div className="space-y-1">
                         <p className="font-medium">{room.name}</p>
                         <p className="text-sm text-muted-foreground">Sleeps {room.capacity} • ${room.price_per_night}/night</p>
                       </div>
                      <Button variant="whatsapp" asChild>
                        <a href={makeWhatsAppLink(msg)} target="_blank" rel="noopener noreferrer" aria-label={`Book ${room.name} on WhatsApp`}>
                          Book Room
                        </a>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/apartment/${apartment.id}`)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button variant="whatsapp" asChild>
            <a href={makeWhatsAppLink(aptMsg)} target="_blank" rel="noopener noreferrer" aria-label={`Book apartment ${apartment.name} on WhatsApp`}>
              Book Now
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
