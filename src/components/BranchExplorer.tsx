import { useMemo, useState } from "react";
import { useBackendData, type BackendBranch, type BackendApartment } from "@/hooks/useBackendData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bath, BedDouble, Building2, MapPin } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/config";
import { useNavigate } from "react-router-dom";

const makeWhatsAppLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const BranchExplorer = () => {
  const { branches, loading } = useBackendData();
  const [active, setActive] = useState("");

  // Sort branches by created_at in ascending order (oldest first)
  const sortedBranches = useMemo(() => {
    return [...branches].sort((a, b) => {
      return a.created_at.localeCompare(b.created_at);
    });
  }, [branches]);

  // Sort apartments within each branch by created_at in ascending order (oldest first)
  const sortedBranchesWithApartments = useMemo(() => {
    return sortedBranches.map(branch => ({
      ...branch,
      apartments: [...branch.apartments].sort((a, b) => {
        return a.created_at.localeCompare(b.created_at);
      })
    }));
  }, [sortedBranches]);

  // Set first branch (oldest) as active when data loads
  useMemo(() => {
    if (sortedBranchesWithApartments.length > 0 && !active) {
      setActive(sortedBranchesWithApartments[0].id);
    }
  }, [sortedBranchesWithApartments, active]);

  const activeBranch = useMemo(() => 
    sortedBranchesWithApartments.find(b => b.id === active) ?? sortedBranchesWithApartments[0], 
    [active, sortedBranchesWithApartments]
  );

  if (loading) {
    return (
      <section className="container mx-auto py-12 md:py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading branches and apartments...</p>
        </div>
      </section>
    );
  }

  if (sortedBranchesWithApartments.length === 0) {
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
          {sortedBranchesWithApartments.map((b) => (
            <TabsTrigger key={b.id} value={b.id}>{b.name}</TabsTrigger>
          ))}
        </TabsList>
        {sortedBranchesWithApartments.map((b) => (
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
  const aptMsg = `Hello! I'm interested in booking the apartment "${apartment.name}" at the ${branchName} branch.`;

  const handleCardClick = () => {
    navigate(`/apartment/${apartment.id}`);
  };

  return (
    <Card 
      className="group overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{apartment.name}</span>
          <Building2 className="opacity-60" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2"><BedDouble className="opacity-70" />{apartment.bedrooms} Beds</div>
          <div className="flex items-center gap-2"><Bath className="opacity-70" />{apartment.bathrooms} Baths</div>
          <div className="flex items-center gap-2"><MapPin className="opacity-70" />{branchName}</div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground"><span className="font-semibold text-orange-500">₨{apartment.price_per_night}</span>/night</p>
      </CardContent>
      <CardFooter className="flex items-center justify-end">
        <Button 
          variant="outline"
          size="lg"
          className="rounded-full border-2 border-green-500 text-green-500 bg-white hover:bg-green-50 hover:border-green-500 hover:text-green-500 transition-transform duration-300 transform hover:-translate-y-1"
          asChild 
          onClick={(e) => e.stopPropagation()}
        >
          <a href={makeWhatsAppLink(aptMsg)} target="_blank" rel="noopener noreferrer" aria-label={`Book apartment ${apartment.name} on WhatsApp`}>
            Book Now
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};