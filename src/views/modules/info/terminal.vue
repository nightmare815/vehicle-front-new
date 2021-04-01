<template>
  <div class="app-container">
    <div class="search-form">
      <div>
        <el-form :inline="true" style="transform: translateY(20%)">
          <el-form-item label="">
            <el-input
              size="mini"
              placeholder="终端编号"
              style="width: 200px"
              v-model="searchObj.terminalNum">
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select style="width: 200px;" size="mini" v-model="searchObj.status" placeholder="状态">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select style="width: 200px;" size="mini" v-model="searchObj.hardVersion" placeholder="固件版本">
              <el-option
                v-for="item in hardOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker
              size="mini"
              v-model="searchObj.date"
              type="datetimerange"
              align="right"
              start-placeholder="生产开始日期"
              end-placeholder="生产结束日期"
              :default-time="['12:00:00', '08:00:00']">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-select style="width: 200px;" size="mini" v-model="searchObj.factory" placeholder="车厂">
              <el-option
                v-for="item in factoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button style="margin-top: 5px" title="查询" size="mini" type="primary" icon="el-icon-search">查询</el-button>
          <el-button title="添加" size="mini" type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">添加
          </el-button>
        </el-form>
      </div>


      <el-dialog title="添加" :visible.sync="dialogFormVisible" width="50%">
        <el-form :model="form" :inline="true" class="demo-form-inline">
          <el-form-item label="终端编号" required>
            <el-input class="dialog-form" size="small" v-model="form.terminalNum" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="ICCID">
            <el-input class="dialog-form" size="small" v-model="form.ICCID" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="硬件版本">
            <el-input class="dialog-form" size="small" v-model="form.hardVersion" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="软件版本">
            <el-input class="dialog-form" size="small" v-model="form.softVersion" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="SIM卡号">
            <el-input class="dialog-form" size="small" v-model="form.SIM" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input class="dialog-form" size="small" v-model="form.address" autocomplete="off"></el-input>
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
        :data="table.data"
        height="100"
        border
        style="width: 100%">
        <el-table-column
          prop="终端编号"
          label="终端编号">
        </el-table-column>
        <el-table-column
          prop="ICCID"
          label="ICCID">
        </el-table-column>
        <el-table-column
          prop="车厂"
          label="车厂">
        </el-table-column>
        <el-table-column
          prop="生产日期"
          label="生产日期">
        </el-table-column>
        <el-table-column
          prop="绑定车辆"
          label="绑定车辆">
        </el-table-column>
        <el-table-column
          prop="绑定日期"
          label="绑定日期">
        </el-table-column>
        <el-table-column
          prop="固件版本"
          label="固件版本">
        </el-table-column>
        <el-table-column
          prop="当前状态"
          label="当前状态">
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
          terminalNum: '',
          status: '',
          hardVersion: '',
          date: '',
          factory: ''
        },
        hardOptions: [],
        statusOptions: [],
        factoryOptions: [],
        dialogFormVisible: false,
        form: {
          terminalNum: '',
          ICCID: '',
          hardVersion: '',
          softVersion: '',
          SIM: '',
          address: ''
        },
        table: {
          count: 0,
          data: []
        }
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

  .search-form-list {
    display: flex;
    justify-content: space-evenly;
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

  .el-col {
    margin-left: 20px;
  }
</style>
