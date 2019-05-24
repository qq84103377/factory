<template>
    <div class="waste-table">
        <!--外发节点-->
        <el-table class="quality-detail__content-table is-fixed-header report-table waste-list-table" :data="componentData.wastedoutsides" border style="width: 100%;margin:8px 0;" v-if="instanceWorkflow.components.information.associateOutside" key="outsideWasteTable">
            <el-table-column
                    align="center"
                    v-if="instanceWorkflow.components.information.associateInStore"
                    :render-header="renderHeaderCheck"
                    width="55">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.wasteds" :key="index" class="cell__row">
                        <div><el-checkbox v-model="item.checked" @change="change"></el-checkbox></div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="commonOutsideFactoryName" label="外发厂商" min-width="130" align="center">
            </el-table-column>
            <el-table-column prop="total" label="废品数" width="100" align="center">
            </el-table-column>
            <el-table-column v-if="componentData.associateWYM || componentData.associateLigation" prop="lathe" label="床次" width="100" align="center">
                <template slot-scope="scope">
                    <div  v-for="(item,index) in scope.row.wasteds" class="cell__row">
                        <i class="dot red-dot"></i>{{ item.lathe }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="componentData.associateWYM" prop="latheNo" label="本次序号" width="100" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.wasteds" class="cell__row">{{item.latheNo}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="componentData.associateWYM" prop="wym" label="唯一码" width="200" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.wasteds" class="cell__row">{{item.wym}}</div>
                </template>
            </el-table-column>
            <!-- 关联扎号 -->
            <el-table-column v-if="componentData.associateLigation" prop="ligationNo" label="所属扎号" width="140" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.wasteds" class="cell__row">{{item.ligationNo}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="styleNo" label="货品款号" min-width="120" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.wasteds" class="cell__row">{{item.styleNo}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="storehouseName" label="所在仓库" width="100" v-if="!componentData.associateLigation&&!componentData.associateWYM" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.wasteds" class="cell__row">{{item.storehouseName ? item.storehouseName : '无'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="颜色" prop="colorName" width="100" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.wasteds" class="cell__row">{{item.colorName}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="lengthShow" prop="standardName" label="内长" width="100" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.wasteds" class="cell__row">{{item.standardName}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="sizeName" label="尺码" width="100" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.wasteds" class="cell__row">{{item.sizeName}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="reason" label="报废原因" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.wasteds" class="cell__row">{{item.reason}}</div>
                </template>
            </el-table-column>
        </el-table>

        <el-table class="quality-detail__content-table is-fixed-header report-table waste-list-table" :data="componentData.wasteds" border style="width: 100%;margin:8px 0;" @selection-change="handleSelectionWasteChange" v-else  key="wasteTable">
            <el-table-column type="selection" width="55" align="center" v-if="instanceWorkflow.components.information.associateInStore"></el-table-column>
            <el-table-column align="center" v-if="componentData.associateWYM || componentData.associateLigation" prop="lathe" label="床次" width="100">
                <template slot-scope="scope">
                    <i class="dot red-dot"></i>{{ scope.row.lathe }}
                </template>
            </el-table-column>
            <el-table-column align="center" v-if="componentData.associateWYM" prop="latheNo" label="本次序号" width="100">
            </el-table-column>
            <el-table-column align="center" v-if="componentData.associateWYM" prop="wym" label="唯一码" width="200">
            </el-table-column>
            <!-- 关联扎号 -->
            <el-table-column align="center" v-if="componentData.associateLigation" prop="ligationNo" label="所属扎号" width="140">
            </el-table-column>
            <el-table-column align="center" prop="styleNo" label="货品款号" width="100">
            </el-table-column>
            <el-table-column align="center" prop="storehouseName" label="所在仓库" width="100" v-if="!componentData.associateLigation&&!componentData.associateWYM">
                <template slot-scope="scope">
                    {{scope.row.storehouseName ? scope.row.storehouseName : '无'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="颜色" prop="colorName" width="100">
            </el-table-column>
            <el-table-column align="center" v-if="lengthShow" prop="standardName" label="内长" width="100">
            </el-table-column>
            <el-table-column align="center" prop="sizeName" label="尺码" width="100">
            </el-table-column>
            <el-table-column align="center" prop="reason" label="报废原因">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        props: ['componentData','instanceWorkflow','lengthShow'],
        data () {
            return {
                checked: false,
            }
        },
        watch:{
            componentData(val) {
                if (this.instanceWorkflow.components.information.associateOutside) {
                    val.wastedoutsides.forEach(item => {
                        item.wasteds.forEach(i => {
                            this.$set(i, 'checked', false)
                        })
                    })
                }
            }
        },
        methods: {
            // 勾选废品
            handleSelectionWasteChange(selection) {
                this.$emit('handleSelectionWasteChange', selection)
            },
            // 外发节点 行选择
            change() {
                let list = []
                this.componentData.wastedoutsides.forEach(item => {
                    item.wasteds.forEach(i => {
                        if(i.checked) {
                            list.push(i)
                        }
                    })
                })
                this.$emit('handleSelectionWasteChange',list)
            },
            // 全选
            selectAll(val) {
                let list = []
                this.componentData.wastedoutsides.forEach(item => {
                    item.wasteds.forEach(i => {
                        if (val.srcElement.checked > 0) {
                            this.$set(i, 'checked', true)
                            list.push(i)
                        } else {
                            this.$set(i, 'checked', false)
                        }
                    })
                })
                if (val.srcElement.checked) {
                    this.handleSelectionWasteChange(list)
                }
            },
            renderHeaderCheck(createElement, { column, $index }) {
                return <div class="materiel-header">{<el-checkbox onChange={this.selectAll} vModel="checked"></el-checkbox>}</div>;
            },
        }
    }
</script>
<style lang="scss">
    .waste-table{
        width: 100%;
        .waste-list-table  .el-table__body,
        .waste-list-table .el-table__header{
            width: 100% !important;
        }
    }
    .waste-list-table .cell{
        padding: 0 !important;
    }
</style>
<style lang="scss">
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
</style>