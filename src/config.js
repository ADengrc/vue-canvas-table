export default {
  source: {
    columns: ['暂无数据'],
    datas: []
  },
  width: 0, // canvas宽度
  height: 0, // canvas高度
  cellMaxWidth: 0, // 默认屏幕1/3
  paddingLR: 22, // 左右内间距
  paddingTB: 22, // 上下内间距
  lineHeight: 8,
  fontSize: 16,
  fontColor: '#333333',
  fontFamily: 'Microsoft YaHei',
  sliderColor: 'rgba(0, 0, 0,.3)',
  lineColor: '#ededed',
  lockRows: 0, // 锁定行
  lockColumns: 0, // 锁定列
  to2DArr(source) { // 把传入的数据源转换成二维数组
    let arr = []
    arr.push(source.columns)
    source.datas.forEach(row => {
      arr.push(row.columns)
    })
    return arr
  },
  index2Data(row, col) { // 坐标转成对应数据
    if (row === 0) {
      return {
        row,
        col,
        rowData: this.source.columns,
        colData: this.source.columns[col]
      }
    } else {
      return {
        row,
        col,
        rowData: this.source.datas[row - 1],
        colData: this.source.datas[row - 1].columns[col]
      }
    }
  },
  setCellOpts(row, col, data) { // 单元格规则
    if (row === 0) {
      return {
        color: '#F8F8F8'
      }
    } else {
      if (data.rowData.clickAble) {
        return {
          arrow: true,
          color: '#FFFFFF'
        }
      } else {
        return {
          color: '#F8F8F8'
        }
      }
    }
  }
}
