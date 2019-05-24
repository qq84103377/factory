import {
    queryFacMissionList
} from '@/api';

export default {
    data() {
        return {
            loading: false,
            dataAuth: 0,                 //工单数据权限
            userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
            facId: JSON.parse(sessionStorage.getItem("user_login")).unitId,
            flag: false,                //工单数据查看权限
        }
    },
    computed: {
        popoverData() {
            return this.nodeItem;
        },
        // 延迟
        isDelay() {
            const {delay, status, dateEnd} = this.popoverData;
            return dateEnd && delay < 0 && status !== 2;
        },
        // 进行中
        isOngoing() {
            const {status, dateEnd} = this.popoverData;
            return status === 1 && !dateEnd;
        },
        // 未开始
        isWaitStart() {
            const {status, dateEnd} = this.popoverData;
            return status === 0;
        },
        // 还剩xxx天
        isRemain() {
            const {delay, status, dateEnd} = this.popoverData;
            return delay > 0 && dateEnd && (status == 0 || status === 1);
        },
        // 完成
        isFinish() {
            const {status} = this.popoverData;
            return status === 2;
        },
        // 是否存在备注
        isRemark() {
            const { notifyTypes } = this.popoverData;
            return notifyTypes.some(item => {
                return item == 2;
            });
        },
        // 延迟预警
        isNotify() {
            const { notifyTypes } = this.popoverData;
            return notifyTypes.some(item => {
                return item == 0;
            })
        },
        isQuailtyChecking() {
            return this.popoverData.typeCode === 'quality-checking';
        }
    },
    methods: {
        viewDetail() {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.mission.node.detail")){
                return
            }
            this.$router.push({
                path: '/sample/detail',
                query: {
                    missionId: this.missionId,
                    instanceWorkflowId: this.nodeItem.id
                }
            });
        },
        showPopover(isReload = false) {
            // isReload 添加备注或者修改备注成功为true；
            // if (!isReload && this.popoverData) return this.popoverData;
            // this.loading = true;
            // getNodeInfoByHover({
            //     instanceId: this.nodeItem.id
            // }).then(res => {
            //     this.$set(this, 'popoverData', res.data.facMissionHoverInfo);
            //     this.loading = false;
            // });
        },
        // 渲染工单状态文案
        renderStatusText() {
            const {delay, dateEnd} = this.popoverData;
            if (this.isDelay) {
                return `已延误 ${Math.abs(delay)} 天`
            }
            if (this.isFinish) {
                return '已完成';
            }
            if (this.isRemain) {
                return `还剩${delay}天`;
            }
            if (this.isOngoing) {
                return '进行中';
            }
            if (this.isWaitStart && !dateEnd) {
                return '未开始';
            }
        },
        renderNotifyText(notifyType) {
            switch (+notifyType) {
                case 0:
                    return '延期预警';
                case 1:
                    return '延误警报';
                case 2:
                    return '备注提醒';
            }
        },
        handleAddRemark() {
            // 新建/编辑 权限
            if(!this.powerJudgement.permissions("fac.spl.design.mission.node.remark.insert") ||
                !this.powerJudgement.permissions("fac.spl.design.mission.node.remark.edit")){
                return
            }
            if (this.isRemark) {
                // if (datalist.indexOf("fac.mission.node.remark.edit") == -1) {
                //     this.$message.error("抱歉，您没有操作权限");
                //     return;
                // }
                // 备注编辑
                this.dispatch('SampleMission', 'node.item.add.remark', { type: 'edit', ...this.nodeItem })
                return
            }
            // if (datalist.indexOf("fac.mission.node.remark.add") == -1) {
            //     this.$message.error("抱歉，您没有操作权限");
            //     return;
            // }
            this.dispatch('SampleMission', 'node.item.add.remark', { type: 'new', ...this.nodeItem })
            // const data = {
            //     facId: this.facId,
            //     userId: this.userId
            // };
            // queryFacMissionList(data).then(res => {
            //     this.dataAuth = res.data.dataAuth;
            //     //工单负责人id
            //     let orderId = [];
            //     if (this.orderLeaders) {
            //         for (let i = 0; i < this.orderLeaders.length; i++) {
            //             let itemId = this.orderLeaders[i].id;
            //             orderId.push(itemId);
            //         }
            //     }
            //     //节点负责人dom
            //     let chargerDom = this.$refs.chargerItem;
            //     //节点负责人id
            //     let chargerId = [];
            //     if (chargerDom) {
            //         for (let i = 0; i < chargerDom.length; i++) {
            //             let itemId = chargerDom[i].getAttribute('data-chargerId');
            //             chargerId.push(itemId);
            //         }
            //     }
            //     if(this.dataAuth ===1 && orderId.indexOf(this.userId) === -1 &&  chargerId.indexOf(this.userId) === -1){
            //         this.$message.error("您没有操作权限");
            //         return;
            //     }
            //     else{
            //         const data = {};
            //         var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            //         if (this.isRemark) {
            //             // if (datalist.indexOf("fac.mission.node.remark.edit") == -1) {
            //             //     this.$message.error("抱歉，您没有操作权限");
            //             //     return;
            //             // }
            //             // 备注编辑
            //             this.dispatch('SampleMission', 'node.item.add.remark', { type: 'edit', ...this.nodeItem })
            //             return
            //         }
            //         // if (datalist.indexOf("fac.mission.node.remark.add") == -1) {
            //         //     this.$message.error("抱歉，您没有操作权限");
            //         //     return;
            //         // }
            //         console.log(123)
            //         this.dispatch('SampleMission', 'node.item.add.remark', { type: 'new', ...this.nodeItem })
            //         // 备注添加
            //     }
            // });
        }
    }
}