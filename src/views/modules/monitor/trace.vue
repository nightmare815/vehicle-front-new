<template>
  <div class="app-container">
    <div id="container"></div>
    <div class="searchForm">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            size="mini"
            placeholder="请输入坐标"
            style="width: 180px"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            size="mini"
            placeholder="请输入vin号"
            style="width: 180px"
            v-model="searchObj.vin"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            size="mini"
            v-model="searchObj.date"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['17:50:00', '17:50:00']"
          >
          </el-date-picker>
        </el-form-item>
        <el-button
          style="margin-top: 5px"
          title="查询"
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="searchInfo"
        ></el-button>
        <el-button
          title="导出"
          size="mini"
          type="primary"
          icon="el-icon-download"
        ></el-button>
      </el-form>
    </div>

    <!--侧边栏信息展示表格-->
    <div class="rightInfo">
      <div class="traceInfo">
        <table style="width: 100%; border-collapse: collapse">
          <tr>
            <td
              colspan="2"
              style="
                font-size: 13px;
                color: rgba(0, 0, 0, 0.65);
                text-align: center;
                font-weight: bold;
              "
            >
              轨迹信息
            </td>
          </tr>
          <tr>
            <td style="width: 70px">vin码:</td>
            <td>{{ traceInfo.vin }}</td>
          </tr>
          <tr>
            <td>GPS:</td>
            <td>{{ traceInfo.gps }}</td>
          </tr>
          <tr>
            <td>车牌:</td>
            <td>{{ traceInfo.license }}</td>
          </tr>
          <tr>
            <td>速度:</td>
            <td>{{ traceInfo.speed }}</td>
          </tr>
          <tr>
            <td>时间:</td>
            <td>{{ traceInfo.messageTime }}</td>
          </tr>
        </table>
      </div>
      <div class="carInfo">
        <table style="width: 100%; border-collapse: collapse">
          <tr>
            <td
              colspan="2"
              style="
                font-size: 13px;
                color: rgba(0, 0, 0, 0.65);
                text-align: center;
                font-weight: bold;
              "
            >
              车辆信息
            </td>
          </tr>
          <tr>
            <td style="width: 85px">里程:</td>
            <td>{{ traceInfo.mileage }}</td>
          </tr>
          <tr>
            <td>SOC:</td>
            <td>{{ traceInfo.soc }}</td>
          </tr>
          <tr>
            <td>总电压: </td>
            <td>{{ traceInfo.totalVoltage }}</td>
          </tr>
          <tr>
            <td>总电流:</td>
            <td>{{ traceInfo.totalCurrent }}</td>
          </tr>
          <tr>
            <td>加速踏板行程:</td>
            <td>{{ traceInfo.boardTrip }}</td>
          </tr>
          <tr>
            <td>电机电压:</td>
            <td>{{ traceInfo.motorVoltage }}</td>
          </tr>
          <tr>
            <td>电机电流:</td>
            <td>{{ traceInfo.motorCurrent }}</td>
          </tr>
          <tr>
            <td>电机转矩:</td>
            <td>{{ traceInfo.motorTorque }}</td>
          </tr>
          <tr>
            <td>电机温度:</td>
            <td>{{ traceInfo.motorTemp }}</td>
          </tr>
          <tr>
            <td>电池最高温度:</td>
            <td>{{ traceInfo.batteryMaxTemp }}</td>
          </tr>
          <tr>
            <td>电池压差:</td>
            <td>{{ traceInfo.batteryPressureDiff }}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: center; padding-top: 4px">
              <el-button
                @click="dialogVisible = true"
                size="mini"
                type="text"
                style="border: 1px solid #108ee9; width: 100px"
              >查看历史数据:
              </el-button>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!--对话框-->
    <div class="dialog-component">
      <el-dialog
        title=""
        :visible.sync="dialogVisible"
        width="90%"
        :before-close="handleClose"
      >
        <span>
          <his-data :searchObj=searchObj></his-data>
        </span>
        <!--      <span slot="footer" class="dialog-footer">-->
        <!--        <el-button @click="dialogVisible = false">取 消</el-button>-->
        <!--        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
        <!--      </span>-->
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: "index",
    components: {
    },
    data() {
      return {
        searchObj: {
          vin: "",
          date: [moment().subtract(1,"day").format('yyyy-MM-DD') + " " + moment('17:50:00','H:mm:ss').format('H:mm:ss'),
            moment().format('yyyy-MM-DD') + " " + moment('17:50:00','H:mm:ss').format('H:mm:ss')],
        },
        isOpen: false,
        isHidden: false,
        tableVisible: false,
        dialogVisible: false,
        factoryOptions: [],
        typeOptions: [],
        statusData: [],
        traceInfo: {},
        multipleSelection: [],
        drawer: false,
        // rules: {
        //   vin: [
        //     {required: true, message:'请输入正确的vin号', trigger: 'blur'}
        //   ],
        //   date: [
        //     {required: true, message:'请选择时间范围', trigger: 'blur'}
        //   ]
        // }
      };
    },
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        const map = new AMap.Map("container", {
          zoom: 4, //级别
          center: [116.397428, 29.90923], //中心点坐标
        });
        // 同时引入工具条插件，比例尺插件和鹰眼插件
        AMap.plugin(["AMap.ToolBar", "AMap.Scale"], function () {
          // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          map.addControl(
            new AMap.ToolBar({ offset: new AMap.Pixel(10, 10), position: "LT" })
          );
          // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
          map.addControl(new AMap.Scale({ offset: new AMap.Pixel(10, 30) }));
        });
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach((row) => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      search() {
        this.tableVisible = true;
      },
      handleHidden() {
        this.isOpen = !this.isOpen;
        this.isHidden = !this.isHidden;
      },
      handleClose(done) {
        done();
      },
      searchInfo() {
        if (this.searchObj.vin == null || this.searchObj.date.length == 0) {
          this.$message({
            type: "warning",
            message: "请输入正确的vin号和时间范围!",
          });
        } else {
          let preDay = this.searchObj.date[0];
          let currentDay = this.searchObj.date[1];
          preDay = moment(preDay).format('yyyy-MM-DD H:mm:ss').toString()
          currentDay = moment(currentDay).format('yyyy-MM-DD H:mm:ss').toString()
          let query = {
            vin: this.searchObj.vin,
            date: [preDay, currentDay]
          }
          // trace.getHistoryTraceByConditon(query).then((res) => {
          //   console.log(res);
          //   this.traceInfo = res.data.traceList[0];
          // });
          this.$http({
            url: this.$http.adornUrl('/vehicle/traceinfo/list'),
            method: 'post',
            data: this.$http.adornData(query, false)
          }).then(({data}) => {
            this.traceInfo = data.data.traceList[0];
          })
        }
      },
    },
  };
