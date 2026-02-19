<script setup>
import { useBoard } from '~/composables/useBoard'

const { getProgress, resetBoard } = useBoard()
const showResetConfirm = ref(false)

const progress = computed(() => getProgress())

function confirmReset() {
  resetBoard()
  showResetConfirm.value = false
}
</script>

<template>
  <header class="bg-white/80 backdrop-blur-sm border-b border-blush-dark/20 sticky top-0 z-50">
    <div class="max-w-full mx-auto px-4 sm:px-6 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="text-3xl">💍</div>
          <div>
            <h1 class="font-serif text-xl sm:text-2xl font-bold text-charcoal tracking-tight">
              Wedding Planner
            </h1>
            <p class="text-xs text-warm-gray hidden sm:block">Organise your perfect day</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Progress -->
          <div class="hidden sm:flex items-center gap-3">
            <div class="text-sm text-warm-gray">
              <span class="font-semibold text-sage-dark">{{ progress.done }}</span>
              / {{ progress.total }} tasks
            </div>
            <div class="w-32 h-2 bg-blush rounded-full overflow-hidden">
              <div
                class="h-full bg-sage rounded-full transition-all duration-500"
                :style="{ width: progress.percent + '%' }"
              />
            </div>
            <span class="text-xs font-medium text-sage-dark">{{ progress.percent }}%</span>
          </div>

          <!-- Reset -->
          <button
            class="text-sm text-warm-gray hover:text-rose transition-colors px-2 py-1 rounded"
            @click="showResetConfirm = true"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Mobile progress -->
      <div class="sm:hidden mt-2 flex items-center gap-2">
        <div class="flex-1 h-2 bg-blush rounded-full overflow-hidden">
          <div
            class="h-full bg-sage rounded-full transition-all duration-500"
            :style="{ width: progress.percent + '%' }"
          />
        </div>
        <span class="text-xs font-medium text-sage-dark">{{ progress.percent }}%</span>
      </div>
    </div>

    <!-- Reset confirmation -->
    <Teleport to="body">
      <div
        v-if="showResetConfirm"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        @click.self="showResetConfirm = false"
      >
        <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
          <h3 class="font-serif text-lg font-bold mb-2">Reset Board?</h3>
          <p class="text-sm text-warm-gray mb-4">
            This will remove all your changes and restore the default tasks. This cannot be undone.
          </p>
          <div class="flex gap-2 justify-end">
            <button
              class="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              @click="showResetConfirm = false"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 text-sm rounded-lg bg-rose text-white hover:bg-rose-dark transition-colors"
              @click="confirmReset"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>
