<script setup>
const route = useRoute()
const mobileOpen = ref(false)

const links = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/board', label: 'Board', icon: '📋' },
  { to: '/budget', label: 'Budget', icon: '💰' },
  { to: '/guests', label: 'Guests', icon: '💌' },
  { to: '/timeline', label: 'Timeline', icon: '📅' },
  { to: '/vendors', label: 'Vendors', icon: '🤝' },
]

function isActive(path) {
  return route.path === path
}

watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<template>
  <!-- Desktop nav -->
  <nav class="hidden md:flex items-center gap-1">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
      :class="isActive(link.to) ? 'bg-sage/15 text-sage-dark' : 'text-warm-gray hover:text-charcoal hover:bg-gray-50'"
    >
      <span class="mr-1">{{ link.icon }}</span>
      {{ link.label }}
    </NuxtLink>
  </nav>

  <!-- Mobile hamburger -->
  <button
    class="md:hidden p-2 rounded-lg text-warm-gray hover:text-charcoal hover:bg-gray-50 transition-colors"
    @click="mobileOpen = !mobileOpen"
  >
    <svg v-if="!mobileOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Mobile slide-out -->
  <Teleport to="body">
    <Transition name="slide">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-[90] md:hidden"
        @click.self="mobileOpen = false"
      >
        <div class="absolute inset-0 bg-black/30" @click="mobileOpen = false" />
        <div class="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-4 pt-16 space-y-1">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
            :class="isActive(link.to) ? 'bg-sage/15 text-sage-dark' : 'text-warm-gray hover:text-charcoal hover:bg-gray-50'"
          >
            <span class="text-lg">{{ link.icon }}</span>
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
.slide-enter-from > div:last-child,
.slide-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
