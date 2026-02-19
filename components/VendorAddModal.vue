<script setup>
import { CATEGORIES } from '~/constants/board'

const props = defineProps({
  vendor: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  name: '',
  category: 'venue',
  status: 'researching',
  contact: '',
  email: '',
  phone: '',
  website: '',
  price: '',
  rating: 0,
  notes: '',
})

watch(
  () => props.vendor,
  (vendor) => {
    if (vendor) {
      Object.assign(form, {
        name: vendor.name,
        category: vendor.category,
        status: vendor.status,
        contact: vendor.contact || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        website: vendor.website || '',
        price: vendor.price || '',
        rating: vendor.rating || 0,
        notes: vendor.notes || '',
      })
    }
  },
  { immediate: true }
)

function save() {
  if (!form.name.trim()) return
  emit('save', {
    ...form,
    name: form.name.trim(),
    price: Number(form.price) || 0,
  })
}

function setRating(n) {
  form.rating = form.rating === n ? 0 : n
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
            {{ vendor ? 'Edit Vendor' : 'Add Vendor' }}
          </h3>
          <button class="text-warm-gray hover:text-charcoal text-xl p-1" @click="emit('close')">&times;</button>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-xs font-medium text-warm-gray mb-1">Business Name</label>
            <input
              v-model="form.name"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
              placeholder="e.g. Rose Garden Florist"
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
              <label class="block text-xs font-medium text-warm-gray mb-1">Status</label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              >
                <option value="researching">Researching</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="booked">Booked</option>
              </select>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Contact Person</label>
              <input
                v-model="form.contact"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                placeholder="Optional"
              />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Price ($)</label>
              <input
                v-model="form.price"
                type="number"
                min="0"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                placeholder="0"
              />
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-medium text-warm-gray mb-1">Phone</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-warm-gray mb-1">Rating</label>
            <div class="flex items-center gap-1">
              <button
                v-for="i in 5"
                :key="i"
                class="text-xl transition-colors"
                :class="i <= form.rating ? 'text-gold' : 'text-gray-200 hover:text-gold/50'"
                @click="setRating(i)"
              >
                ★
              </button>
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
            {{ vendor ? 'Save Changes' : 'Add Vendor' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
