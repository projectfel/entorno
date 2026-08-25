import { memo } from "react";
import { Star, Clock, MapPin, Truck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { getStoreStatusLabel } from "@/lib/storeStatus";
import type { Tables } from "@/integrations/supabase/types";

type PublicStore = Tables<"stores"> | Tables<"stores_public">;

interface StoreCardProps {
  store: PublicStore;
}

const StoreCard = memo(({ store }: StoreCardProps) => {
  const { label, isOpen } = getStoreStatusLabel(store);

  return (
    <Link
      to={`/mercado/${store.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-muted">
        {store.cover_image ? (
          <img src={store.cover_image} alt={store.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full bg-secondary flex items-center justify-center">
            <span className="text-3xl">🏪</span>
          </div>
        )}

        {isOpen ? (
          <Badge className="absolute left-3 top-3 bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] border-0 gap-1">
            <Zap className="h-3 w-3" />
            Aberto
          </Badge>
        ) : (
          <Badge variant="secondary" className="absolute left-3 top-3 gap-1">
            <Clock className="h-3 w-3" />
            {label}
          </Badge>
        )}

        <div className="absolute right-3 top-3 rounded-md bg-card px-2 py-0.5 text-xs font-medium text-card-foreground">
          {store.delivery_time_min ?? 30}-{store.delivery_time_max ?? 60} min
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2.5">
        <div>
          <h3 className="font-display text-base text-card-foreground">{store.name}</h3>
          {store.description && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{store.description}</p>}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 font-medium text-card-foreground">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {store.rating ?? 0}
            <span className="text-muted-foreground font-normal">({store.total_ratings ?? 0})</span>
          </span>
          {store.neighborhood && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {store.neighborhood}
            </span>
          )}
          <span className="flex items-center gap-1 text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            {(store.delivery_fee ?? 0) === 0 ? (
              <span className="text-[hsl(var(--success))] font-medium">Grátis</span>
            ) : (
              `R$ ${Number(store.delivery_fee).toFixed(2).replace(".", ",")}`
            )}
          </span>
        </div>
      </div>
    </Link>
  );
});

StoreCard.displayName = "StoreCard";

export default StoreCard;
