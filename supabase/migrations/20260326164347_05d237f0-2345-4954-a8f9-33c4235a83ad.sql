
-- FIX 1: CRITICAL - Prevent privilege escalation on user_roles
-- The ALL policy for admins already covers INSERT for admins.
-- But we need to explicitly DENY non-admin inserts.
-- Drop and recreate with separate policies for clarity.

-- Remove the broad ALL policy and replace with granular ones
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;

-- Admins can do everything
CREATE POLICY "Admins can select user roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert user roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update user roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- FIX 2: Restrict stores SELECT to hide sensitive data from public
-- Remove the broad public SELECT and replace with role-based access
DROP POLICY IF EXISTS "Stores are publicly viewable" ON public.stores;

-- Only owners and admins can see full store details (with phone/whatsapp)
CREATE POLICY "Owners can view own store details"
  ON public.stores FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

-- Note: "Admins can manage all stores" ALL policy already covers admin SELECT

-- Grant SELECT on the public view (no phone/whatsapp) to everyone
GRANT SELECT ON public.stores_public TO anon, authenticated;

-- FIX 3: Remove dangerous loyalty_points ALL policy
DROP POLICY IF EXISTS "System can manage points" ON public.loyalty_points;

-- Users can only READ their own points, not modify
CREATE POLICY "Users can read own points"
  ON public.loyalty_points FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
