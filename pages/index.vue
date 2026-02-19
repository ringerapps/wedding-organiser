<script setup>
import { useBoard } from '~/composables/useBoard'

const {
  columns,
  init,
  addCard,
  updateCard,
  deleteCard,
  toggleCard,
  moveCard,
  addColumn,
  deleteColumn,
  renameColumn,
} = useBoard()

const editingCard = ref(null)
const editingColumnId = ref(null)
const editingColumnTitle = ref('')
const showAddColumn = ref(false)
const newColumnTitle = ref('')

onMounted(() => {
  init()
})

function handleEditCard(columnId, card) {
  editingCard.value = card
  editingColumnId.value = columnId
  const col = columns.value.find((c) => c.id === columnId)
  editingColumnTitle.value = col?.title || ''
}

function handleSaveCard(updates) {
  if (editingCard.value && editingColumnId.value) {
    updateCard(editingColumnId.value, editingCard.value.id, updates)
  }
  editingCard.value = null
  editingColumnId.value = null
}

function handleDropCard(toColumnId, { cardId, fromColumnId }) {
  moveCard(fromColumnId, toColumnId, cardId)
}

function submitAddColumn() {
  if (!newColumnTitle.value.trim()) return
  addColumn(newColumnTitle.value.trim())
  newColumnTitle.value = ''
  showAddColumn.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <!-- Board -->
    <main class="flex-1 overflow-x-auto p-4 sm:p-6">
      <div class="board-columns flex gap-4 items-start min-h-[calc(100vh-120px)]">
        <BoardColumn
          v-for="col in columns"
          :key="col.id"
          :column="col"
          @add-card="(card) => addCard(col.id, card)"
          @toggle-card="(cardId) => toggleCard(col.id, cardId)"
          @edit-card="(card) => handleEditCard(col.id, card)"
          @delete-card="(cardId) => deleteCard(col.id, cardId)"
          @drop-card="(data) => handleDropCard(col.id, data)"
          @rename-column="(title) => renameColumn(col.id, title)"
          @delete-column="deleteColumn(col.id)"
        />

        <!-- Add Column -->
        <div class="flex-shrink-0 w-72">
          <div v-if="showAddColumn" class="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 p-3 space-y-2">
            <input
              v-model="newColumnTitle"
              class="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
              placeholder="Column name..."
              @keydown.enter="submitAddColumn"
              @keydown.escape="showAddColumn = false"
            />
            <div class="flex gap-2">
              <button
                class="text-xs px-3 py-1.5 rounded-lg bg-sage text-white hover:bg-sage-dark transition-colors"
                @click="submitAddColumn"
              >
                Add Column
              </button>
              <button
                class="text-xs px-2 py-1.5 text-warm-gray hover:text-charcoal transition-colors"
                @click="showAddColumn = false"
              >
                Cancel
              </button>
            </div>
          </div>
          <button
            v-else
            class="w-full text-left text-sm text-warm-gray hover:text-sage-dark bg-white/30 hover:bg-white/50 border border-dashed border-gray-200 hover:border-sage px-4 py-3 rounded-xl transition-all"
            @click="showAddColumn = true"
          >
            + Add column
          </button>
        </div>
      </div>
    </main>

    <!-- Edit Modal -->
    <CardModal
      v-if="editingCard"
      :card="editingCard"
      :column-title="editingColumnTitle"
      @close="editingCard = null"
      @save="handleSaveCard"
    />
  </div>
</template>
