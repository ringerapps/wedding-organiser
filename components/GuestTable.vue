<script setup>
defineProps({
  guests: { type: Array, required: true },
})

const emit = defineEmits(['edit', 'delete', 'set-rsvp'])
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/50">
            <th class="text-left px-4 py-3 text-xs font-medium text-warm-gray">Name</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-warm-gray">RSVP</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-warm-gray hidden sm:table-cell">Meal</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-warm-gray hidden md:table-cell">Table</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-warm-gray hidden md:table-cell">+1</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-warm-gray">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="guest in guests" :key="guest.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-4 py-3">
              <div>
                <p class="font-medium text-charcoal">{{ guest.name }}</p>
                <p v-if="guest.email" class="text-xs text-warm-gray">{{ guest.email }}</p>
              </div>
            </td>
            <td class="px-4 py-3">
              <select
                :value="guest.rsvp"
                class="text-xs px-2 py-1 rounded border border-gray-200 focus:outline-none"
                @change="emit('set-rsvp', guest.id, ($event.target).value)"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell text-warm-gray">{{ guest.meal || '-' }}</td>
            <td class="px-4 py-3 hidden md:table-cell text-warm-gray">{{ guest.table || '-' }}</td>
            <td class="px-4 py-3 hidden md:table-cell text-warm-gray">
              {{ guest.plusOne ? (guest.plusOneName || 'Yes') : '-' }}
            </td>
            <td class="px-4 py-3 text-right">
              <button class="text-warm-gray hover:text-sage-dark p-1 text-xs" @click="emit('edit', guest)">&#9998;</button>
              <button class="text-warm-gray hover:text-rose p-1 text-xs" @click="emit('delete', guest.id)">&times;</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
