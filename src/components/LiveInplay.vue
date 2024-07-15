<template lang="">
  <div class="liveInPlay">
    <div class="live-banner">
      <div class="league-title">
        <span class="dis-icon"><em></em></span>
        <span class="text" data-cms-key="live_betting" data-cms-page="live">Live Betting</span>
        <span class="live-num">7</span>
      </div>
      <div class="all-live">
        <span data-cms-key="all_live" data-cms-page="live">All Live</span>
        <span class="live-num">126</span> <i class="arrow-right"></i>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.liveInPlay {
  background: #353a45;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.liveInPlay .all-live {
  color: #fff;
  cursor: pointer;
  font-size: 16px;
}
.liveInPlay .live-num {
  background: rgba(250, 250, 250, 0.1);
  border-radius: 2px;
  color: #fca311;
  font-size: 14px;
  font-weight: bold;
  height: 20px;
  padding: 0 5px;
}
.liveInPlay .arrow-right {
  color: #fff;
}
.liveInPlay .arrow-right::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.liveInPlay .text {
  margin: 0 5px;
}
.liveInPlay .live-banner {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 55px;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 9px 0 24px;
}
.liveInPlay .live-banner .league-title {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 20px;
  position: relative;
  text-align: left;
}
.liveInPlay .live-banner .league-title .dis-icon {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #fff;
  border-radius: 2px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 19px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  line-height: 1;
  text-align: center;
  width: 19px;
}
.liveInPlay .live-banner .league-title .dis-icon > em {
  color: #fca311;
  display: inline-block;
  font-family: 'iconfont';
  font-size: 10px;
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
  -webkit-transform-origin: center;
  -ms-transform-origin: center;
  transform-origin: center;
  -webkit-transition: -webkit-transform ease 300ms;
  transition: -webkit-transform ease 300ms;
  transition: transform ease 300ms;
  transition:
    transform ease 300ms,
    -webkit-transform ease 300ms;
}
.liveInPlay .live-banner .league-title .dis-icon.active > em {
  -webkit-transform: rotate(0);
  -ms-transform: rotate(0);
  transform: rotate(0);
}
.liveInPlay .live-match {
  background: #353a45;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #fff;
  font-size: 12px;
  margin-right: 15px;
  padding: 0 10px 10px 10px;
  text-align: center;
  width: 100%;
}
.liveInPlay .live-match .match-table {
  border-bottom: 1px solid rgba(234, 236, 239, 0.15);
}
.liveInPlay .live-match .match-table .league-row {
  -webkit-align-content: center;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-top: 1px solid rgba(234, 236, 239, 0.15);
  height: 36px;
  line-height: 36px;
  table-layout: fixed;
  vertical-align: middle;
}
.liveInPlay .live-match .match-table .league-row:first-child {
  border-top: 0px;
}
.liveInPlay .live-match .match-table .league-row .date,
.liveInPlay .live-match .match-table .league-row .league {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  padding-right: 10px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 41%;
}
.liveInPlay .live-match .match-table .league-row .each-module-wrap {
  color: #9ca0ab;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  line-height: 1;
  width: 50%;
}
.liveInPlay .live-match .match-table .league-row .each-module-wrap .market-desc {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  float: left;
  font-size: 12px;
  line-height: 12px;
  padding: 3px 0;
  text-align: center;
  width: 183px;
  width: 50%;
}
.liveInPlay .live-match .match-table .league-row .each-module-wrap .each-module-table {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-table;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  table-layout: fixed;
  text-align: left;
  white-space: nowrap;
  width: 100%;
}
.liveInPlay .live-match .match-table .league-row .each-module-wrap .each-module-table.two-markets {
  width: 50%;
}
.liveInPlay
  .live-match
  .match-table
  .league-row
  .each-module-wrap
  .each-module-table.two-markets:first-child {
  padding-right: 2px;
}
.liveInPlay
  .live-match
  .match-table
  .league-row
  .each-module-wrap
  .each-module-table.two-markets:last-child {
  padding-left: 2px;
}
.liveInPlay .live-match .match-table .league-row .each-module-wrap .each-module-table .each-module {
  background-color: #50545e;
  display: table-cell;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 8px;
  height: 14px;
  line-height: 14px;
  min-width: 1%;
  text-align: center;
}
.liveInPlay
  .live-match
  .match-table
  .league-row
  .each-module-wrap
  .each-module-table
  .each-module:last-child {
  margin-right: 0px;
}
.liveInPlay .live-match .match-table .match-row {
  -webkit-align-content: center;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-top: 1px solid rgba(234, 236, 239, 0.15);
  cursor: pointer;
  font-size: 12px;
  height: 50px;
  position: relative;
  table-layout: fixed;
  text-align: left;
}
.liveInPlay .live-match .match-table .match-row:before,
.liveInPlay .live-match .match-table .match-row:after {
  background-color: #353a45;
  content: ' ';
  display: block;
  height: 1px;
  left: 0;
  position: absolute;
  top: -1px;
  width: 65px;
}
.liveInPlay .live-match .match-table .match-row:after {
  bottom: -1px;
  top: auto;
}
.liveInPlay .live-match .match-table .match-row .left-team-cell {
  width: 40%;
}
.liveInPlay .live-match .match-table .match-row .left-team-cell .left-arrow {
  fill: #fca311;
  height: 50px;
  left: -10px;
  overflow: hidden;
  position: absolute;
  top: 0px;
}
.liveInPlay .live-match .match-table .match-row .left-team-cell .teams {
  color: #051c9e;
}
.liveInPlay .live-match .match-table .match-row .left-team-table {
  display: inline-table;
  font-size: 12px;
  height: 50px;
  table-layout: fixed;
  width: 100%;
}
.liveInPlay .live-match .match-table .match-row .left-team-table > div {
  display: table-cell;
  vertical-align: middle;
}
.liveInPlay .live-match .match-table .match-row .left-team-table .time {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  font-weight: 700;
  line-height: 1;
  padding-left: 6px;
  text-align: left;
  width: 68px;
}
.liveInPlay .live-match .match-table .match-row .left-team-table .time .clock-time {
  padding-bottom: 4px;
}
.liveInPlay .live-match .match-table .match-row .left-team-table .time .game-id {
  color: #d8d8d8;
  font-weight: 500;
}
.liveInPlay .live-match .match-table .match-row .left-team-table .teams {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.liveInPlay .live-match .match-table .match-row .left-team-table .teams > div {
  display: block;
  font-weight: 500;
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.liveInPlay .live-match .match-table .match-row .left-team-table .teams > div:first-child {
  padding-bottom: 4px;
}
.liveInPlay .live-match .match-table .match-row .left-team-table .score {
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  padding-left: 10px;
  width: 30px;
}
.liveInPlay .live-match .match-table .match-row .left-team-table .game-score,
.liveInPlay .live-match .match-table .match-row .left-team-table .point {
  color: #dcdee5;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  opacity: 0.5;
  width: 30px;
}
.liveInPlay .live-match .match-table .match-row .m-table-cell {
  vertical-align: middle;
}
.liveInPlay .live-match .match-table .match-row .market-cell {
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  width: 50%;
}
.liveInPlay .live-match .match-table .match-row .market-cell.two-markets .market {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 50%;
}
.liveInPlay .live-match .match-table .match-row .market-cell.two-markets .market:first-child {
  padding-right: 2px;
}
.liveInPlay .live-match .match-table .match-row .market-cell.two-markets .market:last-child {
  padding-left: 2px;
}
.liveInPlay .live-match .match-table .match-row .market-size {
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  font-size: 12px;
  font-weight: 500;
  line-height: 50px;
  text-align: center;
  text-align: right;
  width: 50px;
}
.liveInPlay .live-match .match-table .match-row .market-size:after {
  color: #fca311;
  content: '\e608';
  display: inline-block;
  font-family: 'iconfont';
  font-weight: 700;
  text-indent: 5px;
  -webkit-transform: translate3d(4px, 0, 0);
  transform: translate3d(4px, 0, 0);
}
.liveInPlay .live-match .m-market > div {
  -webkit-box-shadow: -1px 0px 0px 0px #1b1e25 inset;
  box-shadow: -1px 0px 0px 0px #1b1e25 inset;
}
.liveInPlay .live-match .m-market .af-select-title {
  background: transparent;
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
