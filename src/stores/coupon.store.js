import { defineStore } from 'pinia'
// import _ from 'lodash'
import { useUsersStore } from '@/stores'
import emitter from '../plugins/emitter'
import CouponCalculation from '@/helpers/coupon-calculation.js'
import {
  calculateWinnings,
  groupSelections,
  groupTournament,
  calculateTotalOdds,
  checkBetType,
  checkIfHasLive,
  getDataFromPayload,
  calculateBonus,
  getSplitProps,
  placeBet2,
  bookBet2,
} from '@/helpers'

const couponCalculation = new CouponCalculation()
const WTH_PERC = import.meta.env.VITE_WTH_PERC

export const useCouponStore = defineStore({
  id: 'coupon',
  state: () => ({
    betPlaced: null,
    loadedCoupon: null,
    confirm: false,
    sportsbookBonusList: [],
    SportsbookGlobalVariable: {},
    isBetslipLoading: false,
    isBetslipBooking: false,
    coupon: {
      acceptChanges: false,
      selections: [],
      combos: [],
      totalOdds: 1,
      maxBonus: 0,
      minBonus: 0,
      grossWin: 0,
      maxWin: 0,
      minWin: 0,
      stake: 100,
      totalStake: 100,
      minOdds: 1,
      maxOdds: 1,
      wthTax: 0,
      exciseDuty: 0,
      useBonus: false,
      source: 'website'
    }
  }),
  getters: {},
  actions: {
    async addToCoupon(selection) {
      const couponPayload = selection

      const globalVars = this.SportsbookGlobalVariable
      let type = couponPayload.type

      const data = getDataFromPayload(couponPayload)

      let couponData = { ...this.coupon }
      const bonusList = this.sportsbookBonusList

      this.coupon.event_type = type

      if (!this.coupon.selections.length) {
        //add selection to selections list
        this.coupon.selections.push(data)

        this.coupon.bet_type = 'Single'
        this.coupon.betslip_type = 'Single'
        this.coupon.totalOdds = (parseFloat(this.coupon.totalOdds) * parseFloat(data.odds)).toFixed(
          2
        )

        //calculate and get pot winnings with bonus
        const winnings = calculateWinnings(this.coupon, globalVars, bonusList)
        this.coupon.maxWin = winnings.maxWin
        this.coupon.maxBonus = winnings.maxBonus
        this.coupon.wthTax = winnings.wthTax
        this.coupon.grossWin = winnings.grossWin
        this.coupon.fixtures = groupSelections(this.coupon.selections)
        this.coupon.tournaments = groupTournament(this.coupon.selections)
        // check if event is live
        if (type === 'live') this.coupon.hasLive = true
      } else {
        this.coupon.betslip_type = 'Multiple'
        this.coupon.bet_type = 'Multiple'

        for (let i = 0; i < couponData.selections.length; i++) {
          if (couponData.selections[i].matchId === data.matchId) {
            //add selection to selections list
            this.coupon.selections.push(data)
            // const bonus = calculateBonus(this.coupon, globalVars, bonusList);
            // console.log(bonus, "bon");
            //group selections by match
            this.coupon.tournaments = groupTournament(this.coupon.selections)
            this.coupon.fixtures = groupSelections(couponData.selections)

            // con
            //bet type
            this.coupon.bet_type = 'Split'
            this.coupon.betslip_type = 'Combo'

            const splitProps = await getSplitProps(this.coupon)
            //calculate winnings
            let minStake =
              splitProps.minStake !== undefined && splitProps.minStake !== ''
                ? splitProps.minStake
                : 0
            const minWinnings = parseFloat(splitProps.minOdds) * parseFloat(minStake)
            const maxWinnings = parseFloat(splitProps.maxOdds) * parseFloat(minStake)

            console.log(minWinnings, maxWinnings)
            //calculate bonus
            this.coupon.minBonus = calculateBonus(this.coupon, globalVars, bonusList)

            this.coupon.minGrossWin = parseFloat(splitProps.minBonus) + minWinnings
            this.coupon.minWTH = ((this.coupon.minGrossWin - this.coupon.stake) * WTH_PERC) / 100
            this.coupon.minWin = this.coupon.minGrossWin - this.coupon.minWTH
            this.coupon.grossWin = parseFloat(splitProps.maxBonus) + maxWinnings
            this.coupon.wthTax = ((this.coupon.grossWin - this.coupon.stake) * WTH_PERC) / 100
            this.coupon.maxWin = this.coupon.grossWin - couponData.wthTax

            return
          }
        }

        //add selection to selections list
        this.coupon.selections.push(data)
        // const bonus = calculateBonus(this.coupon, globalVars, bonusList);
        // console.log(bonus, "bon");

        this.coupon.totalOdds = (parseFloat(this.coupon.totalOdds) * parseFloat(data.odds)).toFixed(
          2
        )

        //group selections by match
        this.coupon.tournaments = groupTournament(couponData.selections)
        this.coupon.fixtures = groupSelections(couponData.selections)
        //check bet type
        this.coupon.bet_type = checkBetType(this.coupon.fixtures)
        // check if event is live

        if (type === 'live') this.coupon.hasLive = true

        if (this.coupon.bet_type === 'Split') {
          const splitProps = await getSplitProps(this.coupon)

          this.coupon.minStake = parseFloat(splitProps.stake) / splitProps.noOfCombos

          //calculate winnings
          const minWinnings = parseFloat(splitProps.minOdds) * parseFloat(this.coupon.minStake)
          const maxWinnings = parseFloat(splitProps.maxOdds) * parseFloat(this.coupon.minStake)
          //calculate bonus
          this.coupon.minBonus = calculateBonus(this.coupon, globalVars, bonusList)

          this.coupon.minGrossWin = parseFloat(this.coupon.minBonus) + minWinnings
          this.coupon.minWTH = ((this.coupon.minGrossWin - this.coupon.stake) * WTH_PERC) / 100
          this.coupon.minWin = this.coupon.minGrossWin - this.coupon.minWTH
          this.coupon.grossWin = parseFloat(splitProps.maxBonus) + maxWinnings
          const wthTax = ((this.coupon.grossWin - this.coupon.stake) * WTH_PERC) / 100
          this.coupon.wthTax = wthTax < 1 ? 0 : wthTax
          this.coupon.maxWin = this.coupon.grossWin - this.coupon.wthTax

          return
        } else {
          const calculatedGroup = couponCalculation.calcCombinations(this.coupon)
          this.coupon.combos = calculatedGroup.Groups
          //calculate and get pot winnings with bonus
          if (this.coupon.bet_type === 'Combo') {
            // dispatch({ type: SET_COUPON_DATA, payload: couponData });
            if (this.coupon.Groupings && couponData.Groupings.length) {
              // updateComboWinningsFromTotal()
            }
          } else {
            const winnings = calculateWinnings(this.coupon, globalVars, bonusList)
            // console.log(winnings);
            this.coupon.maxWin = winnings.maxWin
            this.coupon.maxBonus = winnings.maxBonus
            this.coupon.wthTax = winnings.wthTax
            this.coupon.grossWin = winnings.grossWin
          }
        }
      }
    },
    async removeSelection(id) {
      // const { id, globalVars } = action.payload;
      // find deleted item
      const globalVars = this.SportsbookGlobalVariable

      const res = this.coupon.selections ? [...this.coupon.selections] : []
      const data = res.find((item) => item.selectionId === id)

      const bonusList = this.sportsbookBonusList
      //
      // get the new selections
      const newSelection = this.coupon.selections.filter((item) => item.selectionId !== id)

      this.coupon.selections = newSelection

      if (this.coupon.selections.length > 0) {
        const prevBetType = this.coupon.bet_type
        //group selections by match
        this.coupon.tournaments = groupTournament(this.coupon.selections)
        this.coupon.fixtures = groupSelections(this.coupon.selections)
        //check bet type
        // console.log(this.coupon, "coups");
        // this.coupon.bet_type = multibetCombination(this.coupon.selections);

        this.coupon.bet_type = checkBetType(this.coupon.fixtures)

        if (this.coupon.bet_type === 'Split') {
          const splitProps = await getSplitProps(this.coupon)
          //calculate winnings
          const minWinnings = parseFloat(splitProps.minOdds) * parseFloat(splitProps.minStake)
          const maxWinnings = parseFloat(splitProps.maxOdds) * parseFloat(splitProps.minStake)
          //calculate bonus
          this.coupon.minBonus = calculateBonus(this.coupon, globalVars, bonusList)

          this.coupon.minGrossWin = parseFloat(this.coupon.minBonus) + minWinnings
          this.coupon.minWTH = ((this.coupon.minGrossWin - this.coupon.stake) * WTH_PERC) / 100
          this.coupon.minWin = this.coupon.minGrossWin - this.coupon.minWTH
          this.coupon.grossWin = parseFloat(this.coupon.maxBonus) + maxWinnings
          this.coupon.wthTax = ((this.coupon.grossWin - this.coupon.stake) * WTH_PERC) / 100
          this.coupon.maxWin = this.coupon.grossWin - this.coupon.wthTax
        } else {
          // recalculate totalOdds if prev bet type was Split
          if (prevBetType === 'Split') {
            this.coupon.totalOdds = calculateTotalOdds(this.coupon.selections)
            this.coupon.minBonus = calculateBonus(this.coupon, globalVars, bonusList)
          } else {
            // else remove selection from total odds
            this.coupon.totalOdds = (
              parseFloat(this.coupon.totalOdds) / parseFloat(data.odds)
            ).toFixed(2)
            this.coupon.minBonus = calculateBonus(this.coupon, globalVars, bonusList)
          }
          // check if has live
          this.coupon.hasLive = checkIfHasLive(this.coupon.selections)

          const calculatedGroup = couponCalculation.calcCombinations(this.coupon)
          this.coupon.combos = calculatedGroup.Groups
          // couponData.combos = await getCombos(couponData);
          //calculate and get pot winnings with bonus
          if (this.coupon.bet_type === 'Combo') {
            // dispatch({ type: SET_COUPON_DATA, payload: coupondata })
            // if (coupondata.Groupings && coupondata.Groupings.length) {
            //   const calculatedCoupon = couponCalculation.calcPotentialWins(coupondata, bonusList);
            //   coupondata = coupondata.updateFromCalculatedCoupon(coupondata, calculatedCoupon);
            //   // update combos with max win
            //   coupondata.combos.forEach(combo => {
            //     for (let i = 0; i < coupondata.Groupings.length; i++) {
            //       if (combo.Grouping === coupondata.Groupings[i].Grouping) {
            //         combo.minWIn = coupondata.Groupings[i].minWin;
            //         combo.maxWin = coupondata.Groupings[i].maxWin;
            //         combo.Stake = coupondata.Groupings[i].Stake;
            //       }
            //     }
            //   })
            //   setTimeout(() => {
            //     return dispatch(updateComboWinningsFromTotal());
            //   }, 500);
            // }
          } else {
            const winnings = calculateWinnings(this.coupon, globalVars, bonusList)
            this.coupon.maxWin = winnings.maxWin
            this.coupon.maxBonus = winnings.maxBonus
            this.coupon.wthTax = winnings.wthTax
            this.coupon.grossWin = winnings.grossWin
          }
        }
      } else {
        const coupon = {
          acceptChanges: false,
          selections: [],
          combos: [],
          totalOdds: 1,
          maxBonus: 0,
          minBonus: 0,
          grossWin: 0,
          maxWin: 0,
          minWin: 0,
          stake: 100,
          totalStake: 100,
          minOdds: 1,
          maxOdds: 1,
          wthTax: 0,
          exciseDuty: 0,
          useBonus: false,
          source: 'mobile'
        }
        this.coupon = coupon
      }
    },
    updateWinnings(payload) {
      const { stake, id } = payload
      const globalVars = { ...this.SportsbookGlobalVariable }

      const coupondata = JSON.parse(JSON.stringify(this.coupon))
      const bonusList = this.sportsbookBonusList
      const selections = [...this.coupon.selections]

      if (stake === '') {
        this.coupon.stake = ''
        this.coupon.totalStake = ''

        if (this.coupon.betslip_type == 'Single') {
          if (id === 'all') {
            const newSelections = selections.map((item) => {
              const newItem = Object.assign({}, item)
              newItem.stake = ''
              return newItem
            })
            this.coupon.selections = newSelections
            return
          }
          let totalStake = 0
          let minWin = []
          let maxWin = 0
          const newSelections = selections.map((item) => {
            const newItem = Object.assign({}, item)
            if (item.selectionId === id) newItem.stake = 0
            totalStake += newItem.stake
            newItem.stake !== 0 && minWin.push(newItem.odds * newItem.stake)
            maxWin += newItem.odds * parseFloat(newItem.stake)
            return newItem
          })
          this.coupon.selections = newSelections
          this.coupon.totalStake = totalStake
          this.coupon.minWin = Math.min(minWin)
          // console.log(minWin.min());
        }
      }

      if (stake !== '') {
        if (this.coupon.betslip_type === 'Single' || this.coupon.bet_type === 'Single') {
          let maxWin = 0
          let minWin = []
          const maxOdds = Math.max(...this.coupon.selections.map((s) => s.odds))
          const minOdds = Math.min(...this.coupon.selections.map((s) => s.odds))

          if (id === 'all') {
            const stakePerBet = parseFloat(stake)
            this.coupon.stake = stake // set new total stake
            this.coupon.totalStake = stake * this.coupon.selections.length

            for (let index = 0; index < selections.length; index++) {
              const selection = selections[index]
              selection.stake = stakePerBet
              selections[index] = selection

              maxWin += selection.odds * stakePerBet
              minWin.push(selection.odds * stakePerBet)
            }
            this.coupon.maxWin = maxWin
            this.coupon.minWin = Math.min(...minWin)
          } else if (id === 'single') {
            this.coupon.stake = stake
            this.coupon.totalStake = stake
            this.coupon.maxWin = selections[0].odds * stake
            // this.coupon.minWin = 0;
          } else {
            const index = this.coupon.selections.findIndex((i) => i.selectionId === id)
            if (index !== -1) {
              this.coupon.stake = ''
              maxWin = 0
              minWin = []
              let totalStake = 0
              selections[index].stake = parseFloat(stake)

              for (let index = 0; index < selections.length; index++) {
                const selection = selections[index]
                if (selection.stake > 0) {
                  maxWin += selection.odds * parseFloat(selection.stake)
                  totalStake += parseFloat(selection.stake)
                  selections[index] = selection
                  minWin.push(selection.odds * selection.stake)
                }
              }
              this.coupon.maxWin = maxWin
              this.coupon.minWin = Math.min(...minWin)
              this.coupon.selections = selections
              this.coupon.totalStake = totalStake
            }
          }

          this.coupon.totalOdds = parseFloat(maxOdds).toFixed(2)
          this.coupon.minOdds = parseFloat(minOdds).toFixed(2)
        } else {
          this.coupon.totalOdds = calculateTotalOdds(this.coupon.selections).toFixed(2)
          this.coupon.totalStake = parseFloat(stake)
          this.coupon.exciseDuty = (coupondata.totalStake * 0) / 100
          // console.log((coupondata.totalStake * 0) / 100, "calc")
          this.coupon.stake = this.coupon.totalStake - coupondata.exciseDuty
          // console.log(original(this.coupon), "the coup")

          //calculate Winnings
          const winnings = calculateWinnings(this.coupon, globalVars, bonusList)
          // console.log(winnings, "win");
          this.coupon.maxWin = winnings.maxWin
          this.coupon.maxBonus = winnings.maxBonus
          this.coupon.wthTax = winnings.wthTax
          this.coupon.grossWin = winnings.grossWin
        }
      }
    },
    setBetType(type) {
      const betslip_type = type
      this.coupon.betslip_type = betslip_type
      this.coupon.bet_type = betslip_type
      const selections = this.coupon.selections ? [...this.coupon.selections] : []
      this.coupon.stake = 0
      this.coupon.totalStake = 0
      this.coupon.minStake = 0
      this.coupon.minWin = 0
      this.coupon.minBonus = 0
      this.coupon.maxWin = 0
      this.coupon.maxBonus = 0
      const newSelections = selections.map((item) => {
        const newItem = Object.assign({}, item)
        newItem.stake = ''
        return newItem
      })
      this.coupon.selections = newSelections
    },
    async placeBet(e, type) {
      let ele = e.target
      const coupondata = { ...this.coupon }
      const usersStore = useUsersStore()
      coupondata.userId = usersStore.currentUser ? usersStore.currentUser.id : 0
      coupondata.username = usersStore.currentUser ? usersStore.currentUser.username : null
      coupondata.clientId = import.meta.env.VITE_CLIENT_ID

      if (type === 'bet' && coupondata.stake === 0) {
        alert('error. stake muxt be greater than 0')
        return
      }
      if (type === 'bet') {
        this.isBetslipLoading = true
        coupondata.isBooking = 0
        const res = await placeBet2(coupondata)
        this.isBetslipLoading = false
        return res
      } else if (type == 'book') {
        try {
          coupondata.isBooking = 1
          const res = await placeBet2(coupondata)
          this.isBetslipLoading = false
          return res
        } catch (error) {
          throw Error(error)
        }
      }
    },
    clearBetslip() {
      const coupon = {
        acceptChanges: false,
        selections: [],
        combos: [],
        totalOdds: 1,
        maxBonus: 0,
        minBonus: 0,
        grossWin: 0,
        maxWin: 0,
        minWin: 0,
        stake: 100,
        totalStake: 100,
        minOdds: 1,
        maxOdds: 1,
        wthTax: 0,
        exciseDuty: 0,
        useBonus: false,
        source: 'mobile'
      }

      this.coupon = coupon
    }
  },
  persist: {
    storage: localStorage
  }
})

