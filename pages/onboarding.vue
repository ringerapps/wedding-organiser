<script setup>
import { useWeddingStore } from '~/stores/wedding'
import { useBudgetStore } from '~/stores/budget'
import { useTimelineStore } from '~/stores/timeline'
import { WEDDING_STYLES } from '~/constants/board'

definePageMeta({ layout: false })

const weddingStore = useWeddingStore()
const budgetStore = useBudgetStore()
const timelineStore = useTimelineStore()
const router = useRouter()

const step = ref(1)
const totalSteps = 4

const form = reactive({
  partner1: '',
  partner2: '',
  weddingDate: '',
  style: '',
  totalBudget: '',
})

const canNext = computed(() => {
  if (step.value === 1) return form.partner1.trim() && form.partner2.trim()
  if (step.value === 2) return form.weddingDate
  if (step.value === 3) return form.style
  return true
})

function next() {
  if (step.value < totalSteps) {
    step.value++
  } else {
    finish()
  }
}

function back() {
  if (step.value > 1) step.value--
}

function finish() {
  weddingStore.completeOnboarding({
    partner1: form.partner1.trim(),
    partner2: form.partner2.trim(),
    weddingDate: form.weddingDate,
    style: form.style,
    totalBudget: Number(form.totalBudget) || 0,
  })
  timelineStore.generateFromWeddingDate(form.weddingDate)
  router.push('/')
}

function selectStyle(id) {
  form.style = id
}
</script>

<template>
  <div class="min-h-screen bg-ivory flex flex-col">
    <!-- Decorative top bar -->
    <div class="h-1 bg-gradient-to-r from-rose via-gold to-sage" />

    <div class="flex-1 flex items-center justify-center p-4 sm:p-8">
      <div class="w-full max-w-lg">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="text-5xl mb-3">💍</div>
          <h1 class="font-serif text-3xl sm:text-4xl font-bold text-charcoal">Wedding Planner</h1>
          <p class="text-warm-gray mt-2">Let's set up your perfect day</p>
        </div>

        <!-- Progress dots -->
        <div class="flex items-center justify-center gap-2 mb-8">
          <div
            v-for="s in totalSteps"
            :key="s"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="s <= step ? 'bg-sage scale-110' : 'bg-blush-dark/30'"
          />
        </div>

        <!-- Step 1: Names -->
        <div v-if="step === 1" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 class="font-serif text-xl font-bold text-charcoal mb-1">Who's getting married?</h2>
          <p class="text-sm text-warm-gray mb-6">Enter the names of the happy couple</p>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-warm-gray mb-1.5">Partner 1</label>
              <input
                v-model="form.partner1"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
                placeholder="First name"
                @keydown.enter="canNext && next()"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-warm-gray mb-1.5">Partner 2</label>
              <input
                v-model="form.partner2"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
                placeholder="First name"
                @keydown.enter="canNext && next()"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Date -->
        <div v-if="step === 2" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 class="font-serif text-xl font-bold text-charcoal mb-1">When's the big day?</h2>
          <p class="text-sm text-warm-gray mb-6">Pick your wedding date (you can change it later)</p>

          <input
            v-model="form.weddingDate"
            type="date"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          />
        </div>

        <!-- Step 3: Style -->
        <div v-if="step === 3" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 class="font-serif text-xl font-bold text-charcoal mb-1">What's your vibe?</h2>
          <p class="text-sm text-warm-gray mb-6">Choose the style that speaks to you</p>

          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="s in WEDDING_STYLES"
              :key="s.id"
              class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
              :class="form.style === s.id
                ? 'border-sage bg-sage/5 shadow-sm'
                : 'border-gray-100 hover:border-sage/30 hover:bg-gray-50'"
              @click="selectStyle(s.id)"
            >
              <span class="text-2xl">{{ s.icon }}</span>
              <span class="text-sm font-medium text-charcoal">{{ s.label }}</span>
            </button>
          </div>
        </div>

        <!-- Step 4: Budget -->
        <div v-if="step === 4" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 class="font-serif text-xl font-bold text-charcoal mb-1">Set your budget</h2>
          <p class="text-sm text-warm-gray mb-6">Optional - you can set this later too</p>

          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray text-sm">$</span>
            <input
              v-model="form.totalBudget"
              type="number"
              min="0"
              step="100"
              class="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
              placeholder="e.g. 25000"
              @keydown.enter="finish"
            />
          </div>
          <p class="text-xs text-warm-gray mt-2">This helps track your spending across categories</p>
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between mt-6">
          <button
            v-if="step > 1"
            class="px-5 py-2.5 text-sm rounded-xl text-warm-gray hover:text-charcoal hover:bg-white transition-colors"
            @click="back"
          >
            Back
          </button>
          <div v-else />

          <button
            class="px-6 py-2.5 text-sm rounded-xl font-medium transition-all"
            :class="canNext
              ? 'bg-sage text-white hover:bg-sage-dark shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
            :disabled="!canNext"
            @click="next"
          >
            {{ step === totalSteps ? 'Get Started' : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
