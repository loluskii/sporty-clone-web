<template>
  <div
    class="x-outcome"
    :class="[
      odds.odds <= 1 ? 'x-outcome--disabled' : '',
      isSelected(
        createID(match.gameID, match.matchID, odds.outcomeName, odds.oddID, match.name),
        couponStore.coupon
      )
        ? 'x-outcome--checked'
        : '',
      oddsChangeClass
    ]"
  >
    <span class="x-outcome-odds" :class="odds.odds <= 1 ? 'x-icon-lock' : ''">{{
      odds.odds <= 1 ? '' : odds.odds.toFixed(2)
    }}</span>
  </div>
</template>

<script setup>
import { defineComponent, ref, watch } from 'vue'
import { createID, isSelected } from '@/helpers'
import { useCouponStore } from '@/stores'

const couponStore = useCouponStore()
defineComponent({
  name: 'live-fixture-odd'
})

const props = defineProps({
  odds: Object,
  match: Object
})

// Track previous odds value
const previousOdds = ref(props.odds.odds)
const oddsChangeClass = ref('')

// Watch for odds changes
watch(
  () => props.odds.odds,
  (newOdds, oldOdds) => {
    if (newOdds <= 1 || oldOdds <= 1) {
      oddsChangeClass.value = ''
      return
    }

    if (newOdds > oldOdds) {
      oddsChangeClass.value = 'x-outcome--up'
    } else if (newOdds < oldOdds) {
      oddsChangeClass.value = 'x-outcome--down'
    }

    // Clear the class after animation
    setTimeout(() => {
      oddsChangeClass.value = ''
    }, 2000)

    previousOdds.value = newOdds
  }
)
</script>

<!-- <style scoped>
.x-outcome--up {
  animation: oddsUp 2s ease-out;
}

.x-outcome--down {
  animation: oddsDown 2s ease-out;
}

@keyframes oddsUp {
  0% { background-color: rgba(0, 255, 0, 0.2); }
  100% { background-color: transparent; }
}

@keyframes oddsDown {
  0% { background-color: rgba(255, 0, 0, 0.2); }
  100% { background-color: transparent; }
}
</style> -->
