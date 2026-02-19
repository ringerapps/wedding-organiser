<script setup>
import { CATEGORIES } from '~/constants/board'

const props = defineProps({
  item: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  name: '',
  category: 'venue',
  estimated: '',
  actual: '',
  vendor: '',
  notes: '',
  paid: false,
})

watch(
  () => props.item,
  (item) => {
    if (item) {
      form.name = item.name
      form.category = item.category
      form.estimated = item.estimated || ''
      form.actual = item.actual || ''
      form.vendor = item.vendor || ''
      form.notes = item.notes || ''
      form.paid = item.paid || false
    }
  },
  { immediate: true }
)

function save() {
  if (!form.name.trim()) return
  emit('save', {
    name: form.name.trim(),
    category: form.category,
    estimated: Number(form.estimated) || 0,
    actual: Number(form.actual) || 0,
    vendor: form.vendor,
    notes: form.notes,
    paid: form.paid,
  })
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-serif text-lg font-bold text-charcoal">
            {{ item ? 'Edit Expense' : 'Add Expense' }}
          </h3>
          <button class="text-warm-gray hover:text-charcoal text-xl p-1" @click="emit('close')">&times;</button>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-xs font-medium text-warm-gray mb-1">Name</label>
            <input
              v-model="form.name"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
              placeholder="e.g. Venue deposit"
              @keydown.enter="save"
            />
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Category</label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              >
                <option v-for="cat in CATEGORIES" :key="cat.id" :value="cat.id">
                  {{ cat.icon }} {{ cat.label }}
                </option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Vendor</label>
              <input
                v-model="form.vendor"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                placeholder="Optional"
              />
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Estimated ($)</label>
              <input
                v-model="form.estimated"
                type="number"
                min="0"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                placeholder="0"
              />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Actual ($)</label>
              <input
                v-model="form.actual"
                type="number"
                min="0"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-warm-gray mb-1">Notes</label>
            <textarea
              v-model="form.notes"
              rows="2"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 resize-none"
            />
          </div>

          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.paid" type="checkbox" class="rounded border-gray-300 text-sage focus:ring-sage" />
            <span class="text-sm text-charcoal">Mark as paid</span>
          </label>
        </div>

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
            {{ item ? 'Save Changes' : 'Add Expense' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
