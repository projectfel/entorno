/**
 * Determina se um mercado está aberto.
 *
 * Regras:
 * - status "maintenance" → sempre fechado (desativado)
 * - se há horário configurado (opens_at/closes_at):
 *    - status "closed"  → sempre fechado
 *    - status "open"    → aberto somente dentro do horário configurado
 * - se não há horário configurado:
 *    - status "open"    → aberto
 *    - status "closed"  → fechado
 */
export function isStoreOpen(store: {
  status: string;
  opens_at?: string | null;
  closes_at?: string | null;
}): boolean {
  if (store.status === "maintenance") return false;
  if (store.status === "closed") return false;

  // status === "open"
  const hasHours = !!store.opens_at && !!store.closes_at;

  if (hasHours) {
    // Usar horário de Brasília (UTC-3) para consistência
    const now = new Date();
    const brasiliaOffset = -3 * 60; // UTC-3 em minutos
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const currentMinutes = ((utcMinutes + brasiliaOffset) % 1440 + 1440) % 1440;

    const [openH, openM] = store.opens_at!.split(":").map(Number);
    const [closeH, closeM] = store.closes_at!.split(":").map(Number);
    const opensMinutes = openH * 60 + openM;
    const closesMinutes = closeH * 60 + closeM;

    // Horário que atravessa a meia-noite (ex: 22:00 - 06:00)
    if (closesMinutes <= opensMinutes) {
      return currentMinutes >= opensMinutes || currentMinutes < closesMinutes;
    }
    return currentMinutes >= opensMinutes && currentMinutes < closesMinutes;
  }

  // Sem horário configurado, status "open" → sempre aberto
  return true;
}

export function getStoreStatusLabel(store: {
  status: string;
  opens_at?: string | null;
  closes_at?: string | null;
}): { label: string; isOpen: boolean } {
  if (store.status === "maintenance") {
    return { label: "Desativado", isOpen: false };
  }

  if (store.status === "closed") {
    return { label: "Fechado", isOpen: false };
  }

  const hasHours = !!store.opens_at && !!store.closes_at;
  const open = isStoreOpen(store);

  if (hasHours && !open) {
    return { label: `Fechado · Abre às ${store.opens_at!.slice(0, 5)}`, isOpen: false };
  }

  return { label: open ? "Aberto" : "Fechado", isOpen: open };
}
