<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '' },
  to: { type: String, default: '' },
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all cursor-pointer block"
  >
    <div class="flex items-center gap-3">
      <span v-if="icon" class="text-2xl">{{ icon }}</span>
      <div>
        <p class="text-xs text-warm-gray font-medium">{{ title }}</p>
        <p class="text-xl font-bold text-charcoal font-serif">{{ value }}</p>
        <p v-if="subtitle" class="text-xs text-warm-gray">{{ subtitle }}</p>
      </div>
    </div>
  </NuxtLink>
  <div
    v-else
    class="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
  >
    <div class="flex items-center gap-3">
      <span v-if="icon" class="text-2xl">{{ icon }}</span>
      <div>
        <p class="text-xs text-warm-gray font-medium">{{ title }}</p>
        <p class="text-xl font-bold text-charcoal font-serif">{{ value }}</p>
        <p v-if="subtitle" class="text-xs text-warm-gray">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>
