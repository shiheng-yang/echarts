(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4475a00e"],{"4e20":function(e,o,a){},a62e:function(e,o,a){"use strict";a.r(o);var t=function(){var e=this;e._self._c;return e._m(0)},r=[function(){var e=this,o=e._self._c;return o("div",{staticClass:"about"},[o("div",{attrs:{id:"myMap"}})])}],l=a("bc3a"),s=a.n(l);let i=null;var n={name:"about",data(){return{optionMap:{tooltip:{show:!1},geo:[{map:"china",aspectScale:1,zoom:.9,layoutCenter:["50%","50%"],layoutSize:"180%",show:!0,roam:!1,label:{show:!1,color:"#fff"},itemStyle:{areaColor:{type:"linear",x:1200,y:0,x2:0,y2:0,colorStops:[{offset:0,color:"rgba(3,27,78,0.75)"},{offset:1,color:"rgba(58,149,253,0.75)"}],global:!0},borderColor:"#c0f3fb",borderWidth:.8},emphasis:{itemStyle:{show:!1,color:"#fff",areaColor:"rgba(0,254,233,0.6)"},label:{show:!0,color:"#fff"}}},{type:"map",map:"china",zlevel:-1,aspectScale:1,zoom:.9,layoutCenter:["50%","51%"],layoutSize:"180%",roam:!1,silent:!0,itemStyle:{borderWidth:1,borderColor:"rgba(58,149,253,0.8)",shadowColor:"rgba(172, 122, 255,0.5)",shadowOffsetY:5,shadowBlur:15,areaColor:"rgba(5,21,35,0.1)"}},{type:"map",map:"china",zlevel:-2,aspectScale:1,zoom:.9,layoutCenter:["50%","52%"],layoutSize:"180%",roam:!1,silent:!0,itemStyle:{borderWidth:1,borderColor:"rgba(58,149,253,0.6)",shadowColor:"rgba(65, 214, 255,0.6)",shadowOffsetY:5,shadowBlur:15,areaColor:"rgba(5,21,35,0.1)"}},{type:"map",map:"china",zlevel:-3,aspectScale:1,zoom:.9,layoutCenter:["50%","53%"],layoutSize:"180%",roam:!1,silent:!0,itemStyle:{borderWidth:1,borderColor:"rgba(58,149,253,0.4)",shadowColor:"rgba(29, 111, 165,1)",shadowOffsetY:15,shadowBlur:10,areaColor:"rgba(5,21,35,0.1)"}},{type:"map",map:"china",zlevel:-4,aspectScale:1,zoom:.9,layoutCenter:["50%","54%"],layoutSize:"180%",roam:!1,silent:!0,itemStyle:{borderWidth:5,borderColor:"rgba(5,9,57,0.8)",shadowColor:"rgba(29, 111, 165,0.8)",shadowOffsetY:15,shadowBlur:10,areaColor:"rgba(5,21,35,0.1)"}}],series:[{type:"effectScatter",coordinateSystem:"geo",data:[]}]},publicUrl:"https://geo.datav.aliyun.com/areas_v3/bound/"}},methods:{async formatJson(e){return e.features.forEach(e=>{e.properties&&"海南省"==e.properties.name&&(e.geometry.coordinates=e.geometry.coordinates.slice(0,1))}),e.features=e.features.filter(e=>"100000_JD"!==e.properties.adcode),e},async initChart(){let e=await this.getGeoJson("100000_full.json"),o=await this.formatJson(e.data);this.initEcharts(o,"china")},initEcharts(e,o){this.$echarts.registerMap(o,e),i.clear(),i.setOption(this.optionMap),i.hideLoading(),window.addEventListener("resize",()=>{i.resize()})},async getGeoJson(e){return await s.a.get(this.publicUrl+e)}},watch:{"$store.state.isCollapse":{handler(e,o){setTimeout(()=>{i.resize()},500)}}},mounted(){i=this.$echarts.init(document.getElementById("myMap")),i.showLoading({text:"加载中...",textColor:"#fff",color:"#fff",maskColor:"rgba(0 ,0 ,0 ,0.3 )",zlevel:0}),this.initChart()},destroyed(){i&&i.clear()}},c=n,d=(a("be21"),a("2877")),h=Object(d["a"])(c,t,r,!1,null,null,null);o["default"]=h.exports},be21:function(e,o,a){"use strict";a("4e20")}}]);
//# sourceMappingURL=chunk-4475a00e.726fc911.js.map