import { defineStore } from 'pinia'
import { generateId } from '~/utils/id'

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    milestones: [],
  }),

  getters: {
    sorted(state) {
      return [...state.milestones].sort((a, b) => new Date(a.date) - new Date(b.date))
    },
    upcoming(state) {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      return [...state.milestones]
        .filter((m) => new Date(m.date) >= now && !m.completed)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    },
    past(state) {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      return [...state.milestones]
        .filter((m) => new Date(m.date) < now || m.completed)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    },
  },

  actions: {
    addMilestone(milestone) {
      this.milestones.push({
        id: generateId(),
        title: milestone.title,
        date: milestone.date,
        description: milestone.description || '',
        completed: milestone.completed || false,
        icon: milestone.icon || '📌',
      })
    },

    updateMilestone(id, updates) {
      const m = this.milestones.find((m) => m.id === id)
      if (m) Object.assign(m, updates)
    },

    deleteMilestone(id) {
      this.milestones = this.milestones.filter((m) => m.id !== id)
    },

    toggleCompleted(id) {
      const m = this.milestones.find((m) => m.id === id)
      if (m) m.completed = !m.completed
    },

    generateFromWeddingDate(weddingDate) {
      if (!weddingDate || this.milestones.length > 0) return
      const d = new Date(weddingDate)
      const offsets = [
        { months: -12, title: 'Set budget & start planning', icon: '💰' },
        { months: -10, title: 'Book venue & caterer', icon: '🏛️' },
        { months: -8, title: 'Choose wedding party', icon: '👥' },
        { months: -8, title: 'Book photographer & videographer', icon: '📸' },
        { months: -6, title: 'Shop for attire', icon: '👗' },
        { months: -6, title: 'Book music & entertainment', icon: '🎵' },
        { months: -4, title: 'Send save-the-dates', icon: '💌' },
        { months: -3, title: 'Choose florist & decor', icon: '💐' },
        { months: -2, title: 'Send invitations', icon: '✉️' },
        { months: -2, title: 'Finalise menu', icon: '🍰' },
        { months: -1, title: 'Final dress fitting', icon: '✂️' },
        { months: -1, title: 'Confirm all vendors', icon: '✅' },
        { weeks: -2, title: 'RSVP deadline', icon: '📋' },
        { weeks: -1, title: 'Rehearsal dinner', icon: '🥂' },
        { days: 0, title: 'Wedding Day!', icon: '💍' },
      ]

      for (const offset of offsets) {
        const date = new Date(d)
        if (offset.months) date.setMonth(date.getMonth() + offset.months)
        if (offset.weeks) date.setDate(date.getDate() + offset.weeks * 7)
        if (offset.days !== undefined && !offset.months && !offset.weeks) {
          // Wedding day itself
        }
        this.addMilestone({
          title: offset.title,
          date: date.toISOString().split('T')[0],
          icon: offset.icon,
        })
      }
    },
  },
})
