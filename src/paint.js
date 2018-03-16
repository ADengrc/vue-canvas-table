const Arrow = new Image()
Arrow.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAA5UlEQVQokX3QvytFYRgH8M856g538Q9YjWaDjRulKEw3ZVeMyo8V84nBZmWilPs/GJS6BoNEGGSQxaYM76Ou03m99Uzvp6fv8y2qqupiC8voy7wSYzE9jPwHt3EUqIfhHIR1XMTmM7Ry8BtdXGESxyiaIHxhDvdx2H4Owjtm8IJNrOYgPGAWnzjEfA6S+lyM7CcYz0G4xhPa2MvBNi4xGtuXmmAL55gYzFuHQzjFNJ4xJTXw55hCKnoBr1Lxj7+fg/AAK3hDRypeHe5iTSq8g7t68BIb2MFHZLttOFAZofuBbpoQ/ADaQTDapr59bQAAAABJRU5ErkJggg=='
Arrow.width /= 2
Arrow.height /= 2
export default {
  methods: {
    painted() {
      this.clear()
      this.paintMain()
    },
    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height)
    },
    paintMain() {
      let {
        TDArr,
        x,
        y,
        colWidth,
        rowHeight,
        ctx,
        width,
        height,
        options,
        cellMap,
        ratio,
        offset: [ox, oy]
      } = this
      ctx.beginPath()
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, height)
      ctx.lineTo(width, height)
      ctx.lineTo(width, 0)
      ctx.lineTo(0, 0)
      ctx.stroke()
      let row = TDArr.length
      while (row--) {
        const isLockRow = row <= options.lockRows - 1
        const isLockLineRow = row <= options.lockRows
        let col = TDArr[row].length
        const minHeight = y[options.lockRows] || 0
        if (row !== 0) {
          const tmpY = y[row] + 0.5 + (isLockLineRow ? 0 : oy)
          if ((tmpY >= minHeight || isLockLineRow) && tmpY <= height) {
            // 画横线
            ctx.moveTo(0 + 0.5, tmpY)
            ctx.lineTo(width + 0.5, tmpY)
          }
        }
        while (col--) {
          const isLockCol = col <= options.lockColumns - 1
          const isLockLineCol = col <= options.lockColumns
          const minWidth = x[options.lockColumns] || 0
          if (row === 0) {
            const tmpX = x[col] + 0.5 + (isLockLineCol ? 0 : ox)
            if ((tmpX >= minWidth || isLockLineCol) && tmpX <= width) {
              // 画纵线
              ctx.moveTo(tmpX, 0 + 0.5)
              ctx.lineTo(tmpX, height + 0.5)
            }
          }
          const px0 = x[col] + (isLockCol ? 0 : ox)
          const px1 = x[col + 1] + (isLockCol ? 0 : ox)
          const py0 = y[row] + (isLockRow ? 0 : oy)
          const py1 = y[row + 1] + (isLockRow ? 0 : oy)
          if ((px0 >= -(px1 - px0) && px0 <= width && py0 >= -(py1 - py0) && py0 <= height) || (px1 >= minWidth && px1 <= width && py1 >= minHeight && py1 <= height)) {
            ctx.fillStyle = cellMap[row][col].color
            const cw = px1 - px0
            const ch = py1 - py0
            ctx.fillRect(px0, py0, cw, ch)
            ctx.fillStyle = options.fontColor
            if (col === cellMap[row].length - 1 && cellMap[row][col].arrow) {
              const iw = Arrow.width * ratio
              const ih = Arrow.height * ratio
              ctx.drawImage(Arrow, px1 - iw / 2 - options.paddingLR / 2, py1 - ch / 2 - ih / 2, iw, ih)
            }
            const num = cellMap[row][col].lineNum
            let x0 = x[col] + colWidth[col] / 2
            if (num) {
              // 处理多行文本
              let l = cellMap[row][col].length
              let i = 0
              let line = 0
              const odd = num % 2
              let avg = odd ? (num - 1) / 2 : num / 2
              let y0 = y[row] + rowHeight[row] / 2
              y0 -= options.fontSize * avg
              y0 -= odd ? options.lineHeight * avg : -options.lineHeight + options.lineHeight * (avg - 1)
              while (line <= num) {
                if (line !== 0) {
                  y0 += options.lineHeight + options.fontSize
                }
                ctx.fillText(TDArr[row][col].substring(i, i + l), x0 + (isLockCol ? 0 : ox), y0 + (isLockRow ? 0 : oy), colWidth[col])
                i += l
                line++
              }
            } else {
              let y0 = y[row] + rowHeight[row] / 2
              ctx.fillText(TDArr[row][col], x0 + (isLockCol ? 0 : ox), y0 + (isLockRow ? 0 : oy), colWidth[col])
            }
          }
        }
      }
      ctx.stroke()
    }
  }
}
