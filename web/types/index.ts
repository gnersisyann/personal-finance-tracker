export interface Category {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
}
