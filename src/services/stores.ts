import { supabase } from "@/integrations/supabase/client";

export const storesService = {
  /** Public listing — uses stores_public view (no phone/whatsapp) */
  async getAll() {
    const { data, error } = await supabase
      .from("stores_public")
      .select("*")
      .order("name");
    if (error) throw error;
    return data;
  },

  /** Public store detail — uses stores_public view (no sensitive data) */
  async getById(id: string) {
    const { data, error } = await supabase
      .from("stores_public")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  /** Full details with phone/whatsapp — only for authenticated owner/admin */
  async getFullById(id: string) {
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
