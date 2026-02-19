<script setup>
import { CATEGORIES } from '~/constants/board'

const props = defineProps({
  categoryId: { type: String, required: true },
  size: { type: String, default: 'sm' },
})

const category = computed(() => CATEGORIES.find((c) => c.id === props.categoryId))
</script>

<template>
  <span
    v-if="category"
    class="inline-flex items-center gap-1 rounded-full border font-medium"
    :class="size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'"
    :style="{
      backgroundColor: category.color + '18',
      color: category.color,
      borderColor: category.color + '40',
    }"
  >
    <span v-if="size !== 'sm'">{{ category.icon }}</span>
    {{ category.label }}
  </span>
</template>
