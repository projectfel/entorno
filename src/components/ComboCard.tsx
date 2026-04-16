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
    <div className="group relative overflow-hidden rounded-2xl border border-[hsl(var(--gold))]/20 bg-gradient-to-br from-card via-card to-[hsl(var(--gold))]/5 p-5 transition-all duration-500 hover:shadow-[0_8px_40px_-12px_hsl(var(--gold)/0.25)] hover:-translate-y-1">
      {/* Premium shimmer line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-700" />

      {/* Discount badge */}
      <Badge className="absolute right-3 top-3 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(38,60%,45%)] text-white border-0 gap-1 shadow-lg shadow-[hsl(var(--gold))]/20 font-bold">
        <Flame className="h-3 w-3" />
        -{desconto}%
      </Badge>

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[hsl(var(--gold))]">Oferta Exclusiva</span>
          </div>
          <h4 className="font-bold text-card-foreground text-lg leading-tight">{combo.nome}</h4>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{combo.descricao}</p>
        </div>

        {combo.itens.length > 0 && (
          <div className="space-y-1">
            {combo.itens.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold))]" />
                {item}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--gold))]/10">
          <div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-[hsl(var(--gold))] bg-clip-text text-transparent">
              R$ {combo.precoCombo.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-sm text-muted-foreground line-through ml-2">
              R$ {combo.precoOriginal.toFixed(2).replace(".", ",")}
            </span>
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-[hsl(150,32%,30%)] px-4 py-2 text-sm font-medium text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95"
            >
              <ShoppingCart className="h-4 w-4" />
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
