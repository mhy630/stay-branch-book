import { useMemo, useState } from "react";
import { useBackendData, type BackendBranch, type BackendApartment, type BackendRoom } from "@/hooks/useBackendData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bath, BedDouble, Building2, MapPin, Users } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/config";
import { useNavigate } from "react-router-dom";

const makeWhatsAppLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const BranchExplorer = () => {
  const { branches, rooms, loading } = useBackendData();
  const [active, setActive] = useState("");

  // Sort branches by created_at in ascending order (oldest first)
  const sortedBranches = useMemo(() => {
    return [...branches].sort((a, b) => {
      return a.created_at.localeCompare(b.created_at);
    });
  }, [branches]);

  // Sort apartments and rooms within each branch by created_at in ascending order (oldest first)
  const sortedBranchesWithData = useMemo(() => {
    return sortedBranches.map(branch => ({
      ...branch,
      apartments: [...branch.apartments].sort((a, b) => {
        return a.created_at.localeCompare(b.created_at);
      }),
      rooms: [...(branch.rooms || [])].sort((a, b) => {
        return a.created_at.localeCompare(b.created_at);
      })
    }));
  }, [sortedBranches]);

  // Get all rooms sorted by created_at
  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => {
      return a.created_at.localeCompare(b.created_at);
    });
  }, [rooms]);

  // Set first branch (oldest) as active when data loads
  useMemo(() => {
    if (sortedBranchesWithData.length > 0 && !active) {
      setActive(sortedBranchesWithData[0].id);
    }
  }, [sortedBranchesWithData, active]);

  const activeBranch = useMemo(() => 
    sortedBranchesWithData.find(b => b.id === active) ?? sortedBranchesWithData[0], 
    [active, sortedBranchesWithData]
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

  if (sortedBranchesWithData.length === 0) {
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
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Branches, Rooms & Apartments</h2>
      </header>

      <Tabs value={active} onValueChange={setActive} className="w-full">
        <TabsList className="mx-auto">
          {sortedBranchesWithData.map((b) => (
            <TabsTrigger key={b.id} value={b.id}>{b.name}</TabsTrigger>
          ))}
        </TabsList>
        {sortedBranchesWithData.map((b) => (
          <TabsContent key={b.id} value={b.id} className="pt-6">
            <div className="space-y-8">
              {/* Rooms Section */}
              {b.rooms.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Available Rooms</h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {b.rooms.map((room) => (
                      <RoomCard key={room.id} branchName={b.name} room={room} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Apartments Section */}
              {b.apartments.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Apartments</h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {b.apartments.map((apt) => (
                      <ApartmentCard key={apt.id} branchName={b.name} apartment={apt} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

const RoomCard = ({ room, branchName }: { room: BackendRoom; branchName: string }) => {
  const roomMsg = `Hello! I'm interested in booking the room "${room.name}" at the ${branchName} branch.`;

  return (
    <Card className="group overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{room.name}</span>
          <Users className="opacity-60" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2"><Users className="opacity-70" />{room.capacity} People</div>
          <div className="flex items-center gap-2"><MapPin className="opacity-70" />{branchName}</div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground"><span className="font-semibold text-orange-500">₨{room.price_per_night}</span>/night</p>
      </CardContent>
      <CardFooter className="flex items-center justify-end">
        <Button 
          variant="outline"
          size="lg"
          className="rounded-full border-2 border-green-500 text-green-500 bg-white hover:bg-green-50 hover:border-green-500 hover:text-green-500 transition-transform duration-300 transform hover:-translate-y-1"
          asChild
        >
          <a href={makeWhatsAppLink(roomMsg)} target="_blank" rel="noopener noreferrer" aria-label={`Book room ${room.name} on WhatsApp`}>
            Book Now
          </a>
        </Button>
      </CardFooter>
    </Card>
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