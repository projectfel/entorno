import { Search, X, Store, ShoppingBag } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supermarkets } from "@/data/mockData";

interface GlobalSearchProps {
  busca: string;
  onBuscaChange: (value: string) => void;
}

interface SearchResult {
  type: "store" | "product";
  id: string;
  name: string;
  detail: string;
  storeId: string;
  price?: number;
}

const GlobalSearch = ({ busca, onBuscaChange }: GlobalSearchProps) => {
  const [showResults, setShowResults] = useState(false);

  const results = useMemo<SearchResult[]>(() => {
    if (!busca || busca.length < 2) return [];

    const query = busca.toLowerCase();
    const res: SearchResult[] = [];

    supermarkets.forEach((m) => {
      if (m.nome.toLowerCase().includes(query)) {
        res.push({
          type: "store",
          id: m.id,
          name: m.nome,
          detail: m.endereco,
          storeId: m.id,
        });
      }

      m.produtos.forEach((p) => {
        if (p.nome.toLowerCase().includes(query) || p.categoria.toLowerCase().includes(query)) {
          res.push({
            type: "product",
            id: `${m.id}-${p.id}`,
            name: p.nome,
            detail: `${m.nome} — R$ ${p.preco.toFixed(2).replace(".", ",")}`,
            storeId: m.id,
            price: p.preco,
          });
        }
      });
    });

    return res.slice(0, 8);
  }, [busca]);

  return (
    <div className="relative">
      {showResults && results.length > 0 && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)} />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border bg-card shadow-2xl overflow-hidden animate-scale-in">
            <div className="max-h-80 overflow-y-auto py-2">
              {results.map((r) => (
                <Link
                  key={r.id}
                  to={`/mercado/${r.storeId}`}
                  onClick={() => {
                    setShowResults(false);
                    onBuscaChange("");
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                    {r.type === "store" ? (
                      <Store className="h-4 w-4 text-primary" />
                    ) : (
                      <ShoppingBag className="h-4 w-4 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.detail}</p>
                  </div>
                  {r.price && (
                    <span className="text-sm font-bold text-primary shrink-0">
                      R$ {r.price.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Trigger focus handler */}
      <input
        type="text"
        className="hidden"
        onFocus={() => setShowResults(true)}
        onChange={() => setShowResults(true)}
        ref={(el) => {
          if (el && busca.length >= 2) setShowResults(true);
        }}
      />
      {busca.length >= 2 && !showResults && (
        <div className="hidden" ref={() => setShowResults(true)} />
      )}
    </div>
  );
};

export default GlobalSearch;
