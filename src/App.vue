<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import DialogBox from '@/components/Shared/DialogBox.vue'
import emitter from '@/plugins/emitter'
import { useCouponStore, useUsersStore, useUtilsStore } from '@/stores'
import { getBets, loadBetslipByCode } from '@/helpers'
import CasinoDialog from '@/components/Dialog/CasinoDialog.vue'

const dialogType = ref('')
const isDialogShown = ref(false)
const dialogData = ref({})
const usersStore = useUsersStore()
const couponStore = useCouponStore()
const utilstStore = useUtilsStore()
const showCasinoDialog = ref(false)
const route = useRoute()
const router = useRouter()

function handleshowDialog(data) {
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

async function loadBet(code) {
  try {
    const res = await loadBetslipByCode(code)
    if (res.success) {
      if (res.data.selections.length) {
        couponStore.coupon.selections = res.data.selections
        couponStore.coupon.totalOdds = res.data.totalOdd
        couponStore.coupon.totalStake = res.data.stake
        couponStore.coupon.stake = res.data.stake
        couponStore.coupon.maxWin = res.data.possibleWin
        couponStore.coupon.source = 'mobile'
        if (res.data.selections.length === 1) {
          couponStore.coupon.bet_type = 'Single'
          couponStore.coupon.betslip_type = 'Single'
        } else {
          couponStore.coupon.bet_type = 'Multiple'
          couponStore.coupon.betslip_type = 'Multiple'
        }
        // emitter.emit('openBetslip')
        return router.push({ name: 'home' })
      } else {
        emitter.emit('showDialog', {
          dialogType: 'error',
          dialogData: { data: 'All Selections have expired' }
        })
      }
    } else {
      throw Error
    }
  } catch (error) {
    emitter.emit('showDialog', {
      dialogType: 'error',
      dialogData: { data: error}
    })
  }
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

watch(
  () => route.query.shareCode,
  async (code) => {
    // get booking code
    if (code) {
      await loadBet(code)
    }
  },
  { immediate: true } // Trigger the watch callback immediately on component mount
)

onMounted(async () => {
  emitter.on('showDialog', handleshowDialog)
  emitter.on('hideDialog', toggleDialog)
  emitter.on('clearBetslip', clearBetslip)
  emitter.on('refreshOpenBets', getBetsData)
  emitter.on('toggleCasinoDialog', () => {
    showCasinoDialog.value = true
  })
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
  <CasinoDialog v-if="showCasinoDialog" @hide-dialogue="showCasinoDialog = false"></CasinoDialog>
</template>

<style scoped></style>
