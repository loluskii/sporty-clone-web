<template>
  <div class="es-dialog x-dialog">
    <div class="es-dialog-body x-dialog-body">
      <div class="es-dialog-body m-dialog-body">
        <div class="es-dialog-main m-dialog-main" style="height: auto">
          <div class="m-dialog-wrapper">
            <div class="m-pop-header">
              <span></span>
              <img
                data-action="close"
                data-ret="close"
                src="//s.sporty.net/global/main/modules/main/desktop/common/components/betslips/image/ic-close.32f0d4d9dd.svg"
                class="close-icon"
              />
            </div>
            <div class="m-pop-main">
              <p>{{ props.data.data.message || props.data.data }}</p>
              <div class="m-btn-wrapper">
                <button class="af-button af-button--primary" @click="nextAction">
                  <span><span data-cms-key="ok">OK</span></span>
                </button>
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
import emitter from '@/plugins/emitter'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  data: Object
})

const nextAction = () => {
  if (props.data.nextRoute) {
    emitter.emit('hideDialog')
    return router.push(props.nextRoute)
  } else {
    emitter.emit('hideDialog')
  }
}
</script>
