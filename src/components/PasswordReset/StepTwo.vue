<template>
  <div class="x-page--psd">
    <p class="x-text-tips">
      Your password must be at least 8 characters long and must contain at least one upper case
      letter, one lower case letter and one number.
    </p>
    <div class="x-page-opt">
      <span class="x-label" data-cms-key="new_password" data-cms-page="page_login"
        >New Password</span
      >
      <div class="x-opt-wrapper">
        <div tabindex="8" class="x-input-wrapper">
          <span class="x-input-com">
            <input
              type="password"
              name=""
              placeholder="Enter New Password"
              onpaste="return true"
              data-op=""
              class="x-input fs-exclude"
          /></span>
        </div>

        <button
          :disabled="s"
          class="af-button af-button--primary"
          :class="{ 'is-disabled': isLoading || !password }"
          type="primary"
          @click.prevent="savePassword"
        >
          <span><span data-cms-key="confirm" data-cms-page="common_functions">Confirm</span></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CLIENT_ID, resetPassword } from '@/helpers'

const password = ref('')
const emit = defineEmits(['next-step'])

const props = defineProps({
  phoneNumber: String
})
const isLoading = ref(false)

const savePassword = async () => {
  isLoading.value = true
  let payload = {
    username: props.phoneNumber.replace(/^0/, ''),
    password: password.value,
    clientId: CLIENT_ID
  }

  const res = await resetPassword(payload)
  if (res.success) {
    emit('next-step')
  }
}
</script>

<style>
.x-text-second {
  font-size: 13px;
  line-height: 1;
}
.x-page .btn-wrapper,
.x-page .af-button {
  width: 100%;
  height: 38px;
}
.x-page .af-button {
  padding-left: 0;
  padding-right: 0;
  text-align: center;
  border: none !important;
  font-size: 16px;
  border-radius: 2px;
}
.x-page .af-button--primary {
  background: #0d9737 !important;
  color: #fff !important;
}

.x-page .x-input-wrapper,
.x-pop-wrapper .x-page .x-input-wrapper {
  width: 100%;
}
.x-page .x-input-wrapper .x-input-text--icon,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-text--icon {
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  text-align: left;
  text-indent: 4px;
  width: 32px;
}
.x-page .x-input-wrapper .x-input-text--icon + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-text--icon + .x-input {
  padding-right: 55px;
}
.x-page .x-input-wrapper .x-input-icon,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon {
  text-align: left;
  text-indent: 2px;
}
.x-page .x-input-wrapper .x-input-icon + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon + .x-input {
  padding-right: 40px;
}
.x-page .x-input-wrapper .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  font-size: 14px;
  height: 100%;
  padding-left: 18px;
}
.x-page .x-input-wrapper .x-input-icon:before,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon:before {
  line-height: 16px;
}

.x-page .x-input-wrapper.x-input-wrapper--active .x-input-icon--clickable:hover + .x-input,
.x-pop-wrapper
  .x-page
  .x-input-wrapper.x-input-wrapper--active
  .x-input-icon--clickable:hover
  + .x-input {
  border-color: #0d9737 !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--error .x-input {
  border-color: #e41827 !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input-prepend,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--error .x-input-prepend {
  border-color: #e41827 !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover {
  color: #e41827 !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover + .x-input,
.x-pop-wrapper
  .x-page
  .x-input-wrapper.x-input-wrapper--error
  .x-input-icon--clickable:hover
  + .x-input {
  border-color: #e41827 !important;
}
.x-page .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input,
.x-pop-wrapper .x-page .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input {
  border-color: #0d9737;
}
.x-page .x-input-wrapper .x-input-icon--clickable:hover,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon--clickable:hover {
  color: #9ca0ab !important;
}
.x-page .x-input-wrapper .x-input-icon--clickable:hover + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon--clickable:hover + .x-input {
  border-color: #b4b4b4 !important;
}
.x-page .x-input-group--prepend.x-input-wrapper--error .x-input,
.x-pop-wrapper .x-page .x-input-group--prepend.x-input-wrapper--error .x-input {
  border-left: none !important;
}
.x-page .x-input-group--prepend .x-input-prepend,
.x-pop-wrapper .x-page .x-input-group--prepend .x-input-prepend {
  border-color: #b4b4b4;
  border-radius: 2px 0 0 2px;
  padding-left: 18px;
}
.x-page .x-input-group--prepend .x-input,
.x-pop-wrapper .x-page .x-input-group--prepend .x-input {
  border-left: none !important;
  border-radius: 0 2px 2px 0;
  padding-left: 0;
}
.x-page .x-input-group--prepend.x-input-wrapper--active .x-input-prepend,
.x-pop-wrapper .x-page .x-input-group--prepend.x-input-wrapper--active .x-input-prepend {
  border-color: #0d9737;
}
.x-opt-wrapper,
.x-page-opt {
  position: relative;
}
.x-opt-wrapper .x-error-tips,
.x-page-opt .x-error-tips {
  position: absolute;
  top: 47px;
  font-size: 12px;
  line-height: 14px;
  color: #e41827;
}
.x-page--psd {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 35px 0 44px;
  width: 702px;
}
.x-page--psd .x-text-tips {
  color: #353a45;
  font-size: 20px;
  line-height: 27px;
}
.x-page--psd .x-page-opt {
  margin-top: 10px;
  text-align: left;
  width: 100%;
}
.x-page--psd .x-page-opt .x-label,
.x-page--psd .x-page-opt .x-opt-wrapper {
  display: inline-block;
  vertical-align: top;
}
.x-page--psd .x-page-opt .x-label {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  margin-right: 15px;
}
.x-page--psd .x-page-opt .x-input-wrapper {
  display: block;
  height: 40px;
  width: 300px;
}
.x-page--psd .x-page-opt .x-input-wrapper .x-input {
  height: 40px;
}
.x-page--psd .x-page-opt .af-button {
  margin-top: 40px;
  width: 300px;
}
</style>
