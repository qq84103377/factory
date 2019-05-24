<template>
    <!--节点的详情-->
    <el-col :span="24" class="node-list-detailed"
            v-if="instanceWorkflow.components&&instanceWorkflow.components.status">
        <!--节点信息-->
        <el-col v-loading="loading" class="node-list-info">
            <!--头部-->
            <el-row class="info-head1" type="flex" justify="space-between">
                <div class="item-node-info" :span="10">
                    <div :span="4" class="node-icon">
                        <span style="position: relative;">
                            <icon type="icon-gongdan_jiedianjingbao-xiao"
                                  v-show="(instanceWorkflow.components.status.delay<0 && instanceWorkflow.components.status.status!='2') || instanceWorkflow.components.status.alerted"
                                  style="vertical-align:-3px;width: 17px;height: 17px;position: absolute;top: -12px;left: 20px;"></icon>
                            <icon v-show="instanceWorkflow.components.status.status=='2'"
                                  type="icon-gongdan-jiedianyiwancheng-da" style="width: 32px;height: 32px;"></icon>
                            <icon v-show="instanceWorkflow.components.status.status=='0'"
                                  type="icon-gongdan-jiedianweikaishi-da" style="width: 32px;height: 32px;"></icon>
                            <icon v-show="instanceWorkflow.components.status.status=='1'"
                                  type="icon-gongdan-jiedianjinxingzhong-da" style="width: 32px;height: 32px;"></icon>
                        </span>
                    </div>
                    <div :span="16" class="node-name">
                        <span class="node--name">{{instanceWorkflow.components.status.nodeName}}</span>
                        <!--v-clickoutside = "slideDownIndex = 9999"-->
                        <div v-clickoutside = "slideDownIndexTurn" style="display: inline-block">
                             <span  :class="{'nodeTagName':true,'nodeListNodeTagNameFinish':instanceWorkflow.components.status.status===2}"  v-for="(item,index) in instanceWorkflow.prcdNodeTags" v-if="item.use" @click="slideDownIndex = index" :key="index">
                                 {{item.tagName}}
                                 <ul v-if="index === slideDownIndex">
                                     <li style="color: #ff9c38" @click="tagVisibleShow">管理节点</li>
                                     <li @click.stop="nodesTagCheckTag($item)" v-for="($item,$index) in instanceWorkflow.prcdNodeTags" :key="$index"><span>{{$item.tagName}}</span><i v-if="$item.use" class="el-icon-check" style="float: right;margin-top: 6px;margin-right: 10px;"></i></li>
                                 </ul>
                            </span>
                             <span class="nodeTagName addNodeTagName"  @click="slideDownIndex = 'addTag';">
                                 添加标签
                                 <ul v-if="slideDownIndex === 'addTag'">
                                     <li style="color: #ff9c38" @click="tagVisibleShow">管理节点</li>
                                     <li @click.stop="nodesTagCheckTag($item)" v-for="($item,$index) in instanceWorkflow.prcdNodeTags" :key="$index"><span>{{$item.tagName}}</span><i v-if="$item.use" class="el-icon-check" style="float: right;margin-top: 6px;margin-right: 10px;"></i></li>
                                 </ul>
                            </span>
                        </div>

                        <p class="node-type">{{instanceWorkflow.components.status.typeName}} </p>
                    </div>
                </div>
                <div class="change-node-status">
                    <div class="status">
                        <span class="text-color"
                              @click="updateStatus('0',instanceWorkflow.components.status.id,instanceWorkflow.components.status.typeId)"
                              :class="{'wait-start':instanceWorkflow.components.status.status == '0'}">
                            <icon w='14' h="14" type="icon-notstar-little"></icon>未开始
                        </span>
                        <span class="text-color"
                              @click="updateStatus('1',instanceWorkflow.components.status.id,instanceWorkflow.components.status.typeId)"
                              :class="{'ongoing':instanceWorkflow.components.status.status == '1'}">
                            <icon w='14' h="14" type="icon-ongoing-little"></icon>
                            进行中
                        </span>
                        <span class="text-color"
                              @click="updateStatus('2',instanceWorkflow.components.status.id,instanceWorkflow.components.status.typeId,instanceWorkflow.components.notify.notifies)"
                              :class="{'finish':instanceWorkflow.components.status.status == '2'}">
                            <icon w='14' h="14" type="icon-finish-little"></icon>
                            已完成
                        </span>
                        <!-- <p style="color: #a2abb8;">（请为节点选择对应的状态）</p> -->
                    </div>
                </div>

                <div class="btn-wrap">
                    <nf-button class="back-btn" @click="goBack">
                        返回
                    </nf-button>
                </div>
            </el-row>
            <!-- <el-row
            class="info-head1"
            type="flex"
            justify="space-between">
                <span class="title status-color">节点状态</span>
            </el-row> -->
            <!-- 节点提醒 -->
            <node-remind :nodeinfo="instanceWorkflow.components.information" @on-report="handleReportSuccess"
                         :selectPersonList="options.personOptions"
                         :notify="instanceWorkflow.components.notify"></node-remind>
            <!-- 节点信息展示 -->
            <node-info
                    @handleEdit="click_isshow"
                    :nodeInfo="instanceWorkflow.components.information">
            </node-info>
            <!-- 节点信息编辑 -->
            <info-edit v-if="isInfoEdist" :visible.sync="isInfoEdist"
                       :nodeCode="instanceWorkflow.components.information.labourCost"
                       :updateForm="instanceWorkflow.components.information" :options="options"
                       @cancelEdit="handleCancelInfoEdit" @confirmEdit="updteData"></info-edit>
            <!-- sku表格 -->
            <component
                    :is="componentId"
                    :selectPersonList="options.personOptions"
                    :instanceWorkflow="instanceWorkflow"
                    :outsideMsg="outsideMsg"
                    @getFlagVal='getFlagVal'
                    @on-report="handleReportSuccess">
            </component>
            <!-- 警报信息 -->
            <!-- <warning-msg :personOptions="options.personOptions" @on-addWarning="handleAddWarningSuccess"></warning-msg> -->
            <!-- 节点动态列表 -->
            <dynamics :showTitle="true" ref="dynamics" :instanceWorkflow="instanceWorkflow.components"
                      :reportTableData="reportTableData" :personOptions="options.personOptions"
                      :nodeReportTableVal="dynamiceSkuVal" :log="instanceWorkflow.components.log"
                      @on-success="handleAddWarningSuccess"></dynamics>
        </el-col>
        <el-dialog :show-close="false" :visible.sync="visible.deleVisible" size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <img style="display:inline-block;" src="static/images/icon_question.png"/>
                    <p style="color:#3b3b3b;" v-if="this.instanceWorkflow.components.status.completePopConfirm"
                       class="delete-tip">{{this.instanceWorkflow.components.status.completePopConfirm.title}}</p>
                    <p style="color:#a2abb8;" v-if="this.instanceWorkflow.components.status.completePopConfirm">
                        {{this.instanceWorkflow.components.status.completePopConfirm.content}}</P>
                </div>
                <div class="handle-delete">
                    <nf-button @click="visible.deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" :loading="visible.updateBtnLoading"
                               @click="update('2',instanceWorkflow.components.status.id)">确 定
                    </nf-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :show-close="false" :visible.sync="visible.statusVisible" size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <p style="color:#2b2b2b;font-size:16px;">是否设置为{{status}}状态</P>
                </div>
                <div class="handle-delete">
                    <nf-button @click="visible.statusVisible = false">取 消</nf-button>
                    <nf-button type="warning" :loading="visible.updateBtnLoading"
                               @click="update(statusNum,instanceWorkflow.components.status.id)">确 定
                    </nf-button>
                </div>
            </div>
        </el-dialog>
        <!-- 延误订单设置成完成时的弹窗操作 -->
        <el-dialog :modal-append-to-body="false" class="custom-dialog back-node-dialog" title="延误原因"
                   :visible.sync="visible.status_finish"
                   :before-close="handleClose" size="tiny">
            <p class="text-left pdb15">该节点处于已延误状态，本次操作将完成此节点，请填写延误原因</p>
            <el-form
                :model="backNode" ref="backNode">
                <!-- label="回退原因"  -->
                <el-form-item 
                    prop="message"
                    :rules="[{ required: true, message: '请输入节点延误原因'}]"
                    required>
                    <el-input
                            type="textarea"
                            :rows="4"
                            :maxlength="50"
                            resize="none"
                            placeholder="请输入内容"
                            v-model.trim="backNode.message">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible.status_finish = false" v-if="!backNode.valFlag" >取 消</el-button>
                <el-button :loading="visible.isSubmitting"  type="primary" @click="confirmBackNode(statusNum,instanceWorkflow.components.status.id)">确定</el-button>
            </div>
        </el-dialog>
        <!--标签管理-->
        <node-tag-dialog :prcdNodeId="instanceWorkflowId" v-if="tagVisible" :visible.sync="tagVisible" :propTableData="instanceWorkflow.prcdNodeTags&&instanceWorkflow.prcdNodeTags.length?JSON.parse(JSON.stringify(instanceWorkflow.prcdNodeTags)):[]" @getTagTableData="getTagTableData"></node-tag-dialog>

    </el-col>
