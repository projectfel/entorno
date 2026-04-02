import { supabase } from "@/integrations/supabase/client";

export const storesService = {
  /** List all stores — use public view for listings (safe for anon + auth) */
  async getAll() {
    // Always use stores_public for listings — it excludes sensitive fields
    // and is accessible to both anon and authenticated users
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      // Authenticated: try full table first
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .order("name");
      if (!error && data && data.length > 0) return data;
    }
    
    // Fallback (anon or empty result): use public view
    const { data: publicData, error: publicError } = await supabase
      .from("stores_public")
      .select("*")
      .order("name");
    if (publicError) throw publicError;
    return publicData;
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
