import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Apartment {
  id: string;
  name: string;
  branches?: { name: string };
}

interface Room {
  id: string;
  apartment_id: string;
  name: string;
  capacity: number;
  price_per_night: number;
  image?: string;
  images?: string[];
  apartments?: { name: string; branches?: { name: string } };
}

export function RoomManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    apartment_id: '',
    name: '',
    capacity: 1,
    price_per_night: 0,
    image: '',
    images: [] as string[]
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
    fetchApartments();
  }, []);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*, apartments(name, branches(name))')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setRooms(data || []);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `rooms/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const fetchApartments = async () => {
    const { data, error } = await supabase
      .from('apartments')
      .select('id, name, branches(name)')
      .order('name');

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setApartments(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let newImages = [...formData.images];
    
    // Upload new images
    if (imageFiles.length > 0) {
      try {
        for (const file of imageFiles) {
          const imageUrl = await uploadImage(file);
          newImages.push(imageUrl);
        }
      } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    }

    const submitData = { ...formData, images: newImages };
    
    if (editingRoom) {
      const { error } = await supabase
        .from('rooms')
        .update(submitData)
        .eq('id', editingRoom.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Room updated successfully' });
        fetchRooms();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('rooms')
        .insert([submitData]);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Room created successfully' });
        fetchRooms();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Room deleted successfully' });
      fetchRooms();
    }
  };

  const resetForm = () => {
    setFormData({
      apartment_id: '',
      name: '',
      capacity: 1,
      price_per_night: 0,
      image: '',
      images: []
    });
    setEditingRoom(null);
    setImageFiles([]);
    setIsDialogOpen(false);
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      apartment_id: room.apartment_id,
      name: room.name,
      capacity: room.capacity,
      price_per_night: room.price_per_night,
      image: room.image || '',
      images: room.images || []
    });
    setIsDialogOpen(true);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Room Management</h2>
          <p className="text-muted-foreground">Manage individual rooms within apartments</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
              <DialogDescription>
                {editingRoom ? 'Update room details' : 'Create a new room'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apartment">Apartment</Label>
                <Select value={formData.apartment_id} onValueChange={(value) => setFormData({ ...formData, apartment_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an apartment" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartments.map((apartment) => (
                      <SelectItem key={apartment.id} value={apartment.id}>
                        {apartment.name} - {apartment.branches?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  required
                />
              </div>
              
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Night (PKR)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) })}
                    required
                  />
                </div>

              <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                />
                
                {/* Display existing images */}
                {formData.images.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <Label>Current Images:</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={imageUrl} 
                            alt={`Room image ${index + 1}`} 
                            className="w-24 h-24 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="mt-1 w-full text-xs"
                            onClick={() => window.open(imageUrl, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Display selected new images */}
                {imageFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <Label>New Images to Upload:</Label>
                    <div className="text-sm text-muted-foreground">
                      {imageFiles.map((file, index) => (
                        <div key={index}>{file.name}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRoom ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Name</TableHead>
                <TableHead>Apartment</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Price/Night (PKR)</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.apartments?.name || 'N/A'}</TableCell>
                  <TableCell>{room.apartments?.branches?.name || 'N/A'}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>₨{room.price_per_night}</TableCell>
                    <TableCell>
                      {room.images && room.images.length > 0 ? (
                        <div className="flex space-x-2">
                          <span className="text-sm">{room.images.length} image(s)</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              room.images.forEach((img, index) => {
                                setTimeout(() => window.open(img, '_blank'), index * 100);
                              });
                            }}
                          >
                            View All
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No images</span>
                      )}
                    </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(room)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}