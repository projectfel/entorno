import { useState } from "react";
import { Pencil, Copy, Trash2, Star, StarOff, Tag, AlertTriangle, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { productsService } from "@/services/products";
import { useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  unit: string | null;
  image_url: string | null;
  featured: boolean | null;
  in_stock: boolean | null;
  stock_quantity: number;
  low_stock_threshold: number;
  sku?: string | null;
  categories?: { name: string } | null;
}

interface Props {
  product: Product;
  onEdit: () => void;
}

export default function ProductInlineRow({ product: p, onEdit }: Props) {
  const queryClient = useQueryClient();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [editingField, setEditingField] = useState<"price" | "stock" | null>(null);
  const [tmpValue, setTmpValue] = useState<string>("");

  const hasDiscount = p.original_price && Number(p.original_price) > Number(p.price);
  const low = p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold;
  const out = p.stock_quantity <= 0;

  const startEdit = (field: "price" | "stock", current: number) => {
    setEditingField(field);
    setTmpValue(String(current));
  };

  const commitEdit = async () => {
    if (!editingField) return;
    const n = parseFloat(tmpValue.replace(",", "."));
    if (Number.isNaN(n) || n < 0) {
      setEditingField(null);
      return;
    }
    const key = editingField === "price" ? "price" : "stock_quantity";
    setEditingField(null);
    const toastId = toast.loading("Salvando...");
    try {
      await updateProduct.mutateAsync({ id: p.id, updates: { [key]: n } });
      toast.success("Atualizado", { id: toastId });
    } catch {
      toast.error("Erro ao salvar", { id: toastId });
    }
  };

  const handleDuplicate = async () => {
    const toastId = toast.loading("Duplicando produto...");
    try {
      await productsService.duplicate(p.id);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto duplicado!", { id: toastId });
    } catch {
      toast.error("Erro ao duplicar", { id: toastId });
    }
  };

  const handleTogglePromo = async () => {
    try {
      await updateProduct.mutateAsync({ id: p.id, updates: { featured: !p.featured } });
    } catch {
      toast.error("Erro");
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Removendo...");
    try {
      await deleteProduct.mutateAsync(p.id);
      toast.success("Removido", { id: toastId });
    } catch {
      toast.error("Erro ao remover", { id: toastId });
    }
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-secondary/50">
      {p.image_url ? (
        <img src={p.image_url} alt={p.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-secondary flex-shrink-0" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="font-medium text-card-foreground truncate">{p.name}</p>
          {p.featured && <Star className="h-3 w-3 fill-accent text-accent" />}
          {hasDiscount && <Badge className="bg-destructive text-destructive-foreground border-0 text-[9px] px-1.5">PROMO</Badge>}
          {p.sku && <span className="text-[10px] text-muted-foreground">#{p.sku}</span>}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {p.categories?.name && (
            <Badge variant="outline" className="text-[9px] px-1.5 gap-0.5">
              <Tag className="h-2.5 w-2.5" />
              {p.categories.name}
            </Badge>
          )}
          {p.unit && <span className="text-[11px] text-muted-foreground">{p.unit}</span>}
        </div>
      </div>

      {/* Inline price */}
      <div className="text-right">
        <p className="text-[10px] text-muted-foreground">Preço</p>
        {editingField === "price" ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              type="number"
              step="0.01"
              value={tmpValue}
              onChange={(e) => setTmpValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditingField(null); }}
              onBlur={commitEdit}
              className="w-20 rounded border bg-background px-1.5 py-0.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ) : (
          <button
            onClick={() => startEdit("price", Number(p.price))}
            className="text-sm font-bold text-primary hover:underline"
            title="Editar preço"
          >
            R$ {Number(p.price).toFixed(2).replace(".", ",")}
          </button>
        )}
      </div>

      {/* Inline stock */}
      <div className="text-right">
        <p className="text-[10px] text-muted-foreground flex items-center justify-end gap-0.5">
          {low && !out && <AlertTriangle className="h-2.5 w-2.5 text-accent" />}
          {out && <AlertTriangle className="h-2.5 w-2.5 text-destructive" />}
          Estoque
        </p>
        {editingField === "stock" ? (
          <input
            autoFocus
            type="number"
            value={tmpValue}
            onChange={(e) => setTmpValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditingField(null); }}
            onBlur={commitEdit}
            className="w-16 rounded border bg-background px-1.5 py-0.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        ) : (
          <button
            onClick={() => startEdit("stock", p.stock_quantity)}
            className={`text-sm font-semibold hover:underline ${out ? "text-destructive" : low ? "text-accent" : "text-foreground"}`}
            title="Editar estoque"
          >
            {p.stock_quantity}
          </button>
        )}
      </div>

      <div className="flex items-center gap-0.5 ml-auto">
        <button onClick={handleTogglePromo} title={p.featured ? "Remover destaque" : "Destacar"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors">
          {p.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
        </button>
        <button onClick={handleDuplicate} title="Duplicar"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Copy className="h-4 w-4" />
        </button>
        <button onClick={onEdit} title="Editar"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Pencil className="h-4 w-4" />
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
              <AlertDialogDescription>"{p.name}" será removido permanentemente.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
