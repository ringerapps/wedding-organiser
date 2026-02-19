import { describe, it, expect } from 'vitest'
import { generateId } from '../utils/id'
import { saveBoard, loadBoard, clearBoard } from '../utils/storage'

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string')
  })

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})

describe('storage', () => {
  it('saves and loads board data', () => {
    const board = [{ id: 'test', title: 'Test Column', cards: [] }]
    saveBoard(board)
    const loaded = loadBoard()
    expect(loaded).toEqual(board)
  })

  it('returns null when no data saved', () => {
    clearBoard()
    expect(loadBoard()).toBeNull()
  })
})
