<template>
  <!-- 模态框 -->
  <section class="modal">
    <el-dialog title="按货品SKU查看BOM" :visible.sync="centerDialogVisible" width="30%" align="center">
      <div>
        <span>白色</span>
        <span>S</span>
        <span>3 款物料</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    return {
    };
  }
};
</script>

<style lang="scss">
.modal {
  .Divide-line {
    width: 100%;
    height: 1px;
    background-color: #e6eaf0;
    margin: 16px 0 32px;
  }
  .el-dialog__header .el-dialog__headerbtn {
    display: none;
  }
  .el-dialog__body {
    border-top: 1px solid #e6eaf0;
    margin-top: 16px;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .el-dialog__footer button {
    width: 130px;
    height: 40px;
    border-radius: 2px;
    background-color: #ffa914;
  }
}
</style>