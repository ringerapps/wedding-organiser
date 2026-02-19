import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWeddingStore } from '../stores/wedding'
import { useBudgetStore } from '../stores/budget'
import { useGuestStore } from '../stores/guests'
import { useTimelineStore } from '../stores/timeline'
import { useVendorStore } from '../stores/vendors'

describe('useWeddingStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useWeddingStore()
  })

  it('starts with empty state', () => {
    expect(store.partner1).toBe('')
    expect(store.onboardingCompleted).toBe(false)
  })

  it('completes onboarding', () => {
    store.completeOnboarding({
      partner1: 'Alice',
      partner2: 'Bob',
      weddingDate: '2027-06-15',
      style: 'classic',
      totalBudget: 25000,
    })
    expect(store.partner1).toBe('Alice')
    expect(store.partner2).toBe('Bob')
    expect(store.onboardingCompleted).toBe(true)
    expect(store.coupleNames).toBe('Alice & Bob')
  })

  it('calculates days until wedding', () => {
    store.weddingDate = '2099-01-01'
    expect(store.daysUntilWedding).toBeGreaterThan(0)
  })

  it('resets state', () => {
    store.completeOnboarding({ partner1: 'A', partner2: 'B', weddingDate: '2027-01-01', style: 'modern', totalBudget: 1000 })
    store.reset()
    expect(store.partner1).toBe('')
    expect(store.onboardingCompleted).toBe(false)
  })
})

describe('useBudgetStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBudgetStore()
  })

  it('adds an item', () => {
    store.addItem({ name: 'Venue deposit', category: 'venue', estimated: 5000, actual: 4500 })
    expect(store.items.length).toBe(1)
    expect(store.totalEstimated).toBe(5000)
    expect(store.totalActual).toBe(4500)
  })

  it('toggles paid status', () => {
    store.addItem({ name: 'Test', category: 'venue', estimated: 1000 })
    const id = store.items[0].id
    expect(store.items[0].paid).toBe(false)
    store.togglePaid(id)
    expect(store.items[0].paid).toBe(true)
  })

  it('deletes an item', () => {
    store.addItem({ name: 'Test', category: 'venue', estimated: 1000 })
    const id = store.items[0].id
    store.deleteItem(id)
    expect(store.items.length).toBe(0)
  })

  it('groups by category', () => {
    store.addItem({ name: 'A', category: 'venue', estimated: 1000 })
    store.addItem({ name: 'B', category: 'venue', estimated: 2000 })
    store.addItem({ name: 'C', category: 'catering', estimated: 3000 })
    expect(store.byCategory.venue.length).toBe(2)
    expect(store.byCategory.catering.length).toBe(1)
  })
})

describe('useGuestStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGuestStore()
  })

  it('adds a guest', () => {
    store.addGuest({ name: 'Jane Doe', email: 'jane@test.com' })
    expect(store.guests.length).toBe(1)
    expect(store.guests[0].rsvp).toBe('pending')
  })

  it('tracks RSVP stats', () => {
    store.addGuest({ name: 'A' })
    store.addGuest({ name: 'B', rsvp: 'accepted' })
    store.addGuest({ name: 'C', rsvp: 'declined' })
    expect(store.rsvpStats.pending).toBe(1)
    expect(store.rsvpStats.accepted).toBe(1)
    expect(store.rsvpStats.declined).toBe(1)
  })

  it('updates RSVP status', () => {
    store.addGuest({ name: 'A' })
    const id = store.guests[0].id
    store.setRsvp(id, 'accepted')
    expect(store.guests[0].rsvp).toBe('accepted')
  })

  it('counts plus ones', () => {
    store.addGuest({ name: 'A', plusOne: true })
    store.addGuest({ name: 'B', plusOne: false })
    expect(store.totalWithPlusOnes).toBe(3)
  })
})

describe('useTimelineStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTimelineStore()
  })

  it('adds a milestone', () => {
    store.addMilestone({ title: 'Book venue', date: '2027-03-01', icon: '🏛️' })
    expect(store.milestones.length).toBe(1)
  })

  it('generates milestones from wedding date', () => {
    store.generateFromWeddingDate('2028-06-15')
    expect(store.milestones.length).toBeGreaterThan(0)
  })

  it('toggles completion', () => {
    store.addMilestone({ title: 'Test', date: '2027-01-01' })
    const id = store.milestones[0].id
    expect(store.milestones[0].completed).toBe(false)
    store.toggleCompleted(id)
    expect(store.milestones[0].completed).toBe(true)
  })

  it('sorts by date', () => {
    store.addMilestone({ title: 'Later', date: '2027-06-01' })
    store.addMilestone({ title: 'Earlier', date: '2027-01-01' })
    expect(store.sorted[0].title).toBe('Earlier')
    expect(store.sorted[1].title).toBe('Later')
  })
})

describe('useVendorStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useVendorStore()
  })

  it('adds a vendor', () => {
    store.addVendor({ name: 'Rose Garden Florist', category: 'flowers' })
    expect(store.vendors.length).toBe(1)
    expect(store.vendors[0].status).toBe('researching')
  })

  it('updates vendor status', () => {
    store.addVendor({ name: 'Test', category: 'venue' })
    const id = store.vendors[0].id
    store.setStatus(id, 'booked')
    expect(store.vendors[0].status).toBe('booked')
    expect(store.booked.length).toBe(1)
  })

  it('sets rating', () => {
    store.addVendor({ name: 'Test', category: 'venue' })
    const id = store.vendors[0].id
    store.setRating(id, 4)
    expect(store.vendors[0].rating).toBe(4)
  })

  it('groups by category', () => {
    store.addVendor({ name: 'A', category: 'venue' })
    store.addVendor({ name: 'B', category: 'venue' })
    store.addVendor({ name: 'C', category: 'flowers' })
    expect(store.byCategory.venue.length).toBe(2)
    expect(store.byCategory.flowers.length).toBe(1)
  })
})
