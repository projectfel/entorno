import { supabase } from "@/integrations/supabase/client";

export interface BulkProductRow {
  name: string;
  price: number;
  unit?: string;
  description?: string;
  category_id?: string | null;
  original_price?: number | null;
  stock_quantity?: number;
  low_stock_threshold?: number;
  sku?: string | null;
  image_url?: string | null;
}

export const productsService = {
  async getByStore(storeId: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name, icon)")
      .eq("store_id", storeId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data;
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from("products")
      .select("*, stores(name)")
      .eq("featured", true)
      .eq("in_stock", true)
      .limit(8);
    if (error) throw error;
    return data;
  },

  async create(product: {
    name: string;
    price: number;
    store_id: string;
    category_id?: string;
    description?: string;
    unit?: string;
    image_url?: string;
  }) {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async bulkCreate(storeId: string, rows: BulkProductRow[]) {
    if (!rows.length) return [];
    const payload = rows.map((r) => ({ ...r, store_id: storeId }));
    const { data, error } = await supabase.from("products").insert(payload).select();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async duplicate(id: string) {
    const { data: original, error: getErr } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (getErr) throw getErr;
    const { id: _id, created_at: _c, updated_at: _u, ...rest } = original as Record<string, unknown>;
    const copy = { ...rest, name: `${(rest as { name: string }).name} (cópia)`, featured: false };
    const { data, error } = await supabase.from("products").insert(copy as never).select().single();
    if (error) throw error;
    return data;
  },

  async remove(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  },

  async getStockMovements(storeId: string, productId?: string) {
    let q = supabase
      .from("stock_movements")
      .select("*, products(name)")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (productId) q = q.eq("product_id", productId);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },
};
