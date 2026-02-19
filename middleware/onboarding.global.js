export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const key = 'wedding-planner-wedding'
  try {
    const data = localStorage.getItem(key)
    if (data) {
      const state = JSON.parse(data)
      if (state.onboardingCompleted) {
        // Already onboarded, allow all pages including onboarding (for re-editing)
        return
      }
    }
  } catch (_) {}

  // Not onboarded yet, redirect to onboarding (unless already there)
  if (to.path !== '/onboarding') {
    return navigateTo('/onboarding')
  }
})
