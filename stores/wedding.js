import { defineStore } from 'pinia'

export const useWeddingStore = defineStore('wedding', {
  state: () => ({
    partner1: '',
    partner2: '',
    weddingDate: '',
    style: '',
    totalBudget: 0,
    onboardingCompleted: false,
  }),

  getters: {
    coupleNames(state) {
      if (!state.partner1 && !state.partner2) return ''
      return `${state.partner1} & ${state.partner2}`
    },

    daysUntilWedding(state) {
      if (!state.weddingDate) return null
      const wedding = new Date(state.weddingDate)
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      wedding.setHours(0, 0, 0, 0)
      return Math.ceil((wedding - now) / (1000 * 60 * 60 * 24))
    },

    weddingDateFormatted(state) {
      if (!state.weddingDate) return ''
      return new Date(state.weddingDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },

  actions: {
    completeOnboarding({ partner1, partner2, weddingDate, style, totalBudget }) {
      this.partner1 = partner1
      this.partner2 = partner2
      this.weddingDate = weddingDate
      this.style = style
      this.totalBudget = totalBudget || 0
      this.onboardingCompleted = true
    },

    reset() {
      this.partner1 = ''
      this.partner2 = ''
      this.weddingDate = ''
      this.style = ''
      this.totalBudget = 0
      this.onboardingCompleted = false
    },
  },
})
