<template>
  <div class="app-container">
    <div class="search-form">
      <div>
        <el-form :inline="true" style="transform: translateY(20%)">
          <el-form-item>
            <el-select style="width: 200px;" size="mini" v-model="searchObj.factory" placeholder="车厂">
              <el-option
                v-for="item in factoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select style="width: 200px;" size="mini" v-model="searchObj.type" placeholder="车型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select style="width: 200px;" size="mini" v-model="searchObj.status" placeholder="状态">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              size="mini"
              v-model="searchObj.date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              align="right"
              start-placeholder="生产开始日期"
              end-placeholder="生产结束日期"
              :default-time="['12:00:00', '08:00:00']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input
              size="mini"
              placeholder="vin码"
              style="width: 200px"
              v-model="searchObj.vin">
            </el-input>
          </el-form-item>
          <el-button style="margin-top: 5px" title="查询" size="mini" type="primary" icon="el-icon-search" @click="searchInfo">查询</el-button>
          <el-button title="添加" size="mini" type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">添加
          </el-button>
        </el-form>
      </div>
      <el-dialog title="添加" :visible.sync="dialogFormVisible" width="55%">
        <el-form :model="form" :inline="true" class="demo-form-inline">
          <el-form-item label="vin码">
            <el-input class="dialog-form" size="small" v-model="form.vin" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="车型">
            <el-select class="dialog-form" size="small" v-model="form.type">
            </el-select>
          </el-form-item>
          <el-form-item label="车身颜色">
            <el-input class="dialog-form" size="small" v-model="form.color" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="车牌">
            <el-input class="dialog-form" size="small" v-model="form.license " autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电机号">
            <el-input class="dialog-form" size="small" v-model="form.electrNum" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="终端编号">
            <el-input class="dialog-form" size="small" v-model="form.terminalNum" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="生产日期">
            <el-date-picker
              v-model="form.prodTime"
              class="dialog-form"
              size="small"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="下线日期">
            <el-date-picker
              v-model="form.offlineTime"
              class="dialog-form"
              size="small"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="其他">
            <el-input class="dialog-form" size="small" v-model="form.other" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="search-result-list">
      <el-table
        :data="tableData"
        border
        highlight-current-row
        min-height="500px"
        style="width: 100%">
        <el-table-column
          prop="vin"
          label="车架号">
        </el-table-column>
        <el-table-column
          prop="license"
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="motorNumber"
          label="电机号">
        </el-table-column>
        <el-table-column
          prop="terminalNum"
          label="终端号">
        </el-table-column>
        <el-table-column
          prop="factory"
          label="车厂">
        </el-table-column>
        <el-table-column
          prop="type"
          label="车型">
        </el-table-column>
        <el-table-column
          prop="groupIn"
          label="组别">
        </el-table-column>
        <el-table-column
          prop="produceTime"
          label="生产日期">
        </el-table-column>
        <el-table-column
          label="操作">
        </el-table-column>
      </el-table>
    </div>

    <!--分页-->
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="searchInfo"
        :current-page="current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
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
        current: 1,
        limit: 10,
        total: 0,
        searchObj: {
          factory: '',
          type: '',
          status: '',
          date: [],
          vin: ''
        },
        factoryOptions: [],
        typeOptions: [],
        statusOptions: [],
        dialogFormVisible: false,
        form: {
          vin: '',
          type: '',
          color: '',
          license: '',
          electrNum: '',
          terminalNum: '',
          prodTime: '',
          offlineTime: '',
          other: ''
        },
        tableData: []
      }
    },
    created() {
    },
    methods: {
      searchInfo() {
        this.$http({
          url: this.$http.adornUrl(`/vehicle/vehicleinfo/monitor/vehicle/${this.current}/${this.limit}`),
          method: 'post',
          data: this.$http.adornData(this.searchObj, false)
        }).then(({data}) => {
          console.log(this.searchObj)
          this.total = data.data.total
          this.tableData = data.data.records
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.limit = val;
      },
    }
  }
</script>

<style scoped>
  .search-form {
    /*height: 80px;*/
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    background-color: #FBFBFB;
    /*padding: 25px 30px;*/
    padding-left: 30px;
    padding-right: 30px;
  }

  .search-result-list {
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    margin-top: 10px;
  }

  .dialog-form {
    width: 200px;
  }

  .el-row {
    margin: 25px 0;
  }

  .header-form {
    display: flex;
    justify-content: space-evenly;
  }
  .page{
    text-align: center;
    margin-top: 30px;
  }
</style>
<style>
  div .el-dialog__body {
    background-color: #FBFBFB;
    border: 1px solid #E9E9E9;
  }

  .el-form-item {
    margin-left: 10px;
  }

  .el-form-item__label {
    width: 100px;
  }
</style>
