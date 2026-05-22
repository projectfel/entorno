import { useState } from "react";
import { productsService } from "@/services/products";
import { useQuery } from "@tanstack/react-query";
import { X, History, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  storeId: string;
  onClose: () => void;
}

const TYPE_LABEL: Record<string, { label: string; color: string }> = {
  purchase: { label: "Compra", color: "text-[hsl(var(--success))]" },
  sale: { label: "Venda", color: "text-primary" },
  adjustment: { label: "Ajuste", color: "text-muted-foreground" },
  loss: { label: "Perda", color: "text-destructive" },
  return: { label: "Devolução", color: "text-accent" },
  import: { label: "Importação", color: "text-muted-foreground" },
};

export default function StockHistoryDialog({ storeId, onClose }: Props) {
  const [filter, setFilter] = useState<string>("");
  const { data, isLoading } = useQuery({
    queryKey: ["stock-movements", storeId],
    queryFn: () => productsService.getStockMovements(storeId),
  });

  const filtered = (data || []).filter((m) => {
    if (!filter) return true;
    const productName = (m as { products?: { name?: string } }).products?.name?.toLowerCase() || "";
    return productName.includes(filter.toLowerCase()) || m.type.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl bg-card border p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Histórico de Estoque
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Filtrar por produto ou tipo..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-3 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        <div className="flex-1 overflow-y-auto -mx-2 px-2">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <History className="mx-auto h-8 w-8 opacity-40 mb-2" />
              Nenhuma movimentação registrada
            </div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map((m) => {
                const t = TYPE_LABEL[m.type] || { label: m.type, color: "" };
                const pos = m.quantity > 0;
                const productName = (m as { products?: { name?: string } }).products?.name || "—";
                return (
                  <div key={m.id} className="flex items-center justify-between rounded-lg border bg-background p-3 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{productName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className={t.color}>{t.label}</span>
                        {m.reason && <> · {m.reason}</>}
                        {" · "}
                        {new Date(m.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="text-right ml-3">
                      <p className={`font-semibold flex items-center gap-1 ${pos ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                        {pos ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {pos ? "+" : ""}{m.quantity}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Saldo: {m.balance_after}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
