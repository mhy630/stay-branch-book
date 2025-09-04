-- Drop existing policies to rebuild them more securely
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a security definer function to check if user is admin (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can only update their own profile (but not role or email)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = OLD.role AND email = OLD.email);

-- Only allow profile creation through the trigger (no direct inserts)
CREATE POLICY "Deny direct profile creation"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Admins can view all profiles for management
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.get_current_user_role() = 'admin');

-- Admins can update user roles and manage profiles
CREATE POLICY "Admins can manage profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.get_current_user_role() = 'admin');

-- Prevent profile deletion entirely (keep user data for compliance)
CREATE POLICY "Prevent profile deletion"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (false);

-- Update the search_path for existing functions to fix linter warnings
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;