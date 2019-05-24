
import viewRecordBtn from '../../common/view-record-btn';
import ViewLigationStatus from '../../common/view-ligation-status';
import MissionInfo from '../../common/mission-info';
import DialogForm from '../../common/dialog-form';
import LigationReportList from '../../common/ligation-report-table';
import { formatDate } from "@/utils";
import { getLigationListWithoutReport, ligationNodeReport } from '@/api';
export default {
    data() {
        return {
            ligationParams: [],
            commonLigationReportList: []
        };
    },
    components: {
        viewRecordBtn,
        ViewLigationStatus,
        MissionInfo,
        DialogForm,
        LigationReportList
    },
    computed: {
        isBoss() {
          const info = sessionStorage.getItem('user_login');
          return JSON.parse(info).role === 1;
        },
        userId() {
          return JSON.parse(sessionStorage.getItem('user_login')).userId
        },
        isLigationNode() {
            return this.instanceWorkflow.components && this.instanceWorkflow.components.status.associateLigation;
        },
        ligationTotal() {
            return this.totalNum + this.ligationParams.reduce((total, item) => {
                item.canReportNum ? item.canReportNum : 0
                total += Number(item.canReportNum);
                return total;
            }, 0);
        },
         // 出库、入库型
        isStoreType() {
            return [ 'tail-in-store', 'tail-out-store' ].indexOf(this.instanceWorkflow.nodeType.code) > -1;
        },
        isTotality() {
            return this.instanceWorkflow.nodeType.code === 'totality';
        }
    },
    watch: {
        'visible.addReportVisible'(val) {
            if (val) {
                // const chargers = this.instanceWorkflow.components.information.chargers;
                // this.reportFrom['finishUserId'] = !this.isBoss ? this.userId : (chargers.length ? chargers[0].id : '');
                this.reportFrom.endAt = formatDate(new Date(), 'yyyy-MM-dd');
                this.$refs['nfskutable'] && this.$refs['nfskutable'].resetSkuTableData();
                // 当为扎号时
                this.$refs['ligationReportList'] && this.$refs['ligationReportList'].resetData();
            }else {
                // 当为扎号时
                this.ligationParams=[]
            }
        },
        'isVisible' (val) {
            if(val) {
                const chargers = this.instanceWorkflow.components.information.chargers;
                this.form['finishUserId'] = !this.isBoss ? this.userId : (chargers.length ? chargers[0].id : '');
                this.form.endAt = formatDate(new Date(), 'yyyy-MM-dd');
            }
        }
    },
    methods: {
        // 获取当前节点未上报的扎号列表
        fetchWithoutReportList() {
            const { missionId, instanceWorkflowId } = this.$route.query;
            getLigationListWithoutReport({ missionId, missionNodeId: instanceWorkflowId })
            .then(res => {
                this.commonLigationReportList = res.data.ligations.map(item => {
                    item.qualified = '';
                    item.isColspan = false; // 标记是否合并列
                    return item;
                });
                // this.$nextTick(() => {
                    this.visible.addReportVisible = true;
                // });
            });
        },
        reportLigationNode(actionType) {
            // isTotality 总数型无扎号上报
            if (!this.ligationTotal) {
                return this.$message.error('上报数量不能全部为0！');
            }
            // if (!this.commonLigationReportList.length) {
            //     return this.$message.error('暂无可上报的扎号');
            // }
            const { reports, lostLigationSkuList } = this.$refs['ligationReportList'].getReportParams();
            const { instanceWorkflowId } = this.$route.query;
            const baseParams = {
                userId: this.userId,
                finishDate: this.reportFrom.endAt,
                finishUserId: this.reportFrom.finishUserId,
                missionNodeId: instanceWorkflowId,
                actionType: actionType,
                lostLigationSkuList,
                reports,
            };
            if (this.isStoreType) {
                baseParams.storehouseId = this.storeId;
                baseParams.customerId = this.customerId;
            }
            if(actionType === 'DRAFT'){
                this.visible.btnLoading1 = true;
            }else if(actionType === 'REPORT'){
                this.visible.btnLoading2 = true;
            }
            ligationNodeReport(baseParams)
            .then(res => {
                if(actionType === 'DRAFT'){
                    this.visible.btnLoading1 = false;
                }else if(actionType === 'REPORT'){
                    this.visible.btnLoading2 = false;
                }
                if (res.data.code === 0) {
                    this.visible.addReportVisible = false;
                    this.$emit('on-report');
                    this.$refs['viewLigationStatus'].dialogVisible = false;
                    return this.$message.success('上报成功')
                }
                this.$message.error(res.data.msg || '上报失败');
            });
        },
        handleEditReport(row) {
            this.visible.addReportVisible = true;
            this.visible.ligationEditable = true;
            this.$nextTick(() => {
                if (row.reportId) {
                    this.reportFrom.finishUserId = row.finishUserId;
                    this.reportFrom.endAt = row.finishDate;
                }
                this.fetchWithoutReportList();
                this.ligationParams.push({...row, skuId: row.skuID, ligationId: row.ligationID, qualified: row.reportId ? row.quantity : row.num});
            });
        }
    }
}