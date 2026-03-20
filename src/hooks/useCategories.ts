import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CACHE_TIMES, QUERY_KEYS } from "@/constants";

export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: CACHE_TIMES.LONG,
  });
}
