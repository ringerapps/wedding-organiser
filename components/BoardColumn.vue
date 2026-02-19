<script setup>
import { PRIORITY_COLORS, PRIORITY_LABELS } from '~/constants/board'

const props = defineProps({
  column: { type: Object, required: true },
})

const emit = defineEmits(['add-card', 'toggle-card', 'edit-card', 'delete-card', 'drop-card', 'rename-column', 'delete-column'])

const showAddForm = ref(false)
const newCardTitle = ref('')
const newCardPriority = ref('medium')
const isEditing = ref(false)
const editTitle = ref('')
const dragOverColumn = ref(false)

const doneCount = computed(() => props.column.cards.filter((c) => c.done).length)

function submitCard() {
  if (!newCardTitle.value.trim()) return
  emit('add-card', {
    title: newCardTitle.value.trim(),
    priority: newCardPriority.value,
  })
  newCardTitle.value = ''
  newCardPriority.value = 'medium'
  showAddForm.value = false
}

function startRename() {
  editTitle.value = props.column.title
  isEditing.value = true
  nextTick(() => {
    const input = document.querySelector(`#col-edit-${props.column.id}`)
    input?.focus()
  })
}

function submitRename() {
  if (editTitle.value.trim()) {
    emit('rename-column', editTitle.value.trim())
  }
  isEditing.value = false
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
    class="flex-shrink-0 w-72 sm:w-80 flex flex-col bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm max-h-full"
    :class="{ 'ring-2 ring-sage/50 bg-sage/5': dragOverColumn }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- Column Header -->
    <div class="p-3 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <span class="text-lg">{{ column.icon }}</span>
          <template v-if="!isEditing">
            <h2
              class="font-semibold text-sm text-charcoal truncate cursor-pointer"
              @dblclick="startRename"
            >
              {{ column.title }}
            </h2>
          </template>
          <template v-else>
            <input
              :id="`col-edit-${column.id}`"
              v-model="editTitle"
              class="font-semibold text-sm text-charcoal bg-transparent border-b border-sage focus:outline-none flex-1"
              @keydown.enter="submitRename"
              @blur="submitRename"
            />
          </template>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-xs text-warm-gray bg-gray-100 px-1.5 py-0.5 rounded-full">
            {{ doneCount }}/{{ column.cards.length }}
          </span>
          <button
            class="text-warm-gray hover:text-rose text-sm p-0.5 rounded transition-colors"
            title="Delete column"
            @click="emit('delete-column')"
          >
            &times;
          </button>
        </div>
      </div>
    </div>

    <!-- Cards -->
    <div class="flex-1 overflow-y-auto p-2 space-y-2 min-h-[60px]">
      <div
        v-for="card in column.cards"
        :key="card.id"
        draggable="true"
        class="group bg-white rounded-lg border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
        :class="{ 'opacity-60': card.done }"
        @dragstart="onCardDragStart($event, card)"
      >
        <div class="flex items-start gap-2">
          <button
            class="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 transition-colors"
            :class="card.done ? 'bg-sage border-sage' : 'border-gray-300 hover:border-sage'"
            @click="emit('toggle-card', card.id)"
          >
            <svg v-if="card.done" class="w-full h-full text-white" viewBox="0 0 16 16" fill="none">
              <path d="M4 8l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium"
              :class="card.done ? 'line-through text-warm-gray' : 'text-charcoal'"
            >
              {{ card.title }}
            </p>
            <div class="flex items-center gap-1.5 mt-1.5 flex-wrap">
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
        <p v-if="card.notes && !card.done" class="text-xs text-warm-gray mt-2 line-clamp-2">
          {{ card.notes }}
        </p>
      </div>

      <div
        v-if="column.cards.length === 0 && !showAddForm"
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
        <div class="flex items-center gap-2">
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
