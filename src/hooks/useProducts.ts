import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "@/services/products";
import { CACHE_TIMES, QUERY_KEYS } from "@/constants";

export function useProducts(storeId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, storeId],
    queryFn: () => productsService.getByStore(storeId!),
    enabled: !!storeId,
    staleTime: CACHE_TIMES.MEDIUM,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.FEATURED_PRODUCTS,
    queryFn: productsService.getFeatured,
    staleTime: CACHE_TIMES.MEDIUM,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsService.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS, data.store_id] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.FEATURED_PRODUCTS });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Record<string, unknown> }) =>
      productsService.update(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.FEATURED_PRODUCTS });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.FEATURED_PRODUCTS });
    },
  });
}
