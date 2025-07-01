import { ref } from "vue";
import type { Category } from "~/types";

export const categories = ref([
  { id: 1, name: "Food" },
  { id: 2, name: "Transport" },
  { id: 3, name: "Shopping" },
]);

export function getCategory(id: number): string {
  const category = categories.value.find((category) => category.id === id);
  return category ? category.name : "Unknown";
}

export function addCategory(name: string) {
  const maxID = Math.max(...categories.value.map((cat) => cat.id));
  categories.value.push({ id: maxID + 1, name: name });
}

export function removeCategory(id: number) {
  const index = categories.value.findIndex((category) => category.id === id);
  if (index !== -1) categories.value.splice(index, 1);
}

export function updateCategory(id: number, cat: Category) {
  const index = categories.value.findIndex((category) => category.id === id);
  if (index !== -1) {
    categories.value[index].name = cat.name;
  }
}

export function useCategories() {
  return {
    categories,
    getCategory,
    addCategory,
    removeCategory,
    updateCategory,
  };
}
