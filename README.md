# vue-canvas-table

> 使用Canvas实现的表格组件，数据量大的情况下与使用标签实现的表格控件相比速度会更快


# 安装

``` bash
npm i vue-canvas-table -S
```

# 使用

``` html
<template>
    ...
        <VueCanvasTable :config="options" @click="onClcik" />
    ...
</template>
<script>
import Vue from 'vue'
import VueCanvasTable from 'vue-canvas-table'
export default{
    componets:{
        VueCanvasTable
    },
    data(){
        return {
            options:{
                ...
            }
        }
    },
    methods:{
        onClick(data){
            ...
        }
    }
}
</script>
```

# 示例

``` bash
npm install
npm run dev
```

# 选项

``` js
{
  source: { // 数据源
    columns: ['暂无数据'],
    datas: []
  },
  width: 0, // canvas宽度
  height: 0, // canvas高度
  cellMaxWidth: 0, // 最大单元格宽度，默认屏幕1/3
  paddingLR: 22, // 左右内间距
  paddingTB: 22, // 上下内间距
  lineHeight: 8,    // 多行文字行高
  fontSize: 16, // 字体大小
  fontColor: '#333333', // 字体颜色
  fontFamily: 'Microsoft YaHei',    // 字体
  sliderColor: 'rgba(0, 0, 0,.3)',  // 滑块颜色
  lineColor: '#ededed', // 表格分割线颜色
  lockRows: 1, // 锁定1行
  lockColumns: 1, // 锁定1列
  to2DArr(source) { // 把source转换成二维数组
    let arr = []
    arr.push(source.columns)
    source.datas.forEach(row => {
      arr.push(row.columns)
    })
    return arr
  },
  index2Data(row, col) { // 行列索引转换成与source对应的数据
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
  setCellOpts(row, col, data) { // 设置单元格参数
    if (row === 0) {
      return {
        color: '#F8F8F8'
      }
    } else {
      if (data.rowData.clickAble === false) {
        return {
          color: '#F8F8F8'
        }
      } else {
        return {
          arrow: true,
          color: '#FFFFFF'
        }
      }
    }
  }
}
```