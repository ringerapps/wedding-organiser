<script setup>
defineProps({
  status: { type: String, required: true },
})

const styles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
}

const labels = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
}
</script>

<template>
  <span
    class="text-xs px-2 py-0.5 rounded-full border font-medium"
    :class="styles[status] || styles.pending"
  >
    {{ labels[status] || status }}
  </span>
</template>
