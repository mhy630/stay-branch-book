import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WHATSAPP_NUMBER } from "@/config";
import { Seo } from "@/components/Seo";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MapPicker from "@/components/MapPicker";

interface RoomData {
  id: string;
  name: string;
  capacity: number;
  price_per_night: number;
  image?: string;
  images?: string[];
  branch_id?: string;
  apartment_id?: string;
  branches?: {
    name: string;
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  apartments?: {
    name: string;
    description?: string;
    branches: {
      name: string;
      city: string;
      address: string;
      latitude?: number;
      longitude?: number;
    };
  };
}

const makeWhatsAppLink = (message: string) => 
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// Helper to transform Supabase image URL for consistent sizing/quality
const transformImageUrl = (url: string) => {
  if (!url) return url;
  return url.replace('/object/', '/render/image/') + '?width=800&resize=contain&quality=95';
};

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);

  const allImages = room
    ? [
        ...(room.images ? [...room.images].reverse().map(transformImageUrl) : []),
        ...(room.image ? [transformImageUrl(room.image)] : []),
      ]
    : [];

  useEffect(() => {
    if (!id) return;

    const fetchRoom = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select(`
            id,
            name,
            capacity,
            price_per_night,
            image,
            images,
            branch_id,
            apartment_id,
            branches!rooms_branch_id_fkey(
              name,
              city,
              address,
              latitude,
              longitude
            ),
            apartments!rooms_apartment_id_fkey(
              name,
              description,
              branches!apartments_branch_id_fkey(
                name,
                city,
                address,
                latitude,
                longitude
              )
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setRoom(data);
      } catch (error: unknown) {
        let message = "An unknown error occurred";
        if (error instanceof Error) {
          message = error.message;
        }
        toast({
          title: 'Error loading room',
          description: message,
          variant: 'destructive'
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, navigate, toast]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const openModal = (startIndex: number) => {
    setModalImages(allImages);
    setCurrentModalIndex(startIndex);
    setIsModalOpen(true);
  };

  const nextModalImage = () => {
    setCurrentModalIndex((prev) => (prev + 1) % modalImages.length);
  };

  const prevModalImage = () => {
    setCurrentModalIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
  };

  const bookRoom = () => {
    const locationName = room?.apartments 
      ? `${room.apartments.name} at ${room.apartments.branches.name} branch`
      : `${room?.branches?.name} branch`;
    const message = `Hello! I want to book the room "${room?.name}" at ${locationName}.`;
    window.open(makeWhatsAppLink(message), '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Room not found</p>
      </div>
    );
  }

  const locationData = room.apartments?.branches || room.branches;

  return (
    <div className="min-h-screen bg-background">
      <Seo 
        title={`${room.name} - ${locationData?.name} | Raye Kam-Kiraye`}
        description={`Book ${room.name} room in ${locationData?.city}`}
        image={room.image}
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
              <h1 className="text-2xl font-bold">{room.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {room.apartments ? `${room.apartments.name} - ` : ''}{locationData?.name}, {locationData?.city}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              ₨{room.price_per_night}/night
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Slideshow and Map */}
          <div className="space-y-4">
            {/* Slideshow */}
            {allImages.length > 0 ? (
              <div className="relative">
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${room.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-96 object-contain rounded-lg bg-black/10 cursor-pointer"
                  loading="lazy"
                  onClick={() => openModal(currentImageIndex)}
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

            {/* Map */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Pinned Location</h3>
              {locationData?.latitude && locationData?.longitude ? (
                <MapPicker
                  latitude={locationData.latitude}
                  longitude={locationData.longitude}
                  readOnly={true}
                  showCoordinates={false}
                />
              ) : (
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Location not available</p>
                </div>
              )}
            </div>
          </div>

          {/* Room Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Room Details</CardTitle>
                {room.apartments?.description && (
                  <CardDescription>{room.apartments.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Sleeps {room.capacity} people</span>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">Book This Room</h3>
                  <div className="p-4 border rounded-lg bg-accent/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{room.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {room.apartments ? `Room in ${room.apartments.name}` : 'Standalone room'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">₨{room.price_per_night}/night</p>
                        <Button variant="default" onClick={bookRoom} className="mt-2">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{locationData?.name}</p>
                  <p className="text-muted-foreground">{locationData?.address}</p>
                  <p className="text-muted-foreground">{locationData?.city}</p>
                  {room.apartments && (
                    <p className="text-sm text-accent-foreground">
                      This room is part of {room.apartments.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 max-w-[100vw] max-h-[90vh] w-screen h-[90vh] bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={modalImages[currentModalIndex]}
              alt={`Room image ${currentModalIndex + 1}`}
              className="max-w-[100vw] max-h-[90vh] object-contain"
            />
            {modalImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80"
                  onClick={prevModalImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80"
                  onClick={nextModalImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {modalImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentModalIndex ? 'bg-primary' : 'bg-white/60'
                      }`}
                      onClick={() => setCurrentModalIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}