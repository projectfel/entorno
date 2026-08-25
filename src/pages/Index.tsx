import { useState, useMemo } from "react";
import { useStores } from "@/hooks/useStores";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { isStoreOpen } from "@/lib/storeStatus";
import HeroSection from "@/components/HeroSection";
import { Link } from "react-router-dom";
import StoreCard from "@/components/StoreCard";
import FeaturedDeals from "@/components/FeaturedDeals";
import GlobalSearch from "@/components/GlobalSearch";
import { StoreCardSkeleton } from "@/components/StoreSkeleton";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [busca, setBusca] = useState("");
  const { data: stores, isLoading } = useStores();
  const { data: featuredProducts } = useFeaturedProducts();

  const filtered = useMemo(() => {
    if (!stores) return [];
    return stores.filter((s) => {
      const matchBusca =
        !busca || s.name.toLowerCase().includes(busca.toLowerCase()) || (s.description || "").toLowerCase().includes(busca.toLowerCase());
      return matchBusca;
    });
  }, [stores, busca]);

  const ativos = filtered.filter((s) => s.status !== "maintenance");
  const abertos = ativos.filter((s) => isStoreOpen(s));
  const fechados = ativos.filter((s) => !isStoreOpen(s));

  return (
    <main className="pb-16">
      <HeroSection busca={busca} onBuscaChange={setBusca} />

      <div className="mx-auto max-w-xl px-4 relative -mt-5 z-20">
        <GlobalSearch busca={busca} onBuscaChange={setBusca} />
      </div>

      <FeaturedDeals />

      {featuredProducts && featuredProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 mt-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-lg text-foreground">Em destaque</h2>
            <span className="text-xs text-muted-foreground">{featuredProducts.length} itens</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {featuredProducts.map((p) => {
              const storeName = (p as Record<string, unknown> & { stores?: { name: string } }).stores?.name || "";
              const hasDiscount = p.original_price && Number(p.original_price) > Number(p.price);
              const desconto = hasDiscount
                ? Math.round(((Number(p.original_price) - Number(p.price)) / Number(p.original_price)) * 100)
                : 0;

              return (
                <Link
                  to={`/mercado/${p.store_id}`}
                  key={p.id}
                  className="group relative min-w-[170px] shrink-0 lg:min-w-0 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40"
                >
                  {hasDiscount && (
                    <span className="absolute right-2 top-2 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      -{desconto}%
                    </span>
                  )}

                  {p.image_url && (
                    <div className="mb-2.5 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-24 w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{storeName}</span>
                  <h3 className="mt-0.5 truncate text-sm font-medium text-card-foreground">{p.name}</h3>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-base font-semibold text-foreground">
                      R$ {Number(p.price).toFixed(2).replace(".", ",")}
                    </span>
                    {hasDiscount && (
                      <span className="text-[11px] text-muted-foreground line-through">
                        R$ {Number(p.original_price).toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                    Ver <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 mt-12">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <StoreCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {abertos.length > 0 && (
              <>
                <div className="mb-4 flex items-baseline justify-between">
                  <h2 className="font-display text-lg text-foreground">Abertos agora</h2>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
                    {abertos.length} mercados
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {abertos.map((s) => <StoreCard key={s.id} store={s} />)}
                </div>
              </>
            )}

            {fechados.length > 0 && (
              <>
                <h2 className="font-display text-base text-muted-foreground mb-4 mt-12">Fechados</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-60">
                  {fechados.map((s) => <StoreCard key={s.id} store={s} />)}
                </div>
              </>
            )}

            {filtered.length === 0 && !isLoading && (
              <div className="py-20 text-center">
                <p className="font-display text-lg text-foreground">Nenhum mercado encontrado</p>
                <p className="mt-1 text-sm text-muted-foreground">Tente buscar por outro nome</p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default Index;
