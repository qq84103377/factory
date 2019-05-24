<template>
    <div class="ligation-report__list">
        <!--此div用来关闭popover-->
        <div ref="toHidePopover" style="position: absolute"></div>
        <p style="margin: 8px 0;" v-if="editable && currentList[0] && currentList[0].quantity">原上报数量：{{
            currentList[0].quantity }}</p>
        <el-table
                class="ligation-report__table"
                :data="currentList"
                :row-class-name="setRowClassName"
                border>
            <el-table-column label="床次" prop="lathe">
                <template slot-scope="scope">
                    {{ scope.row.isColspan ? '丢失扎号' : scope.row.lathe }}
                </template>
            </el-table-column>
            <el-table-column label="扎号" prop="ligationNo"></el-table-column>
            <el-table-column label="工单号" prop="orderNo"></el-table-column>
            <el-table-column label="货品" prop="styleNo"></el-table-column>
            <el-table-column label="颜色" prop="colorName">
            </el-table-column>
            <el-table-column label="尺码" width="80" prop="sizeName"></el-table-column>
            <el-table-column label="内长" width="80" prop="standardName" v-if="isShowLength"></el-table-column>
            <el-table-column class-name="ligation-report__input-column" label="数量" width="110" prop="total">
                <template slot-scope="scope">
                   <span>{{scope.row.num?scope.row.num:scope.row.total}}</span>  <span v-if="scope.row.alreadyReportNum">(已报{{scope.row.alreadyReportNum}})</span>
                </template>
            </el-table-column>
            <el-table-column class-name="ligation-report__input-column" label="上报数量" width="80" prop="num">
                <template slot-scope="scope">
                    <input class="ligation-report__input" type="number" @focus="getQualityOld(scope.row.canReportNum)"
                           @input="handleInput(scope.row)" v-model="scope.row.canReportNum">
                    <!--<input class="ligation-report__input" type="number" @input="handleInput(scope.row)" v-model="scope.row.canReportNum">-->
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <icon-button class="btn--delete" type="text"
                                 @click.native.stop="handleItemDelete(scope.$index,scope.row)">删除
                    </icon-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="ligation-report__add" >
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

            <icon-button class="btn--add" type="text" v-popover:popover>+添加扎</icon-button>
        </div>
        <div v-if="isTotality && ligationList.length" class="ligation-report__collapse">
            <span @click="handleAddLost">无扎号上报（丢扎）</span>
        </div>
        <template v-else>
            <div v-show="!editable && ligationList.length" class="ligation-report__collapse"
                 @click="isCollapse = !isCollapse">
                <span>无扎号上报（丢扎）</span><i class="el-icon-arrow-down"></i>
            </div>
            <div>
                <nf-sku-table
                        v-show="!isCollapse && !editable"
                        ref="ligationskutable"
                        editable
                        @change="handleSkuValueChange"
                        :metadatas="instanceWorkflow.metadatas"
                        :quantities="instanceWorkflow.quantities"
                        style="margin-top: 20px"></nf-sku-table>
            </div>
        </template>


        <reportCountTable ref="handleItemClickGo" :currentList="currentList"></reportCountTable>


    </div>
</template>

