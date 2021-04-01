<template>
  <div class="app-container">
    <div id="container">
    </div>

    <div class="searchForm">
      <div class="form-item">
        <el-input
          size="mini"
          placeholder="VIN、围栏名称"
          style="width: 180px"
          v-model="searchObj.query">
        </el-input>
      </div>
      <el-button size="mini" type="primary" icon="el-icon-search" circle @click="search"></el-button>
    </div>
    <!--侧边栏搜索表格-->
    <div class="searchResultTable">
      <el-table
        ref="multipleTable"
        :data="fenceStateList"
        :header-cell-style="{background:'#F7F7F7'}"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;"
        min-height="420px"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="vin"
          label="VIN"
          width="200">
        </el-table-column>
        <el-table-column
          label="状态"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <!--            {{scope.row.fenceState == false ? "异常" : "正常"}}-->
            <el-tag v-if="!scope.row.fenceState" type="danger" size="mini">异常</el-tag>
            <el-tag v-if="scope.row.fenceState" type="success" size="mini">正常</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="search"
        :current-page.sync="current"
        :page-size="limit"
        layout="total, prev, pager, next, jumper"
        style="text-align: center"
        :current="current"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        total: 0,
        current: 1,
        limit: 5,
        searchObj: {
          query: ''
        },
        isOpen: false,
        isHidden: false,
        tableVisible: false,
        map: {},
        marker: [],
        factoryOptions: [],
        typeOptions: [],
        statusData: [],
        tableData: [],
        multipleSelection: [],
        drawer: false,
        drawData: [],
        fenceStateList: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        circleList: [],
        defaultIcon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        redIcon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
        fenceList: []
      }
    },
    mounted() {
      this.initMap()
    },
    methods: {
      initMap() {
        const map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 4,//级别
          center: [116.397428, 29.90923]//中心点坐标
        })
        // 同时引入工具条插件，比例尺插件和鹰眼插件
        AMap.plugin([
            'AMap.ToolBar',
            'AMap.Scale'
          ],
          function() {
            // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
            map.addControl(new AMap.ToolBar({ offset: new AMap.Pixel(10, 200), position: 'LT' }))
            // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
            map.addControl(new AMap.Scale({ offset: new AMap.Pixel(10, 30) }))
          }
        )
        this.map = map
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val
      },
      handleSizeChange(val) {
        this.limit = val
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange(val) {
        this.current = val
        console.log(`当前页: ${val}`)
      },
      search() {
        this.map.clearMap()
        this.circleList = []
        this.fenceStateList = []
        this.clearMarker()
        // fence.getFenceState(this.searchObj, this.current, this.limit).then(res => {
        //   this.fenceStateList = res.data.records   //拿到的是属于该电子围栏的车的信息
        //   this.total = res.data.total
        //   this.showFence()
        // }).then(res => {
        //
        // }).catch(err => {
        //
        // })
        this.$http({
          url: this.$http.adornUrl(`/vehicle/fence/getFenceState/${this.current}/${this.limit}`),
          method: 'post',
          data: this.$http.adornData(this.searchObj, false)
        }).then(({data}) => {
          this.fenceStateList = data.data.records   //拿到的是属于该电子围栏的车的信息
          this.total = data.data.total
          this.showFence()
        })
      },
      /*=====================*/
      // 实例化点标记
      addMarker(lng, lat, iconUrl) {
        let marker = new AMap.Marker({
          icon: iconUrl,
          position: [lng, lat],
          offset: new AMap.Pixel(-13, -30)
        })
        this.map.add(marker)
        this.marker.push(marker)
        // this.marker = marker
        // this.marker.setMap(this.map)
      },
      // 清除 marker
      clearMarker() {
        if (this.marker) {
          // this.marker.setMap(null)
          // this.marker = null
          this.map.remove(this.marker)
        }
      },

      // showLocation() {
      //   for (const selection of this.fenceStateList) {
      //     if(selection != null) {
      //       console.log(selection)
      //       this.addMarker(selection.lng, selection.lat, this.defaultIcon)
      //     }
      //   }
      //   // this.drawData = this.multipleSelection
      // },

      rowClick(row, column, event) {
        console.log(row)
        let { lng, lat } = row
        this.map.setZoomAndCenter(12, [lng, lat])
      },

      showFence() {
        for (const fence of this.fenceStateList) {
          let center = fence.fenceCenter.split(',')
          let radius = fence.fenceRadius
          let lng = fence.lng
          let lat = fence.lat
          let state = fence.fenceState
          let circle = new AMap.Circle({
            center: new AMap.LngLat(center[0], center[1]),  // 圆心位置
            radius: radius, // 圆半径
            fillColor: '#A0CFF6',   // 圆形填充颜色
            fillOpacity: 0.4,
            strokeColor: '#fff', // 描边颜色
            strokeWeight: 2 // 描边宽度
          })
          if (state == 1) {
            this.addMarker(lng, lat, this.defaultIcon)
          } else {
            this.addMarker(lng, lat, this.redIcon)
          }

        // this.$http({
        //   url: this.$http.adornUrl(`/vehicle/fence/getFenceByName/${this.current}/${this.limit}`),
        //   method: 'post',
        //   data: this.$http.adornData(this.searchObj, false)
        // }).then(({data}) => {
        //   let fenceList = data.data.records
        //   for (const fence of fenceList) {
        //     let center = fence.center.split(',')
        //     let radius = fence.radius
        //     let circle = new AMap.Circle({
        //       center: new AMap.LngLat(center[0], center[1]),  // 圆心位置
        //       radius: radius, // 圆半径
        //       fillColor: '#A0CFF6',   // 圆形填充颜色
        //       fillOpacity: 0.4,
        //       strokeColor: '#fff', // 描边颜色
        //       strokeWeight: 2 // 描边宽度
        //     })
            this.circleList.push(circle)
            this.map.add(circle)
          // 缩放地图到合适的视野级别
          this.map.setFitView(this.circleList)
      }}
    }
  }
