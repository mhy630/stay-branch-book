import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BackendBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  apartments: BackendApartment[];
}

export interface BackendApartment {
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
}

export const useBackendData = () => {
  const [branches, setBranches] = useState<BackendBranch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('branches')
          .select(`
            id,
            name,
            city,
            address,
            latitude,
            longitude,
            created_at,
            apartments (
              id,
              branch_id,
              name,
              description,
              bedrooms,
              bathrooms,
              price_per_night,
              image,
              images,
              created_at
            )
          `)
          .order('created_at', { ascending: true })
          .order('created_at', { ascending: true, foreignTable: 'apartments' });

        if (error) {
          console.error('Error fetching data:', error);
          setBranches([]);
        } else {
          setBranches(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { branches, loading };
};