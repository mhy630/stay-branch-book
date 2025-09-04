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
  rooms: BackendRoom[];
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

export interface BackendRoom {
  id: string;
  branch_id?: string;
  apartment_id?: string;
  name: string;
  capacity: number;
  price_per_night: number;
  image?: string;
  images?: string[];
  created_at: string;
}

export const useBackendData = () => {
  const [branches, setBranches] = useState<BackendBranch[]>([]);
  const [rooms, setRooms] = useState<BackendRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [branchesData, roomsData] = await Promise.all([
          supabase
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
            .order('created_at', { ascending: true, foreignTable: 'apartments' }),
          
          supabase
            .from('rooms')
            .select(`
              id,
              branch_id,
              apartment_id,
              name,
              capacity,
              price_per_night,
              image,
              images,
              created_at
            `)
            .order('created_at', { ascending: true })
        ]);

        if (branchesData.error) {
          console.error('Error fetching branches:', branchesData.error);
          setBranches([]);
        } else {
          const branchesWithRooms = (branchesData.data || []).map(branch => ({
            ...branch,
            rooms: (roomsData.data || []).filter(room => room.branch_id === branch.id)
          }));
          setBranches(branchesWithRooms);
        }

        if (roomsData.error) {
          console.error('Error fetching rooms:', roomsData.error);
          setRooms([]);
        } else {
          setRooms(roomsData.data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setBranches([]);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { branches, rooms, loading };
};