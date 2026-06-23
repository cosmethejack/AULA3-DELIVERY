export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  estoque: number;
  ativo: boolean;
  categoriaId: string;
  category?: Category;
}

export interface Category {
  id: string;
  nome: string;
  ativo: boolean;
  products?: Product[];
}

export interface Customer {
  id: string;
  nome: string;
  email: string;
  endereco?: string;
  telefone?: string;
}

export interface OrderItem {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  product?: Product;
}

export interface Order {
  id: string;
  numero: string;
  clienteId: string;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  enderecoEntrega?: string;
  createdAt: string;
  items: OrderItem[];
  customer?: Customer;
}

export interface CartItem {
  product: Product;
  quantidade: number;
}
