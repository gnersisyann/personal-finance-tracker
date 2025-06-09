export const categories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Transport" },
  { id: 3, name: "Shopping" },
];

export function getCategory(id: number): string {
  const category = categories.find((category) => category.id === id);
  return category ? category.name : "Unknown";
}

export function useCategories() {
  return { categories, getCategory };
}
