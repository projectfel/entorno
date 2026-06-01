import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, MapPin, Truck, Heart, Share2, MessageCircle, BadgeCheck, Instagram, Facebook, Phone, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/hooks/useStores";
import { useProducts } from "@/hooks/useProducts";
import { getStoreStatusLabel } from "@/lib/storeStatus";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/StoreSkeleton";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";

const MarketPage = () => {
  const { id } = useParams();
  const { data: store, isLoading: storeLoading } = useStore(id);
  const { data: products, isLoading: productsLoading } = useProducts(id);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  if (storeLoading) {
    return (
      <main className="pb-8">
        <Skeleton className="h-60 sm:h-80 w-full rounded-none" />
        <div className="mx-auto max-w-6xl px-4 mt-6 space-y-3">
          {[1, 2, 3, 4].map((i) => <ProductCardSkeleton key={i} />)}
        </div>
      </main>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏪</div>
          <p className="text-xl font-bold text-foreground">Mercado não encontrado</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  const { label: statusLabel, isOpen } = getStoreStatusLabel(store);

  // Build categories from products
  const categories = [...new Set((products || []).map((p) => p.categories?.name).filter(Boolean))];
  const filteredProducts = categoriaAtiva
    ? (products || []).filter((p) => p.categories?.name === categoriaAtiva)
    : (products || []);

  return (
    <main className="pb-8">
      <SEOHead
        title={store.name ?? "Mercado"}
        description={store.description ?? `Confira os produtos de ${store.name} no Entorno`}
        image={store.cover_image ?? undefined}
        url={`https://entorno.lovable.app/mercado/${store.id}`}
        type="store"
        storeName={store.name ?? undefined}
        storeAddress={store.address ?? undefined}
        storeRating={store.rating ?? undefined}
        storeReviewCount={store.total_ratings ?? undefined}
      />
      {/* Banner */}
      <div className="relative h-60 sm:h-80 overflow-hidden">
        {store.cover_image ? (
          <img src={store.cover_image} alt={store.name} className="h-full w-full object-cover scale-105" />
        ) : (
          <div className="h-full w-full gradient-garden flex items-center justify-center">
            <span className="text-6xl">🌿</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-foreground/20" />
        <div className="absolute inset-0 bg-grain opacity-30 mix-blend-overlay" />

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm text-card-foreground hover:bg-card transition-all hover:-translate-x-0.5 shadow-soft">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm text-card-foreground shadow-soft hover:scale-110 transition-transform">
              <Heart className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm text-card-foreground shadow-soft hover:scale-110 transition-transform">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 p-4 sm:p-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-2 mb-2">
              {isOpen ? (
                <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] border-0 rounded-full px-3 animate-breathe">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  Aberto agora
                </Badge>
              ) : (
                <Badge variant="secondary" className="rounded-full px-3">{statusLabel}</Badge>
              )}
              <Badge variant="outline" className="bg-card/60 backdrop-blur-sm border-border/50 rounded-full px-3">
                {store.delivery_time_min ?? 30}–{store.delivery_time_max ?? 60} min
              </Badge>
              {store.year_founded && (
                <Badge variant="outline" className="bg-card/60 backdrop-blur-sm border-border/50 hidden sm:inline-flex rounded-full px-3">
                  <CalendarDays className="h-3 w-3 mr-1" />Desde {store.year_founded}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Organic curve — the garden meets the page */}
        <svg
          className="absolute -bottom-px left-0 right-0 w-full h-10 sm:h-14 text-background"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,80 C240,10 480,60 720,40 C960,20 1200,70 1440,30 L1440,80 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Identity header (logo + name + verified + slogan) */}
      <div className="mx-auto max-w-6xl px-4 -mt-14 sm:-mt-16 relative z-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground mb-2 animate-fade-in">
          Você está em
        </p>
        <div className="flex items-end gap-4">
          <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl overflow-hidden bg-card border-4 border-background shadow-bloom shrink-0 animate-breathe">
            {store.logo_url ? (
              <img src={store.logo_url} alt={`Logo ${store.name}`} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-secondary text-3xl">🌿</div>
            )}
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground truncate tracking-tight">
                {store.name}
              </h1>
              {store.verified && (
                <span title="Loja verificada" className="inline-flex items-center text-primary">
                  <BadgeCheck className="h-6 w-6" fill="currentColor" stroke="hsl(var(--primary-foreground))" />
                </span>
              )}
            </div>
            {store.slogan && (
              <p className="font-display text-sm sm:text-base text-muted-foreground italic mt-1">"{store.slogan}"</p>
            )}
          </div>
        </div>
        {store.description && (
          <p className="text-sm text-muted-foreground mt-4 max-w-2xl leading-relaxed">{store.description}</p>
        )}
        {store.specialties && store.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {store.specialties.map((s) => (
              <Badge key={s} variant="secondary" className="text-xs rounded-full px-3">{s}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="mx-auto max-w-6xl px-4 mt-4">
        <div className="flex items-center gap-5 text-sm overflow-x-auto pb-2">
          <span className="flex items-center gap-1 font-medium text-foreground shrink-0">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {store.rating ?? 0}
            <span className="text-muted-foreground font-normal">({store.total_ratings ?? 0})</span>
          </span>
          {store.address && (
            <span className="flex items-center gap-1 text-muted-foreground shrink-0">
              <MapPin className="h-3.5 w-3.5" />
              {store.address}
            </span>
          )}
          {store.opens_at && store.closes_at && (
            <span className="flex items-center gap-1 text-muted-foreground shrink-0">
              <Clock className="h-3.5 w-3.5" />
              {String(store.opens_at).slice(0,5)} - {String(store.closes_at).slice(0,5)}
            </span>
          )}
          <span className="flex items-center gap-1 text-muted-foreground shrink-0">
            <Truck className="h-3.5 w-3.5" />
            Taxa: R$ {Number(store.delivery_fee ?? 0).toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* Contact / social row */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {store.whatsapp && (
            <a
              href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-[#1da851] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}
          {store.phone && (
            <a
              href={`tel:${store.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-2 rounded-xl bg-card border px-4 py-2.5 text-sm font-medium text-card-foreground hover:bg-secondary transition-colors"
            >
              <Phone className="h-4 w-4" />
              Ligar
            </a>
          )}
          {store.instagram && (
            <a
              href={store.instagram.startsWith("http") ? store.instagram : `https://instagram.com/${store.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-card border text-card-foreground hover:bg-secondary transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
          )}
          {store.facebook && (
            <a
              href={store.facebook.startsWith("http") ? store.facebook : `https://facebook.com/${store.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-card border text-card-foreground hover:bg-secondary transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>


      {/* Categories filter */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 mt-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setCategoriaAtiva(null)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${!categoriaAtiva ? "bg-primary text-primary-foreground shadow-md" : "bg-card text-card-foreground border hover:bg-secondary"}`}
            >
              Todos ({(products || []).length})
            </button>
            {categories.map((cat) => {
              const count = (products || []).filter((p) => p.categories?.name === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoriaAtiva(cat!)}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${categoriaAtiva === cat ? "bg-primary text-primary-foreground shadow-md" : "bg-card text-card-foreground border hover:bg-secondary"}`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="mx-auto max-w-6xl px-4 mt-8">
        <h2 className="mb-5 font-display text-2xl font-medium text-foreground">
          {categoriaAtiva || "Tudo o que está fresco hoje"}{" "}
          <span className="text-muted-foreground font-normal text-base font-sans">· {filteredProducts.length}</span>
        </h2>
        {productsLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <div className="text-4xl mb-3">📦</div>
            <p className="font-medium">Nenhum produto disponível</p>
            <p className="text-sm mt-1">Este mercado ainda não adicionou produtos</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                storeId={store.id ?? ""}
                storeName={store.name ?? ""}
                storeWhatsapp={(store as any).whatsapp ?? ""}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MarketPage;
