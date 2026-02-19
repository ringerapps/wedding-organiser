import { watch } from 'vue'

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(({ store }) => {
    const key = `wedding-planner-${store.$id}`

    // Load persisted state
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(key)
        if (saved) {
          store.$patch(JSON.parse(saved))
        }
      } catch (e) {
        console.warn(`Failed to load ${key}:`, e)
      }
    }

    // Watch for changes and persist
    watch(
      () => store.$state,
      (state) => {
        if (typeof window === 'undefined') return
        try {
          localStorage.setItem(key, JSON.stringify(state))
        } catch (e) {
          console.warn(`Failed to save ${key}:`, e)
        }
      },
      { deep: true }
    )
  })
})
