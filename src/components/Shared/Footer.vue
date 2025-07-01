<template>
  <div class="c-footer">
    <div class="x-footer-top">
      <ul class="x-content d-flex">
        <li class="x-col-wrapper brand-col">
          <div class="d-flex flex-direction-column">
            <div class="d-flex">
              <img src="/logo.png" alt="{{ utilsStore.brandName }}" class="logo" />
            </div>
          </div>
        </li>
        <li class="x-col-wrapper x-m-r">
          <h6 class="x-col-title">{{ utilsStore.brandName }} Nigeria</h6>
          <ul class="x-col-content">
            <li class="x-icon-more">
              <a href="/CMS/AboutUs"
                ><span data-cms-key="about_us" data-cms-page="common_helps">About Us</span></a
              >
            </li>
            <li class="x-icon-more">
              <a href="/CMS/TandC"
                ><span data-cms-key="t_and_c" data-cms-page="common_helps"
                  >Terms &amp; Conditions</span
                ></a
              >
            </li>
            <li class="x-icon-more">
              <a href="/CMS/BettingRules"
                ><span data-cms-key="privacy" data-cms-page="common_helps">Betting Rules</span></a
              >
            </li>
            <li class="x-icon-more">
              <a href="/CMS/ResponsibleGambling"
                ><span data-cms-key="privacy" data-cms-page="common_helps"
                  >Responsible Gambling</span
                ></a
              >
            </li>
            <li class="x-icon-more">
              <a href="/CMS/Contact"
                ><span data-cms-key="privacy" data-cms-page="common_helps">Contact Us</span></a
              >
            </li>
          </ul>
        </li>
        <li class="x-col-wrapper x-m-r">
          <h6 class="x-col-title" data-cms-key="how_to_play" data-cms-page="common_helps">
            Quick Links
          </h6>
          <ul class="x-col-content">
            <li class="x-icon-more">
              <a href="/CMS/FAQS"
                ><span data-cms-key="faq" data-cms-page="common_helps">FAQ</span></a
              >
            </li>
            <li class="x-icon-more">
              <a href="/"><span data-cms-key="sports" data-cms-page="common_helps">Sports</span></a>
            </li>
            <li class="x-icon-more">
              <a href="/Sport/Live"><span data-cms-key="live_betting">Live Betting</span></a>
            </li>
            <li class="x-icon-more">
              <a href="/Casino"><span data-cms-key="games">Games</span></a>
            </li>
          </ul>
        </li>
        <li class="x-col-wrapper">
          <h6 class="x-col-title" data-cms-key="connect_with_us">Connect with Us</h6>
          <address class="x-col-content x-contact">
            <div data-cms-key="tell_phone_number">Telephone: 2012278124</div>
            <div data-cms-key="mail_to">Email: customerservice@streetbet.ng</div>
            <div class="d-flex mt-10p">
              <address class="mr-10p">
                <a href="https://www.facebook.com/Streetbetng" target="_blank"
                  ><i class="x-icon x-icon-fb"></i
                ></a>
              </address>
              <address class="mr-10p">
                <a href="https://twitter.com/streetbet_ng" target="_blank"
                  ><svg
                    viewBox="0 0 29 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="black"
                    height="24px"
                    width="24px"
                    class="x-icon-twitter svg-icon-base"
                  >
                    <circle cx="14.5" cy="14.006" r="14" fill="currentColor"></circle>
                    <path
                      d="M15.369 12.93l4.922-5.924h-1.166L14.85 12.15l-3.414-5.144H7.5l5.162 7.78L7.5 20.998h1.166l4.514-5.433 3.605 5.433h3.937L15.37 12.93zm-1.598 1.924l-.523-.775-4.161-6.164h1.791l3.359 4.975.523.774 4.365 6.467h-1.791l-3.563-5.277z"
                      fill="#fff"
                    ></path>
                  </svg>
                </a>
              </address>
              <address class="mr-10p">
                <a href="https://www.instagram.com/streetbet.ng" target="_blank"
                  ><i class="x-icon x-icon-ins"></i
                ></a>
              </address>
            </div>
          </address>
        </li>
      </ul>
    </div>
    <div class="x-footer-mid">
      <ul class="x-content d-flex">
        <li class="x-col-wrapper flex-1 d-flex" style="display: inline-flex;align-items: center;">
          <div class="x-left x-forum">
            <div class="x-image-wrapper" style="height: auto">
              <img
                src="//s.sporty.net/global/main/modules/main/desktop/common/core/image/forum@2x.c05a82e567.svg"
                alt="18+"
              />
            </div>
          </div>
          <p class="x-right" data-cms-key="18_age_tip">
            Age 18 and above only to register or play at {{ utilsStore.brandName }}. Play
            Responsibly. Betting is addictive and can be psychologically harmful.
          </p>
        </li>
      </ul>
    </div>
    <div class="x-footer-mid">
      <ul class="x-content d-flex">
        <!-- <li style="padding: 20px"></li> -->
        <li class="x-col-wrapper flex-1 d-flex" style="display: inline-flex">
          <div class="x-left x-licence">
            <div class="x-image-wrapper" style="height: auto !important">
              <img
                src="//s.sporty.net/global/main/modules/main/desktop/common/core/image/license@2x.c598257514.svg"
                alt="Licence"
              />
            </div>
          </div>
          <p class="x-right" data-cms-key="licence">
            {{ utilsStore.brandName }} is licensed by the Oyo State
            Gaming Board, according to the License No: OYSGB/SPB/232975 issued by
            the Oyo State Gaming Board.
          </p>
        </li>
      </ul>
    </div>
    <div class="x-footer-bottom">
      <div class="x-content">
        <span class="x-copy" data-cms-key="year_copy_right"
          >© 2025 {{ utilsStore.brandName }}. All rights reserved.</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue'
import { useUtilsStore } from '@/stores'

const utilsStore = useUtilsStore()

defineComponent({
  name: 'footer-component'
})
</script>

<style>
.flex-direction-column {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}
.d-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.d-inline-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.mr-10p {
  margin-right: 10px;
}
.mt-10p {
  margin-top: 10px;
}
.mr-40p {
  margin-right: 40px;
}
.mr-35p {
  margin-right: 35px;
}
.flex-1 {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.text-center {
  text-align: center;
}
.brand-col {
  display: -webkit-inline-box !important;
  display: -webkit-inline-flex !important;
  display: -ms-inline-flexbox !important;
  display: inline-flex !important;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.brand-col .logo {
  margin-right: 8px;
  width: 145px;
}
.brand-col .country-flag {
  width: 100px;
}
.brand-col .partner-logo {
  margin-top: 20px;
  max-width: 280px;
}
.brand-col .country-paybill {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  text-align: center;
}
.brand-col .country-paybill .m-row-top {
  border-bottom: 1px dotted var(--brand-secondary);
}
</style>
