<template>
    <div class="ligation-list--wrapper">
        <nf-button class="view-btn" :loading="btnLoading" style="width: auto;" @click="showDialog">查看扎号上报情况</nf-button>
        <el-dialog
            title="扎号上报情况"
            custom-class="ligation-list__dialog nf-dialog-common"
            :visible.sync="dialogVisible"
            size="large">
            <el-table
                    max-height="600"
            v-loading="inlineLoading"
            class="ligation-list__table"
            :row-class-name="setRowClassName"
            :data="ligationList"
            border
            @sort-change="handleSort">
                <el-table-column label="床次" width="100" sortable="custom" prop="lathe">
                    <template slot-scope="scope">
                        {{ !scope.row.ligationNo ? '丢失扎号' : scope.row.lathe}}
                    </template>
                </el-table-column>
                <el-table-column label="扎号" sortable="custom" prop="ligationNo"></el-table-column>
                <el-table-column label="工单号" prop="orderNo"></el-table-column>
                <el-table-column label="货品" prop="styleNo"></el-table-column>
                <el-table-column label="颜色" prop="colorName">
                    <template slot-scope="scope">
                        {{ scope.row.colorNo }} - {{ scope.row.colorName }}
                    </template>
                </el-table-column>
                <el-table-column label="尺码" width="80" prop="sizeName"></el-table-column>
                <el-table-column label="内长" width="80" prop="standardName" v-if="isShowLength"></el-table-column>
                <el-table-column label="数量" width="80" prop="num"></el-table-column>
                <el-table-column v-if="isQualityChecking" label="上报情况">
                    <template slot-scope="scope">
                        <div class="quality-status">
                            <!-- <span class="quality-status__item" :style="{ 'color': !renderText(scope.row) ? '#C4C6CC' : '' }">{{ renderText(scope.row) && renderText(scope.row).join(',') || '未上报' }}</span> -->
                            <span class="quality-status__item" v-if="scope.row.quantity">合格品{{ scope.row.quantity }}</span>
                            <span class="quality-status__item" v-if="scope.row.defectived">次品{{ scope.row.defectived }}</span>
                            <span class="quality-status__item" v-if="scope.row.wasted">废品{{ scope.row.wasted }}</span>
                            <span class="quality-status__item" style="color: #C4C6CC" v-if="!scope.row.quantity && !scope.row.defectived && !scope.row.wasted">未上报</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="!isQualityChecking" label="实际上报数量" prop="quantity">
                    <template slot-scope="scope">
                        <span
                            :class="{
                                'is-over': scope.row.quantity > scope.row.num,
                                'is-unreport': scope.row.quantity === 0,
                                'is-persuade': scope.row.quantity && scope.row.quantity < scope.row.num
                            }">
                                {{ scope.row.quantity ? scope.row.quantity : '未上报'}}
                            </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <i v-if="!scope.row.ligationNo">—</i>
                        <icon-button v-else class="ligation-list__btn" @click="handleReport(scope.row)">
                            上报
                        </icon-button>
                    </template>
                </el-table-column>
                <el-table-column label="完成人员" prop="finishUserName"></el-table-column>
                <el-table-column label="完成日期" width="100" sortable="custom" prop="finishDate"></el-table-column>
                <el-table-column label="操作人" prop="lastUpdater"></el-table-column>
                <el-table-column label="上次操作时间" width="140" prop="lastUpdateTime"></el-table-column>
            </el-table>
            <el-row class="ligation-list__pagination" type="flex" justify="end">
                <el-pagination
                    style="padding: 0"
                    @current-change="handleCurrentChange"
                    :current-page.sync="params.pageNo"
                    :page-size="params.pageSize"
                    layout="total, prev, pager, next"
                    :total="pageTotal">
                </el-pagination>
            </el-row>
        </el-dialog>
        <el-dialog
            :title="dialogTitle"
            custom-class="ligation-list__dialog nf-dialog-common"
            :visible.sync="reportDialogVisible"
            size="tiny">
                <p style="margin-bottom: 8px;" v-show="handleRow.quantity">原上报数量：{{ handleRow.quantity }}</p>
                <div class="dialog-content">
                    <el-input v-model="qualified" type="number" placeholder="请输入内容"></el-input>
                </div>
                <el-row class="dialog-footer" slot="footer" type="flex" justify="center" align="center">
                  <div>
                    <nf-button @click="closeDialog">取 消</nf-button>
                    <nf-button :loading="btnLoading" type="warning" @click="handleAddReport">确 定</nf-button>
                  </div>
                </el-row>
        </el-dialog>
    </div>
</template>

