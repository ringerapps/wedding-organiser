<script setup>
import { CATEGORIES, VENDOR_STATUSES } from '~/constants/board'

defineProps({
  vendor: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete', 'set-status'])

const statusStyles = {
  researching: 'bg-gray-50 text-gray-600 border-gray-200',
  contacted: 'bg-blue-50 text-blue-600 border-blue-200',
  quoted: 'bg-amber-50 text-amber-600 border-amber-200',
  booked: 'bg-green-50 text-green-600 border-green-200',
}

const statusLabels = {
  researching: 'Researching',
  contacted: 'Contacted',
  quoted: 'Quoted',
  booked: 'Booked',
}

function getCategoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || id
}

function getCategoryIcon(id) {
  return CATEGORIES.find((c) => c.id === id)?.icon || '📋'
}

function formatCurrency(n) {
  if (!n) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 group hover:shadow-md transition-all">
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span>{{ getCategoryIcon(vendor.category) }}</span>
          <h3 class="text-sm font-semibold text-charcoal truncate">{{ vendor.name }}</h3>
        </div>
        <p class="text-xs text-warm-gray mt-0.5">{{ getCategoryLabel(vendor.category) }}</p>
      </div>
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button class="text-warm-gray hover:text-sage-dark p-1 text-xs" @click="emit('edit')">&#9998;</button>
        <button class="text-warm-gray hover:text-rose p-1 text-xs" @click="emit('delete')">&times;</button>
      </div>
    </div>

    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <span
        class="text-xs px-2 py-0.5 rounded-full border font-medium"
        :class="statusStyles[vendor.status]"
      >
        {{ statusLabels[vendor.status] || vendor.status }}
      </span>
      <span v-if="vendor.price" class="text-xs font-semibold text-charcoal">
        {{ formatCurrency(vendor.price) }}
      </span>
      <div v-if="vendor.rating" class="flex items-center gap-0.5">
        <span v-for="i in 5" :key="i" class="text-xs" :class="i <= vendor.rating ? 'text-gold' : 'text-gray-200'">
          ★
        </span>
      </div>
    </div>

    <div v-if="vendor.contact || vendor.email || vendor.phone" class="mt-3 pt-3 border-t border-gray-50 space-y-1">
      <p v-if="vendor.contact" class="text-xs text-warm-gray">👤 {{ vendor.contact }}</p>
      <p v-if="vendor.email" class="text-xs text-warm-gray">✉️ {{ vendor.email }}</p>
      <p v-if="vendor.phone" class="text-xs text-warm-gray">📞 {{ vendor.phone }}</p>
    </div>

    <!-- Quick status buttons -->
    <div class="flex items-center gap-1 mt-3 pt-3 border-t border-gray-50">
      <button
        v-for="(label, key) in statusLabels"
        :key="key"
        class="text-xs px-2 py-1 rounded transition-colors"
        :class="vendor.status === key ? statusStyles[key] : 'text-warm-gray hover:bg-gray-50'"
        @click="emit('set-status', key)"
      >
        {{ label }}
      </button>
    </div>
  </div>
</template>
