import { Plus, Check, Minus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
  marketId: string;
  marketNome: string;
  marketWhatsapp: string;
}

const ProductCard = ({ product, marketId, marketNome, marketWhatsapp }: ProductCardProps) => {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.id === product.id && i.marketId === marketId);
  const quantity = cartItem?.quantidade || 0;

  const handleAdd = () => {
    addItem(product, marketId, marketNome, marketWhatsapp);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  const hasDiscount = product.precoOriginal && product.precoOriginal > product.preco;
  const desconto = hasDiscount
    ? Math.round(((product.precoOriginal! - product.preco) / product.precoOriginal!) * 100)
    : 0;

  return (
    <div className="group relative flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all duration-200 hover:shadow-md">
      {/* Discount badge */}
      {hasDiscount && (
        <Badge className="absolute -right-1 -top-2 bg-destructive text-destructive-foreground border-0 text-[10px] px-2">
          -{desconto}%
        </Badge>
      )}

      {product.destaque && !hasDiscount && (
        <Badge className="absolute -right-1 -top-2 bg-accent text-accent-foreground border-0 text-[10px] px-2">
          ⭐ Destaque
        </Badge>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {product.categoria}
        </p>
        <h4 className="mt-0.5 font-semibold text-card-foreground truncate">{product.nome}</h4>
        {product.unidade && (
          <span className="text-xs text-muted-foreground">{product.unidade}</span>
        )}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            R$ {product.preco.toFixed(2).replace(".", ",")}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              R$ {product.precoOriginal!.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
      </div>

      {/* Quantity controls */}
      {quantity > 0 ? (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (quantity <= 1) removeItem(product.id, marketId);
              else updateQuantity(product.id, marketId, quantity - 1);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-bold text-card-foreground">{quantity}</span>
          <button
            onClick={handleAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
            added
              ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] scale-110"
              : "bg-primary text-primary-foreground hover:shadow-md active:scale-95"
          }`}
        >
          {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
};

export default ProductCard;
