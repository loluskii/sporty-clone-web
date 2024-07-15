<template lang="">
  <div class="m-outcome m-event-outcome-default" :class="selectionClass">
    <span data-op="label-odds-amount" class="m-outcome-odds">{{ odds.odds.toFixed(2) }}</span>
  </div>
</template>
<script setup>
import { formatOdd } from '../../helpers';
import { defineComponent } from 'vue'
defineProps({
  odds: Object,
  selectionClass: String
})
defineComponent({
  name: 'prematch-odds'
})
</script>
<style lang=""></style>
