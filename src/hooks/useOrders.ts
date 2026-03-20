import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/services/orders";
import { CACHE_TIMES, QUERY_KEYS } from "@/constants";
import type { Json } from "@/integrations/supabase/types";

export function useUserOrders(userId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "user", userId],
    queryFn: () => ordersService.getByUser(userId!),
    enabled: !!userId,
    staleTime: CACHE_TIMES.SHORT,
  });
}

export function useStoreOrders(storeId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "store", storeId],
    queryFn: () => ordersService.getByStore(storeId!),
    enabled: !!storeId,
    staleTime: CACHE_TIMES.SHORT,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (order: { store_id: string; user_id: string; items: Json; total: number; notes?: string }) =>
      ordersService.create(order),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      ordersService.updateStatus(orderId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });
}
