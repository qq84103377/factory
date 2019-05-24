/*
 * @Author: kuhn 
 * @Description: 设计档案 - 打板文件
 * @Date: 2019-05-14 13:35:06 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-14 15:06:04
 */

<template>
  <div class="pattern-marking">
    <base-box>
      <content-wrap title="打版文件" type="big">
        <patternTable
          :dialogVisiblePMFile.sync="dialogVisiblePMFile"
          :dialogVisibleDelete.sync="dialogVisibleDelete"
          :loading="loading"
          :tableData="tableData"
          :deleteFileId.sync="deleteFileId"
          @commit="uploadPMFile"
          :reUploadFile.sync="reUploadFile">
        </patternTable>
      </content-wrap>
    </base-box>

    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="dialogVisibleDelete"
      :before-close="handleClose">
      <span>确定要删除文件？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDelete = false">取 消</el-button>
        <el-button type="primary" @click="deletePMFile">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  patternMakingList,
  patternMakingUpload,
  patternMakingUpdate,
  patternMakingDelete
} from '@/api/api'
import patternTable from './components/patternTable'

export default {
  name: "index",
  components: {
    patternTable
  },
  data() {
    return {
      tableData: [],
      loading: false,
      dialogVisiblePMFile: false,
      dialogVisibleDelete: false,
      deleteFileId: '',
      reUploadFile: ''
    }
  },
  computed: {
    isWorkBench() {
      return this.$route.path == '/designWorkbench'
    },
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    }
  },
  created() {
    // 权限
    if (!this.powerJudgement.permissions("fac.spl.design.style.templete.list") && !this.isWorkBench) {
      return
    }
    // 权限
    if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.templete.list") && this.isWorkBench) {
      return
    }
    this.getList()
  },
  methods: {
    /**
     * 获取打板文件列表数据
     */
    getList() {
      const params = { // 样衣档案ID 一个样式档案ID只能对应一个样衣
        designStyleId: this.$route.query.designStyleId,
        userId: this.userId
        // designStyleId: '479e922560ca425cbb2206a9653fce36'
      }
      patternMakingList(params).then(res => {
        console.log('打板文件列表', res.data.data)
        this.tableData = res.data.data
      })
    },
    uploadPMFile(fileList) {
      // console.log('上传文件啦')
      let params = {
        fileFullName: fileList[0].fileFullName,
        fileName: fileList[0].fileName,
        path: fileList[0].filePath,
        suffix: fileList[0].suffix,
      }
      if (this.reUploadFile) {
        params.id = this.reUploadFile.id
        params.fileCode = this.reUploadFile.fileCode
        params.version = this.reUploadFile.version
      } else {
        params.designStyleId = this.$route.query.designStyleId
      }
      // console.log('上传文件啦', params)
      params.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
      if (this.reUploadFile) {
        patternMakingUpdate(params).then(res => {
          this.reUploadFile = ''
          this.deleteFileId = ''
          if (res.data.code === 0) {
            this.getList()
            this.$message.info(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }

        })
      } else {
        patternMakingUpload(params).then(res => {
          this.reUploadFile = ''
          this.deleteFileId = ''
          if (res.data.code === 0) {
            this.getList()
            this.$message.info(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    deletePMFile() {
      patternMakingDelete(this.deleteFileId).then(res => {
        this.dialogVisibleDelete = false
        this.reUploadFile = ''
        this.deleteFileId = ''
        if (res.data.code === 0) {
          this.getList()
          this.$message.info(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style>
.pattern-marking .el-table .cell {
  display: flex;
}

.pattern-marking .operation {
  flex: 1;
  /* border-right: 1px solid rgb(223, 228, 236); */
  padding: 0 5px 0 10px;
  cursor: pointer;
  font-size: 12px;
  color: #1CA1FF;
  text-decoration: underline;
}
</style><style lang="scss" scoped>
.operations {
  .ceil {
    display: flex;
  }
}

.upload-pm-file {
  color: #FFA914;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
}

.icon-header {
  background: orange;
  width: 6px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
</style>
