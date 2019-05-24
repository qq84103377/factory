/*
 * @Author: kuhn 
 * @Description: 设计档案 - 打板文件 - 表格
 * @Date: 2019-05-14 13:40:01 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-14 13:40:21
 */

<template>
  <div class="pattern-table">
    <el-table
      v-loading="loading"
      border
      :data="tableData"
      empty-text=" ">
      <el-table-column
        prop="fileFullName"
        width="140px"
        label="打板文件名">
      </el-table-column>
      <el-table-column
        prop="fileCode"
        width="140px"
        label="版号">
      </el-table-column>
      <el-table-column
        prop="userName"
        width="100px"
        label="上传人">
      </el-table-column>
      <el-table-column prop="dateCreated" label="上传时间"></el-table-column>
      <el-table-column class-name=operations label="操作">
        <template slot-scope="scope">
          <div class="operation" @click="downLoad(scope.row.path)">
            下载
          </div>
          <div class="operation" @click="reUpload(scope.row)">
            <p-m-file-upload @commit="handleCommit" :tipsWord="'重新上传'"></p-m-file-upload>
          </div>
          <div class="operation delete" @click="deletePMFile(scope.row.id)">
            删除
          </div>
        </template>
      </el-table-column>
      <template slot="append">
        <p-m-file-upload @commit="handleCommit"></p-m-file-upload>
      </template>
    </el-table>
  </div>
</template>

<script>
import {
  patternMakingUpload,
  patternMakingUpdate,
  patternMakingDelete
} from '@/api/api'
import PMFileUpload from './PMFileUpload'
export default {
  props: ['reUploadFile', 'dialogVisibleDelete', 'deleteFileId', 'loading', 'tableData'],
  components: {
    PMFileUpload
  },
  methods: {
    downLoad(url) {
      window.open(url)
    },
    reUpload(item) {
      this.$emit('update:reUploadFile', item)
    },
    deletePMFile(id) {
      this.$emit('update:dialogVisibleDelete', true)
      this.$emit('update:deleteFileId', id)
    },
    handleCommit(params) {
      this.$emit('commit', params)
    }
  }
}
</script>

<style>
.pattern-table .el-table .cell {
  display: flex;
}

.pattern-table .el-table__empty-block {
  min-height: 0;
}

.pattern-table .operation {
  flex: 1;
  /* border-right: 1px solid rgb(223, 228, 236); */
  padding: 0 5px 0 10px;
  cursor: pointer;
  font-size: 12px;
  color: #1CA1FF;
  text-decoration: underline;
}

.pattern-table td.operations .cell {
  padding: 0;
}
</style><style lang="scss" scoped>
.pattern-table {
  width: 85%;
}

.operations {
  .ceil {
    display: flex;
  }

  .operation.delete {
    color: #FA4150;
  }

}

.upload-pm-file {
  color: #FFA914;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  cursor: pointer;
}

.pattern-marking-header {
  position: relative;
  margin-bottom: 1rem;
  font-size: 20px;

  .icon-header {
    background: orange;
    display: inline-block;
    width: 6px;
    height: 20px;
    vertical-align: middle;
    position: absolute;
    left: -16px;
  }
}
</style>
