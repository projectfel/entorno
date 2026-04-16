import { Crown, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ComboCard from "./ComboCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedDeals = () => {
  const { data: combos, isLoading } = useQuery({
    queryKey: ["combos", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("combos")
        .select("*, stores(name)")
        .eq("active", true)
        .limit(6);
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-4 mt-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
        </div>
      </section>
    );
  }

  if (!combos || combos.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-6xl px-4 mt-14">
      {/* Premium section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(38,60%,45%)] shadow-lg shadow-[hsl(var(--gold))]/20">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              Combos da Semana
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[hsl(var(--gold))]" />
              Ofertas exclusivas dos mercados parceiros
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {combos.map((combo) => (
          <ComboCard
            key={combo.id}
            combo={{
              id: combo.id,
              nome: combo.name,
              descricao: combo.description || "",
              precoCombo: Number(combo.combo_price),
              precoOriginal: Number(combo.original_price ?? combo.combo_price),
              itens: [],
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedDeals;
