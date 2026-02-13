import { MapPin, ShoppingCart, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { itemCount, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
            <span className="text-lg font-black text-primary-foreground">E</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-foreground leading-none">O Entorno</span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Marketplace de Bairro</p>
          </div>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="text-secondary-foreground text-xs font-medium hidden sm:inline">
            Lagoa Azul — Boa Esperança
          </span>
          <span className="text-secondary-foreground text-xs font-medium sm:hidden">
            Lagoa Azul
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-secondary transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent p-0 text-[10px] text-accent-foreground border-2 border-background">
                {itemCount}
              </Badge>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
