<script setup>
import { PRIORITY_COLORS, PRIORITY_LABELS, CATEGORIES } from '~/constants/board'

const props = defineProps({
  column: { type: Object, required: true },
  categoryFilter: { type: String, default: '' },
})

const emit = defineEmits(['add-card', 'edit-card', 'delete-card', 'drop-card'])

const showAddForm = ref(false)
const newCardTitle = ref('')
const newCardPriority = ref('medium')
const newCardCategory = ref('logistics')
const dragOverColumn = ref(false)

const filteredCards = computed(() => {
  if (!props.categoryFilter) return props.column.cards
  return props.column.cards.filter((c) => c.category === props.categoryFilter)
})

function submitCard() {
  if (!newCardTitle.value.trim()) return
  emit('add-card', {
    title: newCardTitle.value.trim(),
    priority: newCardPriority.value,
    category: newCardCategory.value,
  })
  newCardTitle.value = ''
  newCardPriority.value = 'medium'
  newCardCategory.value = 'logistics'
  showAddForm.value = false
}

function onDragOver(e) {
  e.preventDefault()
  dragOverColumn.value = true
}

function onDragLeave() {
  dragOverColumn.value = false
}

function onDrop(e) {
  e.preventDefault()
  dragOverColumn.value = false
  const data = e.dataTransfer.getData('application/json')
  if (!data) return
  try {
    const { cardId, fromColumnId } = JSON.parse(data)
    emit('drop-card', { cardId, fromColumnId })
  } catch (_) {}
}

function onCardDragStart(e, card) {
  e.dataTransfer.setData(
    'application/json',
    JSON.stringify({ cardId: card.id, fromColumnId: props.column.id })
  )
  e.dataTransfer.effectAllowed = 'move'
}
</script>

<template>
  <div
    class="flex-1 min-w-[280px] max-w-[400px] flex flex-col bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm max-h-full"
    :class="{ 'ring-2 ring-sage/50 bg-sage/5': dragOverColumn }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- Column Header -->
    <div class="p-3 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">{{ column.icon }}</span>
          <h2 class="font-semibold text-sm text-charcoal">{{ column.title }}</h2>
        </div>
        <span class="text-xs text-warm-gray bg-gray-100 px-2 py-0.5 rounded-full font-medium">
          {{ filteredCards.length }}
        </span>
      </div>
    </div>

    <!-- Cards -->
    <div class="flex-1 overflow-y-auto p-2 space-y-2 min-h-[80px]">
      <div
        v-for="card in filteredCards"
        :key="card.id"
        draggable="true"
        class="group bg-white rounded-lg border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
        @dragstart="onCardDragStart($event, card)"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-charcoal">{{ card.title }}</p>
            <div class="flex items-center gap-1.5 mt-2 flex-wrap">
              <CategoryBadge :category-id="card.category" />
              <span
                class="text-[10px] px-1.5 py-0.5 rounded-full border font-medium"
                :class="PRIORITY_COLORS[card.priority]"
              >
                {{ PRIORITY_LABELS[card.priority] }}
              </span>
              <span v-if="card.dueDate" class="text-[10px] text-warm-gray">
                {{ card.dueDate }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              class="text-warm-gray hover:text-sage-dark p-0.5 rounded text-xs"
              title="Edit"
              @click="emit('edit-card', card)"
            >
              &#9998;
            </button>
            <button
              class="text-warm-gray hover:text-rose p-0.5 rounded text-xs"
              title="Delete"
              @click="emit('delete-card', card.id)"
            >
              &times;
            </button>
          </div>
        </div>
        <p v-if="card.notes" class="text-xs text-warm-gray mt-2 line-clamp-2">
          {{ card.notes }}
        </p>
      </div>

      <div
        v-if="filteredCards.length === 0 && !showAddForm"
        class="text-center py-6 text-xs text-warm-gray/60"
      >
        Drop tasks here or add a new one
      </div>
    </div>

    <!-- Add Card -->
    <div class="p-2 border-t border-gray-100">
      <div v-if="showAddForm" class="space-y-2">
        <input
          v-model="newCardTitle"
          class="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          placeholder="Task name..."
          @keydown.enter="submitCard"
          @keydown.escape="showAddForm = false"
        />
        <div class="flex items-center gap-2 flex-wrap">
          <select
            v-model="newCardCategory"
            class="text-xs px-2 py-1 rounded border border-gray-200 focus:outline-none"
          >
            <option v-for="cat in CATEGORIES" :key="cat.id" :value="cat.id">
              {{ cat.icon }} {{ cat.label }}
            </option>
          </select>
          <select
            v-model="newCardPriority"
            class="text-xs px-2 py-1 rounded border border-gray-200 focus:outline-none"
          >
            <option value="high">Urgent</option>
            <option value="medium">Important</option>
            <option value="low">Nice to have</option>
          </select>
          <div class="flex-1" />
          <button
            class="text-xs px-3 py-1 rounded-lg bg-sage text-white hover:bg-sage-dark transition-colors"
            @click="submitCard"
          >
            Add
          </button>
          <button
            class="text-xs px-2 py-1 text-warm-gray hover:text-charcoal transition-colors"
            @click="showAddForm = false"
          >
            Cancel
          </button>
        </div>
      </div>
      <button
        v-else
        class="w-full text-left text-sm text-warm-gray hover:text-sage-dark hover:bg-sage/5 px-3 py-2 rounded-lg transition-colors"
        @click="showAddForm = true"
      >
        + Add task
      </button>
    </div>
  </div>
</template>
