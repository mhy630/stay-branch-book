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
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApartments();
    fetchBranches();
  }, []);

  const fetchApartments = async () => {
    const { data, error } = await supabase
      .from('apartments')
      .select('*, branches(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setApartments(data || []);
    }
  };

  const fetchBranches = async () => {
    const { data, error } = await supabase
      .from('branches')
      .select('id, name, city')
      .order('name');

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setBranches(data || []);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `apartments/${fileName}`;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = formData.image;
    
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    }

    const submitData = { ...formData, image: imageUrl };
    
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
    if (!confirm('Are you sure you want to delete this apartment?')) return;

    const { error } = await supabase
      .from('apartments')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Apartment deleted successfully' });
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
      image: ''
    });
    setEditingApartment(null);
    setImageFile(null);
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
      image: apartment.image
    });
    setIsDialogOpen(true);
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
          <DialogContent className="max-w-2xl">
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
                  <Label htmlFor="price">Price per Night</Label>
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
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {formData.image && (
                  <div className="mt-2 space-y-2">
                    <img 
                      src={formData.image} 
                      alt="Current apartment image" 
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(formData.image, '_blank')}
                    >
                      View Full Image
                    </Button>
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
                <TableHead>Price/Night</TableHead>
                <TableHead>Image</TableHead>
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
                  <TableCell>${apartment.price_per_night}</TableCell>
                  <TableCell>
                    {apartment.image ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(apartment.image, '_blank')}
                      >
                        View Image
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">No image</span>
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