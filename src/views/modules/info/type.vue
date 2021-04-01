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
            <el-input
              size="mini"
              placeholder="车型名称"
              style="width: 200px"
              v-model="searchObj.type">
            </el-input>
          </el-form-item>
          <el-button title="查询" size="mini" type="primary" icon="el-icon-search" style="margin-top: 5px">查询</el-button>
          <el-button title="添加" size="mini" type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">添加</el-button>
        </el-form>
      </div>
      <el-dialog title="添加" :visible.sync="dialogFormVisible" width="45%">
        <el-form :model="form" :inline="true" class="demo-form-inline">
          <el-form-item label="车型名称">
            <el-input class="dialog-form" size="small" v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input class="dialog-form" size="small" v-model="form.desc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否可用">
            <el-select class="dialog-form" size="small" v-model="form.avaliable">
              <el-option label="启用" value="启用"></el-option>
              <el-option label="禁用" value="禁用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input class="dialog-form" size="small" v-model="form.remarks" autocomplete="off"></el-input>
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
          prop="类型名"
          label="类型名">
        </el-table-column>
        <el-table-column
          prop="车厂"
          label="车厂">
        </el-table-column>
        <el-table-column
          prop="账号"
          label="账号">
        </el-table-column>
        <el-table-column
          prop="启用"
          label="启用">
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
        searchObj: {},
        table: {
          count: 0,
          data: []
        },
        factoryOptions: [],
        typeOptions: [],
        dialogFormVisible: false,
        form: {
          name: '',
          desc: '',
          remarks: '',
          avaliable: '启用'
        },
      }
    },
    mounted() {
    },
  }
</script>

<style scoped>
  .search-form {
    /*height: 80px;*/
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    background-color: #FBFBFB;
  }

  .search-result-list {
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    margin-top: 10px;
  }

  .dialog-form {
    width: 150px;
  }

</style>
<style>
  div .el-dialog__body {
    background-color: #FBFBFB;
    border: 1px solid #E9E9E9;
  }

  .el-form-item {
    margin-left: 50px;
  }
</style>
