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
import { Store, Sparkles, ArrowRight, Tag } from "lucide-react";

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
    <main className="pb-8">
      <HeroSection busca={busca} onBuscaChange={setBusca} />

      <div className="mx-auto max-w-lg px-4 relative -mt-2 z-20">
        <GlobalSearch busca={busca} onBuscaChange={setBusca} />
      </div>

      <FeaturedDeals />

      {featuredProducts && featuredProducts.length > 0 && (
        <section className="relative mx-auto max-w-6xl px-4 mt-14">
          {/* Premium header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(38,60%,45%)] shadow-lg shadow-[hsl(var(--gold))]/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">Ofertas em Destaque</h2>
                <p className="text-xs text-muted-foreground">Seleção premium dos melhores preços do bairro</p>
              </div>
            </div>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {featuredProducts.map((p) => {
              const storeName = (p as Record<string, unknown> & { stores?: { name: string } }).stores?.name || "";
              const hasDiscount = p.original_price && Number(p.original_price) > Number(p.price);
              const desconto = hasDiscount
                ? Math.round(((Number(p.original_price) - Number(p.price)) / Number(p.original_price)) * 100)
                : 0;

              return (
                <div
                  key={p.id}
                  className="group relative min-w-[200px] shrink-0 lg:min-w-0 overflow-hidden rounded-2xl border border-[hsl(var(--gold))]/15 bg-gradient-to-b from-card to-[hsl(var(--gold))]/[0.03] p-4 transition-all duration-500 hover:shadow-[0_8px_30px_-10px_hsl(var(--gold)/0.2)] hover:-translate-y-1"
                >
                  {/* Shimmer top */}
                  <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {hasDiscount && (
                    <div className="absolute -right-1 -top-1 rounded-bl-xl rounded-tr-2xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(38,60%,45%)] px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                      <Tag className="inline h-3 w-3 mr-0.5 -mt-0.5" />
                      -{desconto}%
                    </div>
                  )}

                  {p.image_url && (
                    <div className="mb-3 overflow-hidden rounded-xl">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-28 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[hsl(var(--gold))]">
                    {storeName}
                  </span>
                  <h4 className="mt-1 font-bold text-card-foreground text-sm truncate leading-tight">{p.name}</h4>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-extrabold bg-gradient-to-r from-primary to-[hsl(var(--gold))] bg-clip-text text-transparent">
                      R$ {Number(p.price).toFixed(2).replace(".", ",")}
                    </span>
                    {hasDiscount && (
                      <span className="text-[11px] text-muted-foreground line-through">
                        R$ {Number(p.original_price).toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/mercado/${p.store_id}`}
                    className="mt-3 flex items-center gap-1 text-xs font-medium text-[hsl(var(--gold))] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Ver no mercado <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 mt-12">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <StoreCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {abertos.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--success))]/10">
                    <Store className="h-4 w-4 text-[hsl(var(--success))]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Abertos agora <span className="text-primary">({abertos.length})</span>
                    </h2>
                    <p className="text-xs text-muted-foreground">Peça agora e receba em minutos</p>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {abertos.map((s) => <StoreCard key={s.id} store={s} />)}
                </div>
              </>
            )}

            {fechados.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-5 mt-12">
                  <h2 className="text-lg font-semibold text-muted-foreground">Fechados no momento</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 opacity-60">
                  {fechados.map((s) => <StoreCard key={s.id} store={s} />)}
                </div>
              </>
            )}

            {filtered.length === 0 && !isLoading && (
              <div className="py-20 text-center text-muted-foreground">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg font-medium">Nenhum mercado encontrado</p>
                <p className="text-sm mt-1">Tente buscar por outro nome</p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default Index;