</script>

<style scoped>
  #container {
    position: relative;
    /*z-index: 99;*/
    width: 100%;
    height: 800px;
    border: 1px solid #D9D9D9;
    border-radius: 5px;
  }

  .searchForm {
    position: absolute;
    display: flex;
    left: 0;
    right: 0;
    top: 40px;
    margin: auto;
    /*z-index: 100;*/
    width: 800px;
  }

  .form-item {
    padding: 0 5px;
  }

  .searchResultTable {
    position: absolute;
    /*z-index: 100;*/
    /*float: right;*/
    width: 400px;
    height: 200px;
    top: 80px;
    right: 20px;
    background-color: rgba(255, 255, 255, 0.65);
  }

  .button {
    margin-top: 10px;
    margin-right: 10px;
    text-align: center;
  }

  .drawer {
    /*position: absolute;*/
    width: 100%;
    line-height: 14px;
    font-size: 13px;
    /*z-index: 101;*/
    /*bottom: 1px;*/
  }

  .hidden-button {
    outline: none;
    background-color: white;
    border: none;
    border-radius: 5px;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 14px;
    color: rgba(0, 0, 0, 0.65);
  }

  .hidden-button:hover {
    background-color: #69B8F1;
    color: white;
  }

  .hidden-table {
    /*position: absolute;*/
    /*bottom: 30px;*/
    width: 100%;
    overflow: hidden;
    height: 250px;
    /*z-index: 101;*/
  }

  .table-wrapper {
    position: absolute;
    z-index: 101;
    width: 100%;
    bottom: 3px;
    background-color: rgba(255, 255, 255, 0.65);
  }


  .amap-icon img,
  .amap-marker-content img {
    width: 25px;
    height: 34px;
  }

  .marker {
    position: absolute;
    top: -20px;
    right: -118px;
    color: #fff;
    padding: 4px 10px;
    box-shadow: 1px 1px 1px rgba(10, 10, 10, .2);
    white-space: nowrap;
    font-size: 12px;
    font-family: "";
    background-color: #25A5F7;
    border-radius: 3px;
  }

  .input-card {
    position: absolute;
    width: 18rem;
    top: 40px;
    right: 50px;
    z-index: 170;
  }

  .input-card .btn {
    margin-right: .8rem;
  }

  .input-card .btn:last-child {
    margin-right: 0;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
<style>
</style>
