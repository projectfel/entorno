import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-display text-sm text-primary-foreground leading-none">e</span>
            </div>
            <div className="leading-tight">
              <span className="font-display text-base text-foreground">O Entorno</span>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                mercados do seu bairro
              </p>
            </div>
          </Link>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/termos" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-5 text-center text-[11px] text-muted-foreground">
          <p>Plataforma de intermediação — a entrega é responsabilidade do mercado parceiro.</p>
          <p className="mt-1.5">© 2026 O Entorno</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
