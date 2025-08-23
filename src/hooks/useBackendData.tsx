import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BackendBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  apartments: BackendApartment[];
}

export interface BackendApartment {
  id: string;
  branch_id: string;
  name: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  price_per_night: number;
  image?: string;
  rooms: BackendRoom[];
}

export interface BackendRoom {
  id: string;
  apartment_id: string;
  name: string;
  capacity: number;
  price_per_night: number;
  image?: string;
}

export const useBackendData = () => {
  const [branches, setBranches] = useState<BackendBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch branches with apartments and rooms
      const { data: branchesData, error: branchesError } = await supabase
        .from('branches')
        .select(`
          id,
          name,
          city,
          address,
          latitude,
          longitude,
          apartments:apartments(
            id,
            branch_id,
            name,
            description,
            bedrooms,
            bathrooms,
            price_per_night,
            image,
            rooms:rooms(
              id,
              apartment_id,
              name,
              capacity,
              price_per_night,
              image
            )
          )
        `)
        .order('name');

      if (branchesError) {
        throw branchesError;
      }

      setBranches(branchesData || []);
    } catch (error: any) {
      toast({
        title: 'Error loading data',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { branches, loading, refetch: fetchData };
};