<script setup>
import BaseLayout from '@/components/Shared/BaseLayout.vue'
import TopView from '@/components/Home/TopView.vue'
import HighlightsContainer from '@/components/Home/HighlightsContainer.vue'
import LiveContainer from '@/components/Home/LiveContainer.vue'
import BetContainer from '@/components/Shared/BetContainer.vue'
</script>

<template>
  <BaseLayout>
    <template v-slot:top>
      <TopView></TopView>
    </template>
    <!-- Main Content -->
    <div class="x-table-row">
      <div class="x-table-cell x-main-mid" style="width: 765px; min-width: 765px">
        <div>
          <HighlightsContainer></HighlightsContainer>
          <LiveContainer></LiveContainer>
        </div>
      </div>
      <div class="x-table-cell x-main-right" style="width: 235px; min-width: 235px">
        <div>
          <aside class="c-right">
            <BetContainer></BetContainer>
          </aside>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>
