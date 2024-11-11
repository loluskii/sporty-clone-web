<template>
  <template v-if="selectionsLength > 0">
    <div v-if="selectionsLength > 1" class="x-list-nav">
      <div class="x-table">
        <div class="x-table-row">
          <div
            class="x-table-cell"
            :class="
              betSlipType !== 'Combo' && betType === 'Single'
                ? 'x-table-cell--active'
                : ''
            "
            @click="couponStore.setBetType('Single')"
          >
            <span data-cms-key="singles">Single</span>
          </div>
          <div
            class="x-table-cell"
            :class="
              betSlipType !== 'Combo' && betType === 'Multiple'
                ? 'x-table-cell--active'
                : ''
            "
            @click="couponStore.setBetType('Multiple')"
          >
            <span data-cms-key="multiple">Multiple</span>
          </div>
          <div
            class="x-table-cell"
            :class="betSlipType === 'Combo' ? 'x-table-cell--active' : ''"
            @click="couponStore.setBetType('Combo')"
          >
            <span data-cms-key="system">System</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div>
        <div v-show="selectionsLength > 1" class="x-opertaion x-opertaion-fix">
          <div class="x-table">
            <div class="x-table-row">
              <div class="x-table-cell x-align--right" @click="clearBetslip">
                <span class="x-text-min">Remove All</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Selections -->
        <BetListEvent
          v-for="(selection, s) in betslipSelections"
          :key="s"
          :selection="selection"
        ></BetListEvent>
        <!-- Selections -->

        <div class="x-stake">
          <div>
            <div class="x-plays-wrapper">
              <!-- One selection -->
              <div v-if="selectionsLength === 1" class="x-plays">
                <div class="x-plays-item">
                  <div class="x-line-wrapper">
                    <div class="x-label">Total Stake</div>
                    <div class="x-value">
                      <span class="x-currency">NGN</span>
                      <div
                        tabindex="6"
                        class="x-input-wrapper"
                        id="j_stake_0"
                        style="max-width: 70px"
                      >
                        <span class="x-input-com">
                          <input
                            type="input"
                            input-mode=""
                            name=""
                            placeholder="min. 10"
                            onpaste="return true"
                            v-model="couponStore.coupon.stake"
                            @input="updateStake"
                            class="x-input fs-exclude"
                        /></span>
                      </div>
                    </div>
                  </div>
                  <p class="x-error-tips" style="display: none"></p>
                </div>
              </div>
              <!-- One selection -->
              <!-- Multiple selection -->
              <div v-else class="x-plays">
                <div class="x-plays-title">
                  <div class="x-type">Type</div>
                  <div class="x-num">No.</div>
                  <div class="x-money">
                    <span>Stake</span>
                    (NGN)
                  </div>
                </div>
                <div id="j_stake_0" class="x-plays-item">
                  <div class="x-line-wrapper">
                    <div class="x-type">
                      {{ betSlipType }}
                    </div>
                    <div class="x-num">{{ selectionsLength }}</div>
                    <div class="x-money">
                      <div
                        tabindex="6"
                        class="x-input-wrapper"
                        data-index="0"
                        style="max-width: 70px"
                      >
                        <span class="x-input-com">
                          <input
                            type="input"
                            input-mode=""
                            name=""
                            placeholder="min. 10"
                            onpaste="return true"
                            v-model="couponStore.coupon.stake"
                            @input="updateStake"
                            class="x-input fs-exclude"
                        /></span>
                      </div>
                    </div>
                  </div>
                  <p class="x-error-tips" style="display: none"></p>
                </div>
              </div>
            </div>
            <div class="x-money-wrapper">
              <template v-if="selectionsLength > 1">
                <div>
                  <div class="x-label">Odds</div>
                  <div class="x-value x-value-fix x-value-too-long">{{ totalOdds }}</div>
                </div>
                <div class="">
                  <div class="x-label" data-cms-key="total_stake">Total Stake</div>
                  <div class="x-value">{{ totalStake }}</div>
                </div>

                <div>
                  <div class="x-label" data-cms-key="max_bonus">Max bonus</div>
                  <div class="x-value">{{ maxBonus }}</div>
                </div>
              </template>

              <div>
                <div class="x-label x-label-one-cut-fix">
                  <span class="flex"
                    ><span class="no-warp" data-cms-key="potential_win"
                      >Potential Win</span
                    >
                    &nbsp;
                  </span>
                </div>
                <div class="x-value">{{ maxWin }}</div>
              </div>
            </div>
            <div class="x-btn-wrapper">
              <button
                @click.prevent="toggleConfirmation"
                class="af-button af-button--primary"
                :class="placeBetDisabled ? 'is-disabled' : ''"
                :style="placeBetDisabled ? 'cursor: not-allowed' : ''"
              >
                <span
                  ><span data-cms-key="place_bet">{{
                    placeBetDisabled ? "Loading" : "Place Bet"
                  }}</span></span
                >
              </button>
            </div>
            <!-- Bet Confirmation Modal -->
            <div
              v-if="showConfirmationModal"
              class="x-comfirm-wrapper"
              style="top: -46px"
            >
              <div>
                <div class="x-content-wrapper">
                  <div class="x-label">About to pay</div>
                  <div class="x-value">
                    NGN<span class="x-money"> {{ totalStake }}</span>
                  </div>
                </div>

                <div class="x-btn-wrapper">
                  <button
                    @click.prevent="toggleConfirmation"
                    class="af-button af-button--text"
                  >
                    <span><span data-cms-key="cancel">Cancel</span></span>
                  </button>
                  <button @click.prevent="placeBet" class="af-button af-button--primary">
                    <span><span data-cms-key="confirm">Confirm</span></span>
                  </button>
                </div>
              </div>
            </div>
            <!-- Bet Confirmation Modal -->
          </div>
        </div>
        <div class="x-share--wrapper">
          <div>
            <span @click="book">Book Bet</span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </template>
  <div v-else class="x-betslip-search">
    <p class="x-text-main" data-cms-key="to_place_a_bet_click_on_the_odds_tip">
      To place a bet, click on the odds. Or insert a booking code
    </p>
    <div class="x-opt-wrapper">
      <div tabindex="6" class="x-input-wrapper">
        <span class="x-input-com"
          ><i class="x-input-icon x-input-icon--clickable x-icon-delete"></i>
          <input
            type="input"
            name=""
            placeholder="Booking Code"
            onpaste="return true"
            class="x-input fs-exclude"
            v-model="bookingCode"
        /></span>
      </div>

      <button
        :disabled="bookingCode === ''"
        class="af-button af-button--primary"
        type="primary"
        :class="{ 'is-disabled': bookingCode === '' }"
      >
        <span><span>Load</span></span>
      </button>
    </div>
    <div>
      <p class="x-text-tips">
        A booking code enables one to transfer a betslip between different devices.
      </p>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useCouponStore, useUsersStore } from "@/stores";
