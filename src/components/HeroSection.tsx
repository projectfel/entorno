import { Search, Zap, Clock, ShieldCheck } from "lucide-react";

interface HeroSectionProps {
  busca: string;
  onBuscaChange: (value: string) => void;
}

const HeroSection = ({ busca, onBuscaChange }: HeroSectionProps) => {
  return (
    <section className="relative border-b border-border/60 gradient-sky">
      <div className="mx-auto max-w-3xl px-4 pt-14 pb-12 sm:pt-20 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-breathe" />
          Mercados de Lagoa Azul, ao vivo
        </div>

        <h1 className="font-display mt-5 text-4xl sm:text-5xl leading-[1.08] text-foreground animate-fade-in">
          Seu mercado do bairro,
          <br />
          <span className="text-primary">em poucos toques.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground animate-slide-up">
          Busque, monte o carrinho e finalize no WhatsApp. Simples e rápido.
        </p>

        <div className="mt-7 animate-slide-up">
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar mercado ou produto"
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              aria-label="Buscar mercado ou produto"
              className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-card-foreground shadow-soft placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>
        </div>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Pedido em menos de 1 minuto
          </li>
          <li className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            Entrega em 30–60 min
          </li>
          <li className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Total validado no servidor
          </li>
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;
