import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBoardStore } from '../stores/board'

describe('useBoardStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBoardStore()
  })

  it('initializes with default columns', () => {
    store.init()
    expect(store.columns.length).toBe(3)
    expect(store.columns[0].id).toBe('todo')
    expect(store.columns[1].id).toBe('in-progress')
    expect(store.columns[2].id).toBe('done')
  })

  it('has sample cards in todo column', () => {
    store.init()
    expect(store.columns[0].cards.length).toBeGreaterThan(0)
    expect(store.columns[1].cards.length).toBe(0)
    expect(store.columns[2].cards.length).toBe(0)
  })

  it('adds a card to a column', () => {
    store.init()
    const initialLen = store.columns[0].cards.length
    store.addCard('todo', { title: 'Test Task', priority: 'high', category: 'venue' })
    expect(store.columns[0].cards.length).toBe(initialLen + 1)
    expect(store.columns[0].cards[initialLen].title).toBe('Test Task')
    expect(store.columns[0].cards[initialLen].category).toBe('venue')
  })

  it('deletes a card', () => {
    store.init()
    const cardId = store.columns[0].cards[0].id
    const initialLen = store.columns[0].cards.length
    store.deleteCard('todo', cardId)
    expect(store.columns[0].cards.length).toBe(initialLen - 1)
  })

  it('moves a card between columns', () => {
    store.init()
    const card = store.columns[0].cards[0]
    const fromLen = store.columns[0].cards.length
    const toLen = store.columns[1].cards.length

    store.moveCard('todo', 'in-progress', card.id)

    expect(store.columns[0].cards.length).toBe(fromLen - 1)
    expect(store.columns[1].cards.length).toBe(toLen + 1)
  })

  it('updates a card', () => {
    store.init()
    const cardId = store.columns[0].cards[0].id
    store.updateCard('todo', cardId, { title: 'Updated Title', category: 'catering' })
    expect(store.columns[0].cards[0].title).toBe('Updated Title')
    expect(store.columns[0].cards[0].category).toBe('catering')
  })

  it('tracks progress', () => {
    store.init()
    const progress = store.progress
    expect(progress.total).toBeGreaterThan(0)
    expect(progress.done).toBe(0)
    expect(progress.percent).toBe(0)
  })

  it('tracks progress when cards are done', () => {
    store.init()
    // Move a card to done
    const card = store.columns[0].cards[0]
    store.moveCard('todo', 'done', card.id)
    const progress = store.progress
    expect(progress.done).toBe(1)
    expect(progress.percent).toBeGreaterThan(0)
  })

  it('resets board', () => {
    store.init()
    store.addCard('in-progress', { title: 'Custom', priority: 'low', category: 'venue' })
    store.resetBoard()
    expect(store.columns[1].cards.length).toBe(0)
    expect(store.columns[0].cards.length).toBeGreaterThan(0)
  })
})
