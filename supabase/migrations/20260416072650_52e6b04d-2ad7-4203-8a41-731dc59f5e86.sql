
-- Performance indexes for 50k concurrent users scale

-- Stores: fast lookup by status and name (home page)
CREATE INDEX IF NOT EXISTS idx_stores_status ON public.stores (status);
CREATE INDEX IF NOT EXISTS idx_stores_name ON public.stores (name);

-- Products: fast lookup by store (market page) and featured (home page)
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products (store_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products (featured, in_stock) WHERE featured = true AND in_stock = true;
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_store_sort ON public.products (store_id, sort_order);

-- Orders: fast lookup by user and store (high volume at scale)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders (store_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- Profiles: fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles (user_id);

-- User roles: fast role checks (used in every RLS policy via has_role)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles (user_id, role);

-- Combos: active combos per store
CREATE INDEX IF NOT EXISTS idx_combos_store_active ON public.combos (store_id) WHERE active = true;

-- Categories: sort order for display
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories (sort_order);
