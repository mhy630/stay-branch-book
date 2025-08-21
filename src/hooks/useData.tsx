import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  price_per_night: number;
  apartment_id: string;
  image?: string;
}

export interface Apartment {
  id: string;
  name: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  price_per_night: number;
  branch_id: string;
  image?: string;
  rooms?: Room[];
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  apartments?: Apartment[];
}

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      
      // Fetch branches with apartments and rooms
      const { data: branchesData, error: branchesError } = await supabase
        .from('branches')
        .select(`
          *,
          apartments (
            *,
            rooms (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (branchesError) throw branchesError;

      setBranches(branchesData || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return { branches, loading, error, refetch: fetchBranches };
};

export const useApartments = (branchId?: string) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('apartments')
        .select(`
          *,
          rooms (*)
        `);

      if (branchId) {
        query = query.eq('branch_id', branchId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setApartments(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, [branchId]);

  return { apartments, loading, error, refetch: fetchApartments };
};

export const useRooms = (apartmentId?: string) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('rooms').select('*');

      if (apartmentId) {
        query = query.eq('apartment_id', apartmentId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setRooms(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [apartmentId]);

  return { rooms, loading, error, refetch: fetchRooms };
};