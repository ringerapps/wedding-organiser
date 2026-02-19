<script setup>
const props = defineProps({
  milestone: { type: Object, required: true },
  isLast: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle', 'delete'])

const isPast = computed(() => {
  const d = new Date(props.milestone.date)
  d.setHours(0, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return d < now
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="flex gap-4 group">
    <!-- Timeline line + dot -->
    <div class="flex flex-col items-center">
      <button
        class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm flex-shrink-0 transition-all"
        :class="milestone.completed
          ? 'bg-sage border-sage text-white'
          : isPast
            ? 'bg-amber-100 border-amber-300 text-amber-600'
            : 'bg-white border-gray-200 hover:border-sage'"
        @click="emit('toggle')"
      >
        {{ milestone.completed ? '✓' : milestone.icon }}
      </button>
      <div
        v-if="!isLast"
        class="w-0.5 flex-1 min-h-[40px]"
        :class="milestone.completed ? 'bg-sage/30' : 'bg-gray-200'"
      />
    </div>

    <!-- Content -->
    <div class="pb-8 flex-1">
      <div class="flex items-start justify-between">
        <div>
          <h3
            class="text-sm font-semibold"
            :class="milestone.completed ? 'text-warm-gray line-through' : 'text-charcoal'"
          >
            {{ milestone.title }}
          </h3>
          <p class="text-xs text-warm-gray mt-0.5">{{ formatDate(milestone.date) }}</p>
          <p v-if="milestone.description" class="text-xs text-warm-gray mt-1">{{ milestone.description }}</p>
        </div>
        <button
          class="text-warm-gray hover:text-rose text-xs opacity-0 group-hover:opacity-100 transition-opacity p-1"
          @click="emit('delete')"
        >
          &times;
        </button>
      </div>
    </div>
  </div>
</template>