</template>

<script>
    import nodeInfo from "../../../service/node-info";
    import progressSuccess from "./progress-success";
    import infoEdit from "../infoEdit";
    import Dynamics from "../dynamics";
    import NodeDynamics from "../nodeDynamics";
    import nodeRemind from "./node-remind";
    import mixin from "../mixin";
    import Utils from "@/utils/format";
    import numNode from "./num-node"; // 数量型
    import qualityDetail from "./quality-detail"; //质检
    import cuttingNode from "./cutting-bed-node"; // 裁床-数量
    import cuttingNodeWym from "./cutting-bed-node-wym"; // 裁床-唯一码
    import actualCuttingLigation from "./actual-cutting-ligation"; // 裁床-扎号
    import totalNode from "./total-node"; // 总数
    import tailIn from "./tail-in-node"; // 入库
    import tailOut from "./tail-out-node"; // 发货
    import matertialNodeDetail from "./matertial-node-detail"; // 送料
    import samplingNode from "./sampling-node"; // 抽检型节点
    import samplingNodeQuantity from "./sampling-node-quantity"; // 抽检型节点
    import matertialFreeNodeDetail from "./matertial-free-node-detail"; // 自由送料型节点
    import NodeTagDialog from '@/components/templateManage/children/nodeTagDialog'
    import {
        getTaskInstanceWorkflow,
        instanceMissionNodeInfo,
        updateTaskInstanceWorkflow,
        getPersonList,
        getGoodSkuList,
        nodeInfoEdit,
        nodeInfoReason,
        nodesTagList,
        nodesTagCheckTag,
        nodesTagUpdate,
        storeList,
        updateTaskNodeFac
    } from "@/api";

    export default {
        props: {},
        mixins: [mixin],
        inject: ['homeRouterReload'],     //注入全局刷新方法
        data() {
            return {
                tagVisible:false,
                prcdNodeTages:[],
                slideDownIndex:9999,
                "tags": [{
                    "id": "",
                    "prcdNodeId": "e2e42e3e0f4843b1940cde61c399f98a",
                    "tagName": "标签4",
                    "sort": 0,
                    "use": null,
                    "facMissionId": null,
                    "facMissionPrcdNodeId": null
                }, {
                    "id": "33dc2ba55b60464580205700edbab331",
                    "prcdNodeId": "e2e42e3e0f4843b1940cde61c399f98a",
                    "tagName": "标签3",
                    "sort": 1,
                    "use": null,
                    "facMissionId": null,
                    "facMissionPrcdNodeId": null
                }],
                componentName: "nodeDetail",
                isInfoEdist: false,
                skuRadio: 0,
                unDoneNum: 0,
                instanceWorkflow: {},
                selectPersonList: [],
                skuList: [],
                reportTableData: {},
                copySkuVal: {}, // 备份首次获取的sku数据
                staticSkuVal: {}, // 展示表格sku数据
                reportSkuVal: {}, // 上报时表格sku数据
                dynamiceSkuVal: {}, // 节点动态sku空数据
                options: {
                    personOptions: []
                },
                visible: {
                    deleVisible: false,
                    updateBtnLoading: false,
                    statusVisible: false,
                    status_finish:false,
                    isSubmitting:false,
                },
                updateForm: {},
                pickerBeginDateAfter: {
                    disabledDate: time => {
                        let beginDateVal = this.updateForm.beginAt;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                store: [],
                loading: true,
                sign: "0",
                status: "",
                statusNum: "",
                outsideMsg: {
                    fabricatingPlantId: '',
                    fabricatingPlantName: '',
                    fabricatingPlantType: '',
                    missionNodeId: ''
                },
                // 设置延误原因
                backNode:{
                    message:'',
                    valFlag:false
                },
            };
        },
        computed: {
            parent() {
                let result = this.$parent;
                while (!(result.componentName === "orderDetail")) {
                    result = result.$parent;
                }
                return result;
            },
            componentId() {
                const nodeTypes = {
                    quantitative: "numNode",
                    tail_in_store: "tailIn",
                    tail_out_store: "tailOut",
                    actual_cutting: "cuttingNode",
                    total: "totalNode",
                    actual_cutting_wym: "cuttingNodeWym",
                    material: "matertialNodeDetail",
                    quality_checking: "qualityDetail",
                    actual_cutting_ligation: "actualCuttingLigation",
                    select_check: "samplingNode",
                    freedom_material: "matertialFreeNodeDetail",
                    select_check_quantity: "samplingNodeQuantity"
                };
                const components = this.instanceWorkflow.components;
                console.log(this.instanceWorkflow,'this.instanceWorkflowthis.instanceWorkflow');
                const type = Object.keys(components).find(item => {
                    console.log(item,'itemitem');
                    return nodeTypes.hasOwnProperty(item);
                });
                console.log(type,'typetype');
                if (type) {
                    return nodeTypes[type];
                }
                return "";
            },
            orderData() {
                return this.parent.orderData;
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
            missionId() {
                return this.$route.query["missionId"];
            },
            instanceWorkflowId() {
                return this.$route.query["instanceWorkflowId"];
            }
        },
        watch: {
            "$route.query.instanceWorkflowId"(val, old) {
                if (val !== old) {
                    this.nodesTagList()
                    this.fetchTaskInstanceWorkflow({
                        instanceWorkflowId: this.instanceWorkflowId,
                        facId: this.facId,
                        missionId: this.missionId
                    });

                }
            },
            "visible.addReportVisible"(val) {
                console.log(this.isBoss);
                this.reportFrom["finishUserId"] = val && this.isBoss ? "" : this.userId;
                this.reportFrom.endAt = Utils.formatDate(new Date());
                this.$refs["reportTable"] && this.$refs["reportTable"].initOnceInputVal();
            }
        },
        components: {
            NodeTagDialog,
            nodeInfo,
            infoEdit,
            Dynamics,
            NodeDynamics,
            progressSuccess,
            cuttingNodeWym,
            nodeRemind,
            numNode,
            qualityDetail,
            totalNode,
            cuttingNode,
            tailIn,
            tailOut,
            matertialNodeDetail,
            actualCuttingLigation,
            samplingNode,
            samplingNodeQuantity,
            matertialFreeNodeDetail,
        },
        methods: {
             handleClose(done) {
                this.$confirm('请填写延误原因')
                .then(_ => {
                    if(this.backNode.valFlag){
                            this.$refs[formName].validate((valid) => {
                            if (valid) {
                                done();
                            } else {
                                // console.log('error submit!!');
                                this.$message({
                                    message: '请填写延误原因',
                                    type: 'warning'
                                });
                                return false;
                            }
                        });
                    }
                    else{
                        done();
                    }
                    
                    
                })
                .catch(_ => {});
            },
            // 获取上报后的完成标志位
            getFlagVal(val){
                // console.log("看看获取到额标志位是什么：",val);
                    this.backNode.valFlag = val;
                    // console.log("俺看这里:",this.instanceWorkflow.components.notify.notifies);
                    let errorFlag = this.instanceWorkflow.components.notify.notifies;
                    if (val) {
                        if(errorFlag.length!=0){
                            if(errorFlag[0].type ==1){
                                this.visible.status_finish = true;
                            }
                        }
                        else{//当如果不弹出延误窗口也需要刷新下
                            this.homeRouterReload();
                        }

                    }//当上报完成数没有达标的时候也要更新下
                    else{
                        this.homeRouterReload();
                    }
                    
                // }
            },
            slideDownIndexTurn(){
                this.slideDownIndex = 9999
                // console.log(212121);
            },
            nodesTagCheckTag(item){
                let obj = {
                    id:item.id,
                    facMissionPrcdNodeId:this.instanceWorkflowId,
                    isUse:item.use?0:1
                }
                nodesTagCheckTag(obj).then(res=>{
                    console.log(res);
                    this.homeRouterReload();
                })
            },
            tagVisibleShow(){
                this.tagVisible = true
            },
            //更新节点标签
            getTagTableData(val){
                val.forEach(item=>{
                    item.facMissionPrcdNodeId = this.instanceWorkflowId;
                    if(!item.id){
                        item.id = ''
                    }
                    if(!item.use){
                        item.use = false
                    }
                })
                nodesTagUpdate(val).then(res=>{
                    if(res.data.code === 0){
                        this.homeRouterReload();

                    }else {
                        this.$message.error(res.data.msg)
                    }
                    this.tagVisible = false;
                })
            },
            nodesTagList() {
                nodesTagList({prcdNodeId: this.instanceWorkflowId}).then(res => {

                })
            },
            click_isshow() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist) {
                    for (let i = 0; i < datalist.length; i++) {
                        if (datalist[i] == "fac.mission.node.status.update") {
                            this.sign = "1";
                        }
                    }
                }
                if (this.sign == "0" || !datalist) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.isInfoEdist = true;
            },
            goBack() {
                this.$router.push(
                    `/OrderDetailed?missionId=${this.$route.query.missionId}`
                );
            },
            /**获取展示的数据，一次性给到 */
            fetchTaskInstanceWorkflow(params) {
                params.userId = this.userId;
                this.loading = true;
                instanceMissionNodeInfo(params).then(async res => {
                    if (res.data.code != 0) {
                        this.$message.error(res.data.msg);
                        return
                    }
                    //获取外发厂需要的outsideMsg
                    this.outsideMsg.fabricatingPlantId = res.data.header.fabricatingPlantId;
                    this.outsideMsg.fabricatingPlantName = res.data.header.fabricatingPlantName;
                    this.outsideMsg.fabricatingPlantType = res.data.header.fabricatingPlantType;
                    this.outsideMsg.missionNodeId = res.data.header.missionNodeId;
                    //获取负责人列表的ID，用于编辑负责人
                    res.data.components.information.leaderIds = [];
                    for (
                        let i = 0;
                        i < res.data.components.information.chargers.length;
                        i++
                    ) {
                        res.data.components.information.leaderIds.push(
                            res.data.components.information.chargers[i].id
                        );
                    }
                    // 设置节点类型typeCode
                    res.data.components.information.typeCode = res.data.nodeType.code
                    this.instanceWorkflow = res.data;
                    console.log("当前页面的数据:", this.instanceWorkflow);                 
                    //获取SKU外壳，让所有的都拿同一个壳，直接在数量型的对象里面拿
                    const skuList = this.instanceWorkflow.metadatas;
                    this.skuList = skuList;
                    // this.initUpdateForm(this.instanceWorkflow);
                    //获取负责人列表
                    this.fetchPersonList();
                    if (skuList && this.instanceWorkflow.metadatas) {
                        this.getReportSkuVal(JSON.parse(JSON.stringify(this.instanceWorkflow.quantities)), skuList);
                    }
                    this.loading = false;
                });
            },
            fetchGoodSku(goodsId) {
                const params = {
                    goodsId: goodsId
                };
                return getGoodSkuList(params).then(res => {
                    return res.data;
                });
            },
            getReportSkuVal(nodeSKUList) {
                let data = this.regroupTaleData(this.skuList, true);
                this.reportSkuVal = JSON.parse(JSON.stringify(data["skuVal"]));
                this.staticSkuVal = this.setReportSkuVal(nodeSKUList, data["skuVal"]);
                this.copySkuVal = JSON.parse(JSON.stringify(this.staticSkuVal));
                this.getDynamiceSkuVal(JSON.parse(JSON.stringify(data["skuVal"])));
                this.reportTableData = data;
            },
            // 节点动态sku表的空数据
            getDynamiceSkuVal(skuVal) {
                skuVal = JSON.parse(JSON.stringify(skuVal));
                Object.keys(skuVal).map(key => {
                    skuVal[key].finishNum = "";
                    skuVal[key].num = "";
                });
                this.dynamiceSkuVal = skuVal;
            },
            setReportSkuVal(nodeSKUList, staticSkuVal) {
                if (!nodeSKUList) return;
                Object.keys(staticSkuVal).map(key => {
                    const findItem = nodeSKUList.find(
                        item => item.skuId === staticSkuVal[key]["skuId"]
                    );
                    if (findItem) {
                        staticSkuVal[key] = {...findItem};
                    }
                });
                return staticSkuVal;
            },
            // 获取关联人员列表
            fetchPersonList() {
                const params = {
                    unitId: this.facId
                };
                getPersonList(params).then(res => {
                    this.options["personOptions"] = res.data;
                });
                storeList({unitId: this.facId}).then(res => {
                    console.log(res);
                    this.store = res.data.storehouses;
                });
            },
            getLeaderIds(leaders) {
                const arr = [];
                leaders.map(item => {
                    arr.push(item.userId);
                });
                return arr;
            },
            updteData(backtabledata) {
                let information = this.instanceWorkflow.components.information;
                let param = {
                    id: information.id,
                    editType: "information",
                    chargeIds: information.leaderIds,
                    labourCost: information.labourCost,
                    dateStart: information.dateStart,
                    dateEnd: information.dateEnd,
                    remark: information.remark || "",
                    outSideFlag: information.outSideFlag,
                    machiningUnitPrice: information.outSideFlag ? information.machinigUnitPrice : 0,
                    outSideFactoryId: information.outSideFlag ? information.outSideFactoryId : '',
                    prcdNodeAttachments: information.nodeAttachments
                };
                nodeInfoEdit(param).then(res => {
                    if (res.data.code == 0) {
                        this.isInfoEdist = false;
                        this.fetchTaskInstanceWorkflow({
                            instanceWorkflowId: this.instanceWorkflowId
                        });
                        this.$nextTick(() => {
                            this.homeRouterReload();
                            this.saveTaskNodeFac(backtabledata);
                            // this.$emit("refreshMissionNodeInfoList");
                        });
                    } else {
                        this.$message.error(res.data.msg)
                    }
                });
                return;
                const params = this.getUpdteDataParams(status);
                let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,3})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (params.wages && !reg.test(params.wages)) {
                    this.$message.error("请输入小数点三位以内的正数!");
                    return;
                }
                updateTaskInstanceWorkflow(params).then(res => {
                    if (res.data.code == 0) {
                        this.instanceWorkflow["status"] = params["status"];
                        this.$message.success("修改成功");
                        // this.initUpdateForm();
                        !status && this.updateSuccess();
                        this.isInfoEdist = false;
                        this.$nextTick(() => {
                            this.$emit("refreshMissionNodeInfoList");
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: "目标数量上报未完成，节点无法完成",
                            type: "error"
                        });
                    }
                });
            },
            update(status, id) {
                let params = {
                    editType: "status",
                    status: status,
                    id: id,
                    userId: this.userId
                };
                this.visible.updateBtnLoading = true;
                nodeInfoEdit(params).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.visible.statusVisible = false;
                        this.visible.deleVisible = false;
                        this.visible.updateBtnLoading = false;
                        this.fetchTaskInstanceWorkflow({
                            instanceWorkflowId: this.instanceWorkflowId
                        });
                        this.$nextTick(() => {
                            this.$emit("refreshMissionNodeInfoList");
                        });
                    }
                });
            },
            // 延误操作结点提交原因--点击事件
            confirmBackNode(status,id){
                if(this.backNode.valFlag){
                    status = '2';
                }
                let params = {
                    editType: "status",
                    status: status,
                    id: id,
                    userId: this.userId
                };
                let params_reason = {
                    reasonDelay: this.backNode.message,
                    nodeId: id,
                };
                this.visible.isSubmitting=true;
                this.$refs['backNode'].validate((valid) => {
                    if (valid) {
                        nodeInfoEdit(params).then(res => {
                            // console.log(res);
                            if (res.data.code == 0) {
                                // this.visible.status_finish = false;
                                // this.visible.deleVisible = false;
                                // this.visible.isSubmitting = false;
                                this.fetchTaskInstanceWorkflow({
                                    instanceWorkflowId: this.instanceWorkflowId
                                });
                                this.$nextTick(() => {
                                    this.$emit("refreshMissionNodeInfoList");
                                });
                                nodeInfoReason(params_reason).then(res => {
                                    // console.log("江卓帆请求的接口：",res);
                                    if (res.data.code == 0) {
                                        this.visible.status_finish = false;
                                        this.visible.deleVisible = false;
                                        this.visible.isSubmitting = false;
                                        // this.fetchTaskInstanceWorkflow({
                                        //     instanceWorkflowId: this.instanceWorkflowId
                                        // });
                                        // this.$nextTick(() => {
                                        //     this.$emit("refreshMissionNodeInfoList");
                                        // });
                                        this.$message({
                                            message: '节点延误原因保存成功',
                                            type: 'success'
                                        });
                                        // 填写延误原因之后刷新页面
                                        this.homeRouterReload();
                                    }
                                    else{
                                        this.$message({
                                            message: '节点延误原因保存失败',
                                            type: 'error'
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        this.$message({
                            message: '请填写节点延误原因',
                            type: 'warning'
                        });
                        this.visible.isSubmitting = false;
                        return false;
                    }
                });
                
                
                
            },
            updateStatus(status, id,id2,type=0) {    
                 // 权限
                if(!this.powerJudgement.permissions("fac.mission.node.status.update")){
                    return
                }            
                this.statusNum = status;
                if (status == '0') {
                    this.status = '未开始';
                } else if (status == '1') {
                    this.status = '进行中';
                } else if (status == '2') {
                    this.status = '已完成';
                    // 判断是设置已完成的状态
                    
                }
                if(type[0]!=null){

                    if(type[0].type==1){
                        this.backNode.message = '';
                        this.visible.status_finish = true;
                        return;
                    }
                }else
                if (this.instanceWorkflow.components.status.completePopConfirm == null) {
                    this.visible.statusVisible = true;
                    return;
                }
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist) {
                    for (let i = 0; i < datalist.length; i++) {
                        if (datalist[i] == "fac.mission.node.status.update") {
                            this.sign = "1";
                        }
                    }
                }

                if (this.sign == "0" || !datalist) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                console.warn(
                    status,
                    this.instanceWorkflow.components.status.completePopConfirm
                );
                if (
                    status == "2" &&
                    this.instanceWorkflow.components.status.completePopConfirm != null
                ) {
                    this.visible.deleVisible = true;
                    return;
                } else {
                    let params = {
                        editType: "status",
                        status: status,
                        id: id,
                        userId: this.userId
                    };
                    this.loading = true;
                    nodeInfoEdit(params).then(res => {
                        console.log(res);
                        this.loading = false;
                        if (res.data.code == 0) {
                            this.visible.statusVisible = false;
                            this.fetchTaskInstanceWorkflow({
                                instanceWorkflowId: this.instanceWorkflowId
                            });
                            this.$nextTick(() => {
                                this.$emit("refreshMissionNodeInfoList");
                            });
                        }
                    });
                }
                // this.updteData(status);
            },
            //执行外发厂节点信息的保存
            saveTaskNodeFac(data){
                // console.log('传到的数据：',data);
                let information = this.instanceWorkflow.components.information;
                let Tabledata = [];
                data.forEach( v => {
                    Tabledata.push({
                        id:v.outsideFactoryId,
                        price:v.machiningUnitPrice,
                    });
                });
                let params = {
                    outsideFactoryList:Tabledata,
                    facMissionPrcdNodeId:information.header.missionNodeId,
                };
                updateTaskNodeFac(params).then(res =>{
                    if (res.data.code == 0) {
                        this.$message({
                            showClose: true,
                            message: '修改成功',
                            type: 'success'
                            });
                    }else{
                        this.$message({
                            showClose: true,
                            message: '加工厂工价修改失败',
                            type: 'error'
                        });
                    }
                });
            }, 
            getUpdteDataParams(status) {
                return {
                    userId: this.userId,
                    id: this.instanceWorkflow["id"],
                    status: status || this.instanceWorkflow["status"],
                    ...this.updateForm
                };
            },
            updateSuccess(type, status) {
                console.warn(this.updateForm);
                const leaders = [];
                for (let perItem of this.options["personOptions"]) {
                    const had = this.updateForm["leaderIds"].some(
                        item => perItem["id"] === item
                    );
                    if (had) {
                        leaders.push({
                            userId: perItem["id"],
                            userName: perItem["userName"]
                        });
                    }
                }
                this.instanceWorkflow = {
                    ...this.instanceWorkflow,
                    ...this.updateForm,
                    leaders
                };
                // console.log(this.instanceWorkflow)
            },
            initUpdateForm(instanceWorkflow) {
                const {leaders, remark, wages} = instanceWorkflow;
                this.updateForm = {
                    leaderIds: this.getLeaderIds(leaders),
                    endAt: instanceWorkflow.endAt || "",
                    beginAt: instanceWorkflow.beginAt || "",
                    wages: wages || "",
                    remark
                };
                // console.log(this.updateForm);
            },
            handleCancelInfoEdit() {
                this.fetchTaskInstanceWorkflow({
                    instanceWorkflowId: this.instanceWorkflowId
                });
                this.isInfoEdist = false;
                this.homeRouterReload();
                // this.$emit("refreshMissionNodeInfoList");
            },
            handleReportSuccess() {
                this.fetchTaskInstanceWorkflow({
                    instanceWorkflowId: this.instanceWorkflowId,
                    facId: this.facId,
                    missionId: this.missionId
                });
                this.$emit("refreshMissionNodeInfoList");
                this.homeRouterReload();
            },
            handleAddWarningSuccess() {
                this.$emit("refreshMissionNodeInfoList");
                this.fetchTaskInstanceWorkflow({
                    instanceWorkflowId: this.instanceWorkflowId,
                    facId: this.facId,
                    missionId: this.missionId
                });
            }
        },
        created() {

            this.fetchTaskInstanceWorkflow({
                instanceWorkflowId: this.instanceWorkflowId
            });            
        },
        //利用这个钩子函数是因为当前的router用了keep-alive
        activated() {
            this.fetchTaskInstanceWorkflow({
                instanceWorkflowId: this.instanceWorkflowId
            });
        }
    };
</script>

<style lang="scss" scoped>
    //节点详情
    .node-list-detailed {
        padding: 27px 32px 0 32px;

        border-top: 1px solid #e6e8eb;
        .nodeTagName{
            display: inline-block;
            /*width: 100px;*/
            padding: 0 4px;
            height: 26px;
            line-height: 26px;
            color: #fff;
            background: #ff9c38;
            text-align: center;
            margin: 0 6px;
            cursor: pointer;
            position: relative;
            ul{
                position: absolute;
                left: 0;
                top: 30px;
                border: 1px solid #e6e8eb;
                z-index: 1;
                background: #fff;
                li{
                    color: #666;
                    width: 200px;
                    text-align: left;
                    padding-left: 10px;
                    box-sizing: border-box;
                    border-bottom: #e6e8eb;

                }
            }
        }
        .nodeListNodeTagNameFinish{
            background: #666;
        }
        .addNodeTagName{
            background: #fff;
            color: #666;
            border: 1px solid #666;
        }
        .dib {
            display: inline-block;
            margin-right: 10px;
        }
        .w60 {
            width: 56px;
        }
        .w100 {
            width: 100%;
        }
        .node-list-info {
            .el-date-editor {
                width: 240px;
            }
            .status-color {
                color: #636363;
            }
            .list-edit {
                color: #1f96ff;
                margin-left: 8px;
            }
            .text-color {
                color: #2c2c2c;
                border: 1px solid #ccc;
            }
            .info-head1 {
                // margin-bottom: 24px;
                line-height: 32px;
                border-bottom: 1px solid #e6eaf0;
                .back-btn {
                    width: 72px;
                }

                .item-node-info {
                    height: 36px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .node-name {
                        line-height: 18px;
                        .node--name {
                            font-size: 14px;
                            color: #2c2c2c;
                        }
                        .node-type {
                            font-size: 12px;
                            color: #a2abb8;
                        }
                    }

                    .node-icon {
                        margin-right: 12px;
                    }
                }
            }
            .change-node-status {
                display: flex;
                justify-content: flex-start;
                margin-bottom: 0;
                padding-bottom: 24px;
                .title {
                    margin-right: 12px;
                }
                .status {
                    display: flex;
                    span {
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-right: 12px;
                        width: 88px;
                        color: #a2abb8;
                        height: 32px;
                        border-radius: 24px;
                        border: solid 1px #e6eaf0;
                    }

                    //节点状态颜色
                    .wait-start {
                        background-image: linear-gradient(-45deg, #dae2eb 0%, #d3d9e6 100%);
                        color: #fff;
                        border: none;
                    }

                    .ongoing {
                        background-image: linear-gradient(-45deg, #3dcfff 0%, #1ca1ff 100%);
                        color: #fff;
                        border: none;
                    }

                    .finish {
                        color: #fff;
                        background-image: linear-gradient(-45deg, #65e0b7 0%, #23c811 100%);
                        // margin-right: 0;
                        border: none;
                    }
                }
            }

            //编辑状态

            .node-list-edit {
                border-bottom: 1px solid #e6e8eb;
                padding-bottom: 8px;
                margin-bottom: 24px;
                //节点状态
                .info-head2 {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .title {
                        width: 56px;
                        margin-right: 12px;
                        text-align: right;
                    }

                    //节点状态样式
                    .content {
                        flex: 1;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        //三个状态
                        .status {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            span {
                                display: inline-block;
                                width: 66px;
                                height: 36px;
                                line-height: 36px;
                                text-align: center;
                                border-radius: 2px;
                                margin-right: 12px;
                                &:nth-of-type(3) {
                                    margin-right: 8px;
                                }
                            }
                        }
                    }

                    //负责人和备注的样式
                    .select {
                        flex: 1;
                        .el-select {
                            width: 100%;
                        }
                    }

                    //开始/结束日期
                    .info-data {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        .content {
                            min-width: 240px;
                        }
                    }
                }

                //取消确认按钮
                .enter-update-btn {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 16px;
                    margin-top: 8px;
                    font-family: MicrosoftYaHei;
                    .cancel-btn {
                        font-size: 14px;
                        color: #636363;
                        cursor: pointer;
                    }
                    .enter-btn {
                        font-size: 14px;
                        color: #1ca1ff;
                        cursor: pointer;
                        margin-left: 12px;
                    }
                }

                .info-data-item {
                    display: flex;
                    justify-content: space-between;
                }
                .wait-start {
                    background-image: linear-gradient(-45deg, #dae2eb 0%, #d3d9e6 100%);
                    color: #fff;
                    border: none;
                }
                .ongoing {
                    background-image: linear-gradient(-45deg, #3dcfff 0%, #1ca1ff 100%);
                    color: #fff;
                    border: none;
                }
                .finish {
                    color: #fff;
                    background-image: linear-gradient(-45deg, #65e0b7 0%, #23c811 100%);
                    // margin-right: 0;
                    border: none;
                }
            }

            //数量型时需要和逻辑型保持一致
            .is-data {
                margin-bottom: 24px !important;
            }
            .node-list-view {
                margin-top: 8px;
                overflow: hidden;
                padding-bottom: 8px;
                border-bottom: 1px solid #e6e8eb;
                /*margin-bottom: 24px;*/

                .info-head-view {
                    margin-bottom: 16px;
                    .view-left {
                        .view-title {
                            display: inline-block;
                            width: 70px;
                            text-align: right;
                            white-space: nowrap;
                        }
                        .view-content {
                            display: inline-block;
                        }
                    }

                    .view-right {
                        text-align: right;
                        .edit-node-info {
                            font-size: 14px;
                            color: #1ca1ff;
                            cursor: pointer;
                        }
                    }

                    //未填写样式
                    .null-text {
                        font-family: MicrosoftYaHei;
                        font-size: 14px;
                        color: #babdc2;
                    }
                }
            }

            //警报按钮
            .warning {
                border-bottom: 1px solid #e6e8eb;
                padding-top: 24px;
                padding-bottom: 24px;
                button {
                    width: 104px;
                    height: 36px;
                    background-color: #f55d5d;
                    margin-top: 0;
                }
                .warn-list {
                    margin-bottom: 10px;
                    font-size: 12px;
                    padding: 16px;
                    border: solid 1px #ffd6d6;
                    .warn-title {
                        padding-left: 4px;
                        font-size: 14px;
                        color: #2c2c2c;
                    }

                    .warn-member {
                        color: #aaaaaa;
                        line-height: 24px;
                    }

                    .warn-tip {
                        color: #e0b4b4;
                        line-height: 24px;
                        text-align: right;
                    }
                }
            }
            .create-warn {
                margin-top: 8px;
            }
            //数量型表格
            .node-list-table {
                .node-table-title {
                    margin-bottom: -8px;
                    color: #2c2c2c;
                }
                .node-list-content {
                    .report-btn {
                        margin-top: -6px;
                    }
                }
            }
        }
        .dialog-content-wrap {
            text-align: center;
            .delete-tip {
                font-size: 16px;
            }
            p {
                line-height: 26px;
            }
        }

        .handle-delete {
            margin-top: 34px;
        }
    }

    .dynamics-wrap {
        padding-bottom: 32px;
        &__head {
            margin-top: 20px;
            margin-bottom: 12px;
        }
        &__title {
            font-size: 16px;
        }
        &__btn {
            font-size: 14px;
            color: #808080;
        }
    }
</style>

