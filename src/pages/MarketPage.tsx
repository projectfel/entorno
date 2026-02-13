import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, MapPin, Truck, MessageCircle, Share2, Heart } from "lucide-react";
import { useState } from "react";
import { supermarkets } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";
import ComboCard from "@/components/ComboCard";
import { Badge } from "@/components/ui/badge";

const MarketPage = () => {
  const { id } = useParams();
  const market = supermarkets.find((m) => m.id === id);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  if (!market) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏪</div>
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
    <main className="pb-8">
      {/* Banner */}
      <div className="relative h-60 sm:h-80 overflow-hidden">
        <img
          src={market.imagem}
          alt={market.nome}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-foreground/20" />

        {/* Nav */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card/90 backdrop-blur-sm text-card-foreground hover:bg-card transition-colors shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card/90 backdrop-blur-sm text-card-foreground shadow-md">
              <Heart className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card/90 backdrop-blur-sm text-card-foreground shadow-md">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Store info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-2 mb-2">
              {market.aberto ? (
                <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] border-0">
                  Aberto agora
                </Badge>
              ) : (
                <Badge variant="secondary">Fechado</Badge>
              )}
              <Badge variant="outline" className="bg-card/50 backdrop-blur-sm border-border/50">
                {market.tempoEntregaMin}-{market.tempoEntregaMax} min
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{market.nome}</h1>
            <p className="text-sm text-muted-foreground mt-1">{market.descricao}</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mx-auto max-w-6xl px-4 mt-4">
        <div className="flex items-center gap-5 text-sm overflow-x-auto pb-2">
          <span className="flex items-center gap-1 font-medium text-foreground shrink-0">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {market.avaliacao}
            <span className="text-muted-foreground font-normal">({market.totalAvaliacoes} avaliações)</span>
          </span>
          <span className="flex items-center gap-1 text-muted-foreground shrink-0">
            <MapPin className="h-3.5 w-3.5" />
            {market.endereco}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground shrink-0">
            <Clock className="h-3.5 w-3.5" />
            {market.horario}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground shrink-0">
            <Truck className="h-3.5 w-3.5" />
            Taxa: R$ {market.taxaEntrega.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      {/* Combos */}
      {market.combos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 mt-8">
          <h2 className="text-lg font-bold text-foreground mb-4">🔥 Combos Especiais</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {market.combos.map((combo) => (
              <ComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </section>
      )}

      {/* Categories filter */}
      <section className="mx-auto max-w-6xl px-4 mt-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setCategoriaAtiva(null)}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              !categoriaAtiva
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card text-card-foreground border hover:bg-secondary"
            }`}
          >
            Todos ({market.produtos.length})
          </button>
          {market.categorias.map((cat) => {
            const count = market.produtos.filter((p) => p.categoria === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  categoriaAtiva === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-card-foreground border hover:bg-secondary"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-4 mt-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          {categoriaAtiva || "Todos os produtos"}{" "}
          <span className="text-muted-foreground font-normal text-base">({produtosFiltrados.length})</span>
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
