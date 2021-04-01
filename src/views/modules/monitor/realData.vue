<template>
  <div class="app-container">
    <el-container>
      <el-row :gutter="10" type="flex">
        <el-col>
          <el-input
            size="small"
            placeholder="VIN、车主名称、手机号"
            style="width: 250px"
            v-model="searchObj.identification"
          >
          </el-input>
        </el-col>
        <el-col>
          <el-button type="primary" size="small" @click="showRealTimeData"
          >检索
          </el-button
          >
          <el-button type="primary" size="small">显示设置</el-button>
        </el-col>
      </el-row>
    </el-container>
    <el-container class="label-page">
      <el-row>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
          <el-tab-pane label="整车数据" name="first">
            <div v-if="showTableInfo">
              <table class="tableInfo" border>
                <tr>
                  <td>VIN号：</td>
                  <td>{{carInfo.vin}}</td>
                </tr>
                <tr>
                  <td>数据采集时间：</td>
                  <td>{{carInfo.messageTime}}</td>
                </tr>
                <tr>
                  <td>GPS：</td>
                  <td>{{carInfo.gps==false?'离线':'在线'}}</td>
                </tr>
                <tr>
                  <td>车辆状态：</td>
                  <td>{{driveStatusMap[carInfo.driveStatus]}}</td>
                </tr>
                <tr>
                  <td>SOC：</td>
                  <td>{{carInfo.soc}}</td>
                </tr>
                <tr>
                  <td>充电状态：</td>
                  <td>{{chargeStatusList[carInfo.chargeState]}}</td>
                </tr>
                <tr>
                  <td>运行模式：</td>
                  <td>{{runModeList[carInfo.runMode]}}</td>
                </tr>
                <tr>
                  <td>车速：</td>
                  <td>{{carInfo.vehicleSpeed}}</td>
                </tr>
                <tr>
                  <td>里程：</td>
                  <td>{{carInfo.mileage}}</td>
                </tr>

              </table>

              <table class="tableInfo" border style="margin-left: 50px">
                <tr>
                  <td>总电压：</td>
                  <td>{{carInfo.totalVoltage}}</td>
                </tr>
                <tr>
                  <td>总电流：</td>
                  <td>{{carInfo.totalCurrent}}</td>
                </tr>
                <tr>
                  <td>DC-DC状态：</td>
                  <td>{{carInfo.dcdcState}}</td>
                </tr>
                <tr>
                  <td>档位：</td>
                  <td>{{shiftModeList[carInfo.shiftMode]}}</td>
                </tr>
                <tr>
                  <td>加速踏板开度：</td>
                  <td>{{carInfo.boardTrip}}</td>
                </tr>
                <tr>
                  <td>驱动故障：</td>
                  <td>{{carInfo.hasDriver=='0'?'无':'有'}}</td>
                </tr>
                <tr>
                  <td>制动踏板开度：</td>
                  <td>{{carInfo.breakBoardState}}</td>
                </tr>
                <tr>
                  <td>制动故障：</td>
                  <td>{{carInfo.hasBreak=='0'?'无':'有'}}</td>
                </tr>
                <tr>
                  <td>绝缘电阻：</td>
                  <td>{{carInfo.insulationResistance}}</td>
                </tr>
              </table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="电池数据" name="second">
            <div v-if="showTableInfo">
              <div style="font-size: 14px; font-weight: bold;margin-bottom: 20px">极值数据</div>
              <div class="extremeValue clearfix">
                <table border class="tableInfo">
                  <tr>
                    <td>最高电压电池子系统号：</td>
                    <td>{{batteryInfo.highestVoltageSysNum}}</td>
                  </tr>
                  <tr>
                    <td>最高电压电池单体代号：</td>
                    <td>{{batteryInfo.highestVoltageSingleNum}}</td>
                  </tr>
                  <tr>
                    <td>电池单体电压最高值：</td>
                    <td>{{batteryInfo.singleMaxVoltage}}</td>
                  </tr>
                  <tr>
                    <td>最低电压电池子系统号：</td>
                    <td>{{batteryInfo.lowestVoltageSysNum}}</td>
                  </tr>
                  <tr>
                    <td>最低电压电池单体代号：</td>
                    <td>{{batteryInfo.lowestVoltageSingleNum}}</td>
                  </tr>
                  <tr>
                    <td>电池单体电压最低值：</td>
                    <td>{{batteryInfo.singleMinVoltage}}</td>
                  </tr>
                </table>

                <table class="tableInfo" border style="margin-left: 50px">
                  <tr>
                    <td>最高温度子系统号：</td>
                    <td>{{batteryInfo.highestTempSysNum}}</td>
                  </tr>
                  <tr>
                    <td>最高温度探针序号：</td>
                    <td>{{batteryInfo.highestTempProbeNum}}</td>
                  </tr>
                  <tr>
                    <td>最高温度值：</td>
                    <td>{{batteryInfo.maxTemp}}</td>
                  </tr>
                  <tr>
                    <td>最低温度子系统号：</td>
                    <td>{{batteryInfo.lowestTempSysNum}}</td>
                  </tr>
                  <tr>
                    <td>最低温度探针序号：</td>
                    <td>{{batteryInfo.lowestTempProbeNum}}</td>
                  </tr>
                  <tr>
                    <td>最低温度值：</td>
                    <td>{{batteryInfo.minTemp}}</td>
                  </tr>
                </table>
              </div>

              <div class="chargeDevice clearfix">
                <div style="font-size: 14px; font-weight: bold;margin-bottom: 20px ">
                  充电数据
                </div>
                <table border class="tableInfo">
                  <tr>
                    <td>充电次数:</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>累计充电</td>
                    <td></td>
                  </tr>
                </table>

                <table class="tableInfo" border style="margin-left: 50px">
                  <tr>
                    <td>累计放电:</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>单次充电信息:</td>
                    <td></td>
                  </tr>
                </table>
              </div>

              <div class="chargeDevice clearfix">
                <div style="font-size: 14px; font-weight: bold;margin-bottom: 20px ">
                  可充电储能装置子系统
                </div>
                <table border class="tableInfo">
                  <tr>
                    <td>电压:</td>
                    <td>{{batteryInfo.voltage}}</td>
                  </tr>
                  <tr>
                    <td>电流</td>
                    <td>{{batteryInfo.current}}</td>
                  </tr>
                </table>

                <table class="tableInfo" border style="margin-left: 50px">
                  <tr>
                    <td>单体电池总数:</td>
                    <td>{{batteryInfo.singleBatterySum}}</td>
                  </tr>
                  <tr>
                    <td>温度探针总数:</td>
                    <td>{{batteryInfo.tempProbeSum}}</td>
                  </tr>
                </table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="电机数据" name="third">
            <div v-if="showTableInfo">
              <div v-if="showTableInfo">
                <div class="clearfix">
                  <table border class="tableInfo">
                    <tr>
                      <td>数据采集时间:</td>
                      <td>{{motorInfo.messageTime}}</td>
                    </tr>
                  </table>
                </div>


                <div class="clearfix">
                  <div style="font-size: 14px; font-weight: bold;margin: 20px 0">
                    11
                  </div>
                  <table border class="tableInfo">
                    <tr>
                      <td>序号:</td>
                      <td>{{motorInfo.number}}</td>
                    </tr>
                    <tr>
                      <td>状态</td>
                      <td>{{motorStateList[motorInfo.status - 1]}}</td>
                    </tr>
                    <tr>
                      <td>控制器温度</td>
                      <td>{{motorInfo.controllerTemp}}</td>
                    </tr>
                    <tr>
                      <td>转速</td>
                      <td>{{motorInfo.rotationRate}}</td>
                    </tr>
                  </table>

                  <table class="tableInfo" border style="margin-left: 50px">
                    <tr>
                      <td>转矩:</td>
                      <td>{{motorInfo.torque}}</td>
                    </tr>
                    <tr>
                      <td>温度</td>
                      <td>{{motorInfo.temperature}}</td>
                    </tr>
                    <tr>
                      <td>控制器电压</td>
                      <td>{{motorInfo.controllerVoltage}}</td>
                    </tr>
                    <tr>
                      <td>控制器电流</td>
                      <td>{{motorInfo.controllerCurrent}}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="报警数据" name="fifth">
            <div v-if="showTableInfo">
              <div class="warnInfo">
                <div class="warn">
                  温度差异
                </div>
                <div class="warn">
                  电池高温
                </div>
                <div class="warn">
                  车载储能装置类型过压
                </div>
                <div class="warn">
                  车载储能装置类型欠压
                </div>
                <div class="warn">
                  SOC低
                </div>
                <div class="warn">
                  单体电池过压
                </div>
                <div class="warn">
                  单体电池欠压
                </div>
                <div class="warn">
                  SOC过高
                </div>
                <div class="warn">
                  SOC跳变
                </div>
                <div class="warn">
                  可充电储能系统不匹配
                </div>
                <div class="warn">
                  电池单体一致性差
                </div>
                <div class="warn">
                  绝缘
                </div>
                <div class="warn">
                  DC-DC温度
                </div>
                <div class="warn">
                  制动系统
                </div>
                <div class="warn">
                  DC-DC状态
                </div>
                <div class="warn">
                  驱动电机控制器温度
                </div>
                <div class="warn">
                  高压互锁状态
                </div>
                <div class="warn">
                  驱动电机温度
                </div>
                <div class="warn">
                  车载储能装置类型过充
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="其他数据" name="sixth">
            <div v-if="showTableInfo">其他数据</div>
          </el-tab-pane>
          <el-tab-pane label="T-BOX数据" name="seventh">
            <div v-if="showTableInfo">T-BOX数据</div>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-container>

    <!--侧边栏搜索表格-->
    <div class="searchResultTable" v-show="tableVisible">
      <el-table
        ref="multipleTable"
        :data="tableData"
        :header-cell-style="{ background: '#F7F7F7' }"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%"
        @row-dblclick="selectInfo"
        min-height="550px"
      >
        <el-table-column width="55"></el-table-column>
        <el-table-column prop="vin" label="VIN" width="160"></el-table-column>
        <el-table-column prop="license" label="车牌" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="factory" label="车厂" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="vehicleType" label="车型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="location" label="区域" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="showRealTimeData"
        :current-page.sync="current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        style="text-align: center"
        :current="current"
        :total="total">
      </el-pagination>
      <!--      <div class="button">-->
      <!--        <el-button size="mini" type="primary" @click="">确定</el-button>-->
      <!--        <el-button size="mini" @click="tableVisible=false">取消</el-button>-->
      <!--      </div>-->
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
        limit: 10,
        currentPage: 1,
        tableData: [],
        tableVisible: false,
        searchObj: {},
        showTableInfo: false,
        activeName: 'first',
        carInfo: {},
        batteryInfo: {},
        motorInfo: {},
        warnInfo: {},
        otherInfo: {},
        tboxInfo: {},
        driveStatusMap: {
          '1': '车辆启动',
          '2': '熄火',
          '3': '其他状态',
          '14': '异常'
        },
        chargeStatusList: ['未充电', '充电'],
        runModeList: ['正常', '大坡', '小坡'],
        shiftModeList: ['N挡', '倒挡', '前进挡', '手动挡', '手动挡升挡', '手动挡降挡'],
        motorStateList:['耗电','发电','关闭','异常'],
        vehicleInfo: {}
      }
    },
    computed: {
      getLastMessageMillis() {
        return this.$store.state.onmessage.lastMessageMillis
      }
    },
    //监听新消息到达, 查询数据库
    watch: {
      getLastMessageMillis(newVal, oldVal) {
        if (this.vehicleInfo.vin != null) {
          this.selectInfo(this.vehicleInfo)
        }
      }
    },
    mounted() {
      if(this.$route.params.vin != null) {
        this.searchObj.identification = this.$route.params.vin;
        this.showRealTimeData()
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      },
      handleSizeChange(val) {
        this.limit = val
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange(val) {
        this.current = val
        console.log(`当前页: ${val}`)
      },
      showRealTimeData() {
        this.tableVisible = true
        // realtime
        //   .getRealTimeLocationByCondition(
        //     this.searchObj,
        //     this.current,
        //     this.limit
        //   )
        this.$http({
          url: this.$http.adornUrl(`/vehicle/monitor/location/realtime/${this.current}/${this.limit}`),
          method: 'post',
          data: this.$http.adornData(this.searchObj, false)
        }).then(({data}) => {
          this.tableData = data.data.records
          this.total = data.data.total
        })
      },
      selectInfo(vehicleInfo) {
        this.vehicleInfo = vehicleInfo;
        const vin = vehicleInfo.vin;
        // console.log(val);
        this.$http({
          url: this.$http.adornUrl(`/vehicle/realtime-data-car/info/${vin}`),
          method: 'get',
          params: {}
        }).then(({data}) => {
          this.carInfo = data.data.carInfo;
        }).catch(() => {
        })
        this.$http({
          url: this.$http.adornUrl(`/vehicle/realtime-data-battery/info/${vin}`),
          method: 'get',
          params: {}
        }).then(({data}) => {
          this.batteryInfo = data.data.batteryInfo;
        }).catch(() => {
        })
        // realData.getBatteryInfo(vin).then(res => {
        //   console.log(res);
        //   this.batteryInfo = res.data.batteryInfo;
        // });
        this.$http({
          url: this.$http.adornUrl(`/vehicle/realtime-data-motor/info/${vin}`),
          method: 'get',
          params: {}
        }).then(({data}) => {
          console.log(data);
          this.motorInfo = data.data.motorInfo;
        }).catch(() => {
        })
        // realData.getMotorInfo(vin).then(res => {
        //   console.log(res);
        //   this.motorInfo = res.data.motorInfo;
        // });
        this.tableVisible = false;
        this.showTableInfo = true;
      }
    }
  }
