import { MapPin, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { itemCount, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">E</span>
          </div>
          <span className="text-xl font-bold text-foreground">O Entorno</span>
        </Link>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Lagoa Azul - Conj. Boa Esperança</span>
          <span className="sm:hidden">Lagoa Azul</span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="relative rounded-lg p-2 transition-colors hover:bg-secondary"
        >
          <ShoppingCart className="h-5 w-5 text-foreground" />
          {itemCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent p-0 text-[10px] text-accent-foreground">
              {itemCount}
            </Badge>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
