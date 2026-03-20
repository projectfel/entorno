/** Shared domain types used across the application */

export interface CartProduct {
  id: string;
  nome: string;
  preco: number;
  precoOriginal?: number;
  categoria: string;
  imagem?: string;
  unidade?: string;
  destaque?: boolean;
}

export interface CartItem extends CartProduct {
  quantidade: number;
  marketId: string;
  marketNome: string;
  marketWhatsapp: string;
}

export type AppRole = "admin" | "moderator" | "user";

export type StoreStatus = "open" | "closed" | "maintenance";

export interface StoreHours {
  status: string;
  opens_at?: string | null;
  closes_at?: string | null;
}
