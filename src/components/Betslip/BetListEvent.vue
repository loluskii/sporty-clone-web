<template>
  <div class="x-list">
    <div class="x-item">
      <!-- <div class="x-lay-left"></div> -->
      <div class="x-lay-mid">
        <div class="x-lay-mid">
          <div class="x-item-play">
            <i
              class="x-icon-sport"
              :class="'x-icon--' + selection.sport.toLowerCase()"
            ></i>
            <span>{{ selection.outcomeName }}</span>
            <i class="x-icon-delete" @click="removeSelection(selection.element_id)"></i>
          </div>
          <div class="x-item-team">
            <!-- <i class="x-icon-live"
                        ><span data-cms-key="live" >Live</span></i
                      > -->
            {{ selection.eventName }}
          </div>
          <div class="x-item-main">
            <span class="x-item-market">{{ selection.marketName }}</span>

            <div class="x-item-odds">
              <span v-if="!selectionIsUnavailable" class="x-text-main">{{
                parseFloat(selection.odds).toFixed(2)
              }}</span>
              <span v-else class="x-text-min x-text-btn">Unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCouponStore } from "@/stores";

const couponStore = useCouponStore();

defineEmits(["toggle-betslip"]);
const props = defineProps({
  selection: Object,
});

const selectionIsUnavailable = computed(() => {
  // If explicitly marked as unavailable
  if (props.selection.unavailable) {
    return true;
  }

  // If suspended
  if (props.selection.suspended) {
    return true;
  }

  if(parseFloat(props.selection.odds <= 1)){
    return true
  }

  return false;

  // // Check if expired based on time
  // const parsedDate = new Date(props.selection.eventDate);
  // const currentDate = new Date();
  // const difference = currentDate - parsedDate;
  // const hoursDifference = difference / (1000 * 60 * 60);

  // return hoursDifference >= 5;
});

async function removeSelection(element_id) {
  await couponStore.removeSelection(element_id);
}
</script>

<style>
.x-list {
  background: rgba(0, 0, 0, 0.15);
  width: 100%;
  border-bottom: 2px solid #eaecef;
}
.x-list .x-item {
  background: #ffffff !important;
  padding: 0 7px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 0;
  margin-bottom: 0;
}

.x-list .x-item > .x-lay-mid {
  padding: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-list .x-item > .x-lay-left {
  margin-bottom: 1px;
  border-left: 3px solid transparent;
}
.x-list .x-item > .x-lay-mid {
  display: table-cell;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 1%;
  border-top: 1px solid #eaecef;
  /* width: 190px; */
  width: 100%;
}
.x-list .x-item > .x-lay-mid > .x-lay-mid {
  width: 100%;
}
.x-list .x-item:last-of-type > .x-lay-left {
  margin-bottom: 0;
}
.x-list .x-item:only-of-type > .x-lay-mid {
  border-top: none;
}
.x-list .x-lay-mid .x-lay-mid {
  width: 100%;
}
.x-list .x-lay-mid .x-lay-fix {
  max-width: calc(100% - 28px);
  display: inline-block;
  vertical-align: top;
}
.x-list .x-lay-left,
.x-list .x-lay-right {
  display: inline-block;
  vertical-align: top;
}
.x-list .x-lay-left {
  width: 24px;
  margin-right: 3px;
  text-align: center;
}
.x-list .x-item-team {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #353a45;
  font-size: 10px;
  line-height: 16px;
  width: 75%;
}
.x-list .x-icon-live {
  display: inline-block;
  vertical-align: top;
  background: var(--brand-secondary);
  color: #353a45;
  position: relative;
  margin-right: 5px;
  padding: 0 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-list .x-icon-live:after {
  position: absolute;
  top: 0;
  right: -2px;
  content: "";
  width: 0;
  height: 0;
  border-top: 8px solid var(--brand-secondary);
  border-left: 1px solid var(--brand-secondary);
  border-right: 1px solid transparent;
  border-bottom: 8px solid transparent;
}
.x-list .x-item-play {
  color: #353a45;
  font-size: 12px;
  text-transform: capitalize;
}
.x-list .x-item-play > * {
  display: inline-block;
  vertical-align: top;
  line-height: 17px;
}
.x-list .x-item-play .x-icon-delete {
  float: right;
}
.x-list .x-item-play .x-icon-delete::before {
  content: "\e69a";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-list .x-item-play .x-icon-delete:before {
  font-size: 10px;
}
.x-list .x-item-play > span {
  max-width: 75%;
}
.x-list .x-item-main {
  color: #353a45;
  font-size: 10px;
  overflow: hidden;
}
.x-list .x-item-main .x-item-market,
.x-list .x-item-main .x-item-odds {
  display: inline-block;
  vertical-align: middle;
  height: 17px;
  line-height: 17px;
}
.x-list .x-item-main .x-item-market {
  display: inline-block;
  max-width: 62%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.x-list .x-item-main .x-item-odds {
  float: right;
}
.x-list .x-item-main .delay-icon {
  line-height: 1;
  vertical-align: -10%;
  padding-left: 5px;
  cursor: pointer;
}
.x-list .x-item-odds {
  font-size: 14px;
  color: #353a45;
  /* font-weight: bold; */
}
.x-list .x-icon-sport:before {
  font-size: 14px;
}
.x-list .x-icon-up {
  color: var(--brand-secondary);
}
.x-list .x-icon-up::before {
  content: "\e609";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-list .x-icon-up:before {
  font-size: 11px;
  line-height: 14px;
}
.x-list .x-icon-down {
  color: #e41827;
}
.x-list .x-icon-down::before {
  content: "\e605";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-list .x-icon-down:before {
  font-size: 11px;
  line-height: 14px;
}
.x-list .x-banker-wrapper {
  display: inline-block;
  vertical-align: top;
  height: 100%;
  padding-left: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-list .x-icon-delete {
  display: inline-block;
  font-size: 15px;
  line-height: 1;
  word-break: break-word;
  margin-bottom: 0;
  cursor: pointer;
}
.x-list .x-icon-check {
  margin-top: 2px;
  width: 13px;
  height: 13px;
  border: 1px solid #dcdee5;
  background: #ffffff;
  border-radius: 2px;
  display: inline-block;
}

.x-list .x-text-btn {
  display: inline-block;
  padding: 3px 4px;
  color: #9ca0ab;
  font-size: 10px;
  line-height: 1;
  /* font-weight: bold; */
  background: #eaecef;
  border-radius: 2px;
}
</style>
