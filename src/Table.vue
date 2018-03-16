<template>
  <div class="container" :style="styles" @mousemove="onDrag" @mouseup="onEnd">
    <canvas ref="canvas" :style="styles" :width="width" :height="height" @wheel="onWheel" @touchstart="onStart($event,'touch')"
      @touchmove="onDrag($event,'touch')" @touchend="onEnd" @click="onClick($event)"></canvas>
    <div class="V" :style="{height:height/ratio,opacity:V.show?1:0}" @mouseenter="setBarVisible($event,1,1)">
      <div class="slider" @mousedown="onStart($event,'V')" :style="{background:options?options.sliderColor:'#000',height:V.size/ratio+'px',top:V.y/ratio+'px'}"></div>
    </div>
    <div class="H" :style="{width:width/ratio,opacity:H.show?1:0}" @mouseenter="setBarVisible($event,0,1)">
      <div class="slider" @mousedown="onStart($event,'H')" :style="{background:options?options.sliderColor:'#000',width:H.size/ratio+'px',left:H.x/ratio+'px'}"></div>
    </div>
  </div>
</template>
<script>
  import Init from './init'
  import Scroll from './scroll'
  import Paint from './paint'
  import Events from './events'
  export default {
    mixins: [Init, Scroll, Paint, Events],
    mounted() {
      this.init()
    },
    watch: {
      'config.source' (newVal, oldVal) {
        if (newVal === oldVal) {
          return
        }
        this.init()
      }
    }
  }

</script>
<style lang="scss" scoped>
  .container {
    position: relative;
  }

  .V,
  .H {
    position: absolute;
    opacity: 0;
    transition: opacity .3s ease-in-out;
  }

  .V {
    right: 1px;
    top: 1px;
    bottom: 1px;
  }

  .H {
    bottom: 1px;
    left: 1px;
    right: 1px;
  }

  .slider {
    position: relative;
    height: 10px;
    width: 10px;
    border-radius: 5px;
  }

</style>
