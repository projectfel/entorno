import { supabase } from "@/integrations/supabase/client";

export const storesService = {
  /** List all stores — authenticated users see full data, anon gets public view */
  async getAll() {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .order("name");
    // If RLS blocks (anon user), fallback to public view
    if (error) {
      const { data: publicData, error: publicError } = await supabase
        .from("stores_public")
        .select("*")
        .order("name");
      if (publicError) throw publicError;
      return publicData;
    }
    return data;
  },

  /** Store detail */
  async getById(id: string) {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      const { data: publicData, error: publicError } = await supabase
        .from("stores_public")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (publicError) throw publicError;
      return publicData;
    }
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
