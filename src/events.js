export default {
  methods: {
    onClick(e) {
      this.$emit('click', this.options.index2Data.apply(this, this.xy2Index(e.offsetX, e.offsetY)))
    },
    xy2Index(px, py) {
      let {
        x,
        y,
        options: {
          lockRows,
          lockColumns
        },
        offset: [ox, oy],
        ratio
      } = this
      let row = 0
      let col = 0
      let lockRowsFlag = false
      let lockColumnsFlag = false
      while (lockRows--) {
        if (py < y[lockRows + 1] / ratio) {
          lockRowsFlag = true
          row = lockRows
        } else {
          break
        }
      }
      while (lockColumns--) {
        if (px < x[lockColumns + 1] / ratio) {
          lockColumnsFlag = true
          row = lockColumns
        } else {
          break
        }
      }
      if (!lockRowsFlag) {
        for (let i = 0; i < y.length; i++) {
          if (py > (y[i] + oy) / ratio) {
            row = i
          } else {
            break
          }
        }
      }
      if (!lockColumnsFlag) {
        for (let i = 0; i < x.length; i++) {
          if (px > (x[i] + ox) / ratio) {
            col = i
          } else {
            break
          }
        }
      }
      return [row, col]
    }
  }
}
