<template>
  <div class="about">
    <div id="myMap"></div>
    <el-button type="primary" size="large" title="点击返回上一级" class="btn" @click="upside">{{ adName }}</el-button>
  </div>
</template>
<script>
import axios from 'axios'
let myChartMap = null //地图
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
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [],
          },
        ],
      },
      publicUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/',
      level: 0,
      historyData: [],
      adName: '中国',
      alladcode: '',
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
      this.initEcharts(formatChinaGeoJson, 'china')
    },
    // 格式图表
    formatChart(geoJson, name) {
      this.adName = name == 'china' ? '中国' : name
      this.$echarts.registerMap(name, geoJson)
      this.optionMap.geo.forEach((v) => {
        v.map = name
        v.layoutSize = name == 'china' ? '180%' : '100%'
      })
      myChartMap.clear()
      myChartMap.setOption(this.optionMap)
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
    this.initChart()
  },
  destroyed() {
    if (myChartMap) myChartMap.clear()
  },
}
</script>
<style lang="less">
.about {
  // background: #000469;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: url('../../public/home/bg4.jpg');
}
#myMap {
  width: 100%;
  height: 100%;
}
.btn {
  position: absolute;
  top: 0px;
  left: 10px;
  font-size: 30px;
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
