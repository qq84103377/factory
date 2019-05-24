<template>
  <div class="sampling-report-table">
    <el-row class="mgt8 mgb8">
      <div class="dis-block">外发厂：{{formData.fabricatingPlantName?formData.fabricatingPlantName : '未填写'}}</div>
      <div class="dis-block border-line"></div>
      <div class="dis-block">外发厂编号：{{formData.fabricatingPlantCode?formData.fabricatingPlantCode : '未填写'}}</div>
    </el-row>
    <el-table
        :data="formData.tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="deliveryQuantity"
          align="center"
          label="交货数量" class-name="column-name">
          <template slot-scope="scope">
            <el-input v-model="scope.row.deliveryQuantity" :min="0" :placeholder="formData.waitDeliveryQuantity > 0 ? `未报数${formData.waitDeliveryQuantity}` : `未报数0`" @change="changNum" type="number"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="selectCheckQuantity"
          align="center"
          label="抽检数" class-name="column-name">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.selectCheckQuantity" :min="0" @change="changNum"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="qualified"
          align="center"
          label="合格数" class-name="column-name">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.qualified" :min="0" @change="changNum"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="defectived"
          align="center"
          label="次品数" class-name="column-name">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.defectived" :min="0" @change="changNum"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="wasted"
          align="center"
          label="废品数" class-name="column-name">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.wasted" :min="0" @change="changNum"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="合格率">
          <!-- 合格数 / 抽检数 -->
          <template slot-scope="scope">
            <span>{{qualification}}</span>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
export default {
  props:['formData'],
  computed:{
    qualification() {
      if(this.formData.tableData[0].qualified && this.formData.tableData[0].selectCheckQuantity) {
        let sum = this.formData.tableData[0].qualified*1 / this.formData.tableData[0].selectCheckQuantity*1
        sum = (sum* 100).toFixed(2) 
        return `${sum}%`
      } else {
        return `0%`
      }
    },
  },
  methods: {
    // 只能输入正整数
    changNum (val) {
      let reg = /^[0-9]+$/
      if (!reg.test(val*1)) return this.$message.error('请输入正整数')
    },
  }
}
</script>
<style lang="scss">
.sampling-report-table{
  .dis-block{
    display:inline-block;
  }
  .column-name{
    .cell {
      padding:0 !important;
      height: 36px;
    }
    .el-input__inner{
      background-color: #FFF9ED;
      height: 40px;
      border:none;
    }
  }
}
</style>


