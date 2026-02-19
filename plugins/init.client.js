import { useBoardStore } from '~/stores/board'

export default defineNuxtPlugin(() => {
  // Initialize the board store after persistence has loaded
  // This ensures sample cards are created if no persisted data exists
  const boardStore = useBoardStore()
  boardStore.init()
})
