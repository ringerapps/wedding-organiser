<script setup>
import { useWeddingStore } from '~/stores/wedding'

const weddingStore = useWeddingStore()

const countdown = computed(() => {
  if (!weddingStore.weddingDate) return null
  const wedding = new Date(weddingStore.weddingDate)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  wedding.setHours(0, 0, 0, 0)

  const diff = wedding - now
  if (diff <= 0) return { days: 0, months: 0, weeks: 0, isPast: true }

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)
  const weeks = Math.floor((days % 30) / 7)
  const remainingDays = days % 7

  return { days: remainingDays, months, weeks, totalDays: days, isPast: false }
})
</script>

<template>
  <div v-if="countdown" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
    <p class="text-sm text-warm-gray mb-3">
      {{ countdown.isPast ? 'Congratulations!' : 'Counting down to your big day' }}
    </p>

    <div v-if="!countdown.isPast" class="flex items-center justify-center gap-4 sm:gap-6">
      <div v-if="countdown.months > 0">
        <p class="text-3xl sm:text-4xl font-bold text-rose font-serif">{{ countdown.months }}</p>
        <p class="text-xs text-warm-gray mt-1">{{ countdown.months === 1 ? 'month' : 'months' }}</p>
      </div>
      <div v-if="countdown.weeks > 0 || countdown.months > 0">
        <p class="text-3xl sm:text-4xl font-bold text-gold font-serif">{{ countdown.weeks }}</p>
        <p class="text-xs text-warm-gray mt-1">{{ countdown.weeks === 1 ? 'week' : 'weeks' }}</p>
      </div>
      <div>
        <p class="text-3xl sm:text-4xl font-bold text-sage font-serif">{{ countdown.days }}</p>
        <p class="text-xs text-warm-gray mt-1">{{ countdown.days === 1 ? 'day' : 'days' }}</p>
      </div>
    </div>

    <div v-if="!countdown.isPast" class="mt-3">
      <p class="text-xs text-warm-gray">{{ countdown.totalDays }} days total</p>
    </div>

    <p v-if="countdown.isPast" class="text-3xl font-serif font-bold text-sage mt-2">
      You're married! 💍
    </p>

    <p v-if="weddingStore.weddingDateFormatted" class="text-sm text-warm-gray mt-3">
      {{ weddingStore.weddingDateFormatted }}
    </p>
  </div>
</template>
