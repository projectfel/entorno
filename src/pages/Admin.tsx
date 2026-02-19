import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminService } from "@/services/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft, Store, Users, ShoppingBag, Plus, X, Search,
  Shield, ShieldCheck, User as UserIcon, Eye, EyeOff,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Stats { totalStores: number; totalUsers: number; totalOrders: number; }

const Admin = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchStores, setSearchStores] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "", password: "", displayName: "", storeName: "", whatsapp: "", address: "", neighborhood: "Lagoa Azul",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, st, u, o] = await Promise.all([
        adminService.getStats(),
        adminService.getAllStores(),
        adminService.getAllProfiles(),
        adminService.getAllOrders(),
      ]);
      setStats(s);
      setStores(st || []);
      setUsers(u || []);
      setOrders(o || []);
    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async () => {
    if (!form.email || !form.password || !form.storeName || !form.whatsapp) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Senha deve ter no mínimo 6 caracteres");
      return;
    }
    setCreating(true);
    try {
      await adminService.createStoreOwner(form);
      toast.success("Mercado e lojista criados com sucesso!");
      setShowCreate(false);
      setForm({ email: "", password: "", displayName: "", storeName: "", whatsapp: "", address: "", neighborhood: "Lagoa Azul" });
      loadData();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao criar mercado");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStore = async (storeId: string, currentStatus: string) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    try {
      await adminService.updateStoreStatus(storeId, newStatus as any);
      toast.success(newStatus === "open" ? "Mercado ativado!" : "Mercado desativado!");
      setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, status: newStatus } : s)));
    } catch {
      toast.error("Erro ao alterar status");
    }
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "moderator" | "user") => {
    try {
      await adminService.updateUserRole(userId, newRole);
      toast.success("Permissão atualizada!");
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId ? { ...u, user_roles: [{ role: newRole }] } : u
        )
      );
    } catch {
      toast.error("Erro ao alterar permissão");
    }
  };

  const filteredStores = stores.filter(
    (s) => !searchStores || s.name.toLowerCase().includes(searchStores.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) => !searchUsers || (u.display_name || "").toLowerCase().includes(searchUsers.toLowerCase())
  );

  const roleIcon = (role: string) => {
    if (role === "admin") return <ShieldCheck className="h-3.5 w-3.5" />;
    if (role === "moderator") return <Shield className="h-3.5 w-3.5" />;
    return <UserIcon className="h-3.5 w-3.5" />;
  };

  const roleBadge = (role: string) => {
    const map: Record<string, string> = {
      admin: "bg-destructive text-destructive-foreground",
      moderator: "bg-primary text-primary-foreground",
      user: "bg-muted text-muted-foreground",
    };
    const labels: Record<string, string> = { admin: "Admin", moderator: "Lojista", user: "Cliente" };
    return (
      <Badge className={`${map[role] || map.user} border-0 gap-1 text-[10px]`}>
        {roleIcon(role)}
        {labels[role] || role}
      </Badge>
    );
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Voltar ao marketplace
      </Link>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie mercados, usuários e pedidos</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          Novo Mercado
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{stats?.totalStores ?? 0}</p>
              <p className="text-sm text-muted-foreground">Mercados</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{stats?.totalUsers ?? 0}</p>
              <p className="text-sm text-muted-foreground">Usuários</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--success))]/10">
              <ShoppingBag className="h-5 w-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{stats?.totalOrders ?? 0}</p>
              <p className="text-sm text-muted-foreground">Pedidos</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stores">
        <TabsList className="mb-6">
          <TabsTrigger value="stores">Mercados</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
        </TabsList>

        {/* Stores Tab */}
        <TabsContent value="stores">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar mercados..." value={searchStores} onChange={(e) => setSearchStores(e.target.value)}
              className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          {filteredStores.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Store className="mx-auto h-10 w-10 mb-3 opacity-40" />
              <p className="font-medium">Nenhum mercado encontrado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStores.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border bg-card p-4 transition-colors hover:bg-secondary/50">
                  <div className="flex items-center gap-3">
                    {s.logo_url && <img src={s.logo_url} alt={s.name} className="h-10 w-10 rounded-lg object-cover" />}
                    <div>
                      <p className="font-medium text-card-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.neighborhood || "Sem bairro"} • {s.whatsapp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`border-0 text-[10px] ${s.status === "open" ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]" : "bg-muted text-muted-foreground"}`}>
                      {s.status === "open" ? "Aberto" : s.status === "maintenance" ? "Manutenção" : "Fechado"}
                    </Badge>
                    <button onClick={() => handleToggleStore(s.id, s.status)}
                      className="rounded-lg border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                      {s.status === "open" ? "Desativar" : "Ativar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar usuários..." value={searchUsers} onChange={(e) => setSearchUsers(e.target.value)}
              className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="mx-auto h-10 w-10 mb-3 opacity-40" />
              <p className="font-medium">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((u) => {
                const userRole = u.user_roles?.[0]?.role || "user";
                return (
                  <div key={u.id} className="flex items-center justify-between rounded-xl border bg-card p-4 transition-colors hover:bg-secondary/50">
                    <div className="flex items-center gap-3">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                          <UserIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-card-foreground">{u.display_name || "Sem nome"}</p>
                        <p className="text-xs text-muted-foreground">{u.phone || "Sem telefone"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {roleBadge(userRole)}
                      {userRole !== "admin" && (
                        <select
                          value={userRole}
                          onChange={(e) => handleRoleChange(u.user_id, e.target.value as any)}
                          className="rounded-lg border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="user">Cliente</option>
                          <option value="moderator">Lojista</option>
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShoppingBag className="mx-auto h-10 w-10 mb-3 opacity-40" />
              <p className="font-medium">Nenhum pedido registrado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => {
                const items = Array.isArray(o.items) ? o.items : [];
                return (
                  <div key={o.id} className="rounded-xl border bg-card p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(o.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <p className="font-medium text-card-foreground mt-1">{(o as any).stores?.name || "Loja"}</p>
                        <p className="text-sm text-muted-foreground">{items.length} {items.length === 1 ? "item" : "itens"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">R$ {Number(o.total).toFixed(2).replace(".", ",")}</p>
                        <Badge className={`mt-1 border-0 text-[10px] ${
                          o.status === "pending" ? "bg-accent text-accent-foreground"
                          : o.status === "confirmed" ? "bg-primary text-primary-foreground"
                          : o.status === "delivered" ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
                          : "bg-destructive text-destructive-foreground"
                        }`}>
                          {o.status === "pending" ? "Pendente" : o.status === "confirmed" ? "Confirmado" : o.status === "delivered" ? "Entregue" : "Cancelado"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Store Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card border p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">Cadastrar Novo Mercado</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">Isso criará um novo usuário lojista e vinculará o mercado automaticamente.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Nome do Mercado *</label>
                <input type="text" value={form.storeName} onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Ex: Mercadinho do João" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">E-mail do lojista *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="lojista@email.com" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Senha *</label>
                  <div className="relative mt-1">
                    <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      className="w-full rounded-lg border bg-background px-3 py-2 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Mínimo 6 caracteres" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Nome do responsável</label>
                <input type="text" value={form.displayName} onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="João Silva" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">WhatsApp *</label>
                <input type="text" value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="(84) 99999-9999" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Endereço</label>
                  <input type="text" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Rua..." />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Bairro</label>
                  <input type="text" value={form.neighborhood} onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={creating || !form.email || !form.password || !form.storeName || !form.whatsapp}
              className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {creating ? "Criando..." : "Criar Mercado e Lojista"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Admin;