import { formatNumber } from "@/helpers";
import emitter from "@/plugins/emitter";
import BetListEvent from "@/components/Betslip/BetListEvent.vue";

const couponStore = useCouponStore();
const bookingCode = ref("");
const placeBetStatus = ref(false);
const isPlaceBetSuccessful = ref(false);
const isBookBetSuccessful = ref(false);
const placeBetResponse = ref({});
const bookBetResponse = ref({});
const usersStore = useUsersStore();
const showConfirmationModal = ref(false);
const betSlipType = computed(() => {
  return couponStore.coupon.betslip_type;
});

const betType = computed(() => {
  return couponStore.coupon.bet_type;
});

const totalOdds = computed(() => {
  return couponStore.coupon.totalOdds;
});

const betslipSelections = computed(() => {
  return couponStore.coupon.selections;
});

const updateStake = (e) => {
  couponStore.coupon.stake = e.target.value;
  return couponStore.updateWinnings({
    stake: e.target.value,
    id: "all",
  });
};

const maxBonus = computed(() => {
  return formatNumber(couponStore.coupon.maxBonus);
});

const selectionsLength = computed(() => {
  return couponStore.coupon.selections.length;
});

const maxWin = computed(() => {
  return formatNumber(couponStore.coupon.maxWin);
});

const totalStake = computed(() => {
  return couponStore.coupon.totalStake === ""
    ? 0.0
    : formatNumber(couponStore.coupon.totalStake);
});

const placeBetDisabled = computed(() => {
  return (
    couponStore.isBetslipBooking ||
    couponStore.isBetslipLoading ||
    couponStore.coupon.totalStake < 100
  );
});
function clearBetslip() {
  return couponStore.clearBetslip();
}

