<template>
  <AccountLayout>
    <div id="my-account-container">
      <form class="x-fm-wrap" style="position: relative">
        <div class="x-fm-row" style="padding: 15px 0px 0px">
          <div class="x-fm-left" data-cms-key="mobile_number">Mobile Number</div>
          <div class="x-fm-right">+234 {{ currentUser.username }}</div>
        </div>
        <div class="x-fm-row">
          <div class="x-fm-left">First Name</div>
          <div class="x-fm-right">
            <div tabindex="6" class="x-input-wrapper">
              <span class="x-input-com">
                <input
                  type="input"
                  name=""
                  placeholder=""
                  maxlength="60"
                  class="x-input fs-exclude"
                  v-model="firstName"
                  :disabled="currentUser?.firstName !== ''"
              /></span>
            </div>
          </div>
        </div>
        <div class="x-fm-row">
          <div class="x-fm-left" data-cms-key="last_name">Last Name</div>
          <div class="x-fm-right">
            <div tabindex="6" class="x-input-wrapper">
              <span class="x-input-com">
                <input
                  type="input"
                  name=""
                  placeholder=""
                  maxlength="60"
                  class="x-input fs-exclude"
                  v-model="lastName"
                  :disabled="currentUser?.lastName !== ''"
              /></span>
            </div>
          </div>
        </div>
        <!-- <div class="x-fm-row">
          <div class="x-fm-left" data-cms-key="date_of_birth">Date of Birth</div>
          <div class="x-fm-right">
            <div class="flex flex-align-stretch">
              <Datepicker />
            </div>
            <span class="x-error-infos"></span>
          </div>
        </div> -->
        <div class="x-fm-row">
          <div class="x-fm-left" data-cms-key="gender">Gender</div>
          <div class="x-fm-right">
            <em
              class="x-fm-radio"
              @click="gender = 'male'"
              :class="{ 'x-fm-radio-selected': gender === 'male' }"
              >Male</em
            >
            <input type="radio" v-model="gender" value="male" style="visibility: hidden" />
            <!--  -->
            <em
              class="x-fm-radio"
              data-cms-key="female"
              :class="{ 'x-fm-radio-selected': gender === 'female' }"
              @click="gender = 'female'"
              >Female</em
            >
            <input type="radio" v-model="gender" value="female" style="visibility: hidden" />
          </div>
        </div>
        <div class="x-fm-row">
          <div class="x-fm-left" data-cms-key="email">Email</div>
          <div class="x-fm-right">
            <div>
              <div tabindex="6" class="x-input-wrapper m-input-wrapper--disabled">
                <span class="x-input-com">
                  <input
                    type="input"
                    input-mode=""
                    name=""
                    placeholder=""
                    maxlength="200"
                    onpaste="return true"
                    data-op=""
                    class="x-input fs-exclude"
                    v-model="email"
                    :disabled="currentUser?.email !== ''"
                /></span>
              </div>
              <!-- <i class="icon-check mg-l-8"></i> -->
              <!-- <p class="x-error-infos" style="position: absolute"></p> -->
            </div>
          </div>
        </div>
        <div class="x-fm-row">
          <div class="x-fm-left">&nbsp;</div>
          <div class="x-fm-right">
            <div class="x-btn-wrapper">
              <button
                @click.prevent="updateUserDetails"
                class="af-button af-button--success"
                style="width: 100%"
                type="button"
              >
                <span><span data-cms-key="save">Save</span></span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </AccountLayout>
</template>
<script setup>
import AccountLayout from '@/components/Shared/AccountLayout.vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores'
import { updateProfile } from '@/helpers'
const usersStore = useUsersStore()

const currentUser = computed(() => {
  return usersStore.currentUser
})

const firstName = ref(currentUser.value?.firstName)
const lastName = ref(currentUser.value?.lastName)
const email = ref(currentUser.value?.email)
const gender = ref(currentUser.value?.gender)

async function updateUserDetails() {
  let payload = {
    userID: currentUser.value.id,
    roleId: currentUser.value.roleId,
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    gender: gender.value
  }

  const res = await updateProfile(payload)
  console.log(res)
}

