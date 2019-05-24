<template>
<div class="search-mission-table">
    <el-table :data="table" border style="width:100%">
        <el-table-column prop="billPurchaseOrderNo" label="采购单号" min-width="120">
          <template slot-scope="scope">
            <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.billPurchaseOrderNo"
                      :key="i"
                      >{{item}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="designStyleNo" label="设计款号" min-width="120" v-if="isSampleMaterial">
          <template slot-scope="scope">
            <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.designStyleNo"
                      :key="i"
                      >{{item}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchaserName" label="采购员" min-width="120">
          <template slot-scope="scope">
            <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.purchaserName"
                      :key="i"
                      >{{item}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="datePurchase" label="采购日期" width="120">
            <template slot-scope="scope">
                {{scope.row.datePurchase |filterTime }}
            </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" min-width="120">
        </el-table-column>
        <el-table-column prop="name" label="操作" width="200" align="center">
            <template slot-scope="scope">
                <div class="this-order" v-show="!scope.row.isshow" @click="addThisOrder(scope.row,scope.$index,1)">
                    选择此采购单
                </div>
                <div class="btns" v-show="scope.row.isshow">
                    <span class="this-order" @click="checkMateralAll(scope.row)">选择全部物料</span>
                    <span class="cancel-btn" @click="cancel(scope.row)">取消</span>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <!-- 选择新采购单的弹窗 -->
    <el-dialog :modal-append-to-body="false" class="custom-dialog edit-difficulty-dialog" title="选择新采购单"
                   :visible.sync="addShow" size="tiny">
                   <div style="height:50px;text-align:center;line-height:50px;">
                       是否确定选择新采购单并覆盖已选的物料列表？
                   </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addShow = false">取 消</el-button>
                <el-button :loading="isSubmitting"  type="primary" @click="addThisOrder(curRow,curIndex)">确定</el-button>
            </div>
        </el-dialog>
</div>
</template>

<script>
export default {
    props:['tableData','selectedData','input','isSampleMaterial'],
    filters:{
        filterTime(val) {
            if(val) {
                return val.slice(0, 11);
            }else {
                return "未设置"
            }
        }
    },
    data () {
        return {
            addShow: false,
            curRow: {},
            curIndex: null
        }
    },
    watch: {
        selectedData(v) {
            if (v.length === 0) {
                this.table.forEach(i => {
                    this.$set(i, 'isshow', false)
                })
            }
        }
    },
    computed:{
        table() {
            return JSON.parse(JSON.stringify(this.tableData));
        },
    },
    methods:{
        addThisOrder(row,index,type) {
            this.curRow = row
            this.curIndex = index
            if(type&&this.selectedData.length > 0) {
                return this.addShow = true
            }
            this.table.forEach(i => {
                this.$set(i, 'isshow', false)
            })
            this.$set(row, 'isshow', true)
            this.addShow = false
            this.$emit('materialSku', row)
        },
        // 判断有没有删除物料
        isDelSku (num) {
            if(this.selectedData[0].list.length == num ) {
                this.$message.error('已添加该采购单全部物料!');
                return false;
            }
            return true;
        },
        async checkMateralAll(row) {
            if(await this.isDelSku(row.materialSkuIds.length)) {
                this.$emit('materialSku', row,1)
            }
        },
        cancel(row) {
            this.$set(row, 'isshow', false)
            this.$emit('purchaseCancel')
        }
    },
}
</script>

<style lang='scss' scoped>
.this-order {
    min-width:60px;
    height:24px;
    font-size:12px;
    font-family:SourceHanSansCN-Regular;
    color:rgba(28,161,255,1);
    line-height:24px;
    cursor:pointer;
    text-decoration:underline;
}
.btns{
    display:flex;
    justify-content: space-between;
}
.cancel-btn{
    width:40%;
    cursor: pointer;
    text-decoration: underline;
    padding-left:10px;
    border-left:1px solid rgb(223, 228, 236);
}
</style>
