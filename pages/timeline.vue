<script setup>
import { useTimelineStore } from '~/stores/timeline'
import { useWeddingStore } from '~/stores/wedding'

const timelineStore = useTimelineStore()
const weddingStore = useWeddingStore()

const showAddForm = ref(false)
const newMilestone = reactive({
  title: '',
  date: '',
  icon: '📌',
  description: '',
})

function addMilestone() {
  if (!newMilestone.title.trim() || !newMilestone.date) return
  timelineStore.addMilestone({ ...newMilestone, title: newMilestone.title.trim() })
  newMilestone.title = ''
  newMilestone.date = ''
  newMilestone.icon = '📌'
  newMilestone.description = ''
  showAddForm.value = false
}

function generateDefault() {
  if (weddingStore.weddingDate) {
    timelineStore.generateFromWeddingDate(weddingStore.weddingDate)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 class="font-serif text-2xl font-bold text-charcoal">Timeline</h2>
          <p class="text-sm text-warm-gray">Your wedding planning milestones</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="timelineStore.milestones.length === 0 && weddingStore.weddingDate"
            class="px-3 py-2 text-sm rounded-lg border border-sage text-sage-dark hover:bg-sage/5 transition-colors font-medium"
            @click="generateDefault"
          >
            Auto-generate
          </button>
          <button
            class="px-4 py-2 text-sm rounded-lg bg-sage text-white hover:bg-sage-dark transition-colors font-medium shadow-sm"
            @click="showAddForm = !showAddForm"
          >
            + Add Milestone
          </button>
        </div>
      </div>

      <!-- Countdown -->
      <CountdownDisplay class="mb-8" />

      <!-- Add form -->
      <div v-if="showAddForm" class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 space-y-3">
        <input
          v-model="newMilestone.title"
          class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          placeholder="Milestone title..."
          @keydown.enter="addMilestone"
        />
        <div class="flex gap-3">
          <input
            v-model="newMilestone.date"
            type="date"
            class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
          />
          <input
            v-model="newMilestone.icon"
            class="w-16 px-3 py-2 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-sage/30"
            placeholder="📌"
          />
        </div>
        <div class="flex gap-2 justify-end">
          <button
            class="px-3 py-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors"
            @click="showAddForm = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-1.5 text-sm rounded-lg bg-sage text-white hover:bg-sage-dark transition-colors"
            @click="addMilestone"
          >
            Add
          </button>
        </div>
      </div>

      <!-- Timeline -->
      <div v-if="timelineStore.sorted.length > 0" class="mt-4">
        <TimelineMilestone
          v-for="(m, i) in timelineStore.sorted"
          :key="m.id"
          :milestone="m"
          :is-last="i === timelineStore.sorted.length - 1"
          @toggle="timelineStore.toggleCompleted(m.id)"
          @delete="timelineStore.deleteMilestone(m.id)"
        />
      </div>

      <div v-else class="text-center py-16 text-warm-gray">
        <p class="text-4xl mb-4">📅</p>
        <p class="text-sm">No milestones yet.</p>
        <p v-if="weddingStore.weddingDate" class="text-xs mt-1">
          Click "Auto-generate" to create a suggested timeline from your wedding date.
        </p>
        <p v-else class="text-xs mt-1">
          Set your wedding date in the dashboard to auto-generate milestones.
        </p>
      </div>
    </main>
  </div>
</template>
