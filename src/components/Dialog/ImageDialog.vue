<template>
  <div class="es-dialog x-dialog">
    <div class="es-dialog-body x-dialog-body">
      <div class="es-dialog-body m-dialog-body">
        <div class="es-dialog-main m-dialog-main" style="height: auto">
          <div class="m-dialog-wrapper" style="width: 500px !important; background-color: transparent !important;">
            <div class="m-pop-header">
              <span></span>
              <img
                data-action="close"
                @click="emitter.emit('hideDialog')"
                data-ret="close"
                src="//s.sporty.net/global/main/modules/main/desktop/common/components/betslips/image/ic-close.32f0d4d9dd.svg"
                class="close-icon"
              />
            </div>
            <div class="m-pop-main">
              <div>
                    <img :src="data.image" style="height: 100%; width: 100%;" @click="nextAction"/>
                </div>

                <div class="popup-footer">
                    <span @click="$emit('hide-dialogue')" class="close"></span>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div class="m-dialog-footer es-dialog-footer">
        <a data-action="btn" data-ret="1" href="javascript:void(0);" class="es-dialog-btn"
          ><span>*</span></a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUtilsStore } from '@/stores'
import emitter from '@/plugins/emitter'
import { stringIsLink } from '@/helpers'
const utilsStore = useUtilsStore()
const props = defineProps({
  data: Object
})

function nextAction() {
    utilsStore.popupDialogShown = true
    if (props.data.link && stringIsLink(props.data.link)) {
        return window.location.href = props.data.link
    }
}
</script>
