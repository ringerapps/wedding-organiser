import { defineStore } from 'pinia'
import { generateId } from '~/utils/id'

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    items: [],
  }),

  getters: {
    totalEstimated(state) {
      return state.items.reduce((sum, item) => sum + (item.estimated || 0), 0)
    },
    totalActual(state) {
      return state.items.reduce((sum, item) => sum + (item.actual || 0), 0)
    },
    totalPaid(state) {
      return state.items.filter((i) => i.paid).reduce((sum, item) => sum + (item.actual || item.estimated || 0), 0)
    },
    totalPending(state) {
      return state.items.filter((i) => !i.paid).reduce((sum, item) => sum + (item.actual || item.estimated || 0), 0)
    },
    byCategory(state) {
      const groups = {}
      for (const item of state.items) {
        if (!groups[item.category]) groups[item.category] = []
        groups[item.category].push(item)
      }
      return groups
    },
    categorySummaries(state) {
      const groups = {}
      for (const item of state.items) {
        if (!groups[item.category]) {
          groups[item.category] = { estimated: 0, actual: 0, paid: 0 }
        }
        groups[item.category].estimated += item.estimated || 0
        groups[item.category].actual += item.actual || 0
        if (item.paid) groups[item.category].paid += item.actual || item.estimated || 0
      }
      return groups
    },
  },

  actions: {
    addItem(item) {
      this.items.push({
        id: generateId(),
        name: item.name,
        category: item.category || 'logistics',
        estimated: item.estimated || 0,
        actual: item.actual || 0,
        paid: item.paid || false,
        vendor: item.vendor || '',
        notes: item.notes || '',
        createdAt: new Date().toISOString(),
      })
    },

    updateItem(id, updates) {
      const item = this.items.find((i) => i.id === id)
      if (item) Object.assign(item, updates)
    },

    deleteItem(id) {
      this.items = this.items.filter((i) => i.id !== id)
    },

    togglePaid(id) {
      const item = this.items.find((i) => i.id === id)
      if (item) item.paid = !item.paid
    },
  },
})
