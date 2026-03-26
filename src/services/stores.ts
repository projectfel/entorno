import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type StorePublic = Omit<Tables<"stores">, "phone" | "whatsapp">;

export const storesService = {
  /** Public listing — hides phone/whatsapp */
  async getAll(): Promise<StorePublic[]> {
    const { data, error } = await supabase
      .from("stores")
      .select("id,name,description,cover_image,logo_url,address,neighborhood,status,opens_at,closes_at,rating,total_ratings,delivery_fee,min_order,delivery_time_min,delivery_time_max,created_at,updated_at,owner_id")
      .order("name");
    if (error) throw error;
    return data as unknown as StorePublic[];
  },

  /** Full details — only owner/admin get phone via RLS on stores table */
  async getById(id: string) {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("owner_id", ownerId);
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from("stores")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};
