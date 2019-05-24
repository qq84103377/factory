<template>
  <div class="num-node-outside">
    <template class="review-opinions-table">
      <el-table
        :data="tableData"
        border
        empty-text=" "
        style="width: 100%">
        <el-table-column
          prop="date"
          label="加工厂商名称">
          <template slot-scope="scope" class-name='no-padding'>
            <el-select
                v-if="!isOutsideFlag"
                v-model="scope.row.outsideFactoryId"
                filterable 
                placeholder="请选择外发厂" :id="`outside${scope.$index}`">
              <el-option
                  v-for="item in outsideFactoryList"
                  :key="item.id"
                  :label="item.name"
                  :disabled="item.disabled"
                  :value="item.id">
              </el-option>
            </el-select>
            <span v-else>{{scope.row.facMissionOutsideFactoryName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="加工单价">
          <template slot-scope="scope" class-name='no-padding'>
            <el-input type="number" v-if="!isOutsideFlag" v-model="scope.row.machiningUnitPrice" :id="scope.$index" placeholder="元/件"></el-input>
            <span v-else>{{scope.row.machiningUnitPrice}}</span>
          </template>
        </el-table-column>
        <template slot="append" v-if="!isOutsideFlag">
          <div @click="add" class="orange" style="padding-left:10px;cursor: pointer;">+添加</div>
        </template>
      </el-table>
    </template>
  </div>
</template>
<script>
import { outsideFactoryListForSelect } from '@/api'
export default {
  props: ['tableData','isOutsideFlag'],
  data() {
    return {
      outsideFactoryList: [],
      outsideFlag: false
    }
  },
  watch:{
    'tableData'(val) {
      if(val) {
          this.setItemDisabled(val, true)
      }
    },
  },
  methods: {
    changeNum(val) {
      // let reg = /^\d+(\.\d{1,2})?$/
      // if (!reg.test(val)) return this.$message.error('只能输入正数，且只能保留两位小数')
    },
    // 下拉禁用
      async setItemDisabled(val, isDisabled) {
        console.log(this.outsideFactoryList.length)
        if(!this.outsideFactoryList.length){
            await this.remoteMethod()
        }
      val.forEach(i => {
        this.outsideFactoryList.forEach(item => {
          if (i.outsideFactoryId == item.id) {
            this.$set(item,'disabled', isDisabled)
          }
        })
      })
    },
    // 添加行
    add () {
      let addRow = {
        outsideFactoryId:'',
        machiningUnitPrice: ''
      }
      this.tableData.push(addRow)
    },
    //供应商搜索
      async remoteMethod() {
        let params = {
            userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
            factoryId:JSON.parse(sessionStorage.getItem("last_login")).id,
        };
          await outsideFactoryListForSelect(params).then(res => {
            if (res.data.code === 0) {
                this.outsideFactoryList = res.data.data;
                this.outsideFactoryList.forEach( i => {
                  this.$set(i, 'disabled', false)
                })
            }else{
                this.outsideFactoryList = [];
            }
        });
    },
  },
  async created(){
    await this.remoteMethod()
  }
}
</script>
<style lang="scss">
.num-node-outside{
  .el-table__empty-block{
    display:none;
  }
  td.no-padding,
    td.operations-cell{
        .cell{
            padding: 0 ;
        }
    }
    td.operations-cell{
      .cell{
          height: 100%;
          line-height: 100%;
      }
    }
    .el-input__inner{
        border: none;
        background-color: #fff;
    }
}
</style>

