import Config from './config'
export default {
  data() {
    return {
      width: 0,
      height: 0,
      ratio: 0,
      ctx: null,
      options: null,
      colWidth: [],
      rowHeight: [],
      x: [],
      y: [],
      cellMap: [],
      source: null,
      TDArr: null // 二维数组 展示用到的数据
    }
  },
  props: {
    config: Object
  },
  methods: {
    init() {
      const ctx = this.ctx = this.$refs.canvas.getContext('2d')
      const devicePixelRatio = window.devicePixelRatio || 1
      const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1
      let options = {}
      for (let i in Config) {
        options[i] = Config[i]
        if (this.config && this.config[i]) {
          options[i] = this.config[i]
        }
      }
      this.options = options
      const ratio = this.ratio = devicePixelRatio / backingStoreRatio
      this.width = (options.width || window.innerWidth) * ratio
      this.height = (options.height || window.innerHeight) * ratio
      this.options.fontSize *= ratio
      this.options.paddingLR *= ratio
      this.options.paddingTB *= ratio
      this.$nextTick(() => {
        this.initCanvas()
      })
    },
    initCanvas() {
      this.resetCanvas()
      this.initTableData()
      this.$nextTick(() => {
        this.resetCanvas()
        this.initScroll()
        this.painted()
      })
    },
    resetCanvas() {
      const {
        ctx,
        options,
        height,
        width
      } = this
      ctx.lineWidth = 1
      ctx.font = `normal ${options.fontSize}px ${options.fontFamily}`
      ctx.textBaseline = 'middle'
      ctx.strokeStyle = options.lineColor
      ctx.textAlign = 'center'
      ctx.save()
    },
    initTableData() {
      this.TDArr = this.options.to2DArr(this.options.source)
      this.source = this.options.source
      const {
        options,
        ctx,
        width,
        height
      } = this


      let columns = [] // 每列的所有列宽
      let rows = [] // 每行的行高
      let colMaxWidth = 0 // 数据最大宽度
      let rowMaxHeight = 0 // 数据最大高度      
      this.cellMap = []
      this.TDArr.forEach((row, i) => {
        let maxHeight = options.fontSize + options.paddingTB
        if (!this.cellMap[i]) {
          this.cellMap[i] = []
        }
        row.forEach((cell, j) => {
          if (!this.cellMap[i][j]) {
            this.cellMap[i][j] = {}
          }
          this.cellMap[i][j] = options.setCellOpts.call(this, i, j, options.index2Data.call(this, i, j))
          if (!columns[j]) {
            columns[j] = []
          }
          // 处理多行
          let w = ctx.measureText(cell).width
          let maxW = (options.cellMaxWidth || Math.ceil(width / 3)) - options.paddingLR
          if (w > maxW) {
            this.cellMap[i][j].lineNum = Math.ceil(w / maxW)
            this.cellMap[i][j].length = Math.ceil(w / this.cellMap[i][j].lineNum / Math.floor(w / cell.length))
            w = maxW
            maxHeight = options.fontSize * this.cellMap[i][j].lineNum + options.paddingTB + ((this.cellMap[i][j].lineNum - 1) * options.lineHeight)
          }

          let cellWidth = Math.floor(w + options.paddingLR)
          columns[j].push(cellWidth)
        })
        rowMaxHeight += maxHeight
        rows[i] = maxHeight
      })
      this.colWidth = columns.map(cols => {
        const v = Math.max.apply(null, cols)
        colMaxWidth += v
        return v
      })

      this.rowHeight = rows
      if (colMaxWidth < width) {
        const avg = width / this.colWidth.length
        this.colWidth = this.colWidth.map(v => avg)
      }
      if (rowMaxHeight < height) {
        this.height = rowMaxHeight
      }
      this.x = []
      this.y = []
      this.colWidth.reduce((total, val, i) => {
        this.x.push(total)
        if (i === this.colWidth.length - 1) {
          this.x.push(total + val)
        }
        return total + val
      }, 0)
      this.rowHeight.reduce((total, val, i) => {
        this.y.push(total)
        if (i === this.rowHeight.length - 1) {
          this.y.push(total + val)
        }
        return total + val
      }, 0)
    }
  },
  computed: {
    styles() {
      return {
        width: `${this.width/this.ratio}px`,
        height: `${this.height/this.ratio}px`
      }
    }
  }
}
