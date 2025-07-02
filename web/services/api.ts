import type { Category, Transaction } from "~/types";

const API_BASE_URL = "http://localhost:3001";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// CRUD categories
export const categoriesApi = {
  getAll: (): Promise<Category[]> => apiRequest<Category[]>("/categories"),

  create: (category: Pick<Category, "name">): Promise<Category> =>
    apiRequest<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    }),

  update: (id: number, category: Pick<Category, "name">): Promise<Category> =>
    apiRequest<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    }),

  delete: (id: number): Promise<{ message: string }> =>
    apiRequest<{ message: string }>(`/categories/${id}`, {
      method: "DELETE",
    }),

  deleteBatch: (ids: number[]): Promise<{ message: string }> =>
    apiRequest<{ message: string }>("/categories/batch", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    }),
};

// CRUD transactions
export const transactionsApi = {
  getAll: (params?: {
    categoryId?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<Transaction[]> => {
    const searchParams = new URLSearchParams();

    if (params?.categoryId)
      searchParams.append("categoryId", params.categoryId.toString());
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.search) searchParams.append("search", params.search);

    const queryString = searchParams.toString();
    const endpoint = `/transactions${queryString ? `?${queryString}` : ""}`;

    return apiRequest<Transaction[]>(endpoint);
  },

  create: (
    transaction: Pick<Transaction, "amount" | "categoryId" | "description">
  ): Promise<Transaction> =>
    apiRequest<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    }),

  update: (
    id: number,
    transaction: Pick<Transaction, "amount" | "categoryId" | "description">
  ): Promise<Transaction> =>
    apiRequest<Transaction>(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transaction),
    }),

  delete: (id: number): Promise<{ message: string }> =>
    apiRequest<{ message: string }>(`/transactions/${id}`, {
      method: "DELETE",
    }),
};
