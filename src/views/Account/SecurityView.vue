<template>
  <AccountLayout>
    <div id="safety-and-security-container">
      <div class="pc-navbar-container">
        <ul class="pc-navbar">
          <li class="pc-navbar-item pc-navbar-item--active">Change Password</li>
        </ul>
      </div>
      <form class="x-fm-wrap x-fm-wrap-psw">
        <div class="x-fm-row">
          <div class="x-fm-left" data-cms-key="old_password" data-cms-page="my_account">
            Old Password
          </div>
          <div class="x-fm-right">
            <div tabindex="8" class="x-input-wrapper" showtexticon="Show" hidetexticon="Hide">
              <span class="x-input-com">
                <input
                  type="password"
                  name=""
                  placeholder=""
                  maxlength="64"
                  min="6"
                  v-model="oldPassword"
                  onpaste="return true"
                  data-op=""
                  class="x-input fs-exclude"
              /></span>
            </div>
            <div class="x-error-infos"></div>
          </div>
        </div>
        <div class="x-fm-row">
          <div class="x-fm-left" data-cms-key="new_password" data-cms-page="my_account">
            New Password
          </div>
          <div class="x-fm-right">
            <div tabindex="8" class="x-input-wrapper" showtexticon="Show" hidetexticon="Hide">
              <span class="x-input-com">
                <input
                  type="password"
                  name=""
                  placeholder=""
                  v-model="newPassword"
                  maxlength="64"
                  min="8"
                  onpaste="return true"
                  data-op=""
                  class="x-input fs-exclude"
              /></span>
            </div>
            <div class="x-error-infos"></div>
          </div>
        </div>
        <div class="x-fm-row">
          <div class="x-fm-left">&nbsp;</div>
          <div class="x-fm-right">
            <button
              class="af-button af-button--success"
              :class="{ 'is-disabled': isSaving }"
              :disabled="isSaving"
              style="padding: 10px"
              @click.prevent="saveUpdate"
            >
              <span
                ><span data-cms-key="confirm" data-cms-page="common_functions">Confirm</span></span
              >
            </button>
          </div>
        </div>
      </form>
    </div>
  </AccountLayout>
</template>

<script setup>
import AccountLayout from '@/components/Shared/AccountLayout.vue'
import { ref } from 'vue'
import { updatePassword } from '@/helpers'
import { useUsersStore } from '@/stores'

const oldPassword = ref('')
const newPassword = ref('')
const isSaving = ref(false)
const usersStore = useUsersStore()

async function saveUpdate() {
  isSaving.value = true
  if (oldPassword.value === '' || newPassword.value === '') return
  if (oldPassword.value === newPassword.value) {
    alert('Your old password and new password cannot be the same!')
    return
  }
  let payload = {
    oldPassword: oldPassword.value,
    password: newPassword.value,
    clientId: import.meta.env.VITE_CLIENT_ID
  }
  const res = await updatePassword(payload)
  isSaving.value = true
  if (res.success) {
    await usersStore.loadCurrentUser()
    alert('Update Successful!')
    oldPassword.value = ''
    newPassword.value = ''
  } else {
    alert(`Error: ${res.message}`)
  }
}
</script>

<style scoped>
.x-text-second {
  font-size: 13px;
  line-height: 1;
}

.x-main-mid .x-input-wrapper {
  width: 100%;
}

.x-main-mid .x-input-wrapper .x-input {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  font-size: 14px;
  height: 40px;
  line-height: 38px;
  padding-left: 18px;
}

.x-main-mid .x-input-wrapper .x-input-com {
  display: block;
}

.x-main-mid .x-input-wrapper .x-input-icon:before {
  position: absolute;
  top: 50%;
  -webkit-transform: translate(-9px, -50%);
  -ms-transform: translate(-9px, -50%);
  transform: translate(-9px, -50%);
  line-height: 16px;
  height: 16px;
}

.x-main-mid .x-input-wrapper .x-input-icon.x-input-icon--clickable:hover {
  color: #0d9737;
}

.x-main-mid .x-input-wrapper .x-input-icon.x-input-icon--clickable:hover + .x-input {
  border-color: #0d9737;
}

.x-main-mid .x-input-wrapper.x-input-wrapper--error .x-input {
  border-color: #e41827 !important;
}

.x-main-mid .x-input-wrapper.x-input-wrapper--error .x-input-prepend {
  border-color: #e41827 !important;
}

.x-main-mid .x-input-wrapper.x-input-wrapper--active .x-input {
  border-color: #0d9737;
}

.x-main-mid .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input {
  border-color: #0d9737;
}

.x-main-mid .x-input-group--prepend.x-input-wrapper--error .x-input {
  border-left: none !important;
}