</script>

<style scoped>
  #container {
    position: relative;
    /*z-index: 99;*/
    width: 100%;
    height: 800px;
    border: 1px solid #d9d9d9;
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
    width: 1200px;
  }

  .form-item {
    padding: 0 5px;
  }

  .rightInfo {
    position: absolute;
    /*z-index: 100;*/
    /*float: right;*/
    width: 204px;
    height: 550px;
    margin-right: 6px;
    padding: 3px 2px;
    top: 80px;
    right: 30px;
    border-radius: 10px;
    /*background-color: rgba(255, 255, 255, 0.65);*/
  }

  td {
    height: 27px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
  }
  tr:nth-child(even) {
    background-color: #49a9ee;
  }
  .traceInfo {
    background-color: rgba(255, 255, 255, 0.65);
    border-radius: 8px;
    padding: 5px 2px;
  }
  .carInfo {
    margin-top: 20px;
    padding: 5px 2px;
    background-color: rgba(255, 255, 255, 0.65);
    border-radius: 8px;
  }
  .button {
    margin-top: 10px;
    margin-right: 10px;
    text-align: right;
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
    background-color: #69b8f1;
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
  .rightInfo {
    position: absolute;
  }
</style>
<style>
  .dialog-component .el-dialog__body {
    padding: 0px 10px;
  }
  /*.dialog-component .el-dialog__header {*/
  /*  padding: 29px 20px 10px;*/
  /*}*/
</style>
