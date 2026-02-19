<script setup>
import { useBudgetStore } from '~/stores/budget'
import { useWeddingStore } from '~/stores/wedding'
import { CATEGORIES } from '~/constants/board'

const budgetStore = useBudgetStore()
const weddingStore = useWeddingStore()

const showAddModal = ref(false)
const editingItem = ref(null)
const filterCategory = ref('')

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const filteredItems = computed(() => {
  if (!filterCategory.value) return budgetStore.items
  return budgetStore.items.filter((i) => i.category === filterCategory.value)
})

const budgetRemaining = computed(() => {
  if (!weddingStore.totalBudget) return null
  return weddingStore.totalBudget - budgetStore.totalActual
})

const budgetPercent = computed(() => {
  if (!weddingStore.totalBudget) return 0
  return Math.min(100, Math.round((budgetStore.totalActual / weddingStore.totalBudget) * 100))
})

function handleSave(data) {
  if (editingItem.value) {
    budgetStore.updateItem(editingItem.value.id, data)
  } else {
    budgetStore.addItem(data)
  }
  showAddModal.value = false
  editingItem.value = null
}

function editItem(item) {
  editingItem.value = item
  showAddModal.value = true
}

function closeModal() {
  showAddModal.value = false
  editingItem.value = null
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-serif text-2xl font-bold text-charcoal">Budget</h2>
          <p class="text-sm text-warm-gray">Track your wedding expenses</p>
        </div>
        <button
          class="px-4 py-2 text-sm rounded-lg bg-sage text-white hover:bg-sage-dark transition-colors font-medium shadow-sm"
          @click="showAddModal = true"
        >
          + Add Expense
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <BudgetSummaryCard
          v-if="weddingStore.totalBudget"
          title="Total Budget"
          :amount="weddingStore.totalBudget"
          icon="💎"
        />
        <BudgetSummaryCard title="Estimated" :amount="budgetStore.totalEstimated" icon="📊" />
        <BudgetSummaryCard title="Actual Spent" :amount="budgetStore.totalActual" icon="💳" />
        <BudgetSummaryCard title="Paid" :amount="budgetStore.totalPaid" icon="✅" />
      </div>

      <!-- Budget bar -->
      <div v-if="weddingStore.totalBudget" class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-warm-gray">Budget usage</span>
          <span class="text-sm font-medium" :class="budgetRemaining < 0 ? 'text-red-600' : 'text-sage-dark'">
            {{ formatCurrency(budgetRemaining) }} remaining
          </span>
        </div>
        <div class="w-full h-3 bg-blush rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="budgetPercent > 90 ? 'bg-red-400' : budgetPercent > 70 ? 'bg-amber-400' : 'bg-sage'"
            :style="{ width: budgetPercent + '%' }"
          />
        </div>
        <div class="flex justify-between mt-1">
          <span class="text-xs text-warm-gray">{{ budgetPercent }}% used</span>
          <span class="text-xs text-warm-gray">{{ formatCurrency(weddingStore.totalBudget) }}</span>
        </div>
      </div>

      <!-- Category filter -->
      <div class="mb-4 overflow-x-auto pb-1">
        <div class="flex items-center gap-1.5">
          <button
            class="text-xs px-2.5 py-1 rounded-full border font-medium transition-colors whitespace-nowrap"
            :class="!filterCategory ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-warm-gray border-gray-200'"
            @click="filterCategory = ''"
          >
            All
          </button>
          <button
            v-for="cat in CATEGORIES"
            :key="cat.id"
            class="text-xs px-2.5 py-1 rounded-full border font-medium transition-colors whitespace-nowrap"
            :class="filterCategory === cat.id ? 'text-white' : ''"
            :style="{
              backgroundColor: filterCategory === cat.id ? cat.color : cat.color + '12',
              color: filterCategory === cat.id ? 'white' : cat.color,
              borderColor: filterCategory === cat.id ? cat.color : cat.color + '40',
            }"
            @click="filterCategory = filterCategory === cat.id ? '' : cat.id"
          >
            {{ cat.icon }} {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Expense list -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div v-if="filteredItems.length === 0" class="p-8 text-center text-warm-gray text-sm">
          No expenses yet. Add your first expense to start tracking your budget.
        </div>
        <div v-else class="divide-y divide-gray-50">
          <BudgetItemRow
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            @toggle-paid="budgetStore.togglePaid(item.id)"
            @edit="editItem(item)"
            @delete="budgetStore.deleteItem(item.id)"
          />
        </div>
      </div>
    </main>

    <BudgetAddModal
      v-if="showAddModal"
      :item="editingItem"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>
