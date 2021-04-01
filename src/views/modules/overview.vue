<template>
  <div class="app-container">
    <div id="container">

    </div>

    <div class="searchForm">
      <div class="form-item">
        <el-select style="width: 110px;" size="mini" v-model="searchObj.factory" placeholder="车厂">
          <el-option
            v-for="item in factoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="form-item">
        <el-select style="width: 110px;" size="mini" v-model="searchObj.type" placeholder="车型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button size="mini" type="primary" icon="el-icon-search" circle @click="getVehicleInfoByConditional"></el-button>
    </div>

    <!--===========================================-->
    <!--    <div class="input-card" style="display: flex">-->
    <!--      &lt;!&ndash;      <label style="color:grey">点标记操作</label>&ndash;&gt;-->
    <!--      <div class="input-item" style="margin-right: 20px">-->
    <!--        <el-button id="addMarker" type="primary" size="mini" class="btn" @click="addMarker()" value="添加点标记">添加点标记-->
    <!--        </el-button>-->
    <!--      </div>-->
    <!--      <div class="input-item">-->
    <!--        <el-button id="clearMarker" type="primary" size="mini" class="btn" @click="clearMarker()" value="删除点标记">删除点标记-->
    <!--        </el-button>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--左上角统计栏-->
    <div class="statistics">
      <div style="font-weight: bold;text-align: center;padding-top: 10px">车辆统计</div>
      <div><span class="circle-point"></span>在线车辆:0</div>
      <div><span class="circle-point"></span>故障车辆:0</div>
      <div><span class="circle-point"></span>离线车辆:0</div>
      <div><span class="circle-point"></span>总计车辆:0</div>
    </div>

    <!--右侧表格-->
    <div class="rightDiv">
      <div class="cityDiv">
        <el-table
          :data="tableData"
          @row-dblclick="handledbClick"
          style="width: 100%">
          <el-table-column
            prop="vin"
            label="vin码"
            width="200">
          </el-table-column>
          <el-table-column
            prop="fenceState"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="region"
            label="地区">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        current: 1,
        limit: 5,
        total: 0,
        currentPage: 1,
        searchObj: {
          type: '',
          factory: ''
        },
        map: {},
        marker: [],
        factoryOptions: [],
        typeOptions: [],
        statusData: [],
        tableData: [],
        multipleSelection: [],
      }
    },
    mounted() {
      this.initMap()
      // this.addMarker()
      this.getVehicleInfoByConditional();
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
      search() {
        this.tableVisible = true
      },
      /*=====================*/
      // 实例化点标记
      addMarker(lng, lat) {
        let marker = new AMap.Marker({
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
      getVehicleInfoByConditional() {
        this.$http({
          url: this.$http.adornUrl(`/vehicle/vehicleinfo/getVehicleInfoByConditional/${this.current}/${this.limit}`),
          method: 'post',
          data: this.$http.adornData(this.searchObj, false)
        }).then(({data}) => {
          this.tableData = data.data.records;
          console.log(this.tableData)
          this.total = data.data.total;

          this.clearMarker();
          for (const point of this.tableData) {
            let lng = point.lng;
            let lat = point.lat;
            this.addMarker(lng, lat);
          }
        })
      },
      handledbClick(row, event, column) {
        let {lng, lat} = row;
        this.map.setZoomAndCenter(12, [lng,lat])
      }
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
    /*left: 500px;*/
    right: 0;
    top: 40px;
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
    width: 600px;
    height: 400px;
    top: 80px;
    right: 20px;
    background-color: rgba(255, 255, 255, 0.65);
  }

  .button {
    margin-top: 10px;
    margin-right: 10px;
    text-align: right;
  }

  .hidden-button:hover {
    background-color: #69B8F1;
    color: white;
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

  .statistics {
    position: absolute;
    top: 22px;
    left: 30px;
    font-size: 12px;
    width: 100px;
    height: 120px;
    padding: 0 7px;
    margin-left: 5px;
    color: rgba(0, 0, 0, 0.65);
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid #D9D9D9;
    border-radius: 8px;
  }

  .statistics div:nth-child(n-1) {
    padding: 4px 0;
  }

  .statistics div:nth-of-type(2) span {
    background-color: #108EE9;
  }

  .statistics div:nth-of-type(3) span {
    background-color: #00A854;
  }

  .statistics div:nth-of-type(4) span {
    background-color: #D9D9D9;
  }

  .statistics div:nth-of-type(5) span {
    background-color: #FFBF00;
  }

  .circle-point {
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 4px;
    margin-right: 7px
  }


  .hidden-button {
    outline: none;
    float: left;
    height: 480px;
    width: 20px;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    background-color: white;
    border: none;
    right: 310px;
    /*top: 80px;*/
    background-color: rgba(255, 255, 255, 0.8);
  }

  .rightDiv {
    position: absolute;
    overflow: hidden;
    top: 80px;
    right: 30px;
    z-index: 100;
    max-height: 480px;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.6);
  }

  .hiddenDiv {
    float: left;
    width: 500px;
    height: 480px;
  }

  .cityDiv {
    color: rgba(0, 0, 0, 0.65);
    overflow: hidden;
    position: relative;
  }
</style>
<style>

</style>


<!--<script>-->
<!--import rabbitmq from "@/utils/rabbitmq";-->
<!--import Stomp from "stompjs";-->

<!--export default {-->
<!--  name: "index",-->
<!--  data() {-->
<!--    return {-->
<!--      input: "",-->
<!--      message: "",-->
<!--      subscribe_topic: "/topic/vehicle_sub",-->
<!--      // subscribe_topic: '/queue/vehicle_aaa',-->

<!--      publish_topic: "/topic/vehicle_pub",-->
<!--      host: "/",-->
<!--    };-->
<!--  },-->
<!--  created() {-->
<!--    this.connect();-->
<!--  },-->
<!--  methods: {-->
<!--    //连接mq并订阅主题-->
<!--    connect() {-->
<!--      let that = this;-->
<!--      rabbitmq.init(this.subscribe_topic, (msg) => {-->
<!--        // console.log(msg);-->
<!--        console.log(-->
<!--          `收到来自主题${msg.headers.destination}的消息: ${msg.body}`-->
<!--        );-->
<!--        that.message = msg.body;-->
<!--        msg.ack(); //若设置ack模式为client, 则需要客户端手动确认消息-->
<!--      });-->
<!--    },-->

<!--    //向指定主题发布消息-->
<!--    //如果要发送带有正文的消息，则还必须传递headers 参数, 需要持久化消息添加"persistent": true-->
<!--    //。如果没有要传递的标头，请使用空的JavaScript文字{}：-->
<!--    publish() {-->
<!--      rabbitmq.publish(this.publish_topic, { persistent: true }, this.input);-->
<!--    },-->
<!--    random(length) {-->
<!--      //获取当前时戳, 得到的是当前的毫秒数-->
<!--      let timestamp = new Date().getTime();-->
<!--      //substr表示从字符串的index为2的下表开始到结尾截取字符串, random生成的是0-1之间的小数-->
<!--      let str = Math.random().toString(36).substr(2);-->
<!--      if (str.length >= length) {-->
<!--        return str.substr(0, length) + timestamp;-->
<!--      }-->
<!--      str += random(length - str.length);-->
<!--      return str + timestamp;-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--</style>-->
