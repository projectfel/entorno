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
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary/40">
      {/* Discount badge */}
      <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground border-0 gap-1">
        <Flame className="h-3 w-3" />
        -{desconto}%
      </Badge>

      <div className="space-y-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-primary">Combo</span>
          <h4 className="font-medium text-card-foreground text-sm leading-tight line-clamp-1">{combo.nome}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{combo.descricao}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-foreground">
              R$ {combo.precoCombo.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-[10px] text-muted-foreground line-through">
              R$ {combo.precoOriginal.toFixed(2).replace(".", ",")}
            </span>
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
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
