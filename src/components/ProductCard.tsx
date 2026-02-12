import { Plus, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
  marketId: string;
  marketNome: string;
  marketWhatsapp: string;
}

const ProductCard = ({ product, marketId, marketNome, marketWhatsapp }: ProductCardProps) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, marketId, marketNome, marketWhatsapp);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.categoria}
        </p>
        <h4 className="mt-1 font-semibold text-card-foreground truncate">{product.nome}</h4>
        <p className="mt-1 text-lg font-bold text-primary">
          R$ {product.preco.toFixed(2).replace(".", ",")}
        </p>
      </div>
      <button
        onClick={handleAdd}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
          added
            ? "bg-primary text-primary-foreground scale-110"
            : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default ProductCard;
