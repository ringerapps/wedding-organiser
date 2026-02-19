import { ref, watch } from 'vue'
import { DEFAULT_COLUMNS, SAMPLE_CARDS } from '~/constants/board'
import { generateId } from '~/utils/id'
import { saveBoard, loadBoard } from '~/utils/storage'

function createDefaultBoard() {
  return DEFAULT_COLUMNS.map((col) => ({
    ...col,
    cards: (SAMPLE_CARDS[col.id] || []).map((card) => ({
      id: generateId(),
      ...card,
      createdAt: new Date().toISOString(),
    })),
  }))
}

const columns = ref([])
const initialized = ref(false)

export function useBoard() {
  function init() {
    if (initialized.value) return
    const saved = loadBoard()
    columns.value = saved || createDefaultBoard()
    initialized.value = true
  }

  function persist() {
    saveBoard(columns.value)
  }

  watch(columns, persist, { deep: true })

  function addCard(columnId, card) {
    const col = columns.value.find((c) => c.id === columnId)
    if (!col) return
    col.cards.push({
      id: generateId(),
      title: card.title,
      priority: card.priority || 'medium',
      dueDate: card.dueDate || '',
      notes: card.notes || '',
      done: false,
      createdAt: new Date().toISOString(),
    })
  }

  function updateCard(columnId, cardId, updates) {
    const col = columns.value.find((c) => c.id === columnId)
    if (!col) return
    const card = col.cards.find((c) => c.id === cardId)
    if (!card) return
    Object.assign(card, updates)
  }

  function deleteCard(columnId, cardId) {
    const col = columns.value.find((c) => c.id === columnId)
    if (!col) return
    col.cards = col.cards.filter((c) => c.id !== cardId)
  }

  function toggleCard(columnId, cardId) {
    const col = columns.value.find((c) => c.id === columnId)
    if (!col) return
    const card = col.cards.find((c) => c.id === cardId)
    if (!card) return
    card.done = !card.done
  }

  function moveCard(fromColumnId, toColumnId, cardId, toIndex) {
    const fromCol = columns.value.find((c) => c.id === fromColumnId)
    const toCol = columns.value.find((c) => c.id === toColumnId)
    if (!fromCol || !toCol) return

    const cardIndex = fromCol.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) return

    const [card] = fromCol.cards.splice(cardIndex, 1)
    const insertAt = toIndex !== undefined ? toIndex : toCol.cards.length
    toCol.cards.splice(insertAt, 0, card)
  }

  function addColumn(title) {
    columns.value.push({
      id: generateId(),
      title,
      color: '#a8b5a0',
      icon: '📌',
      cards: [],
    })
  }

  function deleteColumn(columnId) {
    columns.value = columns.value.filter((c) => c.id !== columnId)
  }

  function renameColumn(columnId, title) {
    const col = columns.value.find((c) => c.id === columnId)
    if (col) col.title = title
  }

  function resetBoard() {
    columns.value = createDefaultBoard()
  }

  function getProgress() {
    let total = 0
    let done = 0
    for (const col of columns.value) {
      total += col.cards.length
      done += col.cards.filter((c) => c.done).length
    }
    return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
  }

  return {
    columns,
    init,
    addCard,
    updateCard,
    deleteCard,
    toggleCard,
    moveCard,
    addColumn,
    deleteColumn,
    renameColumn,
    resetBoard,
    getProgress,
  }
}
