<template>
    <!--次品表格-->
    <div class="defective-table">
        <!--节点外发-->
        <el-table class="quality-detail__content-table is-fixed-header report-table defective-list-table" :data="defectiveList" border style="width: 100%; margin:8px 0;"  v-if="associateOutside" key="outsideDefectiveTable">
            <el-table-column
                    v-if="!componentData.associateWYM"
                    align="center"
                    :render-header="renderHeaderCheck"
                    width="55">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.defectiveds" :key="index" class="cell__row">
                                <div><el-checkbox v-model="item.checked" @change="change"></el-checkbox></div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="commonOutsideFactoryName" label="外发厂商" min-width="130" align="center">
            </el-table-column>
            <el-table-column prop="total" label="次品数" width="100" align="center">
            </el-table-column>
            <el-table-column v-if="componentData.associateWYM || componentData.associateLigation" prop="lathe" label="床次" width="100" align="center">
                <template slot-scope="scope">
                    <div  v-for="(item,index) in scope.row.defectiveds" class="cell__row">
                        <i class="dot"></i>{{ item.lathe }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="componentData.associateWYM" prop="latheNo" label="本次序号" width="100" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.defectiveds">{{item.latheNo}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="componentData.associateWYM" prop="wym" label="唯一码" width="200" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.defectiveds">{{item.wym}}</div>
                </template>
            </el-table-column>
            <!-- 关联扎号 -->
            <el-table-column v-if="componentData.associateLigation" prop="ligationNo" label="所属扎号" width="140" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.defectiveds">{{item.ligationNo}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="styleNo" label="货品款号" width="100" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.defectiveds">{{item.styleNo}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="colorName" label="所在仓库" width="100" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.defectiveds">{{item.storehouseName?item.storehouseName : '无'}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="colorName" label="颜色" width="100" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.defectiveds">{{item.colorName}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="lengthShow" prop="standardName" label="内长" width="100" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.defectiveds">{{item.standardName}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="sizeName" label="尺码" width="100" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.defectiveds">{{item.sizeName}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="defectiveLabelName" label="次品标签" align="center" width="180">
                <template slot-scope="scope">
                    <div class="defective-labels cell__row" style="display: inherit" v-for="item in scope.row.defectiveds" >
                        <span v-for="(el, index) in item.defectiveLabelName" :key="index">{{ el }} </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="repairTimes" label="返修次数" width="100" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.defectiveds">{{item.repairTimes}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="状态" width="80" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.defectiveds">
                        <span v-if="(item.status == 0 || scope.row.status == 2)">返修中</span>
                        <span v-else-if="item.status == 1">已修复合格</span>
                        <span v-else-if="item.status == 3">已报废</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" min-width="200" align="center">
                <template slot-scope="scope">
                    <div class="btn-group">
                        <div v-for="item in scope.row.defectiveds" class="cell__btn">
                            <icon-button class="btn qualified-color" @click="handlePass(false,item,1)">合格</icon-button>
                            <icon-button class="btn defective-color" @click="handleUpdateState(item, 2)">再修</icon-button>
                            <icon-button class="btn desc-color" @click="handlePass(false,item,3)">报废</icon-button>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-table v-else class="quality-detail__content-table is-fixed-header report-table defective-list-table" :data="defectiveList" border style="width: 100%; margin:8px 0;" @selection-change="handleSelectionChange" key="defectiveTable">
            <el-table-column type="selection" width="55" v-if="!componentData.associateWYM" align="center">
            </el-table-column>
            <el-table-column align="center" v-if="componentData.associateWYM || componentData.associateLigation" prop="lathe" label="床次" width="100">
                <template slot-scope="scope">
                    <i class="dot"></i>{{ scope.row.lathe }}
                </template>
            </el-table-column>
            <el-table-column align="center" v-if="componentData.associateWYM" prop="latheNo" label="本次序号" width="100">
            </el-table-column>
            <el-table-column align="center" v-if="componentData.associateWYM" prop="wym" label="唯一码" width="200">
            </el-table-column>
            <!-- 关联扎号 -->
            <el-table-column align="center" v-if="componentData.associateLigation" prop="ligationNo" label="所属扎号" width="140">
            </el-table-column>
            <el-table-column align="center" prop="styleNo" label="货品款号">
            </el-table-column>
            <el-table-column align="center" prop="storehouseName" label="所在仓库" width="160">
                <template slot-scope="scope">
                    {{scope.row.storehouseName ? scope.row.storehouseName : '无'}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="colorName" label="颜色" width="120">
            </el-table-column>
            <el-table-column align="center" v-if="lengthShow" prop="standardName" label="内长" width="120">
            </el-table-column>
            <el-table-column align="center" prop="sizeName" label="尺码" width="120">
            </el-table-column>
            <el-table-column align="center" prop="defectiveLabelName" label="次品标签" width="180">
                <template slot-scope="scope">
                    <div class="defective-labels">
                        <span v-for="(item, index) in scope.row.defectiveLabelName" :key="index">{{ item }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="repairTimes" label="返修次数" width="100">
            </el-table-column>
            <el-table-column align="center" prop="name" label="状态" width="120">
                <template slot-scope="scope">
                    <span v-if="(scope.row.status == 0 || scope.row.status == 2)">返修中</span>
                    <span v-else-if="scope.row.status == 1">已修复合格</span>
                    <span v-else-if="scope.row.status == 3">已报废</span>
                </template>
            </el-table-column>
            <el-table-column prop="name"align="center" label="操作" width="300">
                <template slot-scope="scope">
                    <div class="btn-group icon-btns">
                        <icon-button class="btn qualified-color" @click="handlePass(false,scope.row,1)">合格</icon-button>
                        <icon-button class="btn defective-color" @click="handleUpdateState(scope.row, 2)">再修</icon-button>
                        <icon-button class="btn desc-color" @click="handlePass(false,scope.row,3)">报废</icon-button>
                        <!--非唯一码和扎号才显示-->
                        <icon-button
                                v-if="!componentData.associateWYM || !componentData.associateLigation"
                                class="btn return-color" @click="handleBatchTeturn(scope.row.id)">退回返修</icon-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        props: ['defectiveList', 'componentData','associateOutside'],
        data () {
            return {
                checked: false
            }
        },
        watch:{
            defectiveList() {
                if(this.associateOutside) {
                    this.defectiveList.forEach(item => {
                        item.defectiveds.forEach(i => {
                            this.$set(i, 'checked', false)
                        })
                    })
                }
            }
        },
        methods: {
            //退回返修
            handleBatchTeturn(id){
                this.$emit('handleReturn',id)
            },
            // 外发节点的选择
            change() {
                let list = []
                this.defectiveList.forEach(item => {
                    item.defectiveds.forEach(i => {
                        if(i.checked) {
                            let obj = {
                                defectivedId: i.id,
                                ligationId: i.ligationId ? i.ligationId : '',
                                defectivedStorehouseId: i.storehouseId
                            }
                            list.push(obj)
                        }
                    })
                })
                this.$emit('seletctList',list)
            },
            // 非外发节点的选择
            handleSelectionChange(val) {
                let list = [];
                val.forEach(item => {
                    let obj = {
                        defectivedId: item.id,
                        ligationId: item.ligationId ? item.ligationId : '',
                        defectivedStorehouseId: item.storehouseId
                    }
                    list.push(obj)
                })
                this.$emit('seletctList',list)
            },
            handlePass(val,row, type) {
                this.$emit('handleDefective', val, row, type)
            },
            handleUpdateState (row, type) {
                this.$emit('handleUpdateState', row, type)
            },
            selectAll(val) {
                this.defectiveList.forEach(item => {
                    item.defectiveds.forEach(i => {
                        val.srcElement.checked > 0 ? this.$set(i, 'checked', true) : this.$set(i, 'checked', false)
                    })
                })
                this.change()
            },
            renderHeaderCheck(createElement, { column, $index }) {
                return <div class="materiel-header">{<el-checkbox onChange={this.selectAll} vModel="checked"></el-checkbox>}</div>;
            },
        },
    }
</script>
<style lang="scss">
    .defective-table{
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
    .defective-table{
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
        .return-color{
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
    }

</style>
