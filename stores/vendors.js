import { defineStore } from 'pinia'
import { generateId } from '~/utils/id'

export const useVendorStore = defineStore('vendors', {
  state: () => ({
    vendors: [],
  }),

  getters: {
    byCategory(state) {
      const groups = {}
      for (const v of state.vendors) {
        if (!groups[v.category]) groups[v.category] = []
        groups[v.category].push(v)
      }
      return groups
    },
    booked(state) {
      return state.vendors.filter((v) => v.status === 'booked')
    },
    byStatus(state) {
      return (status) => state.vendors.filter((v) => v.status === status)
    },
  },

  actions: {
    addVendor(vendor) {
      this.vendors.push({
        id: generateId(),
        name: vendor.name,
        category: vendor.category || 'venue',
        status: vendor.status || 'researching',
        contact: vendor.contact || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        website: vendor.website || '',
        price: vendor.price || 0,
        rating: vendor.rating || 0,
        notes: vendor.notes || '',
        createdAt: new Date().toISOString(),
      })
    },

    updateVendor(id, updates) {
      const vendor = this.vendors.find((v) => v.id === id)
      if (vendor) Object.assign(vendor, updates)
    },

    deleteVendor(id) {
      this.vendors = this.vendors.filter((v) => v.id !== id)
    },

    setStatus(id, status) {
      const vendor = this.vendors.find((v) => v.id === id)
      if (vendor) vendor.status = status
    },

    setRating(id, rating) {
      const vendor = this.vendors.find((v) => v.id === id)
      if (vendor) vendor.rating = rating
    },
  },
})
