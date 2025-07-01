export interface Category {
  id: number;
  name: string;
  color?: string;
}

export interface Transaction {
  id: number;
  amount: number;
  categoryId: number;
  date: string;
  description?: string;
}
