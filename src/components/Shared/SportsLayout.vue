<template>
  <BaseLayout>
    <!-- Main Content -->
    <div class="x-table-row">
      <div class="x-table-cell x-main-left" style="width: 150px; min-width: 150px">
        <div id="sportList">
          <div class="titles">
            <div
              class="sportList-title"
              @click="
                $router.push({
                  name: 'fixtures-by-sport',
                  params: { sport: activeSport.sportName },
                  query: { period: 'today' },
                })
              "
            >
              Today Games
            </div>
            <div
              class="sportList-subtitle"
              @click="
                $router.push({
                  name: 'upcoming-fixtures-by-sport',
                  params: { sport: activeSport.sportName },
                })
              "
            >
              Upcoming Games
            </div>
          </div>
          <div class="game-list">
            <div class="sport-title" data-cms-key="a_z">A-Z</div>
            <ul class="sport-list">
              <template v-for="(country, index) in categories" :key="index">
                <li class="category-list-item" v-if="country.categoryName">
                  <div class="category-item">
                    <div
                      style="
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: 100px;
                        display: inline-flex;
                        align-items: center;
                      "
                    >
                      <input
                        type="checkbox"
                        @change="selectCategory(country.categoryID)"
                        :checked="isCategorySelected(country.categoryID)"
                        name=""
                        id=""
                        style="margin-right: 5px; accent-color: var(--brand-secondary)"
                      />
                      <span>{{ country.categoryName }}</span>
                    </div>
                    <span class="event-size">{{ country.total }}</span>
                  </div>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
      <div class="x-table-cell x-main-mid" style="width: 615px; min-width: 615px">
        <!-- <div class="crumb-wrap">
          <div class="crumb"><span>Football</span><span></span></div>
          <div class="btns"><span class="refresh"></span></div>
        </div> -->
        <slot name="fixtures-list"></slot>
      </div>
      <div class="x-table-cell x-main-right" style="width: 235px; min-width: 235px">
        <div>
          <aside class="s-right">
            <div v-if="!currentUser" class="x-item">
              <div class="x-instant-reg x-instant-white">
                <div class="x-title">
                  <span>Instant Registration</span>
                </div>
                <p class="x-pro-tips">Make a Deposit and Start Betting!</p>
                <div
                  tabindex="6"
                  class="x-input-wrapper x-input-group x-input-group--prepend"
                >
                  <div class="x-input-prepend"><span>+234</span></div>
                  <span class="x-input-com">
                    <input
                      type="input"
                      name=""
                      placeholder="Mobile Number"
                      onpaste="return true"
                      class="x-input fs-exclude"
                  /></span>
                </div>
                <div class="x-btn-wrapper">
                  <button class="af-button af-button--primary">
                    <span><span>Register</span></span>
                  </button>
                </div>
              </div>
            </div>
            <!-- Betslip -->
            <BetContainer></BetContainer>
          </aside>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>
<script setup>
import BaseLayout from "@/components/Shared/BaseLayout.vue";
import BetContainer from "./BetContainer.vue";
import { useRoute, useRouter } from "vue-router";
import { useUtilsStore, useUsersStore } from "@/stores";
import { computed, onMounted, ref, watch } from "vue";
import { getCategoriesBySport, extractIdsFromURL } from "@/helpers";
import LoadingSpinner from "../Loaders/LoadingSpinner.vue";
import emitter from "@/plugins/emitter";

const utilsStore = useUtilsStore();
const { currentUser } = useUsersStore();
const categories = ref([]);
const router = useRouter();
const route = useRoute();

const activeSport = computed(() => {
  return utilsStore.activeSport;
});

const activeCategories = computed(() => {
  return utilsStore.activeCategories;
});
async function getCategories() {
  const res = await getCategoriesBySport(activeSport.value.sportID);
  categories.value = res.sports;
}

function selectCategory(id) {
  let categories = `sr:category:${id}`;
  let currentCategories = route.params.categories || "";
  let categoryArray = currentCategories ? currentCategories.split("_") : [];
  let categoryExists = categoryArray.includes(categories);
  if (categoryExists) {
    categoryArray = categoryArray.filter((category) => category !== categories);
  } else {
    categoryArray.push(categories);
  }
  if (categoryArray.length === 0) {
    return router.push({
      name: "fixtures-by-sport",
      params: { sport: activeSport.value.sportName },
    });
  }

  const updatedCategories = categoryArray.join("_");
  return router.push({
    name: "fixtures-by-categories",
    params: { categories: updatedCategories },
  });
}

const isCategorySelected = (category) => {
  if (!route.params.categories) {
    return false;
  }
  const categoriesArray = route.params.categories.split("_");
  const categoryToCheck = `sr:category:${category}`;
  return categoriesArray.includes(categoryToCheck);
};

