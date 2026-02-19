<script setup>
import { CATEGORIES } from '~/constants/board'

defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['toggle-paid', 'edit', 'delete'])

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function getCategoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || id
}

function getCategoryIcon(id) {
  return CATEGORIES.find((c) => c.id === id)?.icon || '📋'
}
</script>

<template>
  <div class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
    <button
      class="flex-shrink-0 w-5 h-5 rounded border-2 transition-colors"
      :class="item.paid ? 'bg-sage border-sage' : 'border-gray-300 hover:border-sage'"
      @click="emit('toggle-paid')"
    >
      <svg v-if="item.paid" class="w-full h-full text-white" viewBox="0 0 16 16" fill="none">
        <path d="M4 8l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <span class="text-sm">{{ getCategoryIcon(item.category) }}</span>

    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-charcoal truncate" :class="{ 'line-through opacity-60': item.paid }">
        {{ item.name }}
      </p>
      <p class="text-xs text-warm-gray">{{ getCategoryLabel(item.category) }}</p>
    </div>

    <div class="text-right">
      <p class="text-sm font-semibold text-charcoal">{{ formatCurrency(item.actual || item.estimated) }}</p>
      <p v-if="item.actual && item.estimated" class="text-xs text-warm-gray">
        est. {{ formatCurrency(item.estimated) }}
      </p>
    </div>

    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button class="text-warm-gray hover:text-sage-dark p-1 text-xs" @click="emit('edit')">&#9998;</button>
      <button class="text-warm-gray hover:text-rose p-1 text-xs" @click="emit('delete')">&times;</button>
    </div>
  </div>
</template>