<script>
import { ligationStatusList, ligationNodeReport } from '@/api';
export default {
    props: {
        isQualityChecking: Boolean,
        componentData: {}
    },
    data() {
        return {
            dialogVisible: false,
            reportDialogVisible: false,
            btnLoading: false,
            inlineLoading: false,
            ligationList: [],
            pageTotal: 1,
            dialogTitle: '上报数量',
            handleRow: {},
            qualified: '',
            params: {
                pageNo: 1,
                pageSize: 20,
                /*** 按完成时间排序  * 0 升序  * 1 降序 */
                orderByDateCompleted: 0,
                /*** 按床次排序  * 0 升序  * 1 降序  */
                orderByLathe: 0,
                /*** 按扎号排序  * 0 升序  * 1 降序 */
                orderByLigationNo: 0
            }
        };
    },
    computed: {
        userId() {
          return JSON.parse(sessionStorage.getItem('user_login')).userId
        },
        isShowLength() {
            return this.componentData && this.componentData.goodsWithoutStandard;
        }
    },
    watch: {
        reportDialogVisible() {
            this.qualified = '';
        }
    },
    methods: {
        fetchLigationStatusList() {
            const { instanceWorkflowId, missionId } = this.$route.query;
            const baseParams = {
                missionNodeId: instanceWorkflowId,
                missionId: missionId,
                ...this.params
            };
            this.btnLoading = true;
            this.inlineLoading = true;
            ligationStatusList(baseParams)
            .then(res => {
                this.btnLoading = false;
                this.inlineLoading = false;
                if (res.data.code !== 0) {
                    return this.$message.error(res.data.msg || '');
                }
                this.ligationList = res.data.statusList;
                this.pageTotal = res.data.status.pageTotal || 1;
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.ligationList.unshift({
                        ...res.data.status,
                        isColspan: true
                    });
                    this.setColspan();
                })
            });
        },
        handleCurrentChange(val) {
            this.params.pageNo = val;
            this.fetchLigationStatusList();
        },
        handleSort({ order, prop }) {
            const params = {
                orderByLathe: 0,
                orderByLigationNo: 0,
                orderByDateCompleted: 0
            };
            if (prop === 'lathe' && order === 'descending') {
                params.orderByLathe = 1;
            }
            if (prop === 'ligationNo' && order === 'descending') {
                params.orderByLigationNo = 1;
            }
            if (prop === 'finishDate' && order === 'descending') {
                params.orderByDateCompleted = 1;
            }
            this.params.orderByLathe = params.orderByLathe;
            this.params.orderByLigationNo = params.orderByLigationNo;
            this.params.orderByDateCompleted = params.orderByDateCompleted;
            this.fetchLigationStatusList();
        },
        showDialog() {
            // this.dialogVisible = true
            this.fetchLigationStatusList();
        },
        closeDialog() {
            this.reportDialogVisible = false;
        },
        handleAddReport() {
            if (!this.qualified) {
                return this.$message.error('请输入数量');
            }
        },
        handleReport(row) {
            // if (!row.quantity && row.ligationNo) {
            //     this.dialogTitle = '上报数量';
            // }
            // else {;
            //     this.dialogTitle = '修改上报数量';
            // }
            // this.handleRow = row;
            // this.reportDialogVisible = true;
            // row.alreadyReportNum = Number(row.quantity)
            // if(Number(row.total)-Number(row.quantity)>0){
            //     row.canReportNum = Number(row.total)-Number(row.quantity)
            // }else {
            //     row.canReportNum = 0
            // }

            this.$emit('on-handle-item', row);
        },
        setRowClassName(row, index) {
            if (row.isColspan) {
                return 'colspan__row';
            }
            return '';
        },
        setColspan(arr = [1, 7]) {
            arr = !this.isShowLength ? [1, 6] : [1, 7];
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
        renderText({ quantity, defectived, wasted }) {
            if (quantity || defectived || wasted) {
                return [quantity ? '合格品' + quantity : '', defectived ? '次品' + defectived : '', wasted ? '废品' + wasted + '' : ''];
            }
            else {
                return null;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .ligation-list--wrapper {
        text-align: left;
        margin-top: 10px;
    }
    .ligation-list__btn {
        font-size: 12px;
        color: rgba(28,161,255,1);
        text-decoration: underline;
    }
    .ligation-list__pagination {
        margin-top: 16px;
    }
    .view-btn {
        padding: 7px 12px;
        font-size: 14px;
        color: rgba(28,161,255,1);
        border-radius:2px;
        border: 1px solid rgba(28,161,255,1);
        &:hover {
            opacity: .7;
        }
    }
    .quality-status > span:not(:last-child)::after {
        content: ','
    }
    .is-over {
        color: #23C811
    }
    .is-unreport {
        color: #C4C6CC
    }
    .is-persuade {
        color: #FA4150
    }
</style>

<style lang="scss">
.ligation-list__table {
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