.x-main-mid .x-input-group--prepend .x-input-prepend {
  border-color: #b4b4b4;
  border-radius: 2px 0 0 2px;
  padding-left: 18px;
}

.x-main-mid .x-input-group--prepend .x-input {
  border-left: none !important;
  border-radius: 0 2px 2px 0;
  padding-left: 0;
}

.x-main-mid .x-input-group--prepend.x-input-wrapper--active .x-input-prepend {
  border-color: #0d9737;
}

#safety-and-security-container {
  color: #353a45;
  padding: 10px 20px;
  min-height: 400px;
  margin-left: 19px;
  background-color: #fff;
}

#safety-and-security-container * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

#safety-and-security-container .x-nav-item {
  padding: 10px 45px;
  margin-right: 0;
}

#safety-and-security-container .x-fm-wrap {
  padding: 10px 0 55px 60px;
}

#safety-and-security-container .x-fm-row {
  font-size: 16px;
  line-height: 40px;
  padding: 15px 0;
}

#safety-and-security-container .x-fm-row:after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}

#safety-and-security-container .x-fm-left {
  float: left;
  line-height: 40px;
  width: 135px;
}

#safety-and-security-container .x-fm-right {
  float: left;
}

#safety-and-security-container .x-fm-input-wrap {
  border: 1px solid #b4b4b4;
}

#safety-and-security-container .x-input-wrapper {
  width: 300px;
}

#safety-and-security-container .x-btn-wrapper {
  width: 204px;
  height: 38px;
}

#safety-and-security-container .af-select {
  display: inline-block;
  vertical-align: top;
  margin-right: 24px;
  font-size: 16px;
  width: 96px;
  height: 40px;
}

#safety-and-security-container .af-select .af-select-list {
  border: none;
  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-top: 5px;
  height: 340px;
  overflow-y: auto;
}

#safety-and-security-container .af-select .af-select-list .af-select-item {
  display: block;
  height: 34px;
  line-height: 34px;
  cursor: pointer;
}

#safety-and-security-container .af-select .af-select-list .af-select-item.active,
#safety-and-security-container .af-select .af-select-list .af-select-item.hover {
  background-color: #eaecef;
}

#safety-and-security-container .af-select .af-select-title {
  vertical-align: top;
  height: 40px;
  line-height: 40px;
  border-color: #b4b4b4;
  cursor: pointer;
}

#safety-and-security-container .af-select .af-select-title .af-select-input {
  padding-left: 12px !important;
}

#safety-and-security-container .af-select .af-select-title .icon {
  font-size: 0;
  position: relative;
}

#safety-and-security-container .af-select .af-select-title .icon::before {
  content: '';
  font-size: 0;
  position: absolute;
  right: 11px;
  top: 17px;
  border-width: 7px 5px 7px;
  border-color: #000 transparent transparent;
  border-style: solid;
}

#safety-and-security-container .x-row-select-error .af-select-title {
  border-color: #e41827 !important;
}

#safety-and-security-container .x-fm-radio {
  width: 96px;
  height: 40px;
  margin-right: 44px;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  cursor: pointer;
}

#safety-and-security-container .x-fm-radio-selected {
  border-color: #0d9737;
  position: relative;
  overflow: hidden;
}

#safety-and-security-container .x-fm-radio-selected::after {
  content: '';
  font-size: 0;
  position: absolute;
  right: -6px;
  top: -2px;
  border-width: 0 8px 8px;
  border-color: transparent transparent #0d9737;
  border-style: solid;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

#safety-and-security-container .x-error-infos {
  font-size: 12px;
  line-height: 30px;
  color: #e41827;
}

#safety-and-security-container .inputDesc {
  font-size: 16px;
  line-height: 24px;
  color: #9ca0ab;
  display: inline-block;
  vertical-align: middle;
  font-weight: normal;
  margin-top: 20px;
}

#safety-and-security-container .x-fm-sucwrap {
  padding: 44px 0 0;
  text-align: center;
}

#safety-and-security-container .x-fm-sucwrap h2 {
  font-size: 28px;
  position: relative;
  margin-bottom: 24px;
  text-align: center;
}

#safety-and-security-container .x-fm-sucwrap h2 .x-icon--success {
  margin-right: 17px;
}

#safety-and-security-container .x-fm-sucwrap h2 .x-icon--success::before {
  content: '\e611';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

#safety-and-security-container .x-fm-sucwrap h2 .x-icon--success::before {
  display: inline-block;
  width: 34px;
  height: 34px;
  line-height: 34px;
  border-radius: 34px;
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  background: #0d9737;
}

#safety-and-security-container .x-fm-sucwrap p {
  font-size: 18px;
  text-align: center;
}

