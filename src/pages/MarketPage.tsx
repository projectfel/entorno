import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { supermarkets } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";

const MarketPage = () => {
  const { id } = useParams();
  const market = supermarkets.find((m) => m.id === id);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  if (!market) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">Mercado não encontrado</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const produtosFiltrados = categoriaAtiva
    ? market.produtos.filter((p) => p.categoria === categoriaAtiva)
    : market.produtos;

  return (
    <main>
      {/* Banner */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src={market.imagem}
          alt={market.nome}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <Link
          to="/"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{market.nome}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                {market.avaliacao}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {market.endereco}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {market.horario}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories filter */}
      <section className="mx-auto max-w-6xl px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setCategoriaAtiva(null)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !categoriaAtiva
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            Todos
          </button>
          {market.categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                categoriaAtiva === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-4 mt-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          {categoriaAtiva || "Todos os produtos"}{" "}
          <span className="text-muted-foreground font-normal">({produtosFiltrados.length})</span>
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {produtosFiltrados.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              marketId={market.id}
              marketNome={market.nome}
              marketWhatsapp={market.whatsapp}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default MarketPage;
