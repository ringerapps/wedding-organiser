const STORAGE_KEY = 'wedding-planner-board'

export function saveBoard(board) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
  } catch (e) {
    console.warn('Failed to save board:', e)
  }
}

export function loadBoard() {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.warn('Failed to load board:', e)
    return null
  }
}

export function clearBoard() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
