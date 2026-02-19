import { describe, it, expect, beforeEach } from 'vitest'
import { useBoard } from '../composables/useBoard'

describe('useBoard', () => {
  let board

  beforeEach(() => {
    board = useBoard()
    board.resetBoard()
  })

  it('initializes with default columns', () => {
    board.init()
    expect(board.columns.value.length).toBeGreaterThan(0)
  })

  it('adds a card to a column', () => {
    board.init()
    const colId = board.columns.value[0].id
    const initialLen = board.columns.value[0].cards.length
    board.addCard(colId, { title: 'Test Task', priority: 'high' })
    expect(board.columns.value[0].cards.length).toBe(initialLen + 1)
    expect(board.columns.value[0].cards[initialLen].title).toBe('Test Task')
  })

  it('deletes a card', () => {
    board.init()
    const colId = board.columns.value[0].id
    const cardId = board.columns.value[0].cards[0].id
    const initialLen = board.columns.value[0].cards.length
    board.deleteCard(colId, cardId)
    expect(board.columns.value[0].cards.length).toBe(initialLen - 1)
  })

  it('toggles a card done state', () => {
    board.init()
    const colId = board.columns.value[0].id
    const cardId = board.columns.value[0].cards[0].id
    expect(board.columns.value[0].cards[0].done).toBe(false)
    board.toggleCard(colId, cardId)
    expect(board.columns.value[0].cards[0].done).toBe(true)
  })

  it('moves a card between columns', () => {
    board.init()
    const fromColId = board.columns.value[0].id
    const toColId = board.columns.value[1].id
    const card = board.columns.value[0].cards[0]
    const fromLen = board.columns.value[0].cards.length
    const toLen = board.columns.value[1].cards.length

    board.moveCard(fromColId, toColId, card.id)

    expect(board.columns.value[0].cards.length).toBe(fromLen - 1)
    expect(board.columns.value[1].cards.length).toBe(toLen + 1)
  })

  it('adds a column', () => {
    board.init()
    const initialLen = board.columns.value.length
    board.addColumn('New Column')
    expect(board.columns.value.length).toBe(initialLen + 1)
    expect(board.columns.value[board.columns.value.length - 1].title).toBe('New Column')
  })

  it('tracks progress', () => {
    board.init()
    const progress = board.getProgress()
    expect(progress.total).toBeGreaterThan(0)
    expect(progress.done).toBe(0)
    expect(progress.percent).toBe(0)
  })
})
