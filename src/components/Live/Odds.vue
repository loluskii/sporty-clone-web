<template>
  <div
    class="x-outcome"
    :class="
      odds.odds <= 1
        ? 'x-outcome--disabled'
        : isSelected(
              createID(match.gameID, match.matchID, odds.outcomeName, odds.oddID, match.name),
              couponStore.coupon
            )
          ? 'x-outcome--checked'
          : ''
    "
  >
    <span class="x-outcome-odds" :class="odds.odds <= 1 ? 'x-icon-lock' : ''">{{
      odds.odds <= 1 ? '' : odds.odds.toFixed(2)
    }}</span>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue'
import { createID, isSelected } from '@/helpers'
import { useCouponStore } from '@/stores'

const couponStore = useCouponStore()
defineComponent({
  name: 'live-fixture-odd'
})
defineProps({
  odds: Object,
  match: Object
})
</script>
