import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Branch {
  id: string;
  name: string;
  city: string;
  created_at: string;
}

interface Apartment {
  id: string;
  branch_id: string;
  name: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  price_per_night: number;
  image: string;
  images: string[];
  created_at: string;
  branches?: { name: string };
}

export function ApartmentManager() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [formData, setFormData] = useState({
    branch_id: '',
    name: '',
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    price_per_night: 0,
    image: '',
    images: [] as string[]
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchApartments();
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApartments = async () => {
    const { data, error } = await supabase
      .from('apartments')
      .select('*, branches(name)')
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setApartments(data || []);
    }
  };

  const fetchBranches = async () => {
    const { data, error } = await supabase
      .from('branches')
      .select('id, name, city, created_at')
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setBranches(data || []);
    }
  };

  const preprocessImage = async (file: File): Promise<File> => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    img.src = URL.createObjectURL(file);
    
    await new Promise((resolve) => (img.onload = resolve));

    // Resize to max 800px width while maintaining aspect ratio
    const targetWidth = 800;
    const targetHeight = (img.height / img.width) * targetWidth;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(new File([blob!], file.name, { type: 'image/jpeg', lastModified: Date.now() })),
        'image/jpeg',
        0.95 // 95% quality
      );
    });
  };

  const uploadImage = async (file: File) => {
    try {
      const processedFile = await preprocessImage(file);
      const fileExt = processedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `apartments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, processedFile, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: unknown) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }
      throw new Error(`Failed to upload image ${file.name}: ${message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newImages = [...formData.images];
    
    // Upload new images
    if (imageFiles.length > 0) {
      try {
        for (const file of imageFiles) {
          const imageUrl = await uploadImage(file);
          newImages.push(imageUrl);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
        return;
      }
    }

    const submitData = { ...formData, images: newImages };
    
    if (editingApartment) {
      const { error } = await supabase
        .from('apartments')
        .update(submitData)
        .eq('id', editingApartment.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Apartment updated successfully' });
        fetchApartments();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('apartments')
        .insert([submitData]);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Apartment created successfully' });
        fetchApartments();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this apartment? This will also delete all associated rooms.')) return;

    // First delete associated rooms
    const { error: roomsError } = await supabase
      .from('rooms')
      .delete()
      .eq('apartment_id', id);

    if (roomsError) {
      toast({ title: 'Error', description: roomsError.message, variant: 'destructive' });
      return;
    }

    // Then delete the apartment
    const { error } = await supabase
      .from('apartments')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Apartment and associated rooms deleted successfully' });
      fetchApartments();
    }
  };

  const resetForm = () => {
    setFormData({
      branch_id: '',
      name: '',
      description: '',
      bedrooms: 1,
      bathrooms: 1,
      price_per_night: 0,
      image: '',
      images: []
    });
    setEditingApartment(null);
    setImageFiles([]);
    setIsDialogOpen(false);
  };

  const openEditDialog = (apartment: Apartment) => {
    setEditingApartment(apartment);
    setFormData({
      branch_id: apartment.branch_id,
      name: apartment.name,
      description: apartment.description,
      bedrooms: apartment.bedrooms,
      bathrooms: apartment.bathrooms,
      price_per_night: apartment.price_per_night,
      image: apartment.image,
      images: apartment.images || []
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
          <h2 className="text-2xl font-bold">Apartment Management</h2>
          <p className="text-muted-foreground">Manage apartments across all branches</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Apartment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingApartment ? 'Edit Apartment' : 'Add New Apartment'}</DialogTitle>
              <DialogDescription>
                {editingApartment ? 'Update apartment details' : 'Create a new apartment'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Select value={formData.branch_id} onValueChange={(value) => setFormData({ ...formData, branch_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name} - {branch.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="1"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
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
                
                {formData.images.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <Label>Current Images:</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={imageUrl} 
                            alt={`Apartment image ${index + 1}`} 
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
                  {editingApartment ? 'Update' : 'Create'}
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
                <TableHead>Name</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Bedrooms</TableHead>
                <TableHead>Bathrooms</TableHead>
                <TableHead>Price/Night (PKR)</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apartments.map((apartment) => (
                <TableRow key={apartment.id}>
                  <TableCell className="font-medium">{apartment.name}</TableCell>
                  <TableCell>{apartment.branches?.name || 'N/A'}</TableCell>
                  <TableCell>{apartment.bedrooms}</TableCell>
                  <TableCell>{apartment.bathrooms}</TableCell>
                  <TableCell>₨{apartment.price_per_night}</TableCell>
                  <TableCell>
                    {apartment.images && apartment.images.length > 0 ? (
                      <div className="flex space-x-2">
                        <span className="text-sm">{apartment.images.length} image(s)</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            apartment.images.forEach((img, index) => {
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
                        onClick={() => openEditDialog(apartment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(apartment.id)}
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