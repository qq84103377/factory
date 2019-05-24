import {mapActions} from 'vuex';
import {
    queryFacMissionList,
    checkReportPermission,
    getNodeInfoByHover
} from '@/api';

export default {
    data() {
        return {
            loading: false,
            popoverData: null,
            dataAuth: 0,                 //工单数据权限
            userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
            facId: JSON.parse(sessionStorage.getItem("user_login")).unitId,
            flag: false,                //工单数据查看权限
            costShow: false             //是否显示查看工价
        }
    },
    computed: {
        popoverDisabled() {
            return !this.nodeItem;
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
            const {nodeNotifys} = this.popoverData;
            return nodeNotifys.some(item => {
                return +item.notifyType === 3;
            });
        },
        // 预警提示
        isNotify() {
            const {nodeNotifys} = this.popoverData;
            return nodeNotifys.some(item => {
                return +item.notifyType === 0;
            })
        },
        isQuailtyChecking() {
            return this.popoverData.typeCode === 'quality-checking';
        }
    },
    methods: {
        //点击缩略图展示大图
        showBigImg(item, index){
            //封装图片数据格式
            const picList = [];
            item.forEach( val => {
                let picObj = {};
                picObj['path'] = val;
                picList.push(picObj);
            });
            this.$emit('showImgPreview', picList ,index);
        },
        ...mapActions(['remarkAdd', 'remarkEdit', 'handleDialog', 'handleReportDialog', 'setNodeInfo']),
        viewDetail() {
            if (this.popoverDisabled) return;
            this.$router.push({
                path: '/OrderDetailed',
                query: {
                    missionId: this.missionId,
                    instanceWorkflowId: this.nodeItem.id,
                    currentPage: this.configure.currentPage,
                    scrollTop: this.configure.scrollTop,

                }
            });
        },
        showPopover(isReload = false) {
            this.checkCost();
            // isReload 添加备注或者修改备注成功为true；
            if (this.popoverDisabled) return;
            // if (!isReload && this.popoverData) return this.popoverData;
            this.loading = true;
            getNodeInfoByHover({
                instanceId: this.nodeItem.id
            }).then(res => {
                this.$set(this, 'popoverData', res.data.facMissionHoverInfo);
                this.loading = false;
            });
        },
        // 判断查看工价权限
        checkCost() {
            var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (datalist.indexOf("fac.mission.labour.cost.view") == -1) {
                this.costShow = false;
            }else{
                this.costShow = true;
            }

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
                    return '差数提醒';
                case 3:
                    return '备注提醒';
            }
        },
        handleAddRemark() {
            const data = {
                facId: this.facId,
                userId: this.userId
            };
            queryFacMissionList(data).then(res => {
                this.dataAuth = res.data.dataAuth;
                //工单负责人id
                let orderId = [];
                if (this.orderLeaders) {
                    for (let i = 0; i < this.orderLeaders.length; i++) {
                        let itemId = this.orderLeaders[i].id;
                        orderId.push(itemId);
                    }
                }
                //节点负责人dom
                let chargerDom = this.$refs.chargerItem;
                //节点负责人id
                let chargerId = [];
                if (chargerDom) {
                    for (let i = 0; i < chargerDom.length; i++) {
                        let itemId = chargerDom[i].getAttribute('data-chargerId');
                        chargerId.push(itemId);
                    }
                }
                if(this.dataAuth ===1 && orderId.indexOf(this.userId) === -1 &&  chargerId.indexOf(this.userId) === -1){
                    this.$message.error("您没有操作权限");
                    return;
                }else{
                    const data = {};
                    var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
                    if (this.isRemark) {
                        if (datalist.indexOf("fac.mission.node.remark.edit") == -1) {
                            this.$message.error("抱歉，您没有操作权限");
                            return;
                        }
                        this.handleDialog({visible: true});
                        this.remarkEdit({
                            data: {...this.popoverData, instanceId: this.nodeItem.id},
                            type: 'edit',
                            instance: this
                        });
                        return
                    }
                    if (datalist.indexOf("fac.mission.node.remark.add") == -1) {
                        this.$message.error("抱歉，您没有操作权限");
                        return;
                    }
                    this.handleDialog({visible: true});
                    this.remarkAdd({
                        data: {...this.nodeItem, instanceId: this.nodeItem.id},
                        type: 'new',
                        instance: this
                    });
                }
            });
        },
       async handleReport(notifyId) {
            console.log(notifyId);
            let obj={
                facMissionPrcdNodeId:notifyId,
                userId: this.userId
            };
          let flag = await checkReportPermission(obj).then(res=>{
                if(res.data.code!==0){
                    this.$message.error(res.data.msg)
                    return false
                }else {
                    return true
                }
            });
          if(!flag) return

            const data = {
                facId: this.facId,
                userId: this.userId
            };
            queryFacMissionList(data).then(res => {
                this.dataAuth = res.data.dataAuth;
                //工单负责人id
                let orderId = [];
                if (this.orderLeaders) {
                    for (let i = 0; i < this.orderLeaders.length; i++) {
                        let itemId = this.orderLeaders[i].id;
                        orderId.push(itemId);
                    }
                }
                //节点负责人dom
                let chargerDom = this.$refs.chargerItem;
                //节点负责人id
                let chargerId = [];
                if (chargerDom) {
                    for (let i = 0; i < chargerDom.length; i++) {
                        let itemId = chargerDom[i].getAttribute('data-chargerId');
                        chargerId.push(itemId);
                    }
                }
                if(this.dataAuth ===1 && orderId.indexOf(this.userId) === -1 &&  chargerId.indexOf(this.userId) === -1){
                    this.$message.error("您没有操作权限");
                    return;
                }else{
                    var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
                    if (datalist.indexOf("fac.mission.node.report") == -1) {
                        this.$message.error("抱歉，您没有操作权限");
                        return;
                    }
                    if (this.isQuailtyChecking) {
                        // 质检型节点
                        this.$router.push({
                            path: '/reporting',
                            query: {
                                missionId: this.missionId,
                                instanceWorkflowId: this.nodeItem.id,
                                currentPage:this.configure.currentPage,
                                componentId:this.configure.componentId
                            }
                        });
                        return;
                    }
                    this.handleReportDialog(true);
                    this.setNodeInfo({...this.popoverData, instanceId: this.nodeItem.id});
                }
            });
        }
    }
}
