import { memo } from "react";
import { Flame, ShoppingCart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComboData {
  id: string;
  nome: string;
  descricao: string;
  precoCombo: number;
  precoOriginal: number;
  itens: string[];
}

interface ComboCardProps {
  combo: ComboData;
  onAdd?: () => void;
}

const ComboCard = memo(({ combo, onAdd }: ComboCardProps) => {
  const desconto = Math.round(((combo.precoOriginal - combo.precoCombo) / combo.precoOriginal) * 100);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[hsl(var(--gold))]/20 bg-gradient-to-br from-card via-card to-[hsl(var(--gold))]/5 p-3.5 transition-all duration-500 hover:shadow-[0_8px_40px_-12px_hsl(var(--gold)/0.25)] hover:-translate-y-0.5">
      {/* Premium shimmer line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-700" />

      {/* Discount badge */}
      <Badge className="absolute right-3 top-3 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(38,60%,45%)] text-white border-0 gap-1 shadow-lg shadow-[hsl(var(--gold))]/20 font-bold">
        <Flame className="h-3 w-3" />
        -{desconto}%
      </Badge>

      <div className="space-y-2">
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <Sparkles className="h-3 w-3 text-[hsl(var(--gold))]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[hsl(var(--gold))]">Oferta Exclusiva</span>
          </div>
          <h4 className="font-bold text-card-foreground text-sm leading-tight line-clamp-1">{combo.nome}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{combo.descricao}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[hsl(var(--gold))]/10">
          <div className="flex flex-col leading-tight">
            <span className="text-base font-extrabold bg-gradient-to-r from-primary to-[hsl(var(--gold))] bg-clip-text text-transparent">
              R$ {combo.precoCombo.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-[10px] text-muted-foreground line-through">
              R$ {combo.precoOriginal.toFixed(2).replace(".", ",")}
            </span>
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-primary to-[hsl(150,32%,30%)] px-3 py-1.5 text-xs font-medium text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Pedir
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ComboCard.displayName = "ComboCard";

export default ComboCard;
