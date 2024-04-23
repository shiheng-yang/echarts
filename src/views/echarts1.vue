<template>
  <div class="about">
    <div id="myMap"></div>
  </div>
</template>
<script>
import axios from 'axios'
let myChartMap = null
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
            layoutSize: '100%',
            show: true,
            roam: false,
            label: {
              show: false, // 各个省市县的名字
              color: '#fff',
            },
            itemStyle: {
              // 每块的样式
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
            layoutSize: '100%',
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
            layoutSize: '100%',
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
            layoutSize: '100%',
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
            layoutSize: '100%',
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
    }
  },
  methods: {
    // 初始化
    async initChart() {
      let chinaGeoJson = await this.getGeoJson('100000_full.json')
      this.initEcharts(chinaGeoJson.data, 'china')
    },
    //echarts绘图
    initEcharts(geoJson, name) {
      this.$echarts.registerMap(name, geoJson)
      myChartMap.clear()
      myChartMap.setOption(this.optionMap)
      myChartMap.hideLoading()
      window.addEventListener('resize', () => {
        myChartMap.resize()
      })
    },
    //获取地图json数据
    async getGeoJson(jsonName) {
      return await axios.get(this.publicUrl + jsonName)
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
</style>
