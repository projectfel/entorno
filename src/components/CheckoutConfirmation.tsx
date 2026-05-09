import { CheckCircle2, ShieldCheck, Clock, MessageCircle, ListOrdered } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface ConfirmedOrder {
  id: string;
  storeName: string;
  total: number;
  itemCount: number;
}

interface Props {
  order: ConfirmedOrder | null;
  onClose: () => void;
}

export const CheckoutConfirmation = ({ order, onClose }: Props) => {
  if (!order) return null;

  const protocol = order.id.slice(0, 8).toUpperCase();
  const totalStr = order.total.toFixed(2).replace(".", ",");

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--success))]/10">
            <CheckCircle2 className="h-10 w-10 text-[hsl(var(--success))]" strokeWidth={2.2} />
          </div>
          <DialogTitle className="text-center text-xl text-foreground">
            Pedido enviado com sucesso!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Protocolo</p>
            <p className="mt-1 font-mono text-lg font-bold text-primary">#{protocol}</p>
          </div>

          <div className="space-y-2 rounded-lg border bg-card p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mercado</span>
              <span className="font-medium text-foreground">{order.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Itens</span>
              <span className="font-medium text-foreground">{order.itemCount}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-primary">R$ {totalStr}</span>
            </div>
          </div>

          <div className="space-y-2 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>O mercado receberá sua mensagem no WhatsApp e confirmará o pedido.</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Acompanhe o status em "Meus Pedidos" em tempo real.</span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Pedido registrado com segurança e total validado pelo servidor.</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/meus-pedidos"
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <ListOrdered className="h-4 w-4" />
              Meus Pedidos
            </Link>
            <button
              onClick={onClose}
              className="rounded-xl border px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
