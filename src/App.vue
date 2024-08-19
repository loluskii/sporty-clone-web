<script setup>
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import DialogBox from '@/components/Shared/DialogBox.vue'
import emitter from '@/plugins/emitter'
import { useCouponStore, useUsersStore, useUtilsStore } from '@/stores'
import { getBets } from '@/helpers'

const dialogType = ref('')
const isDialogShown = ref(false)
const dialogData = ref({})
const usersStore = useUsersStore()
const couponStore = useCouponStore()
const utilstStore = useUtilsStore()

function handleshowDialog(data) {
  console.log(data)
  dialogType.value = data.dialogType
  dialogData.value = data.dialogData
  isDialogShown.value = true
}

function toggleDialog() {
  if (isDialogShown.value) {
    isDialogShown.value = false
  }
}

function clearBetslip() {
  isDialogShown.value = false
  return couponStore.clearBetslip()
}

async function getBetsData() {
  let payload = {
    clientId: import.meta.env.VITE_CLIENT_ID,
    date: '',
    status: 0,
    userId: usersStore.currentUser.id
  }
  const res = await getBets(payload)
  if (res.bets) {
    utilstStore.openBetCount = res.bets.length
  }
}

onMounted(async () => {
  emitter.on('showDialog', handleshowDialog)
  emitter.on('hideDialog', toggleDialog)
  emitter.on('clearBetslip', clearBetslip)
  emitter.on('refreshOpenBets', getBetsData)
  if (usersStore.currentUser) {
    Promise.all([usersStore.loadCurrentUser(), getBetsData()])
      .then(() => {})
      .catch(() => {})
  }
})
</script>

<template>
  <RouterView />
  <DialogBox v-if="isDialogShown" :dialog-type="dialogType" :dialog-data="dialogData"></DialogBox>
</template>

<style scoped></style>
