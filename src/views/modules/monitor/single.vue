<template>
  <div class="app-container">
    <div class="search-form">
      <div>
        <el-form :inline="true" style="transform: translateY(20%)">
          <el-form-item>
            <el-select style="width: 250px;" size="mini" v-model="searchObj.factory" placeholder="车厂">
              <el-option
                v-for="item in factoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select style="width: 250px;margin-left: 2vw" size="mini" v-model="searchObj.type" placeholder="车型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              size="mini"
              placeholder="vin"
              style="width: 250px;margin-left: 2vw"
              v-model="searchObj.vin">
            </el-input>
          </el-form-item>
          <el-button title="查询" size="mini" type="primary" icon="el-icon-search" style="margin-top: 5px"
                     @click="search()">查询
          </el-button>
        </el-form>
      </div>
    </div>
    <div class="search-result-list">
      <el-table
        :data="tableData"
        border
        highlight-current-row
        min-height="500px"
        style="width: 100%">
        <el-table-column
          prop="factory"
          label="车厂"
          width="150">
        </el-table-column>
        <el-table-column
          prop="vehicleType"
          label="车型"
          width="100">
        </el-table-column>
        <el-table-column
          prop="vin"
          label="车架号">
        </el-table-column>
        <el-table-column
          prop="terminalNum"
          label="终端编号">
        </el-table-column>
        <el-table-column
          prop="motorNumber"
          label="电机号">
        </el-table-column>
        <el-table-column
          prop="groupIn"
          label="组别">
        </el-table-column>
        <el-table-column
          prop="iccid"
          label="iccid">
        </el-table-column>
        <el-table-column label="在离线情况">
          <template slot-scope="scope">
            <el-tag size="mini" type="danger" v-if="scope.row.driveStatus==0">离线</el-tag>
            <el-tag size="mini" type="primary" v-if="scope.row.driveStatus==1">在线</el-tag>
            <el-tag size="mini" type="success" v-if="scope.row.driveStatus==2">行驶中</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger">锁定</el-button>
            <el-button size="mini" type="primary">解锁</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页-->
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="search"
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
          vin: '',
          factory: '',
          type: ''
        },
        tableData: [],
        factoryOptions: [],
        typeOptions: []
      }
    },
    created() {
    },
    methods: {
      search(current = 1) {
        this.current = current;
        this.$http({
          url: this.$http.adornUrl(`/vehicle/vehicleinfo/monitor/single/${this.current}/${this.limit}`),
          method: 'post',
          data: this.$http.adornData(this.searchObj, false)
        }).then(({data}) => {
          console.log(data.data)
          this.tableData = data.data.records
          this.total = data.data.total
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
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    background-color: #FBFBFB;
    /*padding-left: 30px;*/
  }

  .search-result-list {
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    margin-top: 10px;
  }

  .page {
    text-align: center;
    margin-top: 30px;
  }
</style>
