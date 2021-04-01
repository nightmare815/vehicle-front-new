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
              placeholder="围栏名称"
              style="width: 200px"
              v-model="searchObj.query">
            </el-input>
          </el-form-item>
          <el-button title="查询" size="mini" type="primary" icon="el-icon-search" style="margin-top: 5px"
                     @click="search">查询
          </el-button>
          <el-button title="添加" size="mini" type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">添加
          </el-button>
        </el-form>
      </div>
      <el-dialog :title='updateFence?"修改":"添加"' :visible.sync="dialogFormVisible" width="45%">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="围栏名称" prop="fenceName">
            <el-input v-model="addForm.fenceName"></el-input>
          </el-form-item>
          <el-form-item label="围栏中心" prop="center">
            <el-input v-model="addForm.center" placeholder="经度，纬度以英文逗号隔开"></el-input>
          </el-form-item>
          <el-form-item label="围栏半径" prop="radius">
            <el-input v-model="addForm.radius" placeholder="单位：米"></el-input>
          </el-form-item>
          <el-form-item label="所属车厂" prop="factory">
            <el-input v-model="addForm.factory"></el-input>
          </el-form-item>
          <el-form-item prop="vin" label="设定车辆">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button type="warning" v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!updateFence" type="primary" @click="submitForm('addForm')">立即创建</el-button>
            <el-button v-if="updateFence" type="primary" @click="submitForm('addForm')">确认修改</el-button>
            <el-button @click="resetForm('addForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="search-result-list">
      <el-table
        :data="tableData"
        min-height="400"
        border
        style="width: 100%">
        <el-table-column
          prop="fenceName"
          label="围栏名称">
        </el-table-column>
        <el-table-column
          prop="center"
          label="坐标中心">
        </el-table-column>
        <el-table-column
          prop="radius"
          label="坐标半径（单位:米）">
        </el-table-column>
        <el-table-column
          prop="factory"
          label="所属车厂">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="updateFenceInfo(scope.row)">修改</el-button>
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
        :current-page.sync="current"
        :page-size="limit"
        layout="total, prev, pager, next, jumper"
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
        current: 1,
        limit: 5,
        total: 0,
        updateFence: false,
        searchObj: {
          query: ''
        },
        tableData: [],
        factoryOptions: [],
        typeOptions: [],
        dialogFormVisible: false,
        addForm: {
          id:'',
          fenceName: '',
          center: '',
          radius: '',
          factory: '',
          vin: ''
        },
        rules: {
          fenceName: [
            { required: true, message: '请输入围栏名称', trigger: 'blur' }
          ],
          center: [
            { required: true, message: '请输入围栏中心', trigger: 'blur' }
          ],
          radius: [
            { required: true, message: '请输入围栏半径', trigger: 'blur' }
          ]
        },
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
      }
    },
    mounted() {
    },
    methods: {
      submitForm(formName) {
        const that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.addForm.vin = that.dynamicTags.join(',')
            if(that.updateFence) {
              this.$http({
                url: this.$http.adornUrl(`/vehicle/fence/updateFence`),
                method: 'post',
                data: this.$http.adornData(that.addForm, false)
              }).then(({data}) => {
                this.$message({
                  type: 'success',
                  message: '更新围栏成功'
                })
                this.$refs[formName].resetFields()
                this.dynamicTags = []
                this.addForm = {}
                this.dialogFormVisible = false
                this.updateFence = false;
                this.search();
              }).catch(err => {
                this.dynamicTags = []
                this.$message({
                  type: 'error',
                  message: '更新围栏失败了'
                })
                this.updateFence = false;
              })
            }else {
              this.$http({
                url: this.$http.adornUrl(`/vehicle/fence/addFence`),
                method: 'post',
                data: this.$http.adornData(that.addForm, false)
              }).then(({data}) => {
                this.$message({
                  type: 'success',
                  message: '添加围栏成功'
                })
                this.$refs[formName].resetFields()
                this.dynamicTags = []
                this.dialogFormVisible = false
                this.updateFence = false;
                this.search();
              }).catch(err => {
                this.dynamicTags = []
                this.$message({
                  type: 'error',
                  message: '添加围栏失败了'
                })
                this.updateFence = false;
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.addForm = {}
        this.$refs[formName].resetFields()
        this.dynamicTags = []
        this.dialogFormVisible = false
        this.updateFence = false;
      },
      search() {
        if (this.searchObj.query) {
          this.$http({
            url: this.$http.adornUrl(`/vehicle/fence/getFenceByName/${this.current}/${this.limit}`),
            method: 'post',
            data: this.$http.adornData(this.searchObj, false)
          }).then(({data}) => {
            this.tableData = data.data.records
            this.total = data.data.total
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '查询围栏失败了'
            })
          })
        } else {
          this.$http({
            url: this.$http.adornUrl(`/vehicle/fence/getAllFence/${this.current}/${this.limit}`),
            method: 'get',
            params: {}
          }).then(({data}) => {
            console.log(this.current, this.limit)
            this.tableData = data.data.records
            this.total = data.data.total
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '查询围栏失败了'
            })
          })
        }
      },
      updateFenceInfo(row) {
        this.updateFence = true;
        this.dialogFormVisible = true;
        console.log(row)
        // this.addForm = row
        this.addForm.id = row.id
        this.addForm = { ...row }
        this.dynamicTags = row.vin.split(',')
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },

      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      handleInputConfirm() {
        let inputValue = this.inputValue
        if (inputValue) {
          this.dynamicTags.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.limit = val;
      },
    }
  }
</script>

<style scoped>
  .page{
    text-align: center;
    margin-top: 30px;
  }
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
  div .el-dialog__body {
    background-color: #FBFBFB;
    border: 1px solid #E9E9E9;
  }

  .el-form-item {
    margin-left: 50px;
  }
</style>