function toggleConfirmation() {
  if (!usersStore.currentUser) {
    emitter.emit("showDialog", { dialogType: "auth", dialogData: "login" });
  } else if (couponStore.isBetslipLoading) {
    return;
  } else {
    showConfirmationModal.value = !showConfirmationModal.value;
  }
}

async function book(e) {
  try {
    if (totalStake.value < 1) {
      return;
    }
    e.target.classList.add("loading-icon");
    couponStore.isBetslipBooking = true;

    const res = await couponStore.placeBet(e, "book");
    couponStore.isBetslipBooking = false;

    if (res.success) {
      emitter.emit("showDialog", { dialogType: "book-bet", dialogData: res });
    } else {
      emitter.emit("showDialog", {
        dialogType: "error",
        dialogData: { data: res.message },
      });
    }
  } catch (error) {
    emitter.emit("showDialog", { dialogType: "error", dialogData: { data: error } });
  }
}

async function placeBet(e) {
  showConfirmationModal.value = false;
  couponStore.isBetslipLoading = true;
  if (!usersStore.currentUser) {
    emitter.emit("showDialog", { dialogType: "auth", dialogData: "login" });
  }
  try {
    const res = await couponStore.placeBet(e, "bet");
    couponStore.isBetslipLoading = false;
    if (res.success) {
      await usersStore.loadCurrentUser();
      isPlaceBetSuccessful.value = true;
      placeBetResponse.value = res.data;
      emitter.emit("showDialog", { dialogType: "place-bet", dialogData: res });
    } else {
      emitter.emit("showDialog", { dialogType: "error", dialogData: { data: res } });
    }
  } catch (error) {
    couponStore.isBetslipLoading = false;
    emitter.emit("showDialog", { dialogType: "error", dialogData: { data: error } });
  }
}
</script>

<style>
.x-betslips .x-share--wrapper {
  padding: 10px 0 18px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #ffffff;
}
.x-betslips .x-share--wrapper > div {
  width: 204px;
  margin: 0 auto;
}
.x-betslips .x-share--wrapper span {
  font-size: 12px;
  line-height: 1;
  color: var(--brand-secondary);
  display: inline-block;
  vertical-align: top;
}
.x-betslips .x-share--wrapper span:hover {
  cursor: pointer;
}
.x-betslips .x-comfirm-wrapper {
  background: rgba(53, 58, 69, 0.9);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  z-index: 23;
}
.x-betslips .x-comfirm-wrapper > div {
  background: #ffffff;
  border-top: 1px solid #eaecef;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
}
.x-betslips .x-comfirm-wrapper .x-content-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  overflow: hidden;
  padding: 5px 10px 0;
}
.x-betslips .x-comfirm-wrapper .x-content-wrapper .x-label,
.x-betslips .x-comfirm-wrapper .x-content-wrapper .x-value {
  font-size: 12px;
  line-height: 26px;
  text-align: center;
}
.x-betslips .x-comfirm-wrapper .x-content-wrapper .x-value {
  font-size: 16px;
  margin-top: -5px;
}
.x-betslips .x-comfirm-wrapper .x-btn-wrapper {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 10px;
  margin-top: 10px;
}
.x-betslips .x-comfirm-wrapper .af-button {
  border-radius: 2px;
}
.x-betslips .x-comfirm-wrapper .af-button--text {
  border: 1px solid #9ca0ab !important;
  color: #9ca0ab;
  margin-right: 5px;
  padding: 10px;
  width: auto;
}
.x-betslips .x-comfirm-wrapper .af-button--primary {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  width: auto;
}
.x-betslips .x-comfirm-wrapper .x-line {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 0;
  height: 14px;
  margin-top: 6px;
  overflow: hidden;
  padding: 0 10px;
  width: 100%;
}
.x-betslips .x-comfirm-wrapper .x-line-label,
.x-betslips .x-comfirm-wrapper .x-line-value {
  display: inline-block;
  font-size: 12px;
  line-height: 14px;
  vertical-align: middle;
}
.x-betslips .x-comfirm-wrapper .x-line-label {
  color: #9ca0ab;
  margin-right: 8px;
  max-width: 75px;
}
.x-betslips .x-comfirm-wrapper .x-line-value {
  color: #353a45;
  float: right;
  max-width: calc(100% - 75px);
  text-align: right;
}
.x-betslips .x-comfirm-wrapper .x-line-label-fix {
  max-width: 138px;
}
</style>
