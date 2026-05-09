import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QUERY_KEYS } from "@/constants";
import { toast } from "sonner";

const STATUS_MESSAGES: Record<string, { title: string; emoji: string }> = {
  confirmed: { title: "Pedido confirmado pelo lojista", emoji: "✅" },
  delivered: { title: "Pedido entregue", emoji: "📦" },
  cancelled: { title: "Pedido cancelado", emoji: "❌" },
  pending: { title: "Pedido pendente", emoji: "⏳" },
};

/**
 * Subscribe to realtime status changes on the customer's own orders.
 * Shows a toast whenever the merchant updates the status.
 */
export function useRealtimeUserOrders(userId: string | undefined) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`orders-user-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const oldRow = payload.old as { status?: string };
          const newRow = payload.new as { status?: string; id?: string };
          if (!newRow.status || oldRow.status === newRow.status) return;

          const meta = STATUS_MESSAGES[newRow.status] ?? {
            title: `Status atualizado: ${newRow.status}`,
            emoji: "🔔",
          };
          const protocolo = newRow.id ? newRow.id.slice(0, 8).toUpperCase() : "";

          toast.success(`${meta.emoji} ${meta.title}`, {
            description: protocolo ? `Pedido #${protocolo}` : undefined,
            duration: 7000,
          });

          qc.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, qc]);
}
