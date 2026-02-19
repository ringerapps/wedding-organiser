<script setup>
import { useBoardStore } from '~/stores/board'

const boardStore = useBoardStore()

const upcomingTasks = computed(() => {
  const tasks = []
  for (const col of boardStore.columns) {
    if (col.id === 'done') continue
    for (const card of col.cards) {
      if (card.dueDate) {
        tasks.push({ ...card, columnTitle: col.title })
      }
    }
  }
  return tasks
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)
})

const highPriorityTasks = computed(() => {
  const tasks = []
  for (const col of boardStore.columns) {
    if (col.id === 'done') continue
    for (const card of col.cards) {
      if (card.priority === 'high') {
        tasks.push({ ...card, columnTitle: col.title })
      }
    }
  }
  return tasks.slice(0, 5)
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Upcoming deadlines -->
    <div v-if="upcomingTasks.length > 0" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-50">
        <h3 class="text-sm font-semibold text-charcoal">Upcoming Deadlines</h3>
      </div>
      <div class="divide-y divide-gray-50">
        <div v-for="task in upcomingTasks" :key="task.id" class="flex items-center gap-3 px-4 py-3">
          <span class="text-xs font-medium text-sage-dark bg-sage/10 px-2 py-0.5 rounded">
            {{ formatDate(task.dueDate) }}
          </span>
          <span class="text-sm text-charcoal flex-1 truncate">{{ task.title }}</span>
          <span class="text-xs text-warm-gray">{{ task.columnTitle }}</span>
        </div>
      </div>
    </div>

    <!-- High priority tasks -->
    <div v-if="highPriorityTasks.length > 0" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-50">
        <h3 class="text-sm font-semibold text-charcoal">High Priority</h3>
      </div>
      <div class="divide-y divide-gray-50">
        <div v-for="task in highPriorityTasks" :key="task.id" class="flex items-center gap-3 px-4 py-3">
          <span class="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            Urgent
          </span>
          <span class="text-sm text-charcoal flex-1 truncate">{{ task.title }}</span>
          <CategoryBadge :category-id="task.category" />
        </div>
      </div>
    </div>
  </div>
</template>
