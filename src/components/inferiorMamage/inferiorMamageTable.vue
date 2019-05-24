<template>
    <!--次品表格-->
    <div class="inferior-table">
        <el-table
                ref="multipleTable"
                class="quality-detail__content-table is-fixed-header report-table defective-list-table"
                :data="defectiveList"
                border
                style="width: 100%; margin:8px 0;"
                @select-all="selectAll">
            <el-table-column
                    class-name="no-padding"
                    align="center"
                    type="selection"
                    width="55">
                <template slot-scope="scope">
                    <div class="row-cell" v-for="(item,index) in scope.row.defectivedList" :key="Math.random()">
                        <el-checkbox @change="checkboxChange($event, item,scope.row)" v-model="item.checked"></el-checkbox>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="styleNo"
                    label="商品款号"
                    width="180">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="num"
                    label="款合计"
                    width="60">
            </el-table-column>
            <el-table-column align="center" label="工单号" width="220">
                <template slot-scope="scope">
                    <div class="row-cell" v-for="(item,index) in scope.row.defectivedList" :key="index">
                        {{item.orderNo}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属节点" width="180">
                <template slot-scope="scope">
                    <div class="row-cell" v-for="(item,index) in scope.row.defectivedList" :key="index">
                        {{item.missionNodeName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="外发厂商" width="160">
                <template slot-scope="scope">

                    <el-tooltip effect="light" :content="item.commonOutsideFactoryName || '本厂'" placement="top-start" v-for="(item,index) in scope.row.defectivedList" :key="index">
                        <div style="overflow:hidden;text-overflow:ellipsis;white-space: nowrap;border-top: 1px solid #ddd;line-height: 29px" :class="{'border-none':index==0}">
                            {{item.commonOutsideFactoryName || '本厂'}}
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所在仓库" width="160">
                <template slot-scope="scope">
                    <div class="row-cell" v-for="(item,index) in scope.row.defectivedList" :key="index">
                        {{item.storehouseName ? item.storehouseName : '无'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="颜色" width="100">
                <template slot-scope="scope">
                    <el-tooltip effect="light" :content="item.colorName" placement="top-start" v-for="(item,index) in scope.row.defectivedList" :key="index">
                        <div style="overflow:hidden;text-overflow:ellipsis;white-space: nowrap;border-top: 1px solid #ddd;line-height: 29px" :class="{'border-none':index==0}">
                            {{item.colorName}}
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="内长" width="100">
                <template slot-scope="scope">
                    <div class="row-cell" v-for="(item,index) in scope.row.defectivedList" :key="index">
                        {{item.standardName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="尺码" width="100">
                <template slot-scope="scope">
                    <div class="row-cell" v-for="(item,index) in scope.row.defectivedList" :key="index">
                        {{item.sizeName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="次品标签" width="180">
                <template slot-scope="scope">
                    <div class="row-cell" v-for="(item,index) in scope.row.defectivedList" :key="index">
                        <div v-for="(items, indexs) in item.defectiveLabelName" :key="indexs">
                            <span class="defective-labels">
                                {{items ? items : '-'}}
                            </span>
                        </div>

                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="返修次数" width="100">
                <template slot-scope="scope">
                    <div class="row-cell" v-for="(item,index) in scope.row.defectivedList" :key="index">
                        {{item.repairTimes}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="100">
                <template slot-scope="scope">
                    <div class="row-cell" v-for="(item,index) in scope.row.defectivedList" :key="index">
                        <span v-if="(item.status == 0 || item.status == 2)">返修中</span>
                        <span v-else-if="item.status == 1">已修复合格</span>
                        <span v-else-if="item.status == 3">已报废</span>
                        <span v-else-if="item.status == 4">已返厂</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    fixed="right"
                    align="center"
                    label="操作"
                    width="220">
                <template slot-scope="scope">
                    <div class="row-cell" v-for="(item,index) in scope.row.defectivedList" :key="index">
                        <div class="btn-group icon-btns">
                            <!--不确定以后加不加参数，只好把每个状态都列出来-->
                            <div v-if="item.status === 0 || item.status === 1 || item.status === 2 || item.status === 3">
                                <icon-button class="btn qualified-color" @click="handlePass(item, 1, false)">合格</icon-button>
                                <icon-button class="btn defective-color" @click="handleUpdateState(item, 2, false)">再修</icon-button>
                                <icon-button class="btn desc-color" @click="handlePass(item, 3, false)">报废</icon-button>
                                <icon-button class="btn return-color" @click="handleBatchTeturn(item.id)">退回返修</icon-button>
                            </div>
                            <div v-else-if="item.status === 4">
                                <icon-button class="btn detail-color" @click="goDetail(item.id)">查看详情</icon-button>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        props: ['defectiveList','demandArr'],
        /*************
         *
         * demandArr 已选列表行数据集合
         *
         * **********/
        data () {
            return {
            }
        },
        methods: {
            //跳转详情
            goDetail(id){
                this.$router.push({
                    path:'/inferiorMamage/detail',
                    query:{
                        id: id,
                        from: 'inferiorMamage'
                    }
                })
            },
            //退回返修
            handleBatchTeturn(id){
                this.$emit('handleReturn',id)
            },
            // 全选
            selectAll(selection){
                let checked = selection.length>0;
                let list = [];
                this.defectiveList.forEach((item,index) =>{
                    item.defectivedList.forEach((styleItem,styleIndex) =>{
                        this.$set(this.defectiveList[index].defectivedList[styleIndex],'checked',checked);
                        if(checked){
                            let obj = {
                                id: styleItem.id,
                                ligationId: styleItem.ligationId ? styleItem.ligationId : '',
                                defectivedStorehouseId: styleItem.storehouseId,
                                missionNodeId: styleItem.missionNodeId,
                                status: styleItem.status,
                                associateInStore: styleItem.associateInStore ? styleItem.associateInStore : '',
                            };
                            list.push(obj);
                        }
                    })
                });
                this.$emit('seletctList', list, checked)
            },
            // 单选
            checkboxChange($event, item,row){
                console.log($event);
                console.log(this.defectiveList);
                let checked = $event.currentTarget.checked;
                if(checked){
                    //判断是否要全选勾上开始
                    let flag = true;
                    this.defectiveList.forEach(item=>{
                        item.defectivedList.forEach($item=>{
                            if(!$item.checked){
                                flag = false
                            }
                        })

                    })
                    if(flag){
                        // 全选勾上
                        this.defectiveList.forEach(item=>{
                            this.$refs.multipleTable.toggleRowSelection(item,true)
                        })
                    }
                    //判断是否要全选勾上结束
                    let obj = {
                        id: item.id,
                        ligationId: item.ligationId ? item.ligationId : '',
                        defectivedStorehouseId: item.storehouseId,
                        missionNodeId: item.missionNodeId,
                        status: item.status,
                        associateInStore: item.associateInStore ? item.associateInStore : '',
                    };
                    this.demandArr.push(obj)
                }else{
                    this.$refs.multipleTable.toggleRowSelection(row,false)
                    this.demandArr.forEach((val, index) => {
                        if(val.id === item.id){
                            this.demandArr.splice(index,1);

                        }
                    });
                }
                this.$emit('seletctList', this.demandArr, false)
            },
            handlePass(row, type, flag) {
                let arr = [];
                let obj = {
                    id: row.id,
                    ligationId: row.ligationId ? row.ligationId : '',
                    defectivedStorehouseId: row.storehouseId,
                    missionNodeId: row.missionNodeId,
                    status: row.status,
                    associateInStore: row.associateInStore ? row.associateInStore : '',
                };
                arr.push(obj);
                this.$emit('handleDefective', arr, type, flag)
            },
            handleUpdateState (row, type, flag) {
                let arr = [];
                let obj = {
                    id: row.id,
                    ligationId: row.ligationId ? row.ligationId : '',
                    defectivedStorehouseId: row.storehouseId,
                    missionNodeId: row.missionNodeId,
                    status: row.status,
                    associateInStore: row.associateInStore ? row.associateInStore : '',
                };
                arr.push(obj);
                this.$emit('handleUpdateState', arr, type, flag)
            },
        },
    }
</script>
<style lang="scss">
    .inferior-table{
        width: 100%;
        .defective-list-table  .el-table__body,
        .defective-list-table .el-table__header{
            width: 100% !important;
        }
    }
    .defective-list-table .cell{
        padding: 0 !important;
    }
</style>
<style scoped lang="scss">
    .inferior-table{
        .qualified-color {
            color: #23c811;
        }
        .defective-color {
            color: #ff7f14;
        }
        .waste-color {
            color: #fa4150;
        }
        .desc-color {
            color: #808080;
        }
        .return-color {
            color: #3B3B3B;
        }
        .detail-color{
            color: #20A0FF;
        }
        .btn {
            text-decoration: underline;
        }
        .el-table .cell{
            padding:0 !important;
        }
        .cell__row{
            height: 32px;
            line-height: 32px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
            margin-bottom: -1px;
            &:last-child {
                border: none;
            }
        }
        .cell__btn{
            height: 32px;
            line-height: 32px;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
            margin-bottom: -1px;
            &:last-child {
                border: none;
            }
        }
        .icon-btns span{
            padding-right: 5px;
        }
        .row-cell{
            line-height: 30px;
            position: relative;
            &:after{
                position:absolute;
                top:-1px;
                left:0px;
                content:'';
                width:100%;
                height:1px;
                border-top:1px solid #ddd;
            }
            .defective-labels{
                color:#ff7f14;
            }
        }
        .border-none{
            border: none !important;
        }
    }

</style>
