<script setup>
defineProps({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  icon: { type: String, default: '💰' },
  color: { type: String, default: 'sage' },
})

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
    <div class="flex items-center gap-3">
      <span class="text-2xl">{{ icon }}</span>
      <div>
        <p class="text-xs text-warm-gray font-medium">{{ title }}</p>
        <p class="text-lg font-bold text-charcoal">{{ formatCurrency(amount) }}</p>
      </div>
    </div>
  </div>
</template>
