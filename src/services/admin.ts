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
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (profilesRes.error) throw profilesRes.error;
    if (rolesRes.error) throw rolesRes.error;

    const rolesMap = new Map<string, string>();
    for (const r of rolesRes.data || []) {
      rolesMap.set(r.user_id, r.role);
    }

    return (profilesRes.data || []).map((p) => ({
      ...p,
      user_roles: [{ role: rolesMap.get(p.user_id) || "user" }],
    }));
  },

  async getAllOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*, stores(name)")
      .order("created_at", { ascending: false })
      .limit(200);
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

  async deleteStore(storeId: string) {
    // Delete combos items first, then combos
    const { data: combos } = await supabase.from("combos").select("id").eq("store_id", storeId);
    if (combos && combos.length > 0) {
      const comboIds = combos.map((c) => c.id);
      await supabase.from("combo_items").delete().in("combo_id", comboIds);
      await supabase.from("combos").delete().eq("store_id", storeId);
    }
    // Delete products
    await supabase.from("products").delete().eq("store_id", storeId);
    // Then delete the store
    const { error } = await supabase.from("stores").delete().eq("id", storeId);
    if (error) throw error;
  },

  async updateUserRole(userId: string, role: "admin" | "moderator" | "user") {
    const { data: existing } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("user_roles")
        .update({ role })
        .eq("user_id", userId)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role })
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    }
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
    if (data?.error) throw new Error(data.error);
    return data;
  },
};
