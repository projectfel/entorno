import market1 from "@/assets/market-1.jpg";
import market2 from "@/assets/market-2.jpg";
import market3 from "@/assets/market-3.jpg";

export interface Product {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  imagem?: string;
}

export interface Supermarket {
  id: string;
  nome: string;
  endereco: string;
  distancia: string;
  aberto: boolean;
  horario: string;
  avaliacao: number;
  whatsapp: string;
  imagem: string;
  categorias: string[];
  produtos: Product[];
}

export const supermarkets: Supermarket[] = [
  {
    id: "1",
    nome: "Super Bairro Bezerra",
    endereco: "Lagoa Azul - Conj. Boa Esperança",
    distancia: "350m",
    aberto: true,
    horario: "07:00 - 21:00",
    avaliacao: 4.7,
    whatsapp: "5584987837125",
    imagem: market1,
    categorias: ["Mercearia", "Hortifruti", "Padaria", "Bebidas", "Limpeza"],
    produtos: [
      { id: "1", nome: "Feijão Carioca 1kg", preco: 7.5, categoria: "Mercearia" },
      { id: "2", nome: "Arroz Branco 1kg", preco: 5.2, categoria: "Mercearia" },
      { id: "3", nome: "Óleo de Soja 900ml", preco: 6.8, categoria: "Mercearia" },
      { id: "4", nome: "Café Tradicional 250g", preco: 8.9, categoria: "Mercearia" },
      { id: "5", nome: "Açúcar Cristal 1kg", preco: 4.5, categoria: "Mercearia" },
      { id: "6", nome: "Macarrão Espaguete 500g", preco: 3.8, categoria: "Mercearia" },
      { id: "7", nome: "Leite Integral 1L", preco: 5.9, categoria: "Bebidas" },
      { id: "8", nome: "Suco de Laranja 1L", preco: 7.2, categoria: "Bebidas" },
      { id: "9", nome: "Banana Prata (kg)", preco: 5.5, categoria: "Hortifruti" },
      { id: "10", nome: "Tomate (kg)", preco: 6.9, categoria: "Hortifruti" },
      { id: "11", nome: "Pão Francês (un)", preco: 0.75, categoria: "Padaria" },
      { id: "12", nome: "Detergente 500ml", preco: 2.9, categoria: "Limpeza" },
    ],
  },
  {
    id: "2",
    nome: "Mercearia do João",
    endereco: "Lagoa Azul - Rua São Paulo, 42",
    distancia: "500m",
    aberto: true,
    horario: "06:30 - 20:00",
    avaliacao: 4.5,
    whatsapp: "5584987837125",
    imagem: market2,
    categorias: ["Mercearia", "Hortifruti", "Bebidas"],
    produtos: [
      { id: "1", nome: "Feijão Carioca 1kg", preco: 7.2, categoria: "Mercearia" },
      { id: "2", nome: "Arroz Branco 1kg", preco: 5.5, categoria: "Mercearia" },
      { id: "3", nome: "Óleo de Soja 900ml", preco: 6.5, categoria: "Mercearia" },
      { id: "4", nome: "Café Tradicional 250g", preco: 9.2, categoria: "Mercearia" },
      { id: "5", nome: "Farinha de Trigo 1kg", preco: 4.8, categoria: "Mercearia" },
      { id: "6", nome: "Água Mineral 1.5L", preco: 2.5, categoria: "Bebidas" },
      { id: "7", nome: "Refrigerante 2L", preco: 8.5, categoria: "Bebidas" },
      { id: "8", nome: "Cebola (kg)", preco: 4.9, categoria: "Hortifruti" },
      { id: "9", nome: "Batata (kg)", preco: 5.8, categoria: "Hortifruti" },
    ],
  },
  {
    id: "3",
    nome: "Supermercado Boa Vista",
    endereco: "Lagoa Azul - Av. Principal, 120",
    distancia: "800m",
    aberto: false,
    horario: "07:00 - 19:00",
    avaliacao: 4.3,
    whatsapp: "5584987837125",
    imagem: market3,
    categorias: ["Mercearia", "Hortifruti", "Padaria", "Bebidas", "Limpeza", "Frios"],
    produtos: [
      { id: "1", nome: "Feijão Preto 1kg", preco: 7.8, categoria: "Mercearia" },
      { id: "2", nome: "Arroz Parboilizado 1kg", preco: 5.0, categoria: "Mercearia" },
      { id: "3", nome: "Azeite de Oliva 500ml", preco: 22.9, categoria: "Mercearia" },
      { id: "4", nome: "Presunto Fatiado 200g", preco: 8.5, categoria: "Frios" },
      { id: "5", nome: "Queijo Mussarela 200g", preco: 9.9, categoria: "Frios" },
      { id: "6", nome: "Sabão em Pó 1kg", preco: 12.5, categoria: "Limpeza" },
      { id: "7", nome: "Alface (un)", preco: 2.5, categoria: "Hortifruti" },
      { id: "8", nome: "Pão de Forma", preco: 7.9, categoria: "Padaria" },
    ],
  },
];
