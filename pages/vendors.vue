<script setup>
import { useVendorStore } from '~/stores/vendors'
import { CATEGORIES } from '~/constants/board'

const vendorStore = useVendorStore()

const showAddModal = ref(false)
const editingVendor = ref(null)
const filterCategory = ref('')
const filterStatus = ref('')

const filteredVendors = computed(() => {
  let list = vendorStore.vendors
  if (filterCategory.value) {
    list = list.filter((v) => v.category === filterCategory.value)
  }
  if (filterStatus.value) {
    list = list.filter((v) => v.status === filterStatus.value)
  }
  return list
})

const statusCounts = computed(() => {
  const counts = { researching: 0, contacted: 0, quoted: 0, booked: 0 }
  for (const v of vendorStore.vendors) {
    if (counts[v.status] !== undefined) counts[v.status]++
  }
  return counts
})

function handleSave(data) {
  if (editingVendor.value) {
    vendorStore.updateVendor(editingVendor.value.id, data)
  } else {
    vendorStore.addVendor(data)
  }
  showAddModal.value = false
  editingVendor.value = null
}

function editVendor(vendor) {
  editingVendor.value = vendor
  showAddModal.value = true
}

function closeModal() {
  showAddModal.value = false
  editingVendor.value = null
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 class="font-serif text-2xl font-bold text-charcoal">Vendors</h2>
          <p class="text-sm text-warm-gray">Track your wedding vendors</p>
        </div>
        <button
          class="px-4 py-2 text-sm rounded-lg bg-sage text-white hover:bg-sage-dark transition-colors font-medium shadow-sm"
          @click="showAddModal = true"
        >
          + Add Vendor
        </button>
      </div>

      <!-- Status summary -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div class="bg-gray-50 rounded-xl border border-gray-100 p-3 text-center">
          <p class="text-2xl font-bold text-gray-600">{{ statusCounts.researching }}</p>
          <p class="text-xs text-gray-500">Researching</p>
        </div>
        <div class="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
          <p class="text-2xl font-bold text-blue-600">{{ statusCounts.contacted }}</p>
          <p class="text-xs text-blue-500">Contacted</p>
        </div>
        <div class="bg-amber-50 rounded-xl border border-amber-100 p-3 text-center">
          <p class="text-2xl font-bold text-amber-600">{{ statusCounts.quoted }}</p>
          <p class="text-xs text-amber-500">Quoted</p>
        </div>
        <div class="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p class="text-2xl font-bold text-green-600">{{ statusCounts.booked }}</p>
          <p class="text-xs text-green-500">Booked</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3 mb-4 flex-wrap">
        <div class="flex items-center gap-1">
          <button
            class="text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors"
            :class="!filterStatus ? 'bg-charcoal text-white border-charcoal' : 'text-warm-gray border-gray-200'"
            @click="filterStatus = ''"
          >
            All
          </button>
          <button
            class="text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors"
            :class="filterStatus === 'researching' ? 'bg-gray-600 text-white border-gray-600' : 'text-warm-gray border-gray-200'"
            @click="filterStatus = filterStatus === 'researching' ? '' : 'researching'"
          >
            Researching
          </button>
          <button
            class="text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors"
            :class="filterStatus === 'contacted' ? 'bg-blue-600 text-white border-blue-600' : 'text-warm-gray border-gray-200'"
            @click="filterStatus = filterStatus === 'contacted' ? '' : 'contacted'"
          >
            Contacted
          </button>
          <button
            class="text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors"
            :class="filterStatus === 'quoted' ? 'bg-amber-500 text-white border-amber-500' : 'text-warm-gray border-gray-200'"
            @click="filterStatus = filterStatus === 'quoted' ? '' : 'quoted'"
          >
            Quoted
          </button>
          <button
            class="text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors"
            :class="filterStatus === 'booked' ? 'bg-green-600 text-white border-green-600' : 'text-warm-gray border-gray-200'"
            @click="filterStatus = filterStatus === 'booked' ? '' : 'booked'"
          >
            Booked
          </button>
        </div>
      </div>

      <!-- Category filter -->
      <div class="mb-4 overflow-x-auto pb-1">
        <div class="flex items-center gap-1.5">
          <button
            class="text-xs px-2.5 py-1 rounded-full border font-medium transition-colors whitespace-nowrap"
            :class="!filterCategory ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-warm-gray border-gray-200'"
            @click="filterCategory = ''"
          >
            All Categories
          </button>
          <button
            v-for="cat in CATEGORIES"
            :key="cat.id"
            class="text-xs px-2.5 py-1 rounded-full border font-medium transition-colors whitespace-nowrap"
            :style="{
              backgroundColor: filterCategory === cat.id ? cat.color : cat.color + '12',
              color: filterCategory === cat.id ? 'white' : cat.color,
              borderColor: filterCategory === cat.id ? cat.color : cat.color + '40',
            }"
            @click="filterCategory = filterCategory === cat.id ? '' : cat.id"
          >
            {{ cat.icon }} {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Vendor grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <VendorCard
          v-for="vendor in filteredVendors"
          :key="vendor.id"
          :vendor="vendor"
          @edit="editVendor(vendor)"
          @delete="vendorStore.deleteVendor(vendor.id)"
          @set-status="(status) => vendorStore.setStatus(vendor.id, status)"
        />
      </div>

      <div
        v-if="filteredVendors.length === 0"
        class="text-center py-16 text-warm-gray"
      >
        <p class="text-4xl mb-4">🤝</p>
        <p class="text-sm">No vendors yet. Add your first vendor to start tracking!</p>
      </div>
    </main>

    <VendorAddModal
      v-if="showAddModal"
      :vendor="editingVendor"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>
