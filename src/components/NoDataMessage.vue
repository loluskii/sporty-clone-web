<template>
  <div class="no-data">
    <div class="no-data__icon">
      <slot name="icon">
        <i class="icon-no-data"></i>
      </slot>
    </div>
    <div class="no-data__message">
      <slot>
        Sorry, there are no games currently<br />
        available in this category. Please try<br />
        later.<br />
        Thank you.
      </slot>
    </div>
  </div>
</template>

<script setup>
// No props or logic needed for this simple component
</script>

<style scoped>
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  padding: 2rem;
  text-align: center;
  background-color: white;
}

.no-data__icon {
  margin-bottom: 1rem;
  color: var(--text-color, #353a45);
  opacity: 0.5;
}

.no-data__message {
  color: var(--text-color, #353a45);
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
}

.icon-no-data {
  font-family: 'iconfont';
  font-size: 48px;
}
</style>
