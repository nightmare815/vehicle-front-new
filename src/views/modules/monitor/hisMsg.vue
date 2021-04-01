<template>
  <div class="app-container">
    <div class="search-form">
      <div>
        <el-form :inline="true" style="transform: translateY(20%)">
          <el-form-item>
            <el-input
              size="mini"
              placeholder="请输入VIN号"
              style="width: 200px"
              v-model="searchObj.VIN">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select style="width: 200px;" size="mini" v-model="searchObj.type" placeholder="报文类型">
              <el-option
                v-for="item in options"
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
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']">
            </el-date-picker>
          </el-form-item>
          <el-button style="margin-top: 5px" title="查询" size="mini" type="primary" icon="el-icon-search">查询</el-button>
        </el-form>
      </div>
    </div>
    <div class="search-result-list">
      <div style="font-size: 12px;color: rgba(0, 0, 0, 0.65);height: 18px;line-height: 18px">共{{ table.count }}条记录</div>
      <el-table
        :data="table.data"
        height="100"
        border
        style="width: 100%">
        <el-table-column
          prop="vin"
          label="vin"
          width="180">
        </el-table-column>
        <el-table-column
          prop="type"
          label="报文类型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pickTime"
          label="采集时间">
        </el-table-column>
        <el-table-column
          prop="serverTime"
          label="服务器时间">
        </el-table-column>
        <el-table-column
          prop="hex"
          label="hex">
        </el-table-column>
        <el-table-column
          label="操作">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        searchObj: {
          VIN: '',
          type: '',
          date: {}
        },
        table: {
          count: 0,
          data: []
        },
        options: [{
          value: '全部',
          label: '全部'
        }, {
          value: '登入',
          label: '登入'
        }, {
          value: '实时',
          label: '实时'
        }, {
          value: '补发',
          label: '补发'
        }, {
          value: '登出',
          label: '登出'
        }],
        value: ''
      }
    }
  }
</script>

<style scoped>
  .search-form {
    /*height: 80px;*/
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

  .search-form-list .el-col {
    margin-left: 20px;
  }

  .search-form-list {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
</style>
<style>
</style>
