export default {
  data() {
    return {
      offset: [0, 0],
      V: {
        size: 0,
        y: 0,
        prevY: 0,
        startY: 0,
        move: false,
        show: false
      },
      H: {
        size: 0,
        x: 0,
        prevX: 0,
        startX: 0,
        move: false,
        show: false
      },
      prevTime: 0,
      timer: null
    }
  },
  methods: {
    initScroll() {
      const {
        x,
        y,
        height,
        width
      } = this
      const VRatio = height / y[y.length - 1]
      const HRatio = width / x[x.length - 1]
      VRatio >= 1 ? this.V.size = 0 : this.V.size = height * VRatio
      HRatio >= 1 ? this.H.size = 0 : this.H.size = width * HRatio
      this.V.y = 0
      this.H.x = 0
      this.V.ratio = VRatio
      this.H.ratio = HRatio
      this.offset = [0, 0]
    },
    onWheel(e) {
      this.V.show = true
      this.scrollY(e.deltaY, e)
      if (this.timer) {
        this.prevTime = Date.now()
      } else {
        this.timer = setInterval(() => {
          if (this.prevTime != 0 && Date.now() - this.prevTime > 1000) {
            this.V.show = false
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    onStart(e, type) {
      const {
        screenX,
        screenY
      } = e.touches ? e.touches[0] : e
      if (type === 'touch') {
        this.H.prevX = screenX
        this.H.startX = screenX
        this.V.prevY = screenY
        this.V.startY = screenY
        return
      }
      if (type === 'V') {
        this.V.prevY = screenY
        this.V.move = true
        this.V.show = true
      } else {
        this.H.prevX = screenX
        this.H.move = true
        this.H.show = true
      }
    },
    onEnd() {
      this.V.move = false
      this.H.move = false
      setTimeout(() => {
        this.V.show = false
        this.H.show = false
      }, 1000)
    },
    onDrag(e, type) {
      const {
        V,
        H
      } = this
      const {
        screenX,
        screenY
      } = e.touches ? e.touches[0] : e
      if (type === 'touch') {
        if (Math.abs(screenY - V.startY) > Math.abs(screenX - H.startX)) {
          this.scrollY(-(screenY - V.prevY) / this.V.ratio, e)
          this.V.prevY = screenY
          this.V.show = true
        } else {
          this.scrollX(-(screenX - H.prevX) / this.H.ratio, e)
          this.H.prevX = screenX
          this.H.show = true
        }
        return
      }
      if (V.move) {
        this.scrollY((screenY - V.prevY) / this.V.ratio)
        this.V.prevY = screenY
      } else if (H.move) {
        this.scrollX((screenX - H.prevX) / this.H.ratio)
        this.H.prevX = screenX
      }
    },
    scrollY(val, e) {
      if (!this.V.size) return
      val *= this.V.ratio
      const h = this.height - this.V.size
      const mh = this.V.y + val
      if (mh > 0 && mh < h) {
        e && e.preventDefault()
        this.V.y += val
      } else if (mh <= 0) {
        this.V.y = 0
      } else {
        this.V.y = h
      }
      this.offset[1] = -this.V.y / this.V.ratio
      requestAnimationFrame(this.painted)
    },
    setBarVisible(e, type, val) {
      if (type) {
        this.V.show = val
      } else {
        this.H.show = val
      }
    },
    scrollX(val, e) {
      if (!this.H.size) return
      val *= this.H.ratio
      const w = this.width - this.H.size
      const mw = this.H.x + val
      if (mw > 0 && mw < w) {
        e && e.preventDefault()
        this.H.x += val
      } else if (mw <= 0) {
        this.H.x = 0
      } else {
        this.H.x = w
      }
      this.offset[0] = -this.H.x / this.H.ratio
      requestAnimationFrame(this.painted)
    }
  }
}
