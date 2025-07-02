<script setup lang="ts">
import type { Transaction } from "~/types";

const props = defineProps({
  selectedCategory: {
    type: [Number, null],
    default: null,
  },
});

const {
  categories,
  getCategory,
  isLoading: categoriesLoading,
  error: categoriesError,
} = useCategories();
const {
  transactions,
  removeTransaction,
  updateTransaction,
  isLoading: transactionsLoading,
  error: transactionsError,
  loadTransactions,
} = useTransactions();

const startDate = ref<string>("");
const endDate = ref<string>("");

const showFilter = ref(false);
const showSearch = ref(false);

const selectedCategory = ref<number | null>(null);

const isModalOpen = ref(false);
const editingTransaction = ref<Transaction | null>(null);
const error = ref("");

const search = ref("");
const isSubmitting = ref(false);

onMounted(async () => {
  await loadTransactions();
});

function openEditModal(transaction: Transaction) {
  editingTransaction.value = { ...transaction };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editingTransaction.value = null;
  error.value = "";
}

const confirmDeleteId = ref<number | null>(null);

function askDelete(id: number) {
  confirmDeleteId.value = id;
}

async function confirmDelete() {
  if (confirmDeleteId.value !== null) {
    try {
      await removeTransaction(confirmDeleteId.value);
      confirmDeleteId.value = null;
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  }
}

function cancelDelete() {
  confirmDeleteId.value = null;
}

const filteredTransactions = computed(() =>
  selectedCategory.value == null
    ? transactions.value
    : transactions.value.filter((t) => t.categoryId === selectedCategory.value)
);

const searchedTransactions = computed(() =>
  filteredTransactions.value.filter((t) =>
    t.description.toLowerCase().includes(search.value.trim().toLowerCase())
  )
);

const sortField = ref<"amount" | "categoryId" | "description" | "date">("date");
const sortDirection = ref<"asc" | "desc">("desc");

const dateFilteredTransactions = computed(() => {
  return searchedTransactions.value.filter((t) => {
    const tDate = new Date(t.date).setHours(0, 0, 0, 0);
    const start = startDate.value
      ? new Date(startDate.value).setHours(0, 0, 0, 0)
      : null;
    const end = endDate.value
      ? new Date(endDate.value).setHours(0, 0, 0, 0)
      : null;
    if (start && tDate < start) return false;
    if (end && tDate > end) return false;
    return true;
  });
});

const sortedTransactions = computed(() => {
  const arr = [...dateFilteredTransactions.value];
  arr.sort((a, b) => {
    let aValue = a[sortField.value];
    let bValue = b[sortField.value];

    if (sortField.value === "categoryId" || sortField.value === "amount") {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (sortField.value === "date") {
      aValue = aValue !== undefined ? new Date(aValue).getTime() : 0;
      bValue = bValue !== undefined ? new Date(bValue).getTime() : 0;
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (aValue < bValue) return sortDirection.value === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === "asc" ? 1 : -1;
    return 0;
  });
  return arr;
});

async function submitEdit() {
  if (!editingTransaction.value) return;

  try {
    isSubmitting.value = true;
    error.value = "";

    await updateTransaction(editingTransaction.value.id, {
      amount: editingTransaction.value.amount,
      categoryId: editingTransaction.value.categoryId,
      description: editingTransaction.value.description,
    });

    closeModal();
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to update transaction";
  } finally {
    isSubmitting.value = false;
  }
}

function sortBy(by: "amount" | "categoryId" | "description" | "date") {
  if (sortField.value == by) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = by;
    sortDirection.value = by === "date" ? "desc" : "asc";
  }
}
</script>

<template>
  <div>
    <div
      v-if="transactionsLoading || categoriesLoading"
      style="text-align: center; padding: 20px"
    >
      Loading...
    </div>

    <div v-if="transactionsError" style="color: red; margin-bottom: 16px">
      Error loading transactions: {{ transactionsError }}
      <button @click="loadTransactions()" style="margin-left: 8px">
        Retry
      </button>
    </div>

    <div v-if="categoriesError" style="color: red; margin-bottom: 16px">
      Error loading categories: {{ categoriesError }}
    </div>

    <div style="margin-bottom: 16px">
      <button @click="showFilter = !showFilter" style="margin-right: 8px">
        Filter
      </button>
      <button @click="showSearch = !showSearch">Search</button>
    </div>

    <div v-if="showFilter" style="margin-bottom: 12px">
      <label>
        Category:
        <select v-model="selectedCategory">
          <option :value="null">All categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </label>
      <label style="margin-left: 16px">
        Start date:
        <input type="date" v-model="startDate" />
      </label>
      <label style="margin-left: 12px">
        End date:
        <input type="date" v-model="endDate" />
      </label>
    </div>

    <div v-if="showSearch" style="margin-bottom: 12px">
      <input
        type="text"
        v-model="search"
        placeholder="Description..."
        style="width: 200px"
      />
    </div>

    <table v-if="sortedTransactions.length" border="1">
      <thead>
        <tr>
          <th @click="sortBy('amount')" style="cursor: pointer">Amount</th>
          <th @click="sortBy('categoryId')" style="cursor: pointer">
            Category
          </th>
          <th @click="sortBy('description')" style="cursor: pointer">
            Description
          </th>
          <th @click="sortBy('date')" style="cursor: pointer">Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in sortedTransactions" :key="transaction.id">
          <td>{{ transaction.amount }}</td>
          <td>{{ getCategory(transaction.categoryId) }}</td>
          <td>{{ transaction.description }}</td>
          <td>{{ new Date(transaction.date).toLocaleString() }}</td>
          <td>
            <button
              @click="askDelete(transaction.id)"
              :disabled="transactionsLoading"
            >
              Delete
            </button>
            <button
              v-if="!isModalOpen"
              @click="openEditModal(transaction)"
              :disabled="transactionsLoading"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="no-data"
      v-else-if="!transactionsLoading"
      style="text-align: center; color: #888; margin: 24px 0"
    >
      No transactions to display.
    </div>

    <div v-if="confirmDeleteId !== null" class="modal">
      <div class="modal-content">
        <p>Are you sure you want to delete this transaction?</p>
        <div>
          <button @click="confirmDelete" :disabled="transactionsLoading">
            Yes
          </button>
          <button @click="cancelDelete">No</button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen && editingTransaction" class="modal">
      <form @submit.prevent="submitEdit" class="modal-content">
        <h3>Edit Transaction</h3>
        <div>
          <label>Amount</label>
          <input
            v-model.number="editingTransaction.amount"
            placeholder="Amount"
            type="number"
            step="0.01"
            min="0"
            required
          />
        </div>
        <div>
          <label>Category</label>
          <select v-model.number="editingTransaction.categoryId" required>
            <option :value="null" disabled>Category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div>
          <label>Description</label>
          <input
            v-model="editingTransaction.description"
            placeholder="Description"
            required
            minlength="2"
          />
        </div>
        <div>
          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Saving..." : "Save" }}
          </button>
          <button type="button" @click="closeModal" :disabled="isSubmitting">
            Cancel
          </button>
        </div>
        <div v-if="error" style="color: red; margin-top: 8px">{{ error }}</div>
      </form>
    </div>
  </div>
</template>
