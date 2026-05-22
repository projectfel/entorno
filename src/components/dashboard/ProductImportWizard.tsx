import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { Upload, X, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { productsService, type BulkProductRow } from "@/services/products";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type Row = Record<string, string | number | undefined>;

const FIELDS: Array<{ key: keyof BulkProductRow; label: string; required?: boolean; type: "string" | "number" }> = [
  { key: "name", label: "Nome", required: true, type: "string" },
  { key: "price", label: "Preço", required: true, type: "number" },
  { key: "unit", label: "Unidade (un, kg…)", type: "string" },
  { key: "description", label: "Descrição", type: "string" },
  { key: "sku", label: "SKU / código", type: "string" },
  { key: "stock_quantity", label: "Estoque", type: "number" },
  { key: "low_stock_threshold", label: "Alerta estoque baixo", type: "number" },
  { key: "original_price", label: "Preço original (promo)", type: "number" },
  { key: "image_url", label: "URL da imagem", type: "string" },
];

interface Props {
  storeId: string;
  onClose: () => void;
}

export default function ProductImportWizard({ storeId, onClose }: Props) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);

  const handleFile = async (file: File) => {
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Row>(ws, { defval: "" });
      if (!json.length) {
        toast.error("Planilha vazia");
        return;
      }
      const cols = Object.keys(json[0]);
      setHeaders(cols);
      setRows(json);
      // Heuristic auto-map
      const auto: Record<string, string> = {};
      FIELDS.forEach((f) => {
        const found = cols.find((c) =>
          c.toLowerCase().replace(/[_\s]/g, "").includes(f.key.toString().toLowerCase().replace(/[_\s]/g, "")) ||
          c.toLowerCase().includes(f.label.toLowerCase().split(" ")[0])
        );
        if (found) auto[f.key] = found;
      });
      setMapping(auto);
      setStep(2);
    } catch {
      toast.error("Não foi possível ler a planilha");
    }
  };

  const downloadTemplate = () => {
    const data = [
      { Nome: "Arroz Branco 5kg", Preço: 28.9, Unidade: "pct", Estoque: 50, SKU: "ARR-5KG", Descrição: "Tipo 1" },
      { Nome: "Feijão Carioca 1kg", Preço: 8.5, Unidade: "kg", Estoque: 80, SKU: "FEI-1KG", Descrição: "" },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produtos");
    XLSX.writeFile(wb, "modelo-produtos.xlsx");
  };

  const parsed = useMemo(() => {
    if (step < 2) return { valid: [] as BulkProductRow[], invalid: [] as { row: number; error: string }[] };
    const valid: BulkProductRow[] = [];
    const invalid: { row: number; error: string }[] = [];
    rows.forEach((r, idx) => {
      const obj: Partial<BulkProductRow> = {};
      let err: string | null = null;
      for (const f of FIELDS) {
        const col = mapping[f.key];
        if (!col) {
          if (f.required) err = `${f.label} obrigatório`;
          continue;
        }
        const raw = r[col];
        if (raw === "" || raw === undefined || raw === null) {
          if (f.required) err = `${f.label} vazio`;
          continue;
        }
        if (f.type === "number") {
          const n = typeof raw === "number" ? raw : parseFloat(String(raw).replace(",", "."));
          if (Number.isNaN(n)) { err = `${f.label} inválido`; continue; }
          (obj as Record<string, unknown>)[f.key] = n;
        } else {
          (obj as Record<string, unknown>)[f.key] = String(raw).trim();
        }
      }
      if (err) invalid.push({ row: idx + 2, error: err });
      else valid.push(obj as BulkProductRow);
    });
    return { valid, invalid };
  }, [rows, mapping, step]);

  const handleImport = async () => {
    if (!parsed.valid.length) return;
    setImporting(true);
    const toastId = toast.loading(`Importando ${parsed.valid.length} produto(s)...`);
    try {
      await productsService.bulkCreate(storeId, parsed.valid);
      toast.success(`${parsed.valid.length} produto(s) importado(s)!`, { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setStep(3);
    } catch (e) {
      toast.error("Erro ao importar produtos", { id: toastId, description: e instanceof Error ? e.message : "" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Importar produtos
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Passo {step} de 3</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Aceita .xlsx, .xls e .csv</p>
              <p>Você poderá mapear cada coluna na próxima etapa.</p>
            </div>

            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-10 text-center hover:bg-secondary/60 transition-colors">
              <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">Clique ou arraste a planilha aqui</p>
              <p className="text-xs text-muted-foreground mt-1">XLSX, XLS ou CSV</p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>

            <button
              onClick={downloadTemplate}
              className="flex w-full items-center justify-center gap-2 rounded-lg border bg-background py-2.5 text-sm text-muted-foreground hover:bg-secondary transition-colors"
            >
              <Download className="h-4 w-4" />
              Baixar modelo .xlsx
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-3 text-xs">
              <p className="font-medium text-foreground">{rows.length} linha(s) detectada(s)</p>
              <p className="text-muted-foreground mt-0.5">Mapeie cada campo do sistema para uma coluna da sua planilha.</p>
            </div>

            <div className="space-y-2">
              {FIELDS.map((f) => (
                <div key={f.key} className="flex items-center gap-3">
                  <label className="w-44 text-sm text-foreground">
                    {f.label}
                    {f.required && <span className="text-destructive ml-0.5">*</span>}
                  </label>
                  <select
                    value={mapping[f.key] || ""}
                    onChange={(e) => setMapping((m) => ({ ...m, [f.key]: e.target.value }))}
                    className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">— ignorar —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="rounded-lg border bg-background p-3 text-xs">
              <div className="flex items-center gap-2 text-foreground font-medium mb-2">
                <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                {parsed.valid.length} válido(s)
                {parsed.invalid.length > 0 && (
                  <>
                    <AlertCircle className="h-4 w-4 text-destructive ml-3" />
                    <span className="text-destructive">{parsed.invalid.length} com erro</span>
                  </>
                )}
              </div>
              {parsed.invalid.slice(0, 5).map((i) => (
                <p key={i.row} className="text-muted-foreground">Linha {i.row}: {i.error}</p>
              ))}
              {parsed.invalid.length > 5 && (
                <p className="text-muted-foreground mt-1">+ {parsed.invalid.length - 5} outros…</p>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="rounded-lg border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors">
                Voltar
              </button>
              <button
                onClick={handleImport}
                disabled={!parsed.valid.length || importing}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {importing ? "Importando…" : `Importar ${parsed.valid.length} produto(s)`}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <CheckCircle2 className="mx-auto h-14 w-14 text-[hsl(var(--success))] mb-3" />
            <p className="text-lg font-semibold text-foreground">Importação concluída!</p>
            <p className="text-sm text-muted-foreground mt-1">{parsed.valid.length} produto(s) adicionado(s)</p>
            <button onClick={onClose} className="mt-5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
              Concluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
