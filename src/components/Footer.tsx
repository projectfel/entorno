import { Link } from "react-router-dom";
import { Shield, Sprout, Compass } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mt-24 border-t border-border/60 bg-card/60 backdrop-blur">
      {/* Organic wave divider */}
      <svg
        className="absolute -top-px left-0 w-full h-8 text-card/60"
        viewBox="0 0 1440 32"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,16 C240,32 480,0 720,16 C960,32 1200,0 1440,16 L1440,32 L0,32 Z"
          fill="currentColor"
        />
      </svg>

      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* Manifesto strip */}
        <p className="font-display text-center text-xl sm:text-2xl text-foreground/90 italic leading-snug max-w-2xl mx-auto mb-12">
          “O bairro é uma forma silenciosa de pertencer.
          <br className="hidden sm:block" />
          O Entorno apenas devolve essa presença a você.”
        </p>

        {/* Values bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 pb-10 border-b border-border/40">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sprout className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-base text-foreground">Comércio que floresce</p>
              <p className="text-xs text-muted-foreground mt-0.5">cada compra cuida do vizinho</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Compass className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-display text-base text-foreground">Presença próxima</p>
              <p className="text-xs text-muted-foreground mt-0.5">direto do mercado do seu entorno</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--success))]/10">
              <Shield className="h-5 w-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="font-display text-base text-foreground">Estrutura sem golpes</p>
              <p className="text-xs text-muted-foreground mt-0.5">posicionamento honesto, sempre</p>
            </div>
          </div>
        </div>

        {/* Wordmark + links */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary shadow-soft transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-105">
              <span className="font-display text-lg italic text-primary-foreground leading-none">e</span>
            </div>
            <div className="leading-tight">
              <span className="font-display text-lg text-foreground">O Entorno</span>
              <p className="text-[10px] text-muted-foreground tracking-[0.18em] uppercase mt-0.5">
                pequenos mercados · grandes momentos
              </p>
            </div>
          </Link>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/termos" className="hover:text-foreground transition-colors duration-500">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="hover:text-foreground transition-colors duration-500">
              Privacidade
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-5 text-center text-[10px] text-muted-foreground tracking-wider leading-relaxed">
          <p className="italic">
            Plataforma de intermediação — a presença, o cuidado e a entrega pertencem ao mercado parceiro.
          </p>
          <p className="mt-2">© 2026 O Entorno · feito devagar, com cuidado.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
