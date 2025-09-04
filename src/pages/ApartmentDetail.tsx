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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MapPicker from "@/components/MapPicker";

interface ApartmentData {
  id: string;
  name: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  price_per_night: number;
  image?: string;
  images?: string[];
  branches: {
    name: string;
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  rooms: Array<{
    id: string;
    name: string;
    capacity: number;
    price_per_night: number;
    image?: string;
    images?: string[];
  }>;
}

const makeWhatsAppLink = (message: string) => 
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// Helper to transform Supabase image URL for consistent sizing/quality
const transformImageUrl = (url: string) => {
  if (!url) return url;
  return url.replace('/object/', '/render/image/') + '?width=800&resize=contain&quality=95';
};

export default function ApartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apartment, setApartment] = useState<ApartmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Filter images based on selected room or show apartment images by default
  const allImages = apartment
    ? selectedRoomId
      ? apartment.rooms
          .filter((room) => room.id === selectedRoomId)
          .flatMap((room) => [
            ...(room.images ? [...room.images].reverse().map(transformImageUrl) : []),
            ...(room.image ? [transformImageUrl(room.image)] : []),
          ])
      : [
          ...(apartment.images ? [...apartment.images].reverse().map(transformImageUrl) : []),
          ...(apartment.image ? [transformImageUrl(apartment.image)] : []),
        ]
    : [];

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
            images,
            branches:branches(
              name,
              city,
              address,
              latitude,
              longitude
            ),
            rooms:rooms(
              id,
              name,
              capacity,
              price_per_night,
              image,
              images
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setApartment(data);
      } catch (error: unknown) {
        let message = "An unknown error occurred";
        if (error instanceof Error) {
          message = error.message;
        }
        toast({
          title: 'Error loading apartment',
          description: message,
          variant: 'destructive'
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id, navigate, toast]);

  // Reset currentImageIndex when allImages changes to avoid index out of bounds
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedRoomId, allImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const openModal = (startIndex: number) => {
    const images = selectedRoomId
      ? apartment?.rooms
          .filter((room) => room.id === selectedRoomId)
          .flatMap((room) => [
            ...(room.images ? [...room.images].reverse().map(transformImageUrl) : []),
            ...(room.image ? [transformImageUrl(room.image)] : []),
          ])
      : [
          ...(apartment?.images ? [...apartment.images].reverse().map(transformImageUrl) : []),
          ...(apartment?.image ? [transformImageUrl(apartment.image)] : []),
        ];
    setModalImages(images);
    setCurrentModalIndex(startIndex);
    setIsModalOpen(true);
  };

  const nextModalImage = () => {
    setCurrentModalIndex((prev) => (prev + 1) % modalImages.length);
  };

  const prevModalImage = () => {
    setCurrentModalIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
  };

  const bookApartment = () => {
    const message = `Hello! I want to book the entire apartment "${apartment?.name}" at ${apartment?.branches.name} branch.`;
    window.open(makeWhatsAppLink(message), '_blank');
  };

  const bookRoom = (room: ApartmentData['rooms'][0]) => {
    const message = `Hello! I want to book the room "${room.name}" in "${apartment?.name}" at ${apartment?.branches.name} branch.`;
    window.open(makeWhatsAppLink(message), '_blank');
  };

  const handleRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const handleApartmentClick = () => {
    setSelectedRoomId(null);
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
          {/* Image Slideshow and Map */}
          <div className="space-y-4">
            {/* Slideshow */}
            {allImages.length > 0 ? (
              <div className="relative">
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${apartment.name} - Image ${currentImageIndex + 1}`}
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
              {apartment.branches.latitude && apartment.branches.longitude ? (
                <MapPicker
                  latitude={apartment.branches.latitude}
                  longitude={apartment.branches.longitude}
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

          {/* Preload all images to avoid blur on first render */}
          <div className="hidden">
            {allImages.map((img, index) => (
              <img key={index} src={img} alt="" loading="eager" />
            ))}
          </div>

          {/* Apartment Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="cursor-pointer" onClick={handleApartmentClick}>
                  Apartment Details
                </CardTitle>
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
                  <div className="space-y-3">
                    {/* Book Entire Apartment */}
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedRoomId === null ? 'bg-accent/50' : 'hover:bg-accent/20'
                      }`}
                      onClick={handleApartmentClick}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Entire Apartment: {apartment.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Get the whole apartment for maximum privacy
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">₨{apartment.price_per_night}/night</p>
                          <Button
                            variant="whatsapp"
                            onClick={(e) => {
                              e.stopPropagation();
                              bookApartment();
                            }}
                          >
                            Book Apartment
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Individual Rooms */}
                    {apartment.rooms.length > 0 && (
                      <>
                        <h4 className="font-medium mb-3">Or Book Individual Rooms</h4>
                        {apartment.rooms.map((room) => (
                          <div
                            key={room.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedRoomId === room.id ? 'bg-accent/50' : 'hover:bg-accent/20'
                            }`}
                            onClick={() => handleRoomClick(room.id)}
                          >
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
                                <Button
                                  variant="whatsapp"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    bookRoom(room);
                                  }}
                                >
                                  Book Room
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
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
                  <p className="font-medium">{apartment.branches.name}</p>
                  <p className="text-muted-foreground">{apartment.branches.address}</p>
                  <p className="text-muted-foreground">{apartment.branches.city}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal for Apartment Images */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 max-w-[100vw] max-h-[90vh] w-screen h-[90vh] bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={modalImages[currentModalIndex]}
              alt={`Apartment image ${currentModalIndex + 1}`}
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
          <style>{`
            .dialog-close-button:hover {
              color: white !important;
            }
          `}</style>
        </DialogContent>
      </Dialog>
    </div>
  );
}