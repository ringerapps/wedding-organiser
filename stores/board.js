import { defineStore } from 'pinia'
import { generateId } from '~/utils/id'
import { STATUS_COLUMNS, SAMPLE_CARDS } from '~/constants/board'

export const useBoardStore = defineStore('board', {
  state: () => ({
    columns: [],
    initialized: false,
  }),

  getters: {
    todoCards(state) {
      const col = state.columns.find((c) => c.id === 'todo')
      return col ? col.cards : []
    },
    inProgressCards(state) {
      const col = state.columns.find((c) => c.id === 'in-progress')
      return col ? col.cards : []
    },
    doneCards(state) {
      const col = state.columns.find((c) => c.id === 'done')
      return col ? col.cards : []
    },
    totalCards(state) {
      return state.columns.reduce((sum, col) => sum + col.cards.length, 0)
    },
    completedCards(state) {
      const col = state.columns.find((c) => c.id === 'done')
      return col ? col.cards.length : 0
    },
    progress(state) {
      const total = state.columns.reduce((sum, col) => sum + col.cards.length, 0)
      const done = state.columns.find((c) => c.id === 'done')?.cards.length || 0
      return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
    },
  },

  actions: {
    init() {
      if (this.initialized && this.columns.length > 0) return
      // Check if we have columns (may have been loaded by persistence plugin)
      if (this.columns.length > 0) {
        this.initialized = true
        return
      }
      // Try to migrate old format
      if (typeof window !== 'undefined') {
        const oldData = localStorage.getItem('wedding-planner-board')
        if (oldData) {
          try {
            const parsed = JSON.parse(oldData)
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].icon) {
              this.migrateOldFormat(parsed)
              localStorage.removeItem('wedding-planner-board')
              this.initialized = true
              return
            }
          } catch (_) {}
        }
      }
      this.createDefaultBoard()
      this.initialized = true
    },

    migrateOldFormat(oldColumns) {
      const newColumns = STATUS_COLUMNS.map((col) => ({
        ...col,
        cards: [],
      }))
      // Map old column IDs to categories
      for (const oldCol of oldColumns) {
        for (const card of oldCol.cards || []) {
          const newCard = {
            id: card.id || generateId(),
            title: card.title,
            priority: card.priority || 'medium',
            category: oldCol.id,
            dueDate: card.dueDate || '',
            notes: card.notes || '',
            createdAt: card.createdAt || new Date().toISOString(),
          }
          if (card.done) {
            newColumns[2].cards.push(newCard) // Done
          } else {
            newColumns[0].cards.push(newCard) // Todo
          }
        }
      }
      this.columns = newColumns
    },

    createDefaultBoard() {
      this.columns = STATUS_COLUMNS.map((col) => ({
        ...col,
        cards: col.id === 'todo'
          ? SAMPLE_CARDS.map((card) => ({
              id: generateId(),
              ...card,
              dueDate: '',
              createdAt: new Date().toISOString(),
            }))
          : [],
      }))
    },

    addCard(columnId, card) {
      const col = this.columns.find((c) => c.id === columnId)
      if (!col) return
      col.cards.push({
        id: generateId(),
        title: card.title,
        priority: card.priority || 'medium',
        category: card.category || 'logistics',
        dueDate: card.dueDate || '',
        notes: card.notes || '',
        createdAt: new Date().toISOString(),
      })
    },

    updateCard(columnId, cardId, updates) {
      const col = this.columns.find((c) => c.id === columnId)
      if (!col) return
      const card = col.cards.find((c) => c.id === cardId)
      if (!card) return
      Object.assign(card, updates)
    },

    deleteCard(columnId, cardId) {
      const col = this.columns.find((c) => c.id === columnId)
      if (!col) return
      col.cards = col.cards.filter((c) => c.id !== cardId)
    },

    moveCard(fromColumnId, toColumnId, cardId, toIndex) {
      const fromCol = this.columns.find((c) => c.id === fromColumnId)
      const toCol = this.columns.find((c) => c.id === toColumnId)
      if (!fromCol || !toCol) return

      const cardIndex = fromCol.cards.findIndex((c) => c.id === cardId)
      if (cardIndex === -1) return

      const [card] = fromCol.cards.splice(cardIndex, 1)
      const insertAt = toIndex !== undefined ? toIndex : toCol.cards.length
      toCol.cards.splice(insertAt, 0, card)
    },

    resetBoard() {
      this.createDefaultBoard()
    },
  },
})
