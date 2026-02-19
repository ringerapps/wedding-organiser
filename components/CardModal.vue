<script setup>
import { CARD_PRIORITIES, PRIORITY_LABELS } from '~/constants/board'

const props = defineProps({
  card: { type: Object, default: null },
  columnTitle: { type: String, default: '' },
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  title: '',
  priority: 'medium',
  dueDate: '',
  notes: '',
})

watch(
  () => props.card,
  (card) => {
    if (card) {
      form.title = card.title
      form.priority = card.priority
      form.dueDate = card.dueDate || ''
      form.notes = card.notes || ''
    }
  },
  { immediate: true }
)

function save() {
  if (!form.title.trim()) return
  emit('save', { ...form, title: form.title.trim() })
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="font-serif text-lg font-bold text-charcoal">Edit Task</h3>
            <p class="text-xs text-warm-gray">{{ columnTitle }}</p>
          </div>
          <button
            class="text-warm-gray hover:text-charcoal text-xl p-1"
            @click="emit('close')"
          >
            &times;
          </button>
        </div>

        <!-- Form -->
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-xs font-medium text-warm-gray mb-1">Task Name</label>
            <input
              v-model="form.title"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
              @keydown.enter="save"
            />
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Priority</label>
              <select
                v-model="form.priority"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              >
                <option v-for="(label, key) in PRIORITY_LABELS" :key="key" :value="key">
                  {{ label }}
                </option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Due Date</label>
              <input
                v-model="form.dueDate"
                type="date"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-warm-gray mb-1">Notes</label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 resize-none"
              placeholder="Additional details..."
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
          <button
            class="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-white transition-colors"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 text-sm rounded-lg bg-sage text-white hover:bg-sage-dark transition-colors font-medium"
            @click="save"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
