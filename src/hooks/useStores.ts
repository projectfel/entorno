import { useQuery } from "@tanstack/react-query";
import { storesService } from "@/services/stores";
import { CACHE_TIMES, QUERY_KEYS } from "@/constants";

export function useStores() {
  return useQuery({
    queryKey: [QUERY_KEYS.STORES],
    queryFn: storesService.getAll,
    staleTime: CACHE_TIMES.MEDIUM,
  });
}

export function useStore(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.STORES, id],
    queryFn: () => storesService.getById(id!),
    enabled: !!id,
    staleTime: CACHE_TIMES.MEDIUM,
  });
}

export function useMyStores(ownerId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.MY_STORES, ownerId],
    queryFn: () => storesService.getByOwner(ownerId!),
    enabled: !!ownerId,
  });
}
