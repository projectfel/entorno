import { Search, MapPin } from "lucide-react";
import heroPremium from "@/assets/hero-premium.jpg";

interface HeroSectionProps {
  busca: string;
  onBuscaChange: (value: string) => void;
}

const HeroSection = ({ busca, onBuscaChange }: HeroSectionProps) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[460px] sm:h-[520px]">
        <img
          src={heroPremium}
          alt="O Entorno — Mercados do bairro"
          className="h-full w-full object-cover scale-105 animate-sway"
        />
        {/* Soft organic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/55 via-foreground/30 to-background/95" />
        <div className="absolute inset-0 bg-grain opacity-40 mix-blend-overlay" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="flex items-center gap-2 rounded-full bg-background/15 px-4 py-1.5 backdrop-blur-md border border-background/25 mb-5 animate-fade-in animate-breathe">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--sage))]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground">
              {greeting}, vizinho
            </span>
          </div>

          <h1
            className="font-display text-center text-5xl sm:text-6xl lg:text-7xl font-medium text-primary-foreground tracking-tight animate-fade-in"
            style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}
          >
            O Entorno
          </h1>
          <p className="mt-4 text-center text-base sm:text-lg text-primary-foreground/85 max-w-md font-light animate-slide-up leading-relaxed">
            O tempo passa devagar quando o mercado é do seu bairro.
          </p>

          <div className="mt-5 flex items-center gap-1.5 text-primary-foreground/70 animate-slide-up">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Lagoa Azul — Conj. Boa Esperança</span>
          </div>

          <div className="mt-7 w-full max-w-lg animate-slide-up">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Procure um mercado, um produto, uma lembrança..."
                value={busca}
                onChange={(e) => onBuscaChange(e.target.value)}
                className="w-full rounded-full border-0 bg-card/95 backdrop-blur-md py-4 pl-14 pr-5 text-card-foreground shadow-bloom placeholder:text-muted-foreground placeholder:font-light focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Organic curve at the bottom — the garden meets the page */}
        <svg
          className="absolute -bottom-px left-0 right-0 w-full h-12 sm:h-16 text-background"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,80 C240,10 480,60 720,40 C960,20 1200,70 1440,30 L1440,80 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
