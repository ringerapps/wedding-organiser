<script setup>
import { useGuestStore } from '~/stores/guests'

const guestStore = useGuestStore()

const showAddModal = ref(false)
const editingGuest = ref(null)
const viewMode = ref('cards')
const filterRsvp = ref('')
const searchQuery = ref('')

const filteredGuests = computed(() => {
  let list = guestStore.guests
  if (filterRsvp.value) {
    list = list.filter((g) => g.rsvp === filterRsvp.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((g) =>
      g.name.toLowerCase().includes(q) ||
      (g.email && g.email.toLowerCase().includes(q)) ||
      (g.group && g.group.toLowerCase().includes(q))
    )
  }
  return list
})

const stats = computed(() => guestStore.rsvpStats)

function handleSave(data) {
  if (editingGuest.value) {
    guestStore.updateGuest(editingGuest.value.id, data)
  } else {
    guestStore.addGuest(data)
  }
  showAddModal.value = false
  editingGuest.value = null
}

function editGuest(guest) {
  editingGuest.value = guest
  showAddModal.value = true
}

function closeModal() {
  showAddModal.value = false
  editingGuest.value = null
}

function handleTableSetRsvp(guestId, status) {
  guestStore.setRsvp(guestId, status)
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 class="font-serif text-2xl font-bold text-charcoal">Guest List</h2>
          <p class="text-sm text-warm-gray">{{ guestStore.totalWithPlusOnes }} total (incl. +1s)</p>
        </div>
        <button
          class="px-4 py-2 text-sm rounded-lg bg-sage text-white hover:bg-sage-dark transition-colors font-medium shadow-sm"
          @click="showAddModal = true"
        >
          + Add Guest
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
          <p class="text-2xl font-bold text-charcoal">{{ stats.total }}</p>
          <p class="text-xs text-warm-gray">Total Guests</p>
        </div>
        <div class="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p class="text-2xl font-bold text-green-700">{{ stats.accepted }}</p>
          <p class="text-xs text-green-600">Accepted</p>
        </div>
        <div class="bg-amber-50 rounded-xl border border-amber-100 p-3 text-center">
          <p class="text-2xl font-bold text-amber-700">{{ stats.pending }}</p>
          <p class="text-xs text-amber-600">Pending</p>
        </div>
        <div class="bg-red-50 rounded-xl border border-red-100 p-3 text-center">
          <p class="text-2xl font-bold text-red-700">{{ stats.declined }}</p>
          <p class="text-xs text-red-600">Declined</p>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center gap-3 mb-4 flex-wrap">
        <input
          v-model="searchQuery"
          class="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          placeholder="Search guests..."
        />
        <div class="flex items-center gap-1">
          <button
            class="text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors"
            :class="!filterRsvp ? 'bg-charcoal text-white border-charcoal' : 'text-warm-gray border-gray-200 hover:border-gray-300'"
            @click="filterRsvp = ''"
          >
            All
          </button>
          <button
            class="text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors"
            :class="filterRsvp === 'accepted' ? 'bg-green-600 text-white border-green-600' : 'text-warm-gray border-gray-200'"
            @click="filterRsvp = filterRsvp === 'accepted' ? '' : 'accepted'"
          >
            Accepted
          </button>
          <button
            class="text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors"
            :class="filterRsvp === 'pending' ? 'bg-amber-500 text-white border-amber-500' : 'text-warm-gray border-gray-200'"
            @click="filterRsvp = filterRsvp === 'pending' ? '' : 'pending'"
          >
            Pending
          </button>
          <button
            class="text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors"
            :class="filterRsvp === 'declined' ? 'bg-red-500 text-white border-red-500' : 'text-warm-gray border-gray-200'"
            @click="filterRsvp = filterRsvp === 'declined' ? '' : 'declined'"
          >
            Declined
          </button>
        </div>
        <div class="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
          <button
            class="px-2 py-1 rounded text-xs transition-colors"
            :class="viewMode === 'cards' ? 'bg-sage text-white' : 'text-warm-gray hover:bg-gray-50'"
            @click="viewMode = 'cards'"
          >
            Cards
          </button>
          <button
            class="px-2 py-1 rounded text-xs transition-colors"
            :class="viewMode === 'table' ? 'bg-sage text-white' : 'text-warm-gray hover:bg-gray-50'"
            @click="viewMode = 'table'"
          >
            Table
          </button>
        </div>
      </div>

      <!-- Guest Cards view -->
      <div v-if="viewMode === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <GuestCard
          v-for="guest in filteredGuests"
          :key="guest.id"
          :guest="guest"
          @edit="editGuest(guest)"
          @delete="guestStore.deleteGuest(guest.id)"
          @set-rsvp="(status) => guestStore.setRsvp(guest.id, status)"
        />
        <div
          v-if="filteredGuests.length === 0"
          class="col-span-full text-center py-12 text-warm-gray text-sm"
        >
          {{ searchQuery || filterRsvp ? 'No guests match your filters.' : 'No guests yet. Add your first guest!' }}
        </div>
      </div>

      <!-- Guest Table view -->
      <GuestTable
        v-else
        :guests="filteredGuests"
        @edit="editGuest"
        @delete="guestStore.deleteGuest"
        @set-rsvp="handleTableSetRsvp"
      />
    </main>

    <GuestAddModal
      v-if="showAddModal"
      :guest="editingGuest"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>
