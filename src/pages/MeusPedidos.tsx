import { useAuth } from "@/contexts/AuthContext";
import { useUserOrders } from "@/hooks/useOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pendente", color: "bg-accent text-accent-foreground", icon: Clock },
  confirmed: { label: "Confirmado", color: "bg-primary text-primary-foreground", icon: CheckCircle },
  delivered: { label: "Entregue", color: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-destructive text-destructive-foreground", icon: XCircle },
};

interface OrderItem {
  nome?: string;
  name?: string;
  quantidade?: number;
  quantity?: number;
  preco?: number;
  price?: number;
}

interface OrderWithStore {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: unknown;
  notes: string | null;
  stores: { name: string } | null;
}

const MeusPedidos = () => {
  const { user } = useAuth();
  const { data: orders, isLoading } = useUserOrders(user?.id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Meus Pedidos</h1>
        <p className="text-muted-foreground">Acompanhe seus pedidos</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <Package className="mx-auto h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">Nenhum pedido ainda</p>
          <p className="text-sm mt-1">Seus pedidos aparecerão aqui</p>
          <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
            Explorar mercados
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {(orders as OrderWithStore[]).map((order) => {
            const st = statusMap[order.status] || statusMap.pending;
            const Icon = st.icon;
            const items: OrderItem[] = Array.isArray(order.items)
              ? (order.items as OrderItem[])
              : [];
            return (
              <div key={order.id} className="rounded-xl border bg-card p-4 transition-colors hover:bg-secondary/30">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="font-medium text-card-foreground mt-1">
                      {order.stores?.name || "Loja"}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${st.color} border-0 gap-1`}>
                      <Icon className="h-3 w-3" />
                      {st.label}
                    </Badge>
                    <p className="text-lg font-bold text-primary mt-2">
                      R$ {Number(order.total).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
                {/* Render item details */}
                {items.length > 0 && (
                  <div className="mt-3 border-t pt-3 space-y-1">
                    {items.map((item, idx) => {
                      const name = item.nome || item.name || "Item";
                      const qty = item.quantidade || item.quantity || 1;
                      const price = item.preco || item.price;
                      return (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{name} ×{qty}</span>
                          {price && (
                            <span className="text-card-foreground font-medium">
                              R$ {(Number(price) * qty).toFixed(2).replace(".", ",")}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {order.notes && (
                  <p className="text-xs text-muted-foreground mt-2 border-t pt-2">📝 {order.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default MeusPedidos;
