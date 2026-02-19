<script setup>
import { CATEGORIES } from '~/constants/board'

const model = defineModel({ type: String, default: '' })
</script>

<template>
  <div class="flex items-center gap-1.5 flex-wrap">
    <button
      class="text-xs px-2.5 py-1 rounded-full border font-medium transition-colors"
      :class="!model ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-warm-gray border-gray-200 hover:border-gray-300'"
      @click="model = ''"
    >
      All
    </button>
    <button
      v-for="cat in CATEGORIES"
      :key="cat.id"
      class="text-xs px-2.5 py-1 rounded-full border font-medium transition-colors"
      :class="model === cat.id ? 'text-white' : 'hover:opacity-80'"
      :style="{
        backgroundColor: model === cat.id ? cat.color : cat.color + '12',
        color: model === cat.id ? 'white' : cat.color,
        borderColor: model === cat.id ? cat.color : cat.color + '40',
      }"
      @click="model = model === cat.id ? '' : cat.id"
    >
      {{ cat.icon }} {{ cat.label }}
    </button>
  </div>
</template>
