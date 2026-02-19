<script setup>
import { useWeddingStore } from '~/stores/wedding'
import { useBoardStore } from '~/stores/board'
import { useBudgetStore } from '~/stores/budget'
import { useGuestStore } from '~/stores/guests'
import { useTimelineStore } from '~/stores/timeline'
import { useVendorStore } from '~/stores/vendors'

const weddingStore = useWeddingStore()
const boardStore = useBoardStore()
const budgetStore = useBudgetStore()
const guestStore = useGuestStore()
const timelineStore = useTimelineStore()
const vendorStore = useVendorStore()

onMounted(() => {
  boardStore.init()
})

const progress = computed(() => boardStore.progress)

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <!-- Welcome section -->
      <div class="mb-8">
        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
          {{ weddingStore.coupleNames ? `${weddingStore.coupleNames}'s Wedding` : 'Wedding Dashboard' }}
        </h2>
        <p v-if="weddingStore.weddingDateFormatted" class="text-sm text-warm-gray mt-1">
          {{ weddingStore.weddingDateFormatted }}
        </p>
      </div>

      <!-- Countdown -->
      <CountdownDisplay class="mb-8" />

      <!-- Quick stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <DashboardStatCard
          title="Tasks Done"
          :value="`${progress.done} / ${progress.total}`"
          :subtitle="`${progress.percent}% complete`"
          icon="📋"
          to="/board"
        />
        <DashboardStatCard
          title="Budget Spent"
          :value="formatCurrency(budgetStore.totalActual)"
          :subtitle="weddingStore.totalBudget ? `of ${formatCurrency(weddingStore.totalBudget)}` : 'No budget set'"
          icon="💰"
          to="/budget"
        />
        <DashboardStatCard
          title="Guests Accepted"
          :value="`${guestStore.accepted.length} / ${guestStore.totalGuests}`"
          :subtitle="`${guestStore.pending.length} pending`"
          icon="💌"
          to="/guests"
        />
        <DashboardStatCard
          title="Vendors Booked"
          :value="`${vendorStore.booked.length} / ${vendorStore.vendors.length}`"
          :subtitle="vendorStore.vendors.length ? `${vendorStore.vendors.length} total` : 'None added'"
          icon="🤝"
          to="/vendors"
        />
      </div>

      <!-- Overall progress bar -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-charcoal">Overall Progress</span>
          <span class="text-sm font-bold text-sage-dark">{{ progress.percent }}%</span>
        </div>
        <div class="w-full h-3 bg-blush rounded-full overflow-hidden">
          <div
            class="h-full bg-sage rounded-full transition-all duration-700"
            :style="{ width: progress.percent + '%' }"
          />
        </div>
        <div class="flex justify-between mt-2 text-xs text-warm-gray">
          <span>{{ progress.done }} done</span>
          <span>{{ progress.total - progress.done }} remaining</span>
        </div>
      </div>

      <!-- Two column layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Upcoming tasks / deadlines -->
        <div>
          <h3 class="font-serif text-lg font-bold text-charcoal mb-3">Tasks & Deadlines</h3>
          <DashboardUpcoming />
        </div>

        <!-- Upcoming milestones -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-serif text-lg font-bold text-charcoal">Upcoming Milestones</h3>
            <NuxtLink to="/timeline" class="text-xs text-sage-dark hover:text-sage font-medium">
              View all →
            </NuxtLink>
          </div>
          <div v-if="timelineStore.upcoming.length > 0" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="divide-y divide-gray-50">
              <div v-for="m in timelineStore.upcoming.slice(0, 5)" :key="m.id" class="flex items-center gap-3 px-4 py-3">
                <span class="text-lg">{{ m.icon }}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-charcoal truncate">{{ m.title }}</p>
                  <p class="text-xs text-warm-gray">
                    {{ new Date(m.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-warm-gray text-sm">
            <p>No upcoming milestones</p>
            <NuxtLink to="/timeline" class="text-sage-dark hover:text-sage text-xs mt-1 inline-block">
              Set up your timeline →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Quick links -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <NuxtLink
          to="/board"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:shadow-md hover:border-sage/30 transition-all"
        >
          <span class="text-2xl block mb-1">📋</span>
          <span class="text-xs font-medium text-charcoal">Board</span>
        </NuxtLink>
        <NuxtLink
          to="/budget"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:shadow-md hover:border-sage/30 transition-all"
        >
          <span class="text-2xl block mb-1">💰</span>
          <span class="text-xs font-medium text-charcoal">Budget</span>
        </NuxtLink>
        <NuxtLink
          to="/guests"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:shadow-md hover:border-sage/30 transition-all"
        >
          <span class="text-2xl block mb-1">💌</span>
          <span class="text-xs font-medium text-charcoal">Guests</span>
        </NuxtLink>
        <NuxtLink
          to="/timeline"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:shadow-md hover:border-sage/30 transition-all"
        >
          <span class="text-2xl block mb-1">📅</span>
          <span class="text-xs font-medium text-charcoal">Timeline</span>
        </NuxtLink>
        <NuxtLink
          to="/vendors"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:shadow-md hover:border-sage/30 transition-all"
        >
          <span class="text-2xl block mb-1">🤝</span>
          <span class="text-xs font-medium text-charcoal">Vendors</span>
        </NuxtLink>
        <NuxtLink
          to="/onboarding"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:shadow-md hover:border-sage/30 transition-all"
        >
          <span class="text-2xl block mb-1">⚙️</span>
          <span class="text-xs font-medium text-charcoal">Settings</span>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>
