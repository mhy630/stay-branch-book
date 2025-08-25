import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bath, BedDouble, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WHATSAPP_NUMBER } from "@/config";
import { Seo } from "@/components/Seo";

interface ApartmentData {
  id: string;
  name: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  price_per_night: number;
  image?: string;
  branches: {
    name: string;
    city: string;
    address: string;
  };
  rooms: Array<{
    id: string;
    name: string;
    capacity: number;
    price_per_night: number;
    image?: string;
  }>;
}

const makeWhatsAppLink = (message: string) => 
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export default function ApartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apartment, setApartment] = useState<ApartmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all images (apartment + room images)
  const allImages = apartment ? [
    ...(apartment.image ? [apartment.image] : []),
    ...apartment.rooms.filter(room => room.image).map(room => room.image!)
  ] : [];

  useEffect(() => {
    if (!id) return;

    const fetchApartment = async () => {
      try {
        const { data, error } = await supabase
          .from('apartments')
          .select(`
            id,
            name,
            description,
            bedrooms,
            bathrooms,
            price_per_night,
            image,
            branches:branches(
              name,
              city,
              address
            ),
            rooms:rooms(
              id,
              name,
              capacity,
              price_per_night,
              image
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setApartment(data);
      } catch (error: any) {
        toast({
          title: 'Error loading apartment',
          description: error.message,
          variant: 'destructive'
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id, navigate, toast]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const bookApartment = () => {
    const message = `Hello! I want to book the entire apartment "${apartment?.name}" at ${apartment?.branches.name} branch.`;
    window.open(makeWhatsAppLink(message), '_blank');
  };

  const bookRoom = (room: ApartmentData['rooms'][0]) => {
    const message = `Hello! I want to book the room "${room.name}" in "${apartment?.name}" at ${apartment?.branches.name} branch.`;
    window.open(makeWhatsAppLink(message), '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading apartment details...</p>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Apartment not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo 
        title={`${apartment.name} - ${apartment.branches.name} | Raye Kam-Kiraye`}
        description={apartment.description || `Book ${apartment.name} apartment in ${apartment.branches.city}`}
        image={apartment.image}
      />
      
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Branches
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{apartment.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {apartment.branches.name}, {apartment.branches.city}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              ₨{apartment.price_per_night}/night
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Slideshow */}
          <div className="space-y-4">
            {allImages.length > 0 ? (
              <div className="relative">
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${apartment.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-primary' : 'bg-background/60'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No images available</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              {allImages.length > 0 && `${currentImageIndex + 1} of ${allImages.length} images`}
            </p>
          </div>

          {/* Apartment Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apartment Details</CardTitle>
                {apartment.description && (
                  <CardDescription>{apartment.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-muted-foreground" />
                    <span>{apartment.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                    <span>{apartment.bathrooms} Bathrooms</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">Booking Options</h3>
                  
                  {/* Book Entire Apartment */}
                  <div className="p-4 border rounded-lg mb-4 bg-accent/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Book Entire Apartment</h4>
                        <p className="text-sm text-muted-foreground">
                          Get the whole apartment for maximum privacy
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">₨{apartment.price_per_night}/night</p>
                        <Button variant="whatsapp" onClick={bookApartment}>
                          Book Apartment
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Individual Rooms */}
                  {apartment.rooms.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Or Book Individual Rooms</h4>
                      <div className="space-y-3">
                        {apartment.rooms.map((room) => (
                          <div key={room.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium">{room.name}</h5>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  Sleeps {room.capacity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">₨{room.price_per_night}/night</p>
                                <Button variant="outline" size="sm" onClick={() => bookRoom(room)}>
                                  Book Room
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{apartment.branches.name}</p>
                  <p className="text-muted-foreground">{apartment.branches.address}</p>
                  <p className="text-muted-foreground">{apartment.branches.city}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}