.pc-navbar::-webkit-scrollbar {
  display: none;
}

.pc-navbar-item {
  -webkit-box-flex: 1;
  -webkit-flex: 1 0 auto;
  -ms-flex: 1 0 auto;
  flex: 1 0 auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  line-height: 25px;
  margin-right: 25px;
  padding: 10px;
  text-align: center;
  text-transform: capitalize;
  position: relative;
}

.pc-navbar-item--active {
  border-bottom: 3px solid #0d9737;
  cursor: default;
}

.pc-navbar-item__new {
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #e41828;
  border-radius: 30px;
  color: #fff;
  line-height: normal;
  padding: 2px 6px;
  font-size: 12px;
  min-height: 20px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-left: 8px;
}

.pc-navbar-item__unread {
  position: absolute;
  top: 10px;
  right: 48px;
  width: 6px;
  height: 6px;
  background-color: #e41827;
  border-radius: 10px;
}

.x-text-second {
  font-size: 13px;
  line-height: 1;
}

.x-main-mid .x-input-wrapper {
  width: 100%;
}

.x-main-mid .x-input-wrapper .x-input {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  font-size: 14px;
  height: 40px;
  line-height: 38px;
  padding-left: 18px;
}

.x-main-mid .x-input-wrapper .x-input-com {
  display: block;
}

.x-main-mid .x-input-wrapper .x-input-icon:before {
  position: absolute;
  top: 50%;
  -webkit-transform: translate(-9px, -50%);
  -ms-transform: translate(-9px, -50%);
  transform: translate(-9px, -50%);
  line-height: 16px;
  height: 16px;
}

.x-main-mid .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input {
  border-color: #0d9737;
}

.x-main-mid .x-input-group--prepend.x-input-wrapper--error .x-input {
  border-left: none !important;
}

.x-main-mid .x-input-group--prepend .x-input-prepend {
  border-color: #b4b4b4;
  border-radius: 2px 0 0 2px;
  padding-left: 18px;
}

.x-main-mid .x-input-group--prepend .x-input {
  border-left: none !important;
  border-radius: 0 2px 2px 0;
  padding-left: 0;
}

.x-main-mid .x-input-group--prepend.x-input-wrapper--active .x-input-prepend {
  border-color: #0d9737;
}

#safety-and-security-container {
  color: #353a45;
  padding: 10px 20px;
  min-height: 400px;
  margin-left: 19px;
  background-color: #fff;
}

#safety-and-security-container * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

#safety-and-security-container .x-nav-item {
  padding: 10px 45px;
  margin-right: 0;
}

#safety-and-security-container .x-fm-wrap {
  padding: 10px 0 55px 60px;
}

#safety-and-security-container .x-fm-row {
  font-size: 16px;
  line-height: 40px;
  padding: 15px 0;
}

#safety-and-security-container .x-fm-row:after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}

#safety-and-security-container .x-fm-left {
  float: left;
  line-height: 40px;
  width: 135px;
}

#safety-and-security-container .x-fm-right {
  float: left;
}

#safety-and-security-container .x-fm-input-wrap {
  border: 1px solid #b4b4b4;
}

#safety-and-security-container .x-input-wrapper {
  width: 300px;
}

#safety-and-security-container .x-btn-wrapper {
  width: 204px;
  height: 38px;
}

#safety-and-security-container .x-fm-radio {
  width: 96px;
  height: 40px;
  margin-right: 44px;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  cursor: pointer;
}

#safety-and-security-container .x-error-infos {
  font-size: 12px;
  line-height: 30px;
  color: #e41827;
}

#safety-and-security-container .inputDesc {
  font-size: 16px;
  line-height: 24px;
  color: #9ca0ab;
  display: inline-block;
  vertical-align: middle;
  font-weight: normal;
  margin-top: 20px;
}

#safety-and-security-container .x-fm-sucwrap {
  padding: 44px 0 0;
  text-align: center;
}

#safety-and-security-container .x-fm-sucwrap h2 {
  font-size: 28px;
  position: relative;
  margin-bottom: 24px;
  text-align: center;
}

#safety-and-security-container .x-fm-sucwrap h2 .x-icon--success {
  margin-right: 17px;
}

#safety-and-security-container .x-fm-sucwrap h2 .x-icon--success::before {
  content: '\e611';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

#safety-and-security-container .x-fm-sucwrap h2 .x-icon--success::before {
  display: inline-block;
  width: 34px;
  height: 34px;
  line-height: 34px;
  border-radius: 34px;
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  background: #0d9737;
}

#safety-and-security-container .x-fm-sucwrap p {
  font-size: 18px;
  text-align: center;
}
</style>
