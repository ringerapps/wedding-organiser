import { defineStore } from 'pinia'
import { generateId } from '~/utils/id'

export const useGuestStore = defineStore('guests', {
  state: () => ({
    guests: [],
  }),

  getters: {
    totalGuests(state) {
      return state.guests.length
    },
    totalWithPlusOnes(state) {
      return state.guests.length + state.guests.filter((g) => g.plusOne).length
    },
    accepted(state) {
      return state.guests.filter((g) => g.rsvp === 'accepted')
    },
    declined(state) {
      return state.guests.filter((g) => g.rsvp === 'declined')
    },
    pending(state) {
      return state.guests.filter((g) => g.rsvp === 'pending')
    },
    rsvpStats(state) {
      const total = state.guests.length
      const accepted = state.guests.filter((g) => g.rsvp === 'accepted').length
      const declined = state.guests.filter((g) => g.rsvp === 'declined').length
      const pending = state.guests.filter((g) => g.rsvp === 'pending').length
      return { total, accepted, declined, pending }
    },
    byTable(state) {
      const groups = {}
      for (const guest of state.guests) {
        const table = guest.table || 'Unassigned'
        if (!groups[table]) groups[table] = []
        groups[table].push(guest)
      }
      return groups
    },
    mealCounts(state) {
      const counts = {}
      for (const guest of state.guests) {
        if (guest.rsvp !== 'accepted') continue
        const meal = guest.meal || 'Standard'
        counts[meal] = (counts[meal] || 0) + 1
      }
      return counts
    },
  },

  actions: {
    addGuest(guest) {
      this.guests.push({
        id: generateId(),
        name: guest.name,
        email: guest.email || '',
        phone: guest.phone || '',
        rsvp: guest.rsvp || 'pending',
        meal: guest.meal || 'Standard',
        plusOne: guest.plusOne || false,
        plusOneName: guest.plusOneName || '',
        table: guest.table || '',
        notes: guest.notes || '',
        group: guest.group || '',
        createdAt: new Date().toISOString(),
      })
    },

    updateGuest(id, updates) {
      const guest = this.guests.find((g) => g.id === id)
      if (guest) Object.assign(guest, updates)
    },

    deleteGuest(id) {
      this.guests = this.guests.filter((g) => g.id !== id)
    },

    setRsvp(id, status) {
      const guest = this.guests.find((g) => g.id === id)
      if (guest) guest.rsvp = status
    },
  },
})
