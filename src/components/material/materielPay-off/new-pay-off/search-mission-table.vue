<template>
<div class="search-mission-table">
    <el-table :data="table" border style="width:100%">
        <el-table-column prop="styleNo" label="商品款号" min-width="120">
        </el-table-column>
        <el-table-column prop="facMissionNo" label="工单号" min-width="120">
        </el-table-column>
        <el-table-column prop="placeorderDate" label="制单日期" width="120">
            <template slot-scope="scope">
                {{scope.row.placeorderDate |filterTime }}
            </template>
        </el-table-column>
        <el-table-column prop="deliveryDate" label="交货日期" width="120">
            <template slot-scope="scope">
                {{scope.row.deliveryDate | filterTime}}
            </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户" min-width="120">
        </el-table-column>
        <el-table-column prop="num" label="订货数" min-width="120">
        </el-table-column>
        <el-table-column prop="chargerName" label="负责人" min-width="120">
        </el-table-column>
        <el-table-column prop="name" label="操作" min-width="200" align="center">
            <template slot-scope="scope">
                <div class="this-order" v-show="scope.row.isshow" @click="addThisOrder(scope.$index,scope.row)">
                    选择此工单
                </div>
                <div class="btns" v-show="!scope.row.isshow">
                    <span class="this-order" @click="checkMateralAll(scope.row)">选择全部物料</span>
                    <span class="cancel-btn" @click="cancel(scope.row,scope.$index)">取消</span>
                </div>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
export default {
    props:['tableData','selectedData'],
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
            cancelData: []
        }
    },
    computed:{
        table() {
            return this.tableData;
        }
    },
    methods:{
        judge(val) {
            for(let item of this.selectedData) {
                if(item.facMissionId == val.facMissionId) {
                    this.$emit('facMissionNoId',val,1);
                    this.$set(val, 'isshow', false)
                    return false;
                }
            }
            return true;
        },
        // 判断有没有删除改工单的物料
        isDelSku (row) {
            for(let item of this.selectedData) {
                if(row.facMissionId == item.facMissionId) {
                    if(item.materialsSkus.length == row.materialSkus.length ) {
                        this.$message.error('已添加该工单全部物料');
                        return false;
                    }
                }
            }
            return true;
        },
        // 选择此工位
        async addThisOrder(index,row) {
            for(let item of this.selectedData) {
                if(item.facMissionId == row.facMissionId) {
                    this.$emit('facMissionNoId',row,1);
                    this.$set(row, 'isshow', false)
                    return
                }
            }
            this.$set(row, 'isshow', false)
            this.$emit('facMissionNoId',row);

        },
        // 选择全部物料
        async checkMateralAll(row) {
            if(await this.isDelSku(row)) {
                this.$emit('facMissionNoId',row,1);
            }
        },
        // 取消
        cancel(row,index) {
            let deleted = this.tableData[index]
            this.$set(row, 'isshow', true)
            this.$emit('missinCancel',deleted)
        },
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
    width:30%;
    cursor: pointer;
    text-decoration: underline;
    padding-left:10px;
    border-left:1px solid rgb(223, 228, 236);
}
</style>
