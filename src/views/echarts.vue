<template>
  <div class="about">
    <div id="myMap"></div>
    <el-button type="primary" size="mini" title="点击返回上一级" class="btn" @click="upside">{{ adName }}</el-button>
  </div>
</template>
<script>
import axios from 'axios'
import { isPointInMultiPolygon } from '@/util/echartTool.js'
let myChartMap = null //地图
let charTimer = null // 点位轮播
export default {
  name: 'about',
  data() {
    return {
      optionMap: {
        tooltip: {
          show: false,
        },
        geo: [
          {
            map: 'china',
            aspectScale: 1,
            zoom: 0.9,
            layoutCenter: ['50%', '50%'],
            layoutSize: '180%',
            show: true,
            roam: false,
            label: {
              show: false,
              color: '#fff',
            },
            itemStyle: {
              areaColor: {
                type: 'linear',
                x: 1200,
                y: 0,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(3,27,78,0.75)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(58,149,253,0.75)',
                  },
                ],
                global: true, // 缺省为 false
              },
              borderColor: '#c0f3fb',
              borderWidth: 0.8,
            },
            emphasis: {
              itemStyle: {
                show: false,
                color: '#fff',
                areaColor: 'rgba(0,254,233,0.6)',
              },
              label: {
                show: true,
                color: '#fff',
              },
            },
          },
          // 重影
          {
            type: 'map',
            map: 'china',
            zlevel: -1,
            aspectScale: 1,
            zoom: 0.9,
            layoutCenter: ['50%', '51%'],
            layoutSize: '180%',
            roam: false,
            silent: true,
            itemStyle: {
              borderWidth: 1,
              borderColor: 'rgba(58,149,253,0.8)',
              shadowColor: 'rgba(172, 122, 255,0.5)',
              shadowOffsetY: 5,
              shadowBlur: 15,
              areaColor: 'rgba(5,21,35,0.1)',
            },
          },
          {
            type: 'map',
            map: 'china',
            zlevel: -2,
            aspectScale: 1,
            zoom: 0.9,
            layoutCenter: ['50%', '52%'],
            layoutSize: '180%',
            roam: false,
            silent: true,
            itemStyle: {
              borderWidth: 1,
              borderColor: 'rgba(58,149,253,0.6)',
              shadowColor: 'rgba(65, 214, 255,0.6)',
              shadowOffsetY: 5,
              shadowBlur: 15,
              areaColor: 'rgba(5,21,35,0.1)',
            },
          },
          {
            type: 'map',
            map: 'china',
            zlevel: -3,
            aspectScale: 1,
            zoom: 0.9,
            layoutCenter: ['50%', '53%'],
            layoutSize: '180%',
            roam: false,
            silent: true,
            itemStyle: {
              borderWidth: 1,
              borderColor: 'rgba(58,149,253,0.4)',
              shadowColor: 'rgba(29, 111, 165,1)',
              shadowOffsetY: 15,
              shadowBlur: 10,
              areaColor: 'rgba(5,21,35,0.1)',
            },
          },
          {
            type: 'map',
            map: 'china',
            zlevel: -4,
            aspectScale: 1,
            zoom: 0.9,
            layoutCenter: ['50%', '54%'],
            layoutSize: '180%',
            roam: false,
            silent: true,
            itemStyle: {
              borderWidth: 5,
              borderColor: 'rgba(5,9,57,0.8)',
              shadowColor: 'rgba(29, 111, 165,0.8)',
              shadowOffsetY: 15,
              shadowBlur: 10,
              areaColor: 'rgba(5,21,35,0.1)',
            },
          },
        ],
        series: [
          {
            type: 'lines', // 飞线图
            zlevel: 2,
            effect: {
              show: true,
              period: 3, //箭头指向速度，值越小速度越快
              trailLength: 0.03, //特效尾迹长度[0,1]值越大，尾迹越长重
              symbol: 'arrow', //箭头图标
              symbolSize: 6, //图标大小
            },
            lineStyle: {
              color: '#EE5652',
              width: 1, //尾迹线条宽度
              opacity: 1, //尾迹线条透明度
              curveness: 0.3, //尾迹线条曲直度
            },
            data: [],
            // tooltip: {
            //   trigger: 'none', // 去除鼠标移到线上的弹框
            // },
            symbol: ['none', 'circle'], //飞线起点终点点位样式
            symbolSize: 10, // 飞线起点终点点位大小
          },
          {
            type: 'effectScatter',
            zlevel: 3,
            coordinateSystem: 'geo',
            emphasis: {
              label: {
                show: true,
                position: 'top',
                color: '#fff',
                formatter: '{b|{b}}',
              },
            },
            label: {
              show: false,
              position: 'top',
              color: '#fff',
            },
            data: [],
            symbol: 'circle',
            symbolSize: [20, 10],
            itemStyle: {
              color: 'orange',
              shadowBlur: 10,
              shadowColor: 'orange',
            },
            effectType: 'ripple',
            showEffectOn: 'render', //emphasis移入显示动画，render一开始显示动画
            rippleEffect: {
              scale: 5,
              brushType: 'stroke',
            },
          },
        ],
      },
      publicUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/',
      level: 0,
      historyData: [],
      adName: '中国',
      alladcode: '',
      resData: [],
    }
  },
  methods: {
    // 南沙诸岛以缩略图展示
    async formatJson(chinaGeoJson) {
      chinaGeoJson.features.forEach((v) => {
        if (v.properties && v.properties.name == '海南省') {
          v.geometry.coordinates = v.geometry.coordinates.slice(0, 1)
        }
      })
      // 过滤掉海南诸岛边界线
      chinaGeoJson.features = chinaGeoJson.features.filter((item) => item.properties.adcode !== '100000_JD')
      return chinaGeoJson
    },
    // 初始化
    async initChart() {
      // 获取地图name对应的adcode行政区划编码
      let geoJson = await this.getGeoJson('all.json')
      this.alladcode = geoJson.data
      let chinaGeoJson = await this.getGeoJson('100000_full.json')
      let formatChinaGeoJson = await this.formatJson(chinaGeoJson.data)
      // 鼠标移入点位的弹窗
      let rich = {
        b: {
          color: '#fff',
          backgroundColor: {
            image: require('../../public/home/point.png'),
          },
          padding: [20, 30],
          fontSize: 14,
          align: 'center',
        },
      }
      this.optionMap.series[1].emphasis.label.rich = rich
      this.optionMap.series[1].label.rich = rich
      this.initEcharts(formatChinaGeoJson, 'china')
    },
    // 格式化点位飞线数据
    filterLines(currentData) {
      let dataLines = []
      let center = [120.537612, 31.276282]
      currentData.forEach((v) => {
        let lonLat = [v.value[0], v.value[1]]
        dataLines.push({
          coords: [lonLat, center],
        })
        // dataLines.push([
        //   {
        //     coord: lonLat, // 起始点
        //     value: 0,
        //   },
        //   {
        //     coord: center, // 中心点
        //   },
        // ])
      })
      return dataLines
    },
    // 点位颜色高亮
    highLightPoint(currentData, index) {
      currentData.forEach((v, key) => {
        let flag = key == index ? 'aqua' : 'orange'
        v.itemStyle = {
          color: flag,
          shadowColor: flag,
        }
        // v.zlevel = key == index ? 10 : 3
      })
      this.optionMap.series[1].label.formatter = (e) => {
        return e.name === currentData[index].name ? `{b|${e.name}}` : ''
      }
    },
    // 格式图表
    formatChart(geoJson, name) {
      // 过滤出当前地图的点位
      let currentData = this.resData.filter((v) => {
        return isPointInMultiPolygon([v.value[0], v.value[1]], geoJson.features)
      })
      this.adName = name == 'china' ? '中国' : name
      this.$echarts.registerMap(name, geoJson)
      this.optionMap.geo.forEach((v) => {
        v.map = name
        v.layoutSize = name == 'china' ? '180%' : '100%'
      })
      this.optionMap.series[0].data = this.filterLines(currentData)
      this.optionMap.series[1].data = currentData
      // 点位颜色高亮
      this.highLightPoint(currentData, 0)
      this.optionMap.series[1].label.show = true
      myChartMap.clear()
      myChartMap.setOption(this.optionMap)
      if (charTimer) {
        clearInterval(charTimer)
        charTimer = null
      }
      // 点位大于2个才循环轮播
      if (currentData.length > 1) {
        let i = 0
        charTimer = setInterval(() => {
          i++
          if (i >= currentData.length) i = 0
          this.highLightPoint(currentData, i)
          myChartMap.setOption(this.optionMap)
        }, 1000 * 3)
      }
    },
    //echarts绘图
    initEcharts(geoJson, name) {
      this.formatChart(geoJson, name)
      myChartMap.hideLoading()
      window.addEventListener('resize', () => {
        myChartMap.resize()
      })
      this.level++
      this.historyData.push({ geoJson, name })
      myChartMap.off('click')
      myChartMap.on('click', (params) => {
        // 点击的是当前地图
        if (params.componentType != 'geo') return
        let clickRegionCode = this.alladcode.filter((areaJson) => areaJson.name === params.name)[0].adcode
        // 没有区县的地级市,东莞,中山,儋州,三沙,嘉峪关
        let adcodeArr = ['460400', '460300', '441900', '442000', '620200']
        let regJson = `${clickRegionCode}_full.json`
        // 区县或者没有区县的地级市
        if (clickRegionCode.toString().slice(-2) != '00' || adcodeArr.includes(clickRegionCode.toString())) {
          regJson = `${clickRegionCode}.json`
        }
        this.getGeoJson(regJson)
          .then((regionGeoJson) => {
            this.initEcharts(regionGeoJson.data, params.name)
          })
          .catch((err) => {
            this.level = 0
            this.historyData = []
            this.initEcharts(require('@/util/china.json'), 'china')
          })
      })
    },
    //获取地图json数据
    async getGeoJson(jsonName) {
      return await axios.get(this.publicUrl + jsonName)
    },
    // 返回上一级
    upside() {
      if (this.historyData.length <= 1) return
      this.level--
      this.historyData.pop()
      let upData = this.historyData[this.level - 1]
      this.formatChart(upData.geoJson, upData.name)
    },
  },
  watch: {
    '$store.state.isCollapse': {
      handler(newVal, oldVal) {
        setTimeout(() => {
          myChartMap.resize()
        }, 500)
      },
    },
  },
  mounted() {
    myChartMap = this.$echarts.init(document.getElementById('myMap'))
    myChartMap.showLoading({
      text: '加载中...',
      textColor: '#fff',
      color: '#fff',
      maskColor: 'rgba(0 ,0 ,0 ,0.3 )',
      zlevel: 0,
    })
    this.resData = [
      {
        name: '广州市',
        value: [113.2644, 23.1291],
      },
      {
        name: '成都市',
        value: [104.0657, 30.6598],
      },
      {
        name: '苏州市',
        value: [120.6195, 31.2995],
      },
      {
        name: '北京市',
        value: [116.404, 39.9042],
      },
      {
        name: '连云港市',
        value: [119.1676, 34.5934],
      },
      {
        name: '南京市',
        value: [118.7674, 32.0415],
      },
      {
        name: '杭州市',
        value: [120.1535, 30.2874],
      },
      {
        name: '乌鲁木齐市',
        value: [87.6168, 43.7928],
      },
      {
        name: '拉萨市',
        value: [91.11, 29.97],
      },
      {
        name: '西安市',
        value: [108.953, 34.2779],
      },
      {
        name: '南宁市',
        value: [108.32006, 22.82402],
      },
    ]
    this.initChart()
  },
  destroyed() {
    if (myChartMap) myChartMap.clear()
    if (charTimer) {
      clearInterval(charTimer)
      charTimer = null
    }
  },
}
</script>
<style lang="less">
.about {
  background: #000469;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
#myMap {
  width: 100%;
  height: 100%;
}
.btn {
  position: absolute;
  top: 0px;
  left: 10px;
}
.map-point {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100px;
  height: 100px;
  background: url('../../public/home/bg4.jpg') no-repeat;
  background-size: 100%;
  display: none;
}
</style>