</script>

<style>
  .searchResultTable {
    position: absolute;
    /*z-index: 100;*/
    /*float: right;*/
    border: 1px solid #e9e9e9;
    z-index: 101;
    width: 600px;
    min-height: 400px;
    height: 400px;
    top: 80px;
    right: 20px;
    background-color: rgba(255, 255, 255, 0.65);
  }

  .label-page {
    margin: 20px 0 20px 0;
  }

  .tabs {
    width: 80vw;
  }

  div .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 30px !important;
  }

  .tabs table {
    width: 40%;
    float: left;
    font-size: 13px;
    line-height: 30px;
    border: 1px solid #a8a8a8;
    border-spacing: 0;
    border-collapse: collapse;
  }

  .tabs table tr {
    height: 30px;
    text-align: center;
  }

  .tabs table tr td:nth-of-type(1) {
    width: 30%;
  }

  .chargeDevice {
    margin-top: 50px;
  }

  .clearfix:after {
    /*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .warn {
    font-size: 14px;
    text-align: center;
    line-height: 50px;
    background-color: #00a0e9;
    margin: 5px 5px 5px 5px;
    height: 50px;
    width: 200px;
  }

  .warnInfo {
    display: flex;
    flex-wrap: wrap;
  }

  .tableInfo {
    width: 25vw;
  }
</style>
