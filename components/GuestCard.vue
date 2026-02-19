<script setup>
defineProps({
  guest: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete', 'set-rsvp'])
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 group hover:shadow-md transition-all">
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-semibold text-charcoal truncate">{{ guest.name }}</h3>
        <p v-if="guest.email" class="text-xs text-warm-gray truncate">{{ guest.email }}</p>
        <p v-if="guest.group" class="text-xs text-warm-gray">{{ guest.group }}</p>
      </div>
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button class="text-warm-gray hover:text-sage-dark p-1 text-xs" @click="emit('edit')">&#9998;</button>
        <button class="text-warm-gray hover:text-rose p-1 text-xs" @click="emit('delete')">&times;</button>
      </div>
    </div>

    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <RsvpBadge :status="guest.rsvp" />
      <span v-if="guest.meal && guest.rsvp === 'accepted'" class="text-xs text-warm-gray">
        🍽️ {{ guest.meal }}
      </span>
      <span v-if="guest.plusOne" class="text-xs text-warm-gray">
        +1{{ guest.plusOneName ? `: ${guest.plusOneName}` : '' }}
      </span>
      <span v-if="guest.table" class="text-xs text-warm-gray">
        🪑 {{ guest.table }}
      </span>
    </div>

    <!-- Quick RSVP buttons -->
    <div class="flex items-center gap-1 mt-3 pt-3 border-t border-gray-50">
      <button
        class="text-xs px-2 py-1 rounded transition-colors"
        :class="guest.rsvp === 'accepted' ? 'bg-green-100 text-green-700' : 'text-warm-gray hover:bg-green-50'"
        @click="emit('set-rsvp', 'accepted')"
      >
        Accept
      </button>
      <button
        class="text-xs px-2 py-1 rounded transition-colors"
        :class="guest.rsvp === 'pending' ? 'bg-amber-100 text-amber-700' : 'text-warm-gray hover:bg-amber-50'"
        @click="emit('set-rsvp', 'pending')"
      >
        Pending
      </button>
      <button
        class="text-xs px-2 py-1 rounded transition-colors"
        :class="guest.rsvp === 'declined' ? 'bg-red-100 text-red-700' : 'text-warm-gray hover:bg-red-50'"
        @click="emit('set-rsvp', 'declined')"
      >
        Decline
      </button>
    </div>
  </div>
</template>
