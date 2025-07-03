import { ref, readonly } from "vue";
import type { Category } from "~/types";
import { categoriesApi } from "~/services/api";

const categories = ref<Category[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function loadCategories() {
  try {
    isLoading.value = true;
    error.value = null;
    categories.value = await categoriesApi.getAll();
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load categories";
    console.error("Failed to load categories:", err);
  } finally {
    isLoading.value = false;
  }
}

export function getCategory(id: number): string {
  const category = categories.value.find((category) => category.id === id);
  return category ? category.name : "Unknown";
}

export async function addCategory(name: string) {
  try {
    error.value = null;
    const newCategory = await categoriesApi.create({ name });
    categories.value.push(newCategory);
    return newCategory;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to add category";
    console.error("Failed to add category:", err);
    throw err;
  }
}

export async function removeCategory(id: number) {
  try {
    error.value = null;
    await categoriesApi.delete(id);
    const index = categories.value.findIndex((category) => category.id === id);
    if (index !== -1) {
      categories.value.splice(index, 1);
    }
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to remove category";
    console.error("Failed to remove category:", err);
    throw err;
  }
}

export async function updateCategory(
  id: number,
  categoryData: Pick<Category, "name">
) {
  try {
    error.value = null;
    const updatedCategory = await categoriesApi.update(id, categoryData);
    const index = categories.value.findIndex((category) => category.id === id);
    if (index !== -1) {
      categories.value[index] = updatedCategory;
    }
    return updatedCategory;
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to update category";
    console.error("Failed to update category:", err);
    throw err;
  }
}

export function useCategories() {
  return {
    categories,
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadCategories,
    getCategory,
    addCategory,
    removeCategory,
    updateCategory,
  };
}