onMounted(() => {
  usersStore.loadCurrentUser()
})
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
  color: var(--brand-primary);
}
.x-main-mid .x-input-wrapper .x-input-icon.x-input-icon--clickable:hover + .x-input {
  border-color: var(--brand-primary);
}
.x-main-mid .x-input-wrapper.x-input-wrapper--error .x-input {
  border-color: #e41827 !important;
}
.x-main-mid .x-input-wrapper.x-input-wrapper--error .x-input-prepend {
  border-color: #e41827 !important;
}
.x-main-mid .x-input-wrapper.x-input-wrapper--active .x-input {
  border-color: var(--brand-primary);
}
.x-main-mid .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input {
  border-color: var(--brand-primary);
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
  border-color: var(--brand-primary);
}
#my-account-container {
  color: #353a45;
  padding: 10px 20px;
  min-height: 400px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-left: 19px;
  background-color: #fff;
}
#my-account-container .x-nav-item {
  padding: 10px 45px;
  margin-right: 0;
}
#my-account-container .x-fm-wrap {
  padding: 10px 0 55px 60px;
}
#my-account-container .x-fm-row {
  font-size: 16px;
  line-height: 40px;
  padding: 15px 0;
}
#my-account-container .x-fm-row:after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}
#my-account-container .x-fm-left {
  float: left;
  line-height: 40px;
  width: 135px;
}
#my-account-container .x-fm-right {
  float: left;
}
#my-account-container .x-fm-input-wrap {
  border: 1px solid #b4b4b4;
}
#my-account-container .x-input-wrapper {
  width: 300px;
}
#my-account-container .x-btn-wrapper {
  width: 204px;
  height: 38px;
}
#my-account-container .af-select {
  display: inline-block;
  vertical-align: top;
  margin-right: 24px;
  font-size: 16px;
  width: 96px;
  height: 40px;
}
#my-account-container .af-select .af-select-list {
  border: none;
  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-top: 5px;
  height: 340px;
  overflow-y: auto;
}
#my-account-container .af-select .af-select-list .af-select-item {
  display: block;
  height: 34px;
  line-height: 34px;
  cursor: pointer;
}
#my-account-container .af-select .af-select-list .af-select-item.active,
#my-account-container .af-select .af-select-list .af-select-item.hover {
  background-color: #eaecef;
}
#my-account-container .af-select .af-select-title {
  vertical-align: top;
  height: 40px;
  line-height: 40px;
  border-color: #b4b4b4;
  cursor: pointer;
}
#my-account-container .af-select .af-select-title .af-select-input {
  padding-left: 12px !important;
}
#my-account-container .af-select .af-select-title .icon {
  font-size: 0;
  position: relative;
}
#my-account-container .af-select .af-select-title .icon::before {
  content: '';
  font-size: 0;
  position: absolute;
  right: 11px;
  top: 17px;
  border-width: 7px 5px 7px;
  border-color: #000 transparent transparent;
  border-style: solid;
}
#my-account-container .x-row-select-error .af-select-title {
  border-color: #e41827 !important;
}
#my-account-container .x-fm-radio {
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
#my-account-container .x-fm-radio-selected {
  border-color: var(--brand-primary);
  position: relative;
  overflow: hidden;
}
#my-account-container .x-fm-radio-selected::after {
  content: '';
  font-size: 0;
  position: absolute;
  right: -6px;
  top: -2px;
  border-width: 0 8px 8px;
  border-color: transparent transparent var(--brand-primary);
  border-style: solid;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
#my-account-container .x-error-infos {
  font-size: 12px;
  line-height: 30px;
  color: #e41827;
}
#my-account-container .inputDesc {
  font-size: 14px;
  line-height: 20px;
  color: #9ca0ab;
  display: inline-block;
  vertical-align: middle;
  font-weight: normal;
  margin-left: 18px;
}
#my-account-container .x-fm-sucwrap {
  padding: 44px 0 0;
  text-align: center;
}
#my-account-container .x-fm-sucwrap h2 {
  font-size: 28px;
  position: relative;
  margin-bottom: 24px;
  text-align: center;
}
#my-account-container .x-fm-sucwrap h2 .x-icon--success {
  margin-right: 17px;
}
#my-account-container .x-fm-sucwrap h2 .x-icon--success::before {
  content: '\e611';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#my-account-container .x-fm-sucwrap h2 .x-icon--success::before {
  display: inline-block;
  width: 34px;
  height: 34px;
  line-height: 34px;
  border-radius: 34px;
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  background: var(--brand-primary);
}
#my-account-container .x-fm-sucwrap p {
  font-size: 18px;
  text-align: center;
}
</style>
