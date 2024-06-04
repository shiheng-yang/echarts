<template>
  <div class="about1">
    <div class="titles azjgs">
      <div style="display: flex">
        保存的文件格式：
        <el-checkbox-group v-model="fileType">
          <el-checkbox label="名称"></el-checkbox>
          <el-checkbox label="编码"></el-checkbox>
        </el-checkbox-group>
        <span class="tips">默认格式为: 名称+编码.json</span>
      </div>
      <div>
        按条数下载：
        <el-input v-model="beginIndex" placeholder="请输入开始条数" clearable type="number"></el-input>
        至 <el-input v-model="endIndex" placeholder="请输入结束条数" clearable type="number"></el-input>
        <span class="tips">根据首字母拼音排序</span>
        <el-button type="primary" size="mini" icon="el-icon-bottom" @click="downloadLength">下 载</el-button>
      </div>
      <div>
        按行政区划代码下载：
        <el-input v-model="adcode" placeholder="请输入区县编码" clearable type="number"></el-input>
        <span class="tips">以xxx开头</span>
        <el-button type="primary" size="mini" icon="el-icon-bottom" @click="downloadCode">下 载</el-button>
      </div>
      <div>全国省市县json总共:{{ allTotal.length }}条</div>
      <div class="proListSty">
        <div v-for="item in proList" :key="item.index">{{ item.name }}:{{ item.adcode }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
export default {
  name: 'about',
  data() {
    return {
      publicUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/',
      beginIndex: 0,
      endIndex: 100,
      allTotal: 0,
      adcode: '32',
      proList: [],
      fileType: ['名称', '编码'],
    }
  },
  methods: {
    // 按条数
    downloadLength() {
      let filterData = this.allTotal.slice(this.beginIndex, this.endIndex)
      this.getJson(filterData)
    },
    // 按行政区划代码
    downloadCode() {
      let filterData = this.allTotal.filter((v) => v.adcode.toString().slice(0, this.adcode.length) == this.adcode)
      this.getJson(filterData)
    },
    getJson(filterData) {
      // 没有区县的地级市,东莞,中山,儋州,三沙,嘉峪关
      let adcodeArr = ['460400', '460300', '441900', '442000', '620200']
      const zip = new JSZip()
      const promises = []
      filterData.forEach((v) => {
        let regJson = `${v.adcode}_full.json`
        // 区县或者没有区县的地级市
        if (v.adcode.toString().slice(-2) != '00' || adcodeArr.includes(v.adcode.toString())) {
          regJson = `${v.adcode}.json`
        }
        // 文件名
        const name = this.fileType.includes('名称') ? v.name : ''
        const code = this.fileType.includes('编码') ? v.adcode : ''
        const regName = `${name}${code}.json`
        promises.push(
          this.getGeoJson(regJson)
            .then((regionGeoJson) => {
              let data = JSON.stringify(regionGeoJson.data)
              zip.file(regName, data)
              return data
            })
            .catch((err) => {
              this.$message.error(err)
            })
        )
      })
      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          saveAs(content, `${filterData[0].name}.zip`)
        })
      })
    },
    //获取地图json数据
    async getGeoJson(jsonName) {
      return await axios.get(this.publicUrl + jsonName)
    },
  },
  async mounted() {
    let geoJson = await this.getGeoJson('all.json')
    this.allTotal = geoJson.data
    this.proList = this.allTotal.filter((v) => v.adcode.toString().slice(-4) == '0000')
  },
  destroyed() {},
}
</script>
<style src="../../public/css/search.less" lang="less" scoped></style>
<style lang="less">
.about1 {
  padding: 0.1rem 0.1rem 0;
  height: 98%;
  width: 100%;
  overflow: hidden;
  position: relative;
  background: #fff;
}
.proListSty {
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 200px;
    height: 30px;
  }
}
.tips {
  font-size: 12px;
  margin: 0 10px;
}
</style>
