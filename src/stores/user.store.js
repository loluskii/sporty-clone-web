import { defineStore } from "pinia";

import { getUserDetailsByToken, formatNumber } from "@/helpers";
import { getUserActiveBonus } from "../helpers";
import emitter from "../plugins/emitter";

export const useUsersStore = defineStore({
  id: "users",
  state: () => ({
    currentUser: null,
    activeBonus: null,
    casinoActiveBonus: null,
    error: null,
    isLoadingCurrentUser: false
  }),
  getters: {
    // Helper function to safely access nested properties
    safeGet:
      (state) =>
      (property, defaultValue = 0) => {
        try {
          return state.currentUser && property in state.currentUser
            ? state.currentUser[property]
            : defaultValue;
        } catch (error) {
          console.warn(`Error accessing ${property}:`, error);
          return defaultValue;
        }
      },

    balance: (state) => {
      const balance = state.safeGet("availableBalance");
      return balance
        ? Number(balance).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0.00";
    },
    details: (state) => state.currentUser || null,
    bonus: (state) => state.activeBonus || null,
    sportBonusBalance: (state) => {
      const balance = state.safeGet("sportBonusBalance");
      return balance
        ? Number(balance).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0.00";
    },
    casinoBonusBalance: (state) => {
      const balance = state.safeGet("casinoBonusBalance");
      return balance
        ? Number(balance).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0.00";
    },
    virtualBonusBalance: (state) => {
      const balance = state.safeGet("virtualBonusBalance");
      return balance
        ? Number(balance).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0.00";
    },
    trustBalance: (state) => {
      const balance = state.safeGet("trustBalance");
      return balance
        ? Number(balance).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0.00";
    },

    // Add a getter for error state
    hasError: (state) => Boolean(state.error),
    errorMessage: (state) => state.error,
  },
  actions: {
    async loadCurrentUser() {
      try {
        this.error = null;
        this.isLoadingCurrentUser = true
        const [userResponse, bonusResponse] = await Promise.allSettled([
          getUserDetailsByToken(),
          getUserActiveBonus(),
        ]);
        this.isLoadingCurrentUser = false

        // Handle user details response
        if (userResponse.status === "rejected") {
          throw new Error("Failed to fetch user details");
        }

        // Always validate the response data
        if (!userResponse.value?.data) {
          throw new Error("No user data received");
        }

        this.currentUser = userResponse.value.data;

        // Handle bonus response
        if (bonusResponse.status === "fulfilled" && bonusResponse.value?.data) {
          this.casinoActiveBonus = bonusResponse.value.data;
          emitter.emit("showCasinoDialog", { bonus: this.casinoActiveBonus });
        } else if (bonusResponse.status === "rejected") {
          console.warn("Failed to fetch active bonus:", bonusResponse.reason);
        }

        // Validate required properties
        const requiredProperties = [
          "availableBalance",
          "sportBonusBalance",
          "casinoBonusBalance",
          "virtualBonusBalance",
          "trustBalance",
        ];

        const missingProperties = requiredProperties.filter(
          (prop) => !(prop in this.currentUser),
        );

        if (missingProperties.length > 0) {
          console.warn("Missing user properties:", missingProperties);
          // Don't throw error, just log warning
        }
      } catch (error) {
        console.error("Error loading user:", error);
        this.error = error.message;
        this.currentUser = null;
        this.casinoActiveBonus = null;
      }
    },

    async refreshActiveBonus() {
      if (!this.currentUser) {
        return;
      }
      try {
        const response = await getUserActiveBonus();
        if (response?.data) {
          this.casinoActiveBonus = response.data;
          emitter.emit("showCasinoDialog", { bonus: this.casinoActiveBonus });
        }
      } catch (error) {
        console.warn("Failed to refresh active bonus:", error);
        // Not setting main error state as this is not a critical failure
      }
    },

    setActiveBonus(bonus) {
      try {
        this.activeBonus = bonus;
      } catch (error) {
        console.error("Error setting active bonus:", error);
        this.error = "Failed to set active bonus";
      }
    },

    clearError() {
      this.error = null;
    },
  },
  persist: {
    storage: localStorage,
  },
});
