/** Application-wide constants */

export const CACHE_TIMES = {
  SHORT: 60 * 1000,        // 1 min — orders, realtime data
  MEDIUM: 5 * 60 * 1000,   // 5 min — stores, products
  LONG: 10 * 60 * 1000,    // 10 min — categories, static data
} as const;

export const QUERY_KEYS = {
  STORES: "stores",
  MY_STORES: "my-stores",
  PRODUCTS: "products",
  FEATURED_PRODUCTS: ["products", "featured"],
  ORDERS: "orders",
  CATEGORIES: "categories",
  COMBOS: "combos",
} as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  moderator: "Lojista",
  user: "Cliente",
};

export const IMAGE_CONFIG = {
  MAX_WIDTH: 1200,
  MAX_HEIGHT: 1200,
  QUALITY: 0.8,
  FORMAT: "image/webp" as const,
} as const;

export const VALIDATION = {
  PASSWORD_MIN: 6,
  NAME_MIN: 2,
  NAME_MAX: 100,
  PHONE_REGEX: /^[\d+\s()-]{8,20}$/,
  WHATSAPP_REGEX: /^[\d+\s()-]+$/,
} as const;
