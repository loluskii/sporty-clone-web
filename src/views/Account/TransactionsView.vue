<template>
  <AccountLayout>
    <div class="x-uc-wrapper layout-position">
      <div class="x-trans-list">
        <div class="x-table x-trans-head">
          <div class="x-table-row">
            <div class="x-table-cell x-trans-tl">
              <span>Time</span>
            </div>
            <div class="x-table-cell tran-type">
              <span data-cms-key="type">Type</span>
            </div>
            <div class="x-table-cell tran-tradeno">
              <span data-cms-key="trade_no">Trade No.</span>
            </div>
            <div class="x-table-cell">
              <span data-cms-key="amount">Amount</span>
            </div>
            <div class="x-table-cell">
              <span data-cms-key="status">Status</span>
            </div>
            <div class="x-table-cell">
              <span data-cms-key="balance">Balance</span>
            </div>
            <!-- <div class="x-table-cell"><span></span></div> -->
          </div>
        </div>
        <div class="x-table x-trans-body" v-if="transactionsList.length && !isLoading">
          <div class="x-table-row" v-for="(data, index) in transactionsList" :key="index">
            <div class="x-table-cell x-trans-tl">
              <span>{{ moment(data.transactionDate).format('DD/MM/YYYY') }}</span>
              <span>{{ moment(data.transactionDate).format('HH:MM:SS') }}</span>
            </div>
            <div class="x-table-cell tran-type">
              <span> {{ data.subject }} </span>
            </div>
            <div class="x-table-cell tran-tradeno">
              <span>{{ data.referenceNo }}</span>
            </div>
            <div class="x-table-cell">
              <span>{{ formatNumber(data.amount) }}</span>
            </div>
            <div class="x-table-cell">
              <span class="" data-cms-key="succeed">{{
                data.status === 0 ? 'Pending' : data.status === 1 ? 'Success' : 'Failed'
              }}</span>
            </div>
            <div class="x-table-cell">
              <span>{{ formatNumber(data.balance) }}</span>
            </div>
          </div>
        </div>
        <LoadingSpinner v-else-if="isLoading"></LoadingSpinner>
        <div v-else class="m-list-none">
          <p class="no-list-txt">
            <i class="m-icon--pageques"></i>
            <span data-cms-key="no_records_found" data-cms-page="common_feedback"
              >No Records Found.</span
            >
          </p>
        </div>
      </div>
    </div>
  </AccountLayout>
</template>
<script setup>
import AccountLayout from '@/components/Shared/AccountLayout.vue'
import { getTransactionsData, formatNumber } from '@/helpers'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { ref, onMounted } from 'vue'
import moment from 'moment'

const transactionsList = ref([])
const isLoading = ref(true)

onMounted(async () => {
  let payload = {
    clientId: import.meta.env.VITE_CLIENT_ID
    // startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    // endDate: moment().format('YYYY-MM-DD'),
    // page: 1,
    // perPage
  }
  const res = await getTransactionsData(payload, 1)
  transactionsList.value = res.data
  isLoading.value = false
})
</script>

<style>
.x-uc-wrapper {
  color: #353a45;
  padding: 10px;
  min-height: 500px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-left: 19px;
  background-color: #fff;
}

