/**
 * Determines if a store is currently open based on opens_at/closes_at times
 * and the manual status field as fallback.
 */
export function isStoreOpen(store: {
  status: string;
  opens_at?: string | null;
  closes_at?: string | null;
}): boolean {
  // If store is manually set to maintenance, always closed
  if (store.status === "maintenance") return false;

  // If hours are configured, use time-based logic
  if (store.opens_at && store.closes_at) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = store.opens_at.split(":").map(Number);
    const [closeH, closeM] = store.closes_at.split(":").map(Number);
    const opensMinutes = openH * 60 + openM;
    const closesMinutes = closeH * 60 + closeM;

    // Handle overnight hours (e.g. 22:00 - 06:00)
    if (closesMinutes <= opensMinutes) {
      return currentMinutes >= opensMinutes || currentMinutes < closesMinutes;
    }
    return currentMinutes >= opensMinutes && currentMinutes < closesMinutes;
  }

  // Fallback to manual status
  return store.status === "open";
}

export function getStoreStatusLabel(store: {
  status: string;
  opens_at?: string | null;
  closes_at?: string | null;
}): { label: string; isOpen: boolean } {
  if (store.status === "maintenance") {
    return { label: "Manutenção", isOpen: false };
  }
  const open = isStoreOpen(store);
  return { label: open ? "Aberto" : "Fechado", isOpen: open };
}
