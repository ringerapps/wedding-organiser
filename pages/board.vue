<script setup>
import { useBoardStore } from '~/stores/board'

const boardStore = useBoardStore()

const editingCard = ref(null)
const editingColumnId = ref(null)
const categoryFilter = ref('')

onMounted(() => {
  boardStore.init()
})

function handleEditCard(columnId, card) {
  editingCard.value = card
  editingColumnId.value = columnId
}

function handleSaveCard(updates) {
  if (editingCard.value && editingColumnId.value) {
    boardStore.updateCard(editingColumnId.value, editingCard.value.id, updates)
  }
  editingCard.value = null
  editingColumnId.value = null
}

function handleMoveCard(toColumnId) {
  if (editingCard.value && editingColumnId.value) {
    boardStore.moveCard(editingColumnId.value, toColumnId, editingCard.value.id)
  }
  editingCard.value = null
  editingColumnId.value = null
}

function handleDropCard(toColumnId, { cardId, fromColumnId }) {
  boardStore.moveCard(fromColumnId, toColumnId, cardId)
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-1 flex flex-col p-4 sm:p-6">
      <!-- Filter bar -->
      <div class="mb-4 overflow-x-auto pb-2">
        <CategoryFilter v-model="categoryFilter" />
      </div>

      <!-- Board -->
      <div class="flex-1 flex gap-4 items-start min-h-[calc(100vh-200px)]">
        <BoardColumn
          v-for="col in boardStore.columns"
          :key="col.id"
          :column="col"
          :category-filter="categoryFilter"
          @add-card="(card) => boardStore.addCard(col.id, card)"
          @edit-card="(card) => handleEditCard(col.id, card)"
          @delete-card="(cardId) => boardStore.deleteCard(col.id, cardId)"
          @drop-card="(data) => handleDropCard(col.id, data)"
        />
      </div>
    </main>

    <!-- Edit Modal -->
    <CardModal
      v-if="editingCard"
      :card="editingCard"
      :column-id="editingColumnId"
      @close="editingCard = null"
      @save="handleSaveCard"
      @move="handleMoveCard"
    />
  </div>
</template>
