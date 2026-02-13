import { Flame, ArrowRight } from "lucide-react";
import { supermarkets } from "@/data/mockData";
import ComboCard from "./ComboCard";

const FeaturedDeals = () => {
  const allCombos = supermarkets.flatMap((m) =>
    m.combos.map((c) => ({ ...c, storeName: m.nome, storeId: m.id }))
  );

  if (allCombos.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 mt-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
            <Flame className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Combos da Semana</h2>
            <p className="text-xs text-muted-foreground">Ofertas especiais dos mercados do bairro</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allCombos.map((combo) => (
          <ComboCard key={combo.id} combo={combo} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedDeals;
