<template>
    <div class="ligation-report__list">
        <el-table class="ligation-report__table" :data="currentList" border>
            <el-table-column label="床次" prop="lathe" width="80"></el-table-column>
            <el-table-column label="扎号" prop="ligationNo"></el-table-column>
            <el-table-column label="工单号" prop="orderNo"></el-table-column>
            <el-table-column label="货品" prop="styleNo"></el-table-column>
            <el-table-column label="颜色" prop="colorName">
            </el-table-column>
            <el-table-column label="尺码" width="80" prop="sizeName"></el-table-column>
            <el-table-column label="内长" width="80" prop="standardName" v-if="options.standardOptions.length"></el-table-column>
            <el-table-column class-name="ligation-report__input-column" label="数量" width="110" >
                <template slot-scope="scope">
                    {{scope.row.total}} <span v-if="scope.row.alreadyReportNum">(已报{{scope.row.alreadyReportNum}})</span>
                </template>
            </el-table-column>
            <el-table-column class-name="ligation-report__input-column" label="上报合格品" prop="num">
                <template slot-scope="scope">
                    <input class="ligation-report__input" type="number" @focus="getQualityOld(scope.row.canReportNum)"  @input="handleInput(scope.row)" v-model="scope.row.canReportNum">
                </template>
            </el-table-column>
            <el-table-column class-name="ligation-report__input-column" label="上报次品">
                <template slot-scope="scope">
                    <icon-button
                            class="ligation-report__btn btn"
                            type="icon-edit"
                            @click="showDefectiveDialog(scope.row)">
                        {{scope.row.defectiveNum ? scope.row.defectiveNum : '点击上报'}}
                    </icon-button>
                </template>
            </el-table-column>
            <el-table-column class-name="ligation-report__input-column" label="上报废品">
                <template slot-scope="scope">
                    <icon-button
                            class="ligation-report__btn btn"
                            type="icon-edit"
                            @click="showWasteDialog(scope.row)">{{scope.row.wasteNum ? scope.row.wasteNum : '点击上报'}}
                    </icon-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                    <icon-button class="btn btn--delete" type="text"
                                 @click.native.stop="handleItemDelete(scope.$index,scope.row)">删除
                    </icon-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="ligation-report__add">
            <el-popover
                    ref="popover"
                    placement="bottom"
                    popper-class="ligation-report__popover"
                    trigger="click">
                <ul class="ligation-select">
                    <li v-show="!ligationList.length"
                        :style="{'color': !ligationList.length ? '#e4e8f1' : ''}"
                        class="ligation-select__item">
                        暂无数据
                    </li>
                    <li
                        class="ligation-select__item"
                        :class="itemActive(item) ? 'is-active' : ''"
                        @click="handleItemClick(item)"
                        v-for="item in ligationList"
                        :key="item.ligationId">
                    {{ item.ligationNo }}
                    </li>
                </ul>
            </el-popover>

            <icon-button class="btn btn--add" type="text" v-popover:popover>+添加扎</icon-button>
        </div>
        <reportCountTable ref="handleItemClickGo" :currentList="currentList"></reportCountTable>
        <el-dialog
                title="上报次品"
                size="large"
                custom-class="nf-dialog-common"
                :visible.sync="defectiveDialogVisible">
            <div class="list-wrapper">
                <el-row
                        type="flex"
                        justify="space-between"
                        align="center"
                        class="list-wrapper__item"
                        v-for="(listItem, index) in defectiveList"
                        :key="index">
                    <div class="list-wrapper__form-item">
                        <span class="list-wrapper__form-label">货品sku</span>
                        <el-select class="select"
                                   :style="styleObj"
                                   disabled
                                   v-model="listItem.color_id"
                                   placeholder="颜色">
                            <el-option
                                    v-for="item in options.colorOptions"
                                    :key="item.color_id"
                                    :label="item.color_name"
                                    :value="item.color_id">
                            </el-option>
                        </el-select>
                        <el-select class="select"
                                   disabled
                                   :style="styleObj"
                                   v-if="options.standardOptions.length"
                                   v-model="listItem.standard_id"
                                   placeholder="内长">
                            <el-option
                                    v-for="item in options.standardOptions"
                                    :key="item.standard_id"
                                    :label="item.standard_value"
                                    :value="item.standard_id">
                            </el-option>
                        </el-select>
                        <el-select class="select"
                                   disabled
                                   :style="styleObj"
                                   v-model="listItem.size_id"
                                   placeholder="尺码">
                            <el-option
                                    v-for="item in options.sizeOptions"
                                    :key="item.size_id"
                                    :label="item.size_value"
                                    :value="item.size_id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="list-wrapper__form-item">
                        <span class="list-wrapper__form-label nogood">次品标签</span>
                        <el-select class="select"
                                   multiple
                                   v-model="listItem.defectiveLabelIds" placeholder="请选择">
                            <el-option
                                    v-for="item in defectiveLabelList"
                                    :key="item.id"
                                    :label="item.labelName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="list-wrapper__form-item">
                        <span class="list-wrapper__form-label">次品数量</span>
                        <el-input v-model="listItem.num" :style="styleObj" style="width: 194px"
                                  class="list-wrapper__item-input"></el-input>
                    </div>
                    <div class="list-wrapper__form-item" style="line-height: 36px">
                        <icon-button class="dele" @click="handleDelete('defectiveList', index)">删除</icon-button>
                    </div>
                </el-row>
                <el-row
                        type="flex"
                        justify="space-between"
                        align="center"
                        class="list-wrapper__item">
                    <!-- <div class="list-wrapper__form-item"> -->
                    <icon-button class="btn-dialog--add" @click="handleAddDefectiveRow">+ 添加次品</icon-button>
                </el-row>
            </div>
            <el-row class="dialog-footer" slot="footer" type="flex" justify="space-between" align="center">
                <div class="count-total">
                    合计：<strong>{{ defectiveNum }}次品</strong>
                </div>
                <div>
                    <nf-button @click="defectiveDialogVisible = false">取 消</nf-button>
                    <nf-button :loading="btnLoading" type="warning" @click="handleAddDefective">确 定</nf-button>
                </div>
            </el-row>
        </el-dialog>
        <el-dialog
                title="上报废品"
                size="large"
                custom-class="nf-dialog-common"
                :visible.sync="wasteDialogVisible">
            <div class="list-wrapper">
                <el-row
                        type="flex"
                        justify="space-between"
                        align="center"
                        class="list-wrapper__item"
                        v-for="(listItem, index) in wasteList"
                        :key="index">
                    <div class="list-wrapper__form-item">
                        <span class="list-wrapper__form-label">货品sku</span>
                        <el-select class="select"
                                   disabled
                                   :style="styleObj"
                                   v-model="listItem.color_id"
                                   placeholder="颜色">
                            <el-option
                                    v-for="item in options.colorOptions"
                                    :key="item.color_id"
                                    :label="item.color_name"
                                    :value="item.color_id">
                            </el-option>
                        </el-select>
                        <el-select class="select"
                                   disabled
                                   :style="styleObj"
                                   v-if="options.standardOptions.length"
                                   v-model="listItem.standard_id"
                                   placeholder="内长">
                            <el-option
                                    v-for="item in options.standardOptions"
                                    :key="item.standard_id"
                                    :label="item.standard_value"
                                    :value="item.standard_id">
                            </el-option>
                        </el-select>
                        <el-select class="select"
                                   disabled
                                   :style="styleObj"
                                   v-model="listItem.size_id"
                                   placeholder="尺码">
                            <el-option
                                    v-for="item in options.sizeOptions"
                                    :key="item.size_id"
                                    :label="item.size_value"
                                    :value="item.size_id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="list-wrapper__form-item">
                        <span class="list-wrapper__form-label">报废原因</span>
                        <el-input class="list-wrapper__item-input" style="width: 194px"
                                  v-model="listItem.reason"></el-input>
                    </div>
                    <div class="list-wrapper__form-item">
                        <span class="list-wrapper__form-label">废品数量</span>
                        <el-input class="list-wrapper__item-input" :style="styleObj" style="width: 194px"
                                  v-model="listItem.num"></el-input>
                    </div>
                    <div class="list-wrapper__form-item" style="line-height: 36px">
                        <icon-button class="dele" @click="handleDelete('wasteList', index)">删除</icon-button>
                    </div>
                </el-row>
                <el-row
                        type="flex"
                        justify="space-between"
                        align="center"
                        class="list-wrapper__item">
                    <icon-button class="btn-dialog--add" @click="handleAddWasteRow">+ 添加废品</icon-button>
                </el-row>
            </div>
            <el-row class="dialog-footer" slot="footer" type="flex" justify="space-between" align="center">
                <div class="count-total">
                    合计：<strong>{{ wasteNum }}废品</strong>
                </div>
                <div>
                    <nf-button @click="wasteDialogVisible = false">取 消</nf-button>
                    <nf-button :loading="btnLoading" type="warning" @click="handleAddWaste">确 定</nf-button>
                </div>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import { getLigationReportData } from '@/api';
    import reportCountTable from '../common/report-count-table'
    export default {
        props: {
            metadatas: [],
            options: [],
            defectiveLabelList: [],
            ligationList: [],
            value: [],
            instanceWorkflow: {}
        },
        components:{
            reportCountTable
        },
        data() {
            return {
                styleObj: {
                    width: '100px'
                },
                isCollapse: true,
                btnLoading: false,
                defectiveDialogVisible: false,
                wasteDialogVisible: false,
                defectiveList: [],
                wasteList: [],
                handleRow: {},


                listCount: [],
                currentListCount: [],
                sizeArrBf: [],
                sizeArr: [],
                oldNum: 0,
            }
        },
        created(){
            this.$nextTick(() => {

                if(this.value[0]){
                    this.$refs.handleItemClickGo.handleItemClick(this.value[0])
                }
            })

            // this.fetchWithoutReportList();
        },
        watch: {
            currentList(val) {
                // 监听总数据清除旧数据
                if (val.length === 0) {
                    this.listCount = [];
                    this.currentListCount = [];
                    this.sizeArrBf = [];
                    this.sizeArr = [];
                    this.oldNum = 0;
                }
            }
        },
        mounted() {
            if (this.skuId) {
                this.currentList.push({
                    ...this.editRow,
                    // qualified: '',
                    wasteNum: '',
                    defectiveNum: '',
                    total: this.editRow.num,
                    qualified: this.editRow.num,
                    ligationId: this.editRow.ligationID,
                    skuId: this.editRow.skuID,
                })
            }
        },
        computed: {
            ...mapState({
                editRow: (state) => state.QualityChecking.editRow
            }),
            currentList: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                }
            },
            defectiveNum() {
                return this.defectiveList.reduce((total, item) => {
                    total += Number(item.num);
                    return total;
                }, 0);
            },
            wasteNum() {
                return this.wasteList.reduce((total, item) => {
                    total += Number(item.num);
                    return total;
                }, 0);
            },
            // 质检关联扎号，从查看上报情况列表点击跳转进来
            skuId() {
                return this.$route.query.skuId;
            },
        },
        methods: {
            itemActive(item) {
                return this.currentList.indexOf(item) > -1;
            },
            resetData() {
                this.currentList = [];
                this.$refs['ligationskutable'] && this.$refs['ligationskutable'].resetSkuTableData();
            },
            // 扎号选择
            handleItemClick(item) {


                console.log(item);
                console.log(545454);
                console.log(this.currentList);
                const bol = this.currentList.some(listItem => listItem.ligationId === item.ligationId);
                // !bol && this.currentList.push({...item, qualified: item.canReportNum});
                if(!bol){
                    !bol && this.currentList.push({...item, qualified: item.canReportNum})
                }else {
                    return
                }
                console.log(this.currentList);
                // 如果颜色在表格还没有就push进去，有就不用
                this.$refs.handleItemClickGo.handleItemClick(item)

            },

            handleItemDelete(index,row) {
                this.currentList.splice(index, 1);
                this.$refs.handleItemClickGo.handleItemDelete(row,index)
            },
            getReportParams() {
                const reports = this.currentList.reduce((arr, item) => {
                    if (item.qualified) {
                        const {skuId, qualified, ligationId, reportId} = item;
                        arr.push({skuId, qualified, ligationId, reportId});
                    }
                    return arr;
                }, []);
                const skuValObj = this.$refs['ligationskutable'].getSkuTableValue();
                const lostLigationSkuList = Object.keys(skuValObj).reduce((arr, key) => {
                    if (skuValObj[key].num) {
                        const obj = {
                            skuId: skuValObj[key].skuId,
                            quantity: skuValObj[key].num
                        };
                        arr.push(obj);
                    }
                    return arr;
                }, []);
                return {
                    reports,
                    lostLigationSkuList
                }
            },
            // 获取关联扎号修上报数量数据
            fetchLigationReportData(reportId) {
                return getLigationReportData({
                    reportId
                }).then(res => {

                    console.log(res.data);
                    return res.data
                });
            },
            getEditWasteAndDefective(editRow, data) {
                const wastes = data.wastes.map(item => {
                    item.skuId = editRow.skuID;
                    item.ligationId = editRow.ligationID;
                    item.reason = item.wastedReson;
                    return item;
                });
                const defectiveds = data.defectives.map(item => {
                    item.skuId = this.editRow.skuID;
                    item.ligationId = this.editRow.ligationID;
                    return item;
                });
                return {
                    wastes,
                    defectiveds
                }
            },
            handleSkuValueChange(val, total) {
                this.$emit('on-sku-change', val, total);
            },
            handleAddWaste() {
                if (!this.wasteNum) {
                    return this.$message.error('请输入废品数量');
                }
                this.handleRow.wasteds = this.wasteList.reduce((arr, item) => {
                    item.num && arr.push({
                        skuId: item.skuId,
                        num: item.num,
                        ligationId: item.ligationId,
                        reason: item.reason
                    });
                    return arr;
                }, []);
                this.handleRow.wasteNum = this.wasteNum;
                this.wasteDialogVisible = false;
            },
            handleDelete(obj, index) {
                this[obj].splice(index, 1);
                if (obj === 'wasteList') {
                    return this.handleRow.wasteNum = this.wasteNum;  
                }
                this.handleRow.defectiveNum = this.defectiveNum;
            },
            handleAddDefective() {
                if (!this.defectiveNum) {
                    return this.$message.error('请输入次品数量');
                }
                console.log(this.defectiveList);
                this.handleRow.defectiveds = this.defectiveList.reduce((arr, item) => {
                    item.num && arr.push({
                        skuId: item.skuId,
                        num: item.num,
                        ligationId: item.ligationId,
                        defectiveLabelIds: item.defectiveLabelIds
                    });
                    return arr;
                }, []);
                this.handleRow.defectiveNum = this.defectiveNum;
                this.defectiveDialogVisible = false;
            },
            handleAddDefectiveRow() {
                if (!this.defectiveList[0]) {
                    // 列表数据为空时候
                    return this.showDefectiveDialog(this.handleRow);
                }
                this.defectiveList.push({...this.defectiveList[0], defectiveLabelIds: [], num: 1});
            },
            handleAddWasteRow() {
                if (!this.wasteList[0]) {
                    return this.showWasteDialog(this.handleRow);
                }
                this.wasteList.push({ ...this.wasteList[0], reason: '', num: 1});
            },
            showWasteDialog(item) {
                const fItem = this.metadatas.find(metadataItem => metadataItem.id === item.skuId);
                if (fItem) {
                    this.handleRow = item;
                    if (item.wasteds && item.wasteds.length) {
                        // 第二次点击添加
                        this.wasteList = item.wasteds;
                    }
                    else if (!item.wasteds) {
                        this.handleRow = item;
                        this.wasteList = [{
                            ...fItem,
                            reason: '',
                            num: 1,
                            skuId: fItem.id,
                            ligationId: item.ligationId
                        }];
                    }
                    this.wasteDialogVisible = true;
                }
            },
            showDefectiveDialog(item) {
                const fItem = this.metadatas.find(metadataItem => metadataItem.id === item.skuId);
                if (fItem) {
                    this.handleRow = item;
                    if (item.defectiveds && item.defectiveds.length) {
                        // 第二次点击添加
                        console.log(item.defectiveds)
                        this.defectiveList = item.defectiveds;
                    }
                    else if (!item.defectiveds) {
                        // 第一次点击添加
                        console.log('第一次点击添加')
                        this.defectiveList = [{
                            ...fItem,
                            defectiveLabelIds: [],
                            num: 1,
                            skuId: fItem.id,
                            ligationId: item.ligationId
                        }];
                    }
                    this.defectiveDialogVisible = true;
                }
            },
            // 获取上一次的值备份
            getQualityOld(oldNum) {
                this.$refs.handleItemClickGo.getQualityOld(oldNum)
            },
            handleInput(row) {
                // 触发表格变化
                this.$refs.handleItemClickGo.handleInput(row)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .btn {
        font-size: 12px;
    }

    .btn--delete {
        &:hover {
            color: #FA4150
        }
    }

    .btn--add {
        color: #FFA914;
    }

    .btn-dialog--add {
        margin-top: 8px;
        margin-left: 60px;
        color: #1CA1FF;
    }

    .ligation-report {
        &__list {
            margin-top: 16px;
            background: #fff;
        }
        &__add {
            line-height: 32px;
            box-sizing: border-box;
            border: 1px solid rgb(223, 228, 236);
            border-top: none;
        }
        &__input {
            box-sizing: border-box;
            position: absolute;
            height: 100%;
            width: 100%;
            left: 0;
            top: 0;
            padding: 0 5px;
            background: rgba(245, 247, 250, 1)
        }

        &__collapse {
            display: inline-block;
            margin-top: 16px;
            font-size: 12px;
            cursor: pointer;
        }
    }

    .ligation-select {
        padding: 0;
        margin: 0;
        max-height:274px;
        overflow-y: auto;
        &__item {
            padding: 0 10px;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            font-size: 14px;
            &:hover {
                background: #e4e8f1;
            }
            &.is-active {
                background: #e4e8f1;
            }
        }
    }

    .list-wrapper__item {
        margin-bottom: 8px
    }

    .list-wrapper__item-input {
        display: inline-block;
    }

    .list-wrapper__form-item {
        // display: flex;
    }

    .list-wrapper__form-label {
        margin-right: 8px;
    }

    .dialog-footer > .count-total {
        line-height: 36px;
        strong {
            color: #FF7F14;
            font-weight: 500;
            font-size: 20px;
            vertical-align: -2px
        }
    }
</style>

<style lang="scss">

    .ligation-report__popover {
        padding: 0
    }

    .ligation-report__input-column {

    }

    .ligation-report__table {
        th {
            background-color: #F5F7FA;
        }
        th > .cell {
            font-weight: normal;
            color: #A2ABB8;
            background-color: #F5F7FA;
        }
        .el-table__body {
            .cell,
            td {
                background: #fff;
            }
            .cell {
                height: 100%;
                line-height: 28px;
            }
        }
        .cell {
            position: relative;
            color: #3b3b3b;
            font-size: 12px;
            padding: 0 10px;
        }
        td,
        th {
            height: 28px;
            line-height: 28px;
        }
    }
</style>
