<template>
  <div class="app-container" style="background-color: white">
    <div id="hisData">
      <el-container class="data-container">
        <el-aside width="220px">
          <div class="treeDiv">
            <el-tree
              ref="tree"
              :data="data"
              :expand-on-click-node="false"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[1, 2, 3]"
              :default-checked-keys="[5, 6, 7]"
              :props="defaultProps"
            >
            </el-tree>
          </div>
        </el-aside>
        <el-container>
          <el-header height="60px">
            <el-form
              ref="form"
              :model="searchObj"
              :inline="true"
              :rules="rules"
              style="margin-top: 20px; margin-left: 20px"
            >
              <el-form-item prop="vin">
                <el-input
                  size="small"
                  clearable
                  placeholder="请输入VIN号"
                  style="width: 200px"
                  v-model="searchObj.vin"
                >
                </el-input>
              </el-form-item>
              <el-form-item prop="date">
                <el-date-picker
                  size="small"
                  v-model="searchObj.date"
                  type="datetimerange"
                  align="right"
                  @change="checkTimeRange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['17:50:00', '17:50:00']"
                >
                </el-date-picker>
              </el-form-item>
              <el-button
                @click="search('form')"
                title="查询"
                size="small"
                type="primary"
                icon="el-icon-search"
                style="margin-left: 2vw; margin-top: 5px"
              ></el-button>
              <el-button
                title="导出"
                size="small"
                type="primary"
                icon="el-icon-download"
              ></el-button>
            </el-form>
          </el-header>
          <el-main>
            <div class="main-content">
              <!-- <div v-show="showTip" class="tip">
                1.选择左侧需要显示的项目。2.填写上边VIN和时间间隔。3.单击查询。
              </div> -->
              <div id="main" ref="chart" style="width: 100%"></div>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
  import chart from "echarts";
  import moment from 'moment'

  export default {
    name: "index",
    props: {
      searchObj: {
        type: Object,
        required: false,
        default: () => ({
          vin: "",    //日期要求显示前一天的17:50和当天17:50     date:["2021-01-15 17:50:00", "2021-01-16 17:50:00"],
          date: [moment().subtract(1, "day").format('yyyy-MM-DD') + " " + moment('17:50:00', 'H:mm:ss').format('H:mm:ss'),
            moment().format('yyyy-MM-DD') + " " + moment('17:50:00', 'H:mm:ss').format('H:mm:ss')],
          checkedNums: [],
        })
      },
    },
    data() {
      return {
        showTip: "true",
        checkAll: false,
        buses: ["车速", "总电压", "总电流", "SOC"],
        batteries: ["单体电压", "压差", "单体温度"],
        motor: ["控制器输入电压", "控制器输出电流"],
        isIndeterminate: true,
        data: [
          {
            id: 1,
            label: "整车",
            children: [
              {
                id: 4,
                label: "车速",
              },
              {
                id: 5,
                label: "总电压",
              },
              {
                id: 6,
                label: "总电流",
              },
              {
                id: 7,
                label: "SOC",
              },
            ],
          },
          {
            id: 2,
            label: "电池",
            children: [
              {
                id: 8,
                label: "单体电压",
              },
              {
                id: 9,
                label: "压差",
              },
              {
                id: 10,
                label: "单体温度",
              },
            ],
          },
          {
            id: 3,
            label: "电机",
            children: [
              {
                id: 11,
                label: "控制器输入电压",
              },
              {
                id: 12,
                label: "控制器输出电流",
              },
            ],
          },
        ],
        defaultProps: {
          children: "children",
          label: "label",
        },
        // searchObj: {
        //   vin: "",
        //   date: [],
        //   checkedNums: [],
        // },
        rules: {
          vin: [{required: true, message: "请输入vin码!", trigger: "blur"}],
          date: [{required: true, message: "请输入时间范围!", trigger: "blur"}],
        },
        timeList: [],
        speedList: [],
        voltageList: [],
        currentList: [],
        socList: [],
        title: [],
        xAxis: [],
        yAxis: [],
        series: [],
        grid: [],
        resList: [],
        legend: [],
        xAxisIndexList: [],
        selectOptionMap: {
          4: "车速",
          5: "总电压",
          6: "总电流",
          7: "SOC",
          8: "单体电压",
          9: "压差",
          10: "单体温度",
          11: "控制器输入电压",
          12: "控制器输出电流",
        },
      };
    },
    mounted() {
    },
    methods: {
      drawChart() {
        this.title = [];
        this.xAxis = [];
        this.yAxis = [];
        this.grid = [];
        this.series = [];
        this.xAxisIndexList = []
        let myChart = chart.init(document.getElementById("main"));
        myChart.clear();  //清除画布
        let numArray = this.searchObj.checkedNums;  //选择选项的下标， 4,5,6,7...
        let offset = 0;

        this.title = numArray.map((item) => {
          let titleItem = {
            top: offset * 200 + 20 + "px",
            left: "center",
            text: this.selectOptionMap[item],   //选项的name， 车速，电压...
          };
          offset++;
          return titleItem;
        });
        this.legend = numArray.map((item) => {
          return this.selectOptionMap[item];
        });
        console.log(numArray)
        for (const num in numArray) {
          this.xAxisIndexList.push(num);
          this.xAxis.push({
            data: this.timeList,
            gridIndex: num,
            boundaryGap: false,
          });
          this.yAxis.push({splitLine: {show: true}, gridIndex: num});
          this.grid.push({
            top: 200 * num + 50 + "px",
            width: "1200px",
            height: "150px",
          });
          if (numArray[num] == 8 || numArray[num] == 10) {  //numArray， 下标为8和10的是二维数组特殊处理
            for (const numKey in this.resList[num]) {
              this.series.push({
                name: this.title[num].text,
                type: "line",
                showSymbol: false,
                data: this.resList[num][numKey],
                xAxisIndex: num,
                yAxisIndex: num,
                itemStyle: {
                  normal: {
                    color: this.getRandomColor(),
                    lineStyle: {
                      color: this.getRandomColor(),
                      width: 2
                    }
                  }
                }
              });
            }
          } else {
            this.series.push({
              name: this.title[num].text,
              type: "line",
              showSymbol: false,
              data: this.resList[num],
              xAxisIndex: num,
              yAxisIndex: num,
            });
          }
        }
        this.autoHeight = this.xAxisIndexList.length * 205 + 60; //this.xAxisIndexList.length为当前折线图个数 长度。

        myChart.getDom().style.height = this.autoHeight + "px";
        myChart.resize();
        // 指定图表的配置项和数据
        let option = {
          title: this.title,
          tooltip: {
            trigger: "axis",
          },
          dataZoom: [
            {
              type: "slider",
              show: true,
              start: 10,
              end: 90,
              handleSize: 8,
              xAxisIndex: this.xAxisIndexList,
            },
          ],
          toolbox: {
            feature: {
              dataZoom: {},
              saveAsImage: {},
              restore: {},
            },
          },
          axisPointer: {
            link: {xAxisIndex: "all"},
            label: {
              backgroundColor: "#777",
            },
          },
          legend: {
            left: "left",
            data: this.legend,
          },
          grid: this.grid,
          xAxis: this.xAxis,
          yAxis: this.yAxis,
          series: this.series,
        };
        // 使用刚指定的配置项和数据显示图表。
        console.log(this.series)
        console.log(this.resList)
        myChart.setOption(option);
      },
      search(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.searchObj.checkedNums = this.findAllLeaf();
            let preDay = this.searchObj.date[0];
            let currentDay = this.searchObj.date[1];
            preDay = moment(preDay).format('yyyy-MM-DD H:mm:ss').toString()
            currentDay = moment(currentDay).format('yyyy-MM-DD H:mm:ss').toString()
            let query = {
              vin: this.searchObj.vin,
              date: [preDay, currentDay],
              checkedNums: this.searchObj.checkedNums
            }
            // historyData.getHistoryByCondition(query).then((res) => {
            //   this.timeList = res.data.timeList;
            //   this.resList = res.data.resList;
            //   this.drawChart();
            // });
            this.$http({
              url: this.$http.adornUrl(`/vehicle/monitor/historyData`),
              method: 'post',
              data: this.$http.adornData(query, false)
            }).then(({data}) => {
              this.timeList = data.data.timeList;
              this.resList = data.data.resList;
              this.drawChart();
            })
            this.showTip = false;
          } else {
            this.$message({
              type: "warning",
              message: "请填写vin码及时间范围!",
            });
            return false;
          }
        });
      },
      checkTimeRange() {
        const weekMills = 604800000;
        let start = this.searchObj.date[0];
        let end = this.searchObj.date[1];
        start = new Date(start);
        end = new Date(end);
        if (end - start > weekMills) {
          this.$message({
            type: "warning",
            message: "请选择小于一周的时间区间!",
          });
        }
      },
      findAllLeaf() {
        let nodes = this.$refs.tree.getCheckedNodes();
        let leafKey = new Set();
        this.findLeaf(nodes, leafKey)
        return Array.from(leafKey);
      },
      findLeaf(nodes, leafKey) {
        for (const node of nodes) {
          if (node.children != null) {
            this.findLeaf(node.children, leafKey)
          } else {
            leafKey.add(node.id)
          }
        }
      },
      getFormatDate() {
        let date = new Date();
        let time1 = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "17:50:00"
        let time2 = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "17:50:00"
        return [time1, time2]
      },
      getRandomColor() {
        return '#' + Math.random().toString(16).substr(2, 6).toUpperCase()
      }
    },
  };
</script>

<style scoped>
  #hisData {
    width: 100%;
    height: 60vh;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    background-color: #fbfbfb;
    min-width: 500px;
    min-height: 800px;
  }

  .data-container {
    height: 100%;
  }

  .main-content {
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    min-height: 700px;
    background-color: #ffffff;
  }

  .treeDiv {
    margin-top: 80px;
    margin-left: 30px;
  }

  li,
  ul,
  ol {
    list-style: none;
  }

  .tip {
    color: #108ee9;
    font-size: 12px;
    text-align: center;
    margin-top: 250px;
  }
</style>
