<template lang="">
  <div class="m-outcome m-event-outcome-default" :class="[selectionClass, oddsChangeClass]">
    <span data-op="label-odds-amount" class="m-outcome-odds">{{ odds.odds.toFixed(2) }}</span>
  </div>
</template>
<script setup>
import { defineComponent, ref, watch } from 'vue'

const props = defineProps({
  odds: Object,
  selectionClass: String
})

defineComponent({
  name: 'prematch-odds'
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
      oddsChangeClass.value = 'm-outcome--up'
    } else if (newOdds < oldOdds) {
      oddsChangeClass.value = 'm-outcome--down'
    }

    // Clear the class after animation
    setTimeout(() => {
      oddsChangeClass.value = ''
    }, 2000)

    previousOdds.value = newOdds
  }
)
</script>
<style lang=""></style>