<script>
    import reportCountTable from '../common/report-count-table'
    import {getLigationListWithoutReport} from '@/api'
    export default {
        name: 'LigationReportList',
        props: {
            editable: Boolean,
            isTotality: Boolean,

            ligationList: [],
            value: [],
            instanceWorkflow: {},
            componentData: {}
        },
        components:{
            reportCountTable
        },
        data() {
            return {
                isCollapse: true,
                listCount: [],
                currentListCount: [],
                sizeArrBf: [],
                sizeArr: [],
                oldNum: 0,
            }
        },
        computed: {
            currentList: {
                get() {
                    return this.value
                },
                set(val) {
                    this.$emit('input', val);
                }
            },
            isShowLength() {
                return this.componentData && this.componentData.goodsWithoutStandard;
            },
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
            isCollapse(val) {
                if (!val) {
                    this.$refs['ligationskutable'] && this.$refs['ligationskutable'].resetSkuTableData();
                }
            },
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
        methods: {
            // 获取当前节点未上报的扎号列表
            fetchWithoutReportList() {
                const { missionId, instanceWorkflowId } = this.$route.query;
                getLigationListWithoutReport({ missionId, missionNodeId: instanceWorkflowId })
                    .then(res => {
                        this.ligationList = res.data.ligations.map(item => {
                            item.qualified = '';
                            item.isColspan = false; // 标记是否合并列
                            return item;
                        });
                    });
            },
            itemActive(item) {
                return this.currentList.indexOf(item) > -1;
            },
            resetData() {
                this.currentList = [];
                this.$refs['ligationskutable'] && this.$refs['ligationskutable'].resetSkuTableData();
            },
            // 扎号选择
            handleItemClick(item) {
                const bol = this.currentList.some(listItem => listItem.ligationId === item.ligationId);
                if(!bol){
                    !bol && this.currentList.push({...item, qualified: item.canReportNum})
                }else {
                    return
                }
                // 如果颜色在表格还没有就push进去，有就不用
                this.$refs.handleItemClickGo.handleItemClick(item);
                this.$refs.toHidePopover.click();
            },
            // 合计
            fillter(rowIndex) {
                var sum = 0
                this.sizeArr.forEach(item => {
                    sum += parseInt(item.valueArr[rowIndex])
                })
                return sum
            },

            handleItemDelete($indexBig, row) {
                this.currentList.splice($indexBig, 1);
                this.$refs.handleItemClickGo.handleItemDelete(row,$indexBig)
                // 删除后联动统计表格
                // 都有的颜色和码数 和减去现在的数
                // this.currentListCount.forEach(($itemCount, index) => {
                //     this.sizeArr.forEach(($item, $index) => {
                //         if (row.colorName === $itemCount.colorName && row.sizeName === $item.sizeName) {
                //             this.$set(this.sizeArr[$index].valueArr, index, this.sizeArr[$index].valueArr[index] - row.qualified)
                //         }
                //     })
                // })
                // if()



            },
            handleAddLost() {
                this.currentList.push({
                    isColspan: true,
                    qualified: '',
                    canReportNum: ''
                });
                this.$nextTick(() => {
                    this.setColspan();
                });
            },
            getReportParams() {
                const reports = this.currentList.reduce((arr, item) => {
                    if (item.qualified && item.skuId) {
                        // reportId 当编辑的时候需要传
                        const {skuId, qualified, ligationId, reportId} = item;
                        arr.push({skuId, qualified, ligationId, reportId});
                    }
                    return arr;
                }, []);
                let lostLigationSkuList;
                if (!this.isTotality) {
                    const skuValObj = this.$refs['ligationskutable'].getSkuTableValue();
                    lostLigationSkuList = Object.keys(skuValObj).reduce((arr, key) => {
                        if (skuValObj[key].num) {
                            const obj = {
                                skuId: skuValObj[key].skuId,
                                quantity: skuValObj[key].num
                            };
                            arr.push(obj);
                        }
                        return arr;
                    }, []);
                }
                else {
                    // 总数型
                    lostLigationSkuList = this.currentList.reduce((arr, item) => {
                        if (!item.skuId && item.qualified) {
                            arr.push({
                                quantity: item.qualified
                            });
                        }
                        return arr;
                    }, []);
                }
                return {
                    reports,
                    lostLigationSkuList
                }
            },
            handleSkuValueChange(val, total) {
                this.$emit('on-sku-change', val, total);
            },
            setRowClassName(row, index) {
                if (row.isColspan) {
                    return 'colspan__row';
                }
                return '';
            },
            setColspan(arr = [1, 6]) {
                arr = this.isShowLength ? [1, 6] : [1, 5];
                const rows = document.querySelectorAll('.colspan__row');
                rows.forEach(rowItem => {
                    const cols = rowItem.querySelectorAll('td');
                    cols.forEach((colItem, index) => {
                        if (index >= arr[0] && index <= arr[1]) {
                            colItem.style.display = 'none';
                        }
                        if (index < arr[0]) {
                            colItem.setAttribute('colspan', arr[0] + arr[1]);
                        }
                    });
                });
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
    .btn--delete {
        font-size: 12px;
        &:hover {
            color: #FA4150
        }
    }

    .btn--add {
        font-size: 12px;
        color: #FFA914;
    }

    .ligation-report__list {
        margin-top: 16px;
    }

    .ligation-report__add {
        line-height: 32px;
        box-sizing: border-box;
        border: 1px solid rgb(223, 228, 236);
        border-top: none;
    }

    .ligation-report__input {
        box-sizing: border-box;
        /*position: absolute;*/
        /*height: 100%;*/
        width: 100%;
        /*left: 0;*/
        /*top: 0;*/
        padding: 0 5px;
        /*background: rgba(245,247,250,1)*/
    }

    .ligation-report__collapse {
        display: inline-block;
        margin-top: 16px;
        font-size: 12px;
        cursor: pointer;
    }

    .ligation-select {
        padding: 0;
        margin: 0;
        max-height: 274px;
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
