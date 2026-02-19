<script setup>
import { MEAL_OPTIONS } from '~/constants/board'

const props = defineProps({
  guest: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  name: '',
  email: '',
  phone: '',
  rsvp: 'pending',
  meal: 'Standard',
  plusOne: false,
  plusOneName: '',
  table: '',
  group: '',
  notes: '',
})

watch(
  () => props.guest,
  (guest) => {
    if (guest) {
      Object.assign(form, {
        name: guest.name,
        email: guest.email || '',
        phone: guest.phone || '',
        rsvp: guest.rsvp || 'pending',
        meal: guest.meal || 'Standard',
        plusOne: guest.plusOne || false,
        plusOneName: guest.plusOneName || '',
        table: guest.table || '',
        group: guest.group || '',
        notes: guest.notes || '',
      })
    }
  },
  { immediate: true }
)

function save() {
  if (!form.name.trim()) return
  emit('save', { ...form, name: form.name.trim() })
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h3 class="font-serif text-lg font-bold text-charcoal">
            {{ guest ? 'Edit Guest' : 'Add Guest' }}
          </h3>
          <button class="text-warm-gray hover:text-charcoal text-xl p-1" @click="emit('close')">&times;</button>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-xs font-medium text-warm-gray mb-1">Name</label>
            <input
              v-model="form.name"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
              placeholder="Full name"
            />
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                placeholder="Optional"
              />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Phone</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                placeholder="Optional"
              />
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">RSVP</label>
              <select
                v-model="form.rsvp"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Meal Preference</label>
              <select
                v-model="form.meal"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              >
                <option v-for="m in MEAL_OPTIONS" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Group</label>
              <input
                v-model="form.group"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                placeholder="e.g. Family, Work"
              />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Table</label>
              <input
                v-model="form.table"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                placeholder="e.g. Table 1"
              />
            </div>
          </div>

          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="form.plusOne" type="checkbox" class="rounded border-gray-300 text-sage focus:ring-sage" />
              <span class="text-sm text-charcoal">Has a +1</span>
            </label>
            <input
              v-if="form.plusOne"
              v-model="form.plusOneName"
              class="w-full mt-2 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              placeholder="+1 name (optional)"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-warm-gray mb-1">Notes</label>
            <textarea
              v-model="form.notes"
              rows="2"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 resize-none"
            />
          </div>
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
            {{ guest ? 'Save Changes' : 'Add Guest' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
