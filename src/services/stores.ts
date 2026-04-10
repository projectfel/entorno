import { supabase } from "@/integrations/supabase/client";

export const storesService = {
  /** List all stores — public view works for both anon and authenticated */
  async getAll() {
    const { data, error } = await supabase
      .from("stores_public")
      .select("*")
      .order("name");
    if (error) throw error;
    return data;
  },

  /** Store detail — public view works for both anon and authenticated */
  async getById(id: string) {
    const { data, error } = await supabase
      .from("stores_public")
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
