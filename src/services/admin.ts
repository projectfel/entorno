import { supabase } from "@/integrations/supabase/client";

export const adminService = {
  async getAllStores() {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getAllProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*, user_roles(role)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getAllOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*, stores(name)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return data;
  },

  async updateStoreStatus(storeId: string, status: "open" | "closed" | "maintenance") {
    const { data, error } = await supabase
      .from("stores")
      .update({ status })
      .eq("id", storeId)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateUserRole(userId: string, role: "admin" | "moderator" | "user") {
    const { data, error } = await supabase
      .from("user_roles")
      .update({ role })
      .eq("user_id", userId)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async createStoreOwner(params: {
    email: string;
    password: string;
    displayName?: string;
    storeName: string;
    whatsapp: string;
    address?: string;
    neighborhood?: string;
  }) {
    const { data, error } = await supabase.functions.invoke("admin-create-store-owner", {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  async getStats() {
    const [stores, profiles, orders] = await Promise.all([
      supabase.from("stores").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
    ]);
    return {
      totalStores: stores.count ?? 0,
      totalUsers: profiles.count ?? 0,
      totalOrders: orders.count ?? 0,
    };
  },
};
