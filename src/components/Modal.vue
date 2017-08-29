<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}">
          <div class="md-modal-inner">
            <div class="md-top">
              <div class="md-title"></div>
              <button class="md-close" @click="closeModal()">Close</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                <div class="error-wrap">
                  <!-- 错误信息 -->
                  <slot name='message'></slot>  
                </div>
              </div>
              <div class="btn-wrap">
                <slot name="btnGroup"></slot>
              </div>
            </div>
          </div>
 </div>
<div class="md-overlay" v-if="mdShow" @click="closeModal()"></div>
  </div>
</template>

<script>
export default {
  props: ['mdShow'],
  data () {
    return {
      loginModalFlag: true,
      myShow: false
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>

</style>
