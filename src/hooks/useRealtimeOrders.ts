import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QUERY_KEYS } from "@/constants";
import { toast } from "sonner";

/**
 * Subscribe to realtime order changes for a specific store.
 * Shows toast notifications for new orders and auto-refreshes the query cache.
 */
export function useRealtimeOrders(storeId: string | undefined) {
  const qc = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!storeId) return;

    const channel = supabase
      .channel(`orders-store-${storeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `store_id=eq.${storeId}`,
        },
        (payload) => {
          const order = payload.new as { total?: number; id?: string };
          const total = order.total
            ? `R$ ${Number(order.total).toFixed(2).replace(".", ",")}`
            : "";

          toast.success(`🔔 Novo pedido recebido! ${total}`, {
            duration: 8000,
            action: {
              label: "Ver pedidos",
              onClick: () => {
                // Will be handled by the component
              },
            },
          });

          // Play notification sound
          try {
            if (!audioRef.current) {
              audioRef.current = new Audio(
                "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczHjqIr9bWfEQhJ3WdztjRdEYhLXKb0OXhhVI1OoO03+mEUjQ6g7Pj7IlUNjyCsebriFQ1OYCv5+yJVTY7gK/m7IhVNjt/r+Xsh1U2O3+v5eyIVTY7f6/l7IdVNjt/r+XsiA=="
              );
            }
            audioRef.current.volume = 0.3;
            audioRef.current.play().catch(() => {});
          } catch {
            // Silent fail if audio not available
          }

          qc.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `store_id=eq.${storeId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storeId, qc]);
}
