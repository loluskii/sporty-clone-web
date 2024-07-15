<template lang="">
  <div class="x-nav-bar">
    <div class="x-nav">
      <div class="x-header-item">
        <nav id="header" class="x-flex" style="flex-shrink: 0">
          <a
            href="/Sport/LiveList"
            class="x-flex-item"
            :class="route.name === 'live-view' ? ' x-flex-item--active' : ''"
          >
            <span>Multi View</span></a
          ><a
            href="/Sport/Live"
            :class="
              route.name === 'live-fixtures-specific-detail' ||
              route.name === 'live-fixtures-one-detail'
                ? ' x-flex-item--active'
                : ''
            "
            class="x-flex-item"
            ><span>Single View</span></a
          >
          <!-- <a
            href="/ng/sport/football/live_schedule/"
            :class="route.name === 'live-list' ? ' x-flex-item--active' : ''"
            class="x-flex-item"
            >Schedule</a
          > -->
        </nav>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<style></style>
