import { Search } from "lucide-react";
import { useState } from "react";
import { supermarkets } from "@/data/mockData";
import MarketCard from "@/components/MarketCard";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const [busca, setBusca] = useState("");

  const filtered = supermarkets.filter(
    (m) =>
      m.nome.toLowerCase().includes(busca.toLowerCase()) ||
      m.categorias.some((c) => c.toLowerCase().includes(busca.toLowerCase()))
  );

  const abertos = filtered.filter((m) => m.aberto);
  const fechados = filtered.filter((m) => !m.aberto);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src={heroBanner}
          alt="Mercado do bairro Lagoa Azul"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground animate-fade-in">
              O Entorno
            </h1>
            <p className="mt-1 text-muted-foreground animate-slide-up">
              Seu mercado de bairro, a um toque de distância
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="mx-auto max-w-6xl px-4 -mt-5 relative z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar mercados ou categorias..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-xl border bg-card py-3.5 pl-12 pr-4 text-card-foreground shadow-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </section>

      {/* Open markets */}
      <section className="mx-auto max-w-6xl px-4 mt-8">
        {abertos.length > 0 && (
          <>
            <h2 className="mb-4 text-xl font-bold text-foreground">
              Abertos agora <span className="text-primary">({abertos.length})</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {abertos.map((m) => (
                <MarketCard key={m.id} market={m} />
              ))}
            </div>
          </>
        )}

        {fechados.length > 0 && (
          <>
            <h2 className="mb-4 mt-10 text-xl font-bold text-foreground">
              Fechados no momento
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-70">
              {fechados.map((m) => (
                <MarketCard key={m.id} market={m} />
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">Nenhum mercado encontrado</p>
            <p className="text-sm mt-1">Tente buscar por outro nome ou categoria</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Index;
