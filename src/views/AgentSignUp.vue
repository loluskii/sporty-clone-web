<script setup>
import BaseLayout from '@/components/Shared/BaseLayout.vue'
import { onMounted, ref } from 'vue'



onMounted(async () => {

});
</script>

<template>
    <BaseLayout>
        <div class="container py-5">
            <h1 class="text-center mb-1 fw-bold">Become an Agent</h1>
            <p class="text-center mb-4">Sign Up to become an Agent with us at Streetbet</p>
            <form action="">
                <div style="max-width: 500px; margin: 0 auto;">
                    <div tabindex="8" class="x-input-wrapper">
                        <span class="x-input-com">
                            <input type="text" name="" placeholder="First Name" onpaste="return true"
                                class="x-input fs-exclude" /></span>
                    </div>
                    <div tabindex="8" class="x-input-wrapper">
                        <span class="x-input-com">
                            <input type="text" name="" placeholder="Last Name" onpaste="return true"
                                class="x-input fs-exclude" /></span>
                    </div>
                    <div tabindex="8" class="x-input-wrapper">
                        <span class="x-input-com">
                            <input type="text" name="" placeholder="Email" onpaste="return true"
                                class="x-input fs-exclude" /></span>
                    </div>
                    <div tabindex="8" class="x-input-wrapper">
                        <span class="x-input-com">
                            <input type="text" name="" placeholder="Address" onpaste="return true"
                                class="x-input fs-exclude" /></span>
                    </div>
                    <div tabindex="8" class="x-input-wrapper">
                        <span class="x-input-com">
                            <input type="text" name="" placeholder="City" onpaste="return true"
                                class="x-input fs-exclude" /></span>
                    </div>
                    <div tabindex="8" class="x-input-wrapper">
                        <span class="x-input-com">
                            <input type="text" name="" placeholder="State" onpaste="return true"
                                class="x-input fs-exclude" /></span>
                    </div>
                    <div tabindex="8" class="x-input-wrapper">
                        <span class="x-input-com">
                            <input type="text" name="" placeholder="Phone Number" onpaste="return true"
                                class="x-input fs-exclude" /></span>
                    </div>
                    <button class="af-button af-button--primary" :class="{
                        'is-disabled': ''
                    }">
                        <span><span data-cms-key="log_in">Sign Up</span></span>
                    </button>
                </div>
            </form>
        </div>
    </BaseLayout>
</template>

<style scoped>
@import url('@/assets/css/casino/bootstrap.css');

.x-main-mid {
    width: 100%;
    /* Ensure it takes full width within its flex container */
    min-width: auto;
    /* Remove fixed min-width */
    max-width: 1100px;
    /* Limit max width */
    margin: 0 auto;
    /* Center the content */
}

.container {
    padding: 0 15px;
    /* Add some padding on small screens */
}

.x-input-wrapper .x-input {
    height: 54px;
    margin-bottom: 7px;
}
</style>
