import { useState } from "react";
import { Package, Store, Clock, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supermarkets } from "@/data/mockData";
import type { Product } from "@/data/mockData";

const Dashboard = () => {
  const market = supermarkets[0]; // Simulating logged-in store owner
  const [produtos, setProdutos] = useState<Product[]>(market.produtos);
  const [lojaAberta, setLojaAberta] = useState(market.aberto);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("Mercearia");
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (!novoNome || !novoPreco) return;
    const novo: Product = {
      id: String(Date.now()),
      nome: novoNome,
      preco: parseFloat(novoPreco),
      categoria: novaCategoria,
    };
    setProdutos([...produtos, novo]);
    setNovoNome("");
    setNovoPreco("");
    setShowAdd(false);
  };

  const handleRemove = (id: string) => {
    setProdutos(produtos.filter((p) => p.id !== id));
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao marketplace
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Painel do Lojista</h1>
        <p className="text-muted-foreground">{market.nome}</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{produtos.length}</p>
              <p className="text-sm text-muted-foreground">Produtos</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Store className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{market.categorias.length}</p>
              <p className="text-sm text-muted-foreground">Categorias</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <button
                onClick={() => setLojaAberta(!lojaAberta)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  lojaAberta
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {lojaAberta ? "Aberto" : "Fechado"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products management */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Seus Produtos</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 rounded-xl border bg-card p-4 animate-scale-in">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Nome do produto"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Preço (R$)"
              value={novoPreco}
              onChange={(e) => setNovoPreco(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <select
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {market.categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAdd}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Salvar Produto
          </button>
        </div>
      )}

      <div className="space-y-2">
        {produtos.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border bg-card p-4 transition-colors hover:bg-secondary/50"
          >
            <div>
              <p className="font-medium text-card-foreground">{p.nome}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-bold text-primary">
                  R$ {p.preco.toFixed(2).replace(".", ",")}
                </span>
                <span className="text-xs rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
                  {p.categoria}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleRemove(p.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Dashboard;
