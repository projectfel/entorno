import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <p className="font-bold text-foreground">O Entorno</p>
            <p className="text-sm text-muted-foreground">
              Marketplace do seu bairro
            </p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/termos" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Área do Lojista
            </Link>
          </div>
        </div>
        <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
          <p>
            O Entorno é uma plataforma de intermediação de informações e anúncios. 
            A responsabilidade pela separação, qualidade e entrega dos produtos é exclusivamente dos supermercados parceiros.
          </p>
          <p className="mt-2">© 2026 O Entorno. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