.x-text-second {
  font-size: 13px;
  line-height: 1;
}
.x-trans-list .x-list-header {
  margin: -11px 0 10px;
  overflow: hidden;
}
.x-trans-list .x-list-header .x-reconciliation-btn {
  color: var(--brand-primary);
  cursor: pointer;
  float: right;
  font-size: 13.3px;
  line-height: 15px;
}
.x-trans-list .x-t-gray {
  color: #9ca0ab;
}
.x-trans-list .x-t-red {
  color: #e41827;
}
.x-trans-list .x-table-row {
  table-layout: fixed;
}
.x-trans-list .x-table-cell {
  -webkit-align-self: center;
  -ms-flex-item-align: center;
  align-self: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-flex-basis: 50px;
  -ms-flex-preferred-size: 50px;
  flex-basis: 50px;
  text-align: center;
}
.x-trans-list .x-table-cell.tran-type {
  -webkit-flex-basis: 125px;
  -ms-flex-preferred-size: 125px;
  flex-basis: 125px;
  width: 18%;
}
.x-trans-list .x-table-cell.tran-tradeno {
  -webkit-flex-basis: 140px;
  -ms-flex-preferred-size: 140px;
  flex-basis: 140px;
  width: 23%;
}
.x-trans-list .x-table-cell > span {
  display: block;
  line-height: 1.3;
  white-space: normal;
  word-break: break-all;
}
.x-trans-list .x-trans-tl {
  padding-left: 15px;
  text-align: left;
}
.x-trans-list .x-trans-head {
  background: #1b1e25;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #fff;
  padding: 10px 0;
}
.x-trans-list .x-trans-body .x-table-row {
  border: 1px solid #eaecef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 5px 0 0;
  padding: 6px 0;
}
.x-trans-list .x-detail {
  color: #3656a3;
  cursor: pointer;
  text-decoration: none;
}
.x-trans-list .x-bet-list {
  margin-top: 2px;
}
.x-trans-list .x-bet-list .x-table-row {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 15px 0;
}
.x-trans-list .x-bet-list .x-table-cell > span {
  display: block;
}
.x-trans-list .x-bet-list .x-table-cell > span:last-of-type {
  margin-bottom: 0;
}
.es-dialog.transaction-dialog .es-dialog-head {
  color: #353a45;
  height: 58px;
  padding: 0;
}
.es-dialog.transaction-dialog .es-dialog-head h1 {
  line-height: 1;
  padding: 0;
}
.es-dialog.transaction-dialog .es-dialog-head h1 .dialog-title {
  border-bottom: solid 1px #eaecef;
  font-size: 24px;
  font-weight: bold;
  height: 57px;
  line-height: 57px;
  text-align: center;
  width: 528px;
}
.es-dialog.transaction-dialog .es-dialog-head .es-dialog-close {
  cursor: pointer;
  right: 20px;
  text-decoration: none;
  top: 11px;
}
.es-dialog.transaction-dialog .es-dialog-head .es-dialog-close > * {
  cursor: pointer !important;
}
.es-dialog.transaction-dialog .es-dialog-body .es-dialog-main {
  max-height: 550px;
  overflow-y: auto;
  padding: 0;
  scrollbar-width: none;
}
.es-dialog.transaction-dialog .es-dialog-body .es-dialog-main::-webkit-scrollbar {
  display: none;
}
.es-dialog.transaction-dialog .es-dialog-body .es-dialog-main .dialog-content {
  font-size: 12px;
  width: 528px;
}
.x-reconciliation-dialog {
  width: 528px !important;
}
.x-reconciliation-dialog .x-dialog-body {
  margin-top: -58px;
}
.x-manual-check {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-family: 'Avenir', sans-serif;
  font-weight: bold;
  font-size: 14px;
}
.x-manual-check-header {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.x-manual-check div:first-child {
  margin-right: 12px;
}
.x-manual-check .bank-icon {
  height: 28px;
  margin-right: 8px;
  width: 28px;
}
.x-manual-check .btn {
  background: var(--brand-primary);
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 14px;
}
.x-dialog-wrapper .x-pop-header > span {
  font-weight: bold;
}
.m-list-none {
  padding: 203px 0 290px;
  text-align: center;
}
.no-list-txt {
  color: #9ca0ab;
  font-size: 16px;
}
.no-list-txt .m-icon--pageques {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
}
.no-list-txt .m-icon--pageques::before {
  content: '\e61b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.no-list-txt .m-icon--pageques::before {
  font-size: 23px;
}
.no-list-more-records {
  color: #9ca0ab;
  font-size: 1rem;
  line-height: 1.16666667rem;
  margin-top: 1rem;
  text-align: center;
}
</style>
