import { useState, useMemo } from "react";
import { supermarkets } from "@/data/mockData";
import HeroSection from "@/components/HeroSection";
import CategoryBar from "@/components/CategoryBar";
import StoreCard from "@/components/StoreCard";
import FeaturedDeals from "@/components/FeaturedDeals";
import LoyaltyBanner from "@/components/LoyaltyBanner";
import GlobalSearch from "@/components/GlobalSearch";
import { Store, TrendingUp } from "lucide-react";

const Index = () => {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return supermarkets.filter((m) => {
      const matchBusca =
        !busca ||
        m.nome.toLowerCase().includes(busca.toLowerCase()) ||
        m.categorias.some((c) => c.toLowerCase().includes(busca.toLowerCase())) ||
        m.produtos.some((p) => p.nome.toLowerCase().includes(busca.toLowerCase()));

      const matchCategoria =
        !categoriaAtiva ||
        m.categorias.includes(categoriaAtiva) ||
        m.produtos.some((p) => p.categoria === categoriaAtiva);

      return matchBusca && matchCategoria;
    });
  }, [busca, categoriaAtiva]);

  const abertos = filtered.filter((m) => m.aberto);
  const fechados = filtered.filter((m) => !m.aberto);

  // Best deals across all stores
  const destaques = useMemo(() => {
    return supermarkets
      .flatMap((m) =>
        m.produtos
          .filter((p) => p.destaque || p.precoOriginal)
          .map((p) => ({ ...p, storeName: m.nome, storeId: m.id }))
      )
      .slice(0, 4);
  }, []);

  return (
    <main className="pb-8">
      {/* Hero with search */}
      <HeroSection busca={busca} onBuscaChange={setBusca} />

      {/* Search results dropdown */}
      <div className="mx-auto max-w-lg px-4 relative -mt-2 z-20">
        <GlobalSearch busca={busca} onBuscaChange={setBusca} />
      </div>

      {/* Category filter */}
      <CategoryBar categoriaAtiva={categoriaAtiva} onCategoriaChange={setCategoriaAtiva} />

      {/* Featured deals */}
      <FeaturedDeals />

      {/* Loyalty banner */}
      <LoyaltyBanner />

      {/* Featured products across stores */}
      {destaques.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 mt-12">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Ofertas em Destaque</h2>
              <p className="text-xs text-muted-foreground">Os melhores preços do bairro</p>
            </div>
          </div>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {destaques.map((p) => (
              <div
                key={`${p.storeId}-${p.id}`}
                className="rounded-2xl border bg-card p-4 transition-all hover:shadow-md"
              >
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {p.storeName}
                </span>
                <h4 className="mt-1 font-semibold text-card-foreground text-sm truncate">{p.nome}</h4>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">
                    R$ {p.preco.toFixed(2).replace(".", ",")}
                  </span>
                  {p.precoOriginal && (
                    <span className="text-xs text-muted-foreground line-through">
                      R$ {p.precoOriginal.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Open stores */}
      <section className="mx-auto max-w-6xl px-4 mt-12">
        {abertos.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--success))]/10">
                <Store className="h-4 w-4 text-[hsl(var(--success))]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Abertos agora{" "}
                  <span className="text-primary">({abertos.length})</span>
                </h2>
                <p className="text-xs text-muted-foreground">Peça agora e receba em minutos</p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {abertos.map((m) => (
                <StoreCard key={m.id} market={m} />
              ))}
            </div>
          </>
        )}

        {fechados.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-5 mt-12">
              <h2 className="text-lg font-semibold text-muted-foreground">Fechados no momento</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 opacity-60">
              {fechados.map((m) => (
                <StoreCard key={m.id} market={m} />
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">Nenhum mercado encontrado</p>
            <p className="text-sm mt-1">Tente buscar por outro nome ou categoria</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Index;
