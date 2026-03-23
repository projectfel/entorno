import { supabase } from "@/integrations/supabase/client";

export const authService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: { display_name?: string; phone?: string; address?: string }) {
    const sanitized: Record<string, string | null> = {};
    if (updates.display_name !== undefined) {
      const trimmed = updates.display_name.trim();
      if (trimmed.length < 2) throw new Error("Nome deve ter pelo menos 2 caracteres");
      sanitized.display_name = trimmed;
    }
    if (updates.phone !== undefined) {
      sanitized.phone = updates.phone.trim() || null;
    }
    if (updates.address !== undefined) {
      sanitized.address = updates.address.trim() || null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(sanitized)
      .eq("user_id", userId)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getUserRole(userId: string) {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data?.role ?? "user";
  },
};