watch(
  () => route.params.sport,
  async () => {
    await getCategories();
  },
  { immediate: true } // Trigger the watch callback immediately on component mount
);

onMounted(async () => {
  await getCategories();
});
</script>

<style scoped>
.x-main {
  background: #eaecef;
}
.x-main .x-eventDetail {
  background: #fff;
}
.x-main-bottom {
  padding: 15px 0;
}
.x-main-bottom > .x-table-row {
  -webkit-box-align: normal !important;
  -webkit-align-items: normal !important;
  -ms-flex-align: normal !important;
  align-items: normal !important;
}
.x-main-bottom .x-main-mid {
  padding: 0 20px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.crumb-wrap .crumb {
  color: #2564fa;
  float: left;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  margin-bottom: 19px;
  margin-top: 3px;
}
.crumb-wrap .crumb > span {
  cursor: pointer;
  display: inline-block;
}
.crumb-wrap .crumb > span:after {
  color: #9ca0ab;
  content: "/";
  display: inline-block;
  padding: 0 3px;
}
.crumb-wrap .crumb > span:last-child {
  color: #353a45;
  cursor: normal;
}
.crumb-wrap .crumb > span:last-child:after {
  content: " ";
}
.crumb-wrap .btns {
  float: right;
}
.crumb-wrap .btns .printer {
  cursor: pointer;
}
.crumb-wrap .btns .printer::before {
  content: "\e77b";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.crumb-wrap .btns .printer::before {
  display: inline-block;
  padding-right: 8px;
}
.crumb-wrap .btns .refresh {
  cursor: pointer;
}
.crumb-wrap .btns .refresh::before {
  content: "\e645";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.crumb-wrap .btns .refresh::before {
  display: inline-block;
  padding-right: 8px;
}
.crumb-wrap:after {
  clear: both;
  content: " ";
  display: block;
  height: 0;
  visibility: hidden;
}

/* Sports List Styles */
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
/* siderBar spread */
#sportList {
  position: relative;
  width: 150px;
  color: #353a45;
  font-size: 12px;
}
#sportList > div {
  margin-top: 10px;
  border: 1px solid #b4b4b4;
  -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.11);
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.11);
}
#sportList .titles {
  margin-top: 0px;
  background: #fff;
}
#sportList .titles .sportList-title,
#sportList .titles .sportList-subtitle:not(:last-of-type) {
  border-bottom: 1px solid #b4b4b4;
}
#sportList .titles .sportList-title,
#sportList .titles .sportList-subtitle {
  cursor: pointer;
  line-height: 16px;
  font-size: 12px;
  padding: 14px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-shadow: 0 1 2 0 #000000;
  box-shadow: 0 1 2 0 #000000;
}
#sportList .titles .sportList-title:after,
#sportList .titles .sportList-subtitle:after {
  content: "\e608";
  font-family: "iconfont";
  display: block;
  float: right;
  color: #dcdee5;
}
#sportList .time-wrap {
  min-height: 75px;
  padding: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #fff;
  cursor: pointer;
}
#sportList .time-wrap .time-title {
  font-weight: 700;
  line-height: 1;
  padding-bottom: 7px;
}
#sportList .game-list {
  padding: 6px 0px;
  margin-top: 10px;
  background: #fff;
}
#sportList .game-list .sport-title {
  font-weight: 700;
  line-height: 1;
  padding: 12px 10px 6px;
}
#sportList .game-list .popular-list .category-list-item,
#sportList .game-list .sport-list .category-list-item {
  cursor: pointer;
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 24px;
  line-height: 24px;
  border: 1px solid rgba(255, 255, 255, 0);
}
#sportList .game-list .popular-list .category-list-item .category-item,
#sportList .game-list .sport-list .category-list-item .category-item {
  height: 22px;
  line-height: 22px;
  white-space: nowrap;
  padding: 0 10px;
}
#sportList .game-list .popular-list .category-list-item .category-item > span,
#sportList .game-list .sport-list .category-list-item .category-item > span {
  display: block;
  float: left;
}
#sportList .game-list .popular-list .category-list-item .category-item > span:first-child,
#sportList .game-list .sport-list .category-list-item .category-item > span:first-child {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 98px;
}
#sportList .game-list .popular-list .category-list-item .category-item > span.event-size,
#sportList .game-list .sport-list .category-list-item .category-item > span.event-size {
  float: right;
  padding-left: 5px;
}
#sportList .game-list .popular-list .category-list-item.hover,
#sportList .game-list .sport-list .category-list-item.hover {
  border: 1px solid #b4b4b4;
  -webkit-box-shadow: -1px 1px 2px 0px rgba(0, 0, 0, 0.3);
  box-shadow: -1px 1px 2px 0px rgba(0, 0, 0, 0.3);
  border-left-color: #ffffff;
}
.x-instant-reg .x-title {
  color: unset;
}
</style>
