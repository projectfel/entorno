import { Star, Clock, MapPin, Truck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Supermarket } from "@/data/mockData";

interface StoreCardProps {
  market: Supermarket;
}

const StoreCard = ({ market }: StoreCardProps) => {
  return (
    <Link
      to={`/mercado/${market.id}`}
      className="group block overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={market.imagem}
          alt={market.nome}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        
        {/* Status badge */}
        {market.aberto ? (
          <Badge className="absolute left-3 top-3 bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] border-0 gap-1">
            <Zap className="h-3 w-3" />
            Aberto
          </Badge>
        ) : (
          <Badge variant="secondary" className="absolute left-3 top-3 gap-1 opacity-90">
            <Clock className="h-3 w-3" />
            Fechado
          </Badge>
        )}

        {/* Delivery time */}
        <div className="absolute right-3 top-3 rounded-lg bg-card/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-card-foreground">
          {market.tempoEntregaMin}-{market.tempoEntregaMax} min
        </div>

        {/* Store name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-primary-foreground drop-shadow-md">{market.nome}</h3>
          <p className="text-xs text-primary-foreground/80 mt-0.5 line-clamp-1">{market.descricao}</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        {/* Rating & distance */}
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 font-medium text-card-foreground">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {market.avaliacao}
            <span className="text-muted-foreground font-normal">({market.totalAvaliacoes})</span>
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {market.distancia}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            {market.taxaEntrega === 0 ? (
              <span className="text-[hsl(var(--success))] font-medium">Grátis</span>
            ) : (
              `R$ ${market.taxaEntrega.toFixed(2).replace(".", ",")}`
            )}
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {market.categorias.slice(0, 4).map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground uppercase tracking-wider"
            >
              {cat}
            </span>
          ))}
          {market.categorias.length > 4 && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              +{market.categorias.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;
