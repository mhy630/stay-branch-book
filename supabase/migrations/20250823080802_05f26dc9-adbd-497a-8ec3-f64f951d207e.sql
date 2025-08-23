-- Create public access policies for frontend data
CREATE POLICY "Allow public access to branches" 
ON public.branches 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public access to apartments" 
ON public.apartments 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public access to rooms" 
ON public.rooms 
FOR SELECT 
TO anon, authenticated
USING (true);