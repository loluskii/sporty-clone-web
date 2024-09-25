<template>
  <div class="es-dialog x-dialog place-bet">
    <div class="es-dialog-body x-dialog-body">
      <div class="es-dialog-body m-dialog-body">
        <div class="es-dialog-main m-dialog-main" style="height: auto">
          <div class="m-dialog-wrapper m-dialog-wrapper-fix">
            <div class="m-pop-header">
              <img
                data-action="close"
                data-ret="close"
                src="//s.sporty.net/global/main/modules/main/desktop/common/components/betslips/image/ic-close.32f0d4d9dd.svg"
                class="close-icon"
              />
            </div>
            <div class="m-pop-main">
              <div class="m-share-wrapper">
                <div class="booking-code-share">
                  <div
                    class="booking-code-title"
                    data-cms-key="booking_code"
                    data-cms-page="common_functions"
                  >
                    Booking Code
                  </div>
                  <div class="booking-code-share-code">
                    <input type="text" id="copyShareCode" class="invisible-element" />
                    {{ response.betslipId }}
                    <img
                      @click="copyBookingCode"
                      id="content-copy"
                      src="//s.sporty.net/global/main/modules/main/desktop/common/components/betslips/image/ic-content-copy.8a86da1097.svg"
                    />
                  </div>

                  <div class="links-container">
                    <div @click="redirectToPlatform('x')">
                      <div class="link-icon">
                        <img src="@/assets/images/x-copy.svg" />
                      </div>
                      <div data-cms-key="x" data-cms-page="common_functions">X</div>
                    </div>
                    <div>
                      <div @click="redirectToPlatform('facebook')" class="link-icon">
                        <img src="@/assets/images/fb-copy.svg" />
                      </div>
                      <div>Facebook</div>
                    </div>
                    <div>
                      <div @click="redirectToPlatform('whatsapp')" class="link-icon">
                        <img src="@/assets/images/wa-copy.svg" />
                      </div>
                      <div>Whatsapp</div>
                    </div>
                    <div style="margin-left: -2px" @click="copyToClipboard('')">
                      <div class="link-icon">
                        <img
                          src="//s.sporty.net/global/main/modules/main/desktop/common/components/betslips/image/ig-copy-link.93a6ae7f8e.svg"
                        />
                      </div>
                      <div data-cms-key="copy_link" data-cms-page="common_functions">Copy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  response: Object
})

function copyBookingCode() {
  const textToCopy = props.response.betslipId
  const textarea = document.createElement('textarea')
  textarea.value = textToCopy
  document.body.appendChild(textarea)
  textarea.select()

  try {
    navigator.clipboard.writeText(textToCopy)
    alert('Copied!')
  } catch (err) {
    console.error('Unable to copy to clipboard', err)
  }
}

function copyToClipboard() {
  const textToCopy = `${window.location.origin}?shareCode=${props.response.betslipId}`
  const textarea = document.createElement('textarea')
  textarea.value = textToCopy
  document.body.appendChild(textarea)
  textarea.select()

  try {
    navigator.clipboard.writeText(textToCopy)
  } catch (err) {
    console.error('Unable to copy to clipboard', err)
  }
}

function redirectToPlatform(platform) {
  let message = `Hey I just placed on BetAlmighty! ${window.location.origin}?shareCode=${props.response.betslipId}`
  switch (platform) {
    case 'whatsapp':
      return window.open('https://wa.me/?text=' + encodeURIComponent(message))
    case 'x':
      return window.open('https://x.com/intent/tweet?text=' + encodeURIComponent(message))
    case 'facebook':
      return window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(message)
      )
  }
}
</script>

<style scoped>
.es-dialog.x-dialog.place-bet {
  margin-left: auto;
}
.m-dialog-suc .m-share-wrap .af-button:hover {
  background: #ffffff !important;
  border: 1px solid #32ce62;
}
.m-dialog-suc .m-share-wrap .af-button:active {
  background: #ffffff !important;
  border: 1px solid #096b27;
}
.m-dialog-suc .m-btn-text {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 16px;
  text-align: center;
}
.m-dialog-suc .m-btn-text > a {
  color: #0d9737;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  line-height: 16px;
  text-decoration: none;
}
.m-dialog-suc .m-btn-text > a:hover {
  color: #32ce62;
}
.m-dialog-suc .m-btn-text > a:active {
  color: #33ea6a;
}
.m-dialog-suc .m-btn-text .m-icon-more {
  display: inline-block;
  height: 16px;
  margin-left: 10px;
  vertical-align: middle;
}
.m-dialog-suc .m-btn-text .m-icon-more::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-dialog-suc .m-btn-text .m-icon-more:before {
  font-size: 12px;
  line-height: 16px;
}
.m-dialog-wrapper-fix {
  width: 486px;
}
.m-dialog-wrapper-fix .m-pop-header > span {
  font-weight: bold;
  line-height: 19px;
  padding: 0;
}
.m-dialog-wrapper-fix .m-pop-header .m-icon-close:before {
  font-size: 10px;
  line-height: 20px;
}
.m-dialog-wrapper-fix .m-pop-main {
  padding-bottom: 36px;
}
.m-dialog-wrapper-fix .m-pop-main > p {
  font-size: 12px;
  line-height: 16px;
  padding: 0 60px;
}
.es-dialog.desktop .es-dialog-footer {
  margin-bottom: 14px;
  padding: 0 16px;
}
.es-dialog.desktop .es-dialog-footer .es-dialog-btn {
  background: #0d9737;
  color: #ffffff;
  font-size: 14px;
  padding: 6px 16px;
}
.es-dialog.desktop .es-dialog-footer .es-dialog-btn:hover {
  background: #0d9737;
  color: #ffffff;
}
.m-print-bar {
  z-index: -9999;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
