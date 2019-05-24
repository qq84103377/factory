<template>
    <div class="node_list">
        <div class="node_title">
            <div class="node_name">节点名称</div>
            <div class="node_leaders">默认负责人
            </div>
            <div class="node_price" style="min-width:100px;">默认工价
            </div>
            <div v-if="!time" class="node_time">
                开始日期
            </div>
            <div v-if="!time" class="node_time">
                结束日期
            </div>
            <div v-if="time" class="node_end-time">默认结束时间
            </div>
            <div v-if="time" class="node_warning">预警提醒 (天)</div>
            <div v-if="time" class="node_warning">差额提醒 (数量)</div>
            <div v-if="time" class="node_warning">外发结算</div>
            <div v-if="time" class="node_warning" :title="titleMsg">上报为工单出货数</div>
            <div v-if="time" class="node_name">上游节点</div>
            <div class="node_opera">操作</div>
        </div>
        <draggable v-model="nodeDataList" :options="{handle:'.draggable'}">
            <transition-group>
                <div class="node_container" v-for="(item,index) in nodeDataList" :key="'Node'+index">
                    <div class="node_name">
                        <template>
                            <el-select
                                    v-model="item.id"
                                    :key="'Node'+index"
                                    @change="showid(item.id, index, item.idFlag)"
                                    filterable
                                    placeholder="请选择节点">
                                <el-option disabled="true"
                                           style="padding-left:10px;padding-top:5px;width:100%;cursor:pointer;">
                                    <div @click="newNode(index)" class="new_node">
                                        <span>+新建</span>
                                    </div>
                                </el-option>
                                <el-option v-for="(items,index) in nodeList" :key="index"
                                           :label="items.name+'（'+items.typeName+'）'" :value="items.id">
                                </el-option>
                            </el-select>
                        </template>
                    </div>
                    <div class="node_leaders node_usersUl">
                        <template>
                            <workerLeader
                                    v-if="manList.length"
                                    :manListProps="manList"
                                    :placeholder="'请选择负责人'"
                                    v-model="item.chargerIds"
                            >
                            </workerLeader>
                        </template>
                    </div>
                    <div class="node_price">
                        <div v-show="item.id">
                            <div class="node_price-flex" v-if="item.typeAilc!=false&&item.ailc!=false">
                                <input @focus="bgcssHiddenPri(index)"
                                       :class="{'input_change-price-focus':bgHiddenPriceIndex===index}"
                                       class="input-edit" v-model.trim="item.dlc" type="text"
                                       @blur="validateMoney(index)"/>
                                <span style="color:#000;">元／件</span>
                            </div>
                            <span v-else>-</span>
                        </div>
                    </div>
                    <div v-if="!time&&item.id" class="node_time">
                        <nf-picker v-if="!time&&item.id" :beginTime='item' :timeSelect="'begin'"
                                   @beginAt='nodeBeTime'></nf-picker>
                    </div>
                    <div v-if="!time&&item.id" class="node_time">
                        <nf-picker v-if="!time&&item.id" :beginTime='item' :timeSelect="'end'"
                                   @endAt='nodeEnTime'></nf-picker>
                    </div>
                    <div v-if="time" class="node_end-time">
                        <div v-show="item.id">
                            交货前<input @focus="bgcssHidden(index)" :class="{'input_change-focus':bgHiddenIndex===index}"
                                      class="input-edit" v-model.trim="item.daysAdvanced" type="text"
                                      @blur="validateDay(index)"/>天
                        </div>
                    </div>
                    <div v-if="time" class="node_warning warning">
                        <el-checkbox v-model="item.needDelayWarning"></el-checkbox>
                        <span class="little-gap" v-show="item.needDelayWarning">结束前</span>
                        <input @input=warning(index,item.delayWarningNum) v-model="item.delayWarningNum"
                               v-show="item.needDelayWarning" type="number" class="input-bg little-gap">
                    </div>
                    <div v-if="time" class="node_warning warning">
                        <div v-show="item.id&&item.allowDifferenceWarning">
                            <div v-if="item.isAllowDifferenceWarning!=false">
                                <el-checkbox v-model="item.needDifferenceWarning"></el-checkbox>
                                <input @input="small(index,item.differenceWarningMin)"
                                       v-model="item.differenceWarningMin" v-show="item.needDifferenceWarning"
                                       type="number" class="input-bg little-gap">
                                <span v-show="item.needDifferenceWarning">-</span>
                                <input @input="big(index,item.differenceWarningMax)" v-model="item.differenceWarningMax"
                                       v-show="item.needDifferenceWarning" type="number" class="input-bg little-gap">
                            </div>
                            <span v-else>-</span>
                        </div>

                    </div>
                    <!-- 外发结算 -->
                    <div v-if="time" class="node_warning warning">
                        <template v-if="showOutsideBalance(item)">
                            <div>
                                <el-checkbox v-model="item.allowOutsideBalance" @change="changeCheck(item,item.allowOutsideBalance, index)"></el-checkbox>
                            </div>
                        </template>
                    </div>
                    <!--上报为工单出货数-->
                    <div class="node_warning warning">
                        <template>
                            <div class="mission-shipment-radio">
                                <el-radio
                                        v-if="showMissionShipment(item)"
                                        :key="'radio'+index"
                                        :label="item.labelId"
                                        v-model="missionShipment">
                                </el-radio >
                            </div>
                        </template>
                    </div>
                    <!-- 上游节点 -->
                    <div class="node_name">
                        <template>
                            <el-select
                                    v-if="showUpstreamNode(item)"
                                    v-model="item.upstreamNodeIdFlag"
                                    filterable
                                    clearable
                                    placeholder="选填">
                                <el-option v-for="items in upstreamNode"
                                           :disabled="item.idFlag === items.idFlag"
                                           :key="items.idFlag"
                                           :label="items.name"
                                           :value="items.idFlag">
                                </el-option>
                            </el-select>
                        </template>
                    </div>
                    <div class="node_opera opera handle">
                        <div v-show="item.id" @click="editNode(index)">
                            <icon class="icon_size" type="icon-edit"></icon>
                            修改节点
                        </div>
                        <div v-show="item.id" class="handle">
                            <div class="draggable">
                                <icon class="icon_size" type="icon-liebiaocaozuo_tuodong"></icon>
                                排序
                            </div>
                        </div>
                        <div @click="delNode(index, item.idFlag)">
                            <icon class="icon_size" type="icon-delete"></icon>
                            删除
                        </div>
                    </div>
                </div>
            </transition-group>
        </draggable>
        <div class="add_btn">
            <el-button type="text" @click="addNode()">+添加节点</el-button>
        </div>
        <!--<el-dialog size="tiny" :visible.sync="visible.createVisible" :show-close="false">-->
            <!--<div class="dialog-title" slot="title">-->
                <!--新增节点-->
            <!--</div>-->
            <!--<div class="dialog-form">-->
                <!--<el-form label-position="top" :model="formLabelAlign" ref="ruleForm">-->
                    <!--<el-form-item label="节点名称" prop="name">-->
                        <!--<el-input v-model.trim="formLabelAlign.nodename" placeholder="请输入节点名称"></el-input>-->
                        <!--<div class="text" v-if="nodeRepeat">此节点已存在，请检查后输入新的节点名称。</div>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="节点类型" prop="region" v-popover:popover1>-->
                        <!--<el-select v-model="formLabelAlign.id" placeholder="请选择数据类型" @change="selectNumType">-->
                            <!--<el-option v-for="(item,index) in options" :key="item.id" :label="item.name"-->
                                       <!--:value="item.id">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                        <!--<div class="text" v-if="numberType">节点类型设置为“数量型”后，不可再修改。请慎重考虑。</div>-->
                        <!--<el-popover ref="popover1" placement="top-start" width="200" :offset="180" height="86"-->
                                    <!--trigger="hover">-->
                            <!--<div style="color:#a2abb8">节点数据类型决定在工单里此节点的完成方式。</div>-->
                            <!--<div style="color:#a2abb8">逻辑型：是否完成</div>-->
                            <!--<div style="color:#a2abb8">数量型：已完成数量是否达到预设的数量</div>-->
                        <!--</el-popover>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
            <!--</div>-->
            <!--<div class="submit">-->
                <!--<nf-button @click="visible.createVisible = false">取消</nf-button>-->
                <!--<nf-button type="warning" @click="addNewNode()">确定</nf-button>-->
            <!--</div>-->
        <!--</el-dialog>-->
        <!-- 编辑节点 -->
        <el-dialog size="tiny" :visible.sync="visible.editVisible" :show-close="false">
            <div class="dialog-title" slot="title">
                编辑节点
            </div>
            <div>
                <el-form label-position="top" :model="editNodeData" ref="ruleForm">
                    <el-form-item>
                        <template slot-scope="scope">
                            <div class="description-table">
                                <icon style="width:12px;height:12px;margin-right:4px;" type="icon-tips"></icon>
                                修改后，用到此节点的工单和工序模板的节点名称也会被修改。
                            </div>
                        </template>
                    </el-form-item>
                    <el-form-item>
                        <template slot-scope="scope">
                            <div class="input_edit" style="display:flex;justify-content:center;align-items:center;">
                                <div style="width:80px;">节点名称</div>
                                <el-input :maxlength="8" v-model.trim="editNamed" placeholder="请输入节点名称"
                                          @change="nodeNameRepeat"></el-input>
                            </div>
                            <div class="text" v-if="nodeRepeat">此节点已存在，请检查后输入新的节点名称。</div>
                        </template>
                    </el-form-item>
                </el-form>
            </div>
            <div class="submit">
                <nf-button @click="visible.editVisible = false">取消</nf-button>
                <nf-button type="warning" @click="successsEditNode()">确定</nf-button>
            </div>
        </el-dialog>
        <node-dialog @hiddenShow="hiddenShow" @addNode="addNodes" :isShow="isShowNewNode"></node-dialog>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import nfPicker from '../../order/nf-picker'
    import nodeDialog from "./newNodeDialog"
    import {
        getEasyTaskNodeList,
        getPersonList,
        getDicReportTypeList,
        addTaskNode,
        updateTaskNode,
        getUnitUser,
        getAllNodeList,
        editNodeTypes
    } from '../../../api/api'

    export default {
        props: ['nodeData', 'time','isWholeHair'],
        data() {
            return {
                nodeDataList: [
                    {
                        id: "",
                        typeName: "",
                        chargerIds: [],
                        endAt: "",
                        beginAt: "",
                        daysAdvanced: '',
                        dlc: "",
                        dafd: '',
                        doac: false,
                        adoac: true,
                        ailc: true,
                        delayWarningNum: "",
                        needDelayWarning: false,
                        needDifferenceWarning: false,
                        differenceWarningMin: "",
                        differenceWarningMax: "",
                        allowOutsideBalance:false, // 外发
                        typeCode: '',
                        associateWYM: '',       //关联唯一码
                        associateLigation: '',      //关联扎号
                        associateOutside: '',       //关联外发
                        idFlag:'',      // uuid
                        upstreamNodeIdFlag:'',      // 上游节点id
                        labelId: 1,
                    },
                ],
                editNamed: '',
                visible: {
                    createVisible: false,
                    editVisible: false
                },
                isCheck: false, // 是否勾选整单外发
                formLabelAlign: {
                    nodename: "",
                    region: "",
                    id: "",
                    type: "",
                    multiple: []
                },
                // options: [],
                leaderList: [],
                nodeList: [],
                upstreamNode: [],   //上游节点列表
                validate_money: true,
                validate_day: true,
                bgHiddenIndex: false,
                bgHiddenPriceIndex: false,
                nodeRepeat: false,
                numberType: false,
                isLoading: false,
                index_node: -1,
                edit_node: -1,
                edit_id: '',
                isShowNewNode: false,
                manList: [],
                listIndexNode: 0,
                missionShipment: '',    //上报为工单出货数 单选值
                titleMsg: '设置某个节点后，在工单完成后将该节点上报的完成数视为工单出货数。若不选择，创建时系统自动取最后一个节点为上报出货数节点。',
            }
        },
        watch: {
            nodeData(val) {
                this.nodeDataList = [];
                this.nodeDataList = val;
                this.getUpstreamNodeList();
            },
            isWholeHair(val) {
                this.isCheck = val
            }
        },
        components: {
            draggable,
            nfPicker,
            nodeDialog
        },
        methods: {
            // 清空表格行以idFlag为"上游节点"的值
            removeUpstreamNodeIdFlag(idFlag){
                this.nodeDataList.forEach(item => {
                    if(item.upstreamNodeIdFlag === idFlag) {
                        item.upstreamNodeIdFlag = ''
                    }
                })
            },
            // 获取上游节点下拉列表数据
            getUpstreamNodeList(){
                this.upstreamNode = [];
                this.nodeDataList.forEach((item, index) => {
                    //节点存在值 && (裁床数量型、数量明细型、总数型、尾部入库型、发货型、质检单件流节点) && 未关联唯一码 && 未关联扎号
                    if(item.id && (item.typeCode === 'actual-cutting' || item.typeCode === 'quantitative-detail' || item.typeCode === 'totality'
                        || item.typeCode === 'tail-in-store' || item.typeCode === 'tail-out-store' || item.typeCode === 'quality-checking')
                        && item.associateWYM !== true && item.associateLigation !== true){
                        let obj = {};
                        obj.name = item.name;
                        obj.idFlag = item.idFlag;
                        this.upstreamNode.push(obj);
                    }
                    item.labelId = index + 1;
                    if(item.missionShipment){
                        this.missionShipment = index + 1;
                    }
                })
            },
            //生成uuid
            uuid() {
                let s = [];
                let hexDigits = "0123456789abcdef";
                for (let i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                let uuid = s.join("");
                return uuid;
            },
            //表格行是否显示外发结算
            showOutsideBalance(item){
                // (裁床数量型、数量明细型、总数型、尾部入库型、发货型、质检单件流节点) && 未关联唯一码 && 未关联扎号 && 节点勾选了“外发”
                if((item.typeCode === 'actual-cutting' || item.typeCode === 'quantitative-detail' || item.typeCode === 'totality'
                    || item.typeCode === 'tail-in-store' || item.typeCode === 'tail-out-store' || item.typeCode === 'quality-checking')
                    && item.associateWYM !== true && item.associateLigation !== true && item.associateOutside === true){
                    return true
                }else{
                    return false
                }
            },
            //表格行是否显示上游节点
            showUpstreamNode(item){
                // (裁床数量型、数量明细型、总数型、尾部入库型、发货型、质检单件流节点) && 未关联唯一码 && 未关联扎号
                if((item.typeCode === 'actual-cutting' || item.typeCode === 'quantitative-detail' || item.typeCode === 'totality'
                    || item.typeCode === 'tail-in-store' || item.typeCode === 'tail-out-store' || item.typeCode === 'quality-checking')
                    && item.associateWYM !== true && item.associateLigation !== true){
                    return true
                }else{
                    return false
                }
            },
            //表格行是否显示上报为工单出货数
            showMissionShipment(item){
                // 以下所有节点包括唯一码和扎号
                // 裁床型、总数型、数量明细型、尾部入库型、发货型、质检单件流节点、抽检型
                if(item.typeCode === 'actual-cutting' ||item.typeCode === 'actual-cutting-wym' ||item.typeCode === 'actual-cutting-ligation' ||
                    item.typeCode === 'totality' ||
                    item.typeCode === 'quantitative-detail' ||
                    item.typeCode === 'tail-in-store' ||
                    item.typeCode === 'tail-out-store' ||
                    item.typeCode === 'quality-checking' ||
                    item.typeCode === 'select-check' || item.typeCode === 'select-check-quantity'){
                    return true
                }else{
                    return false
                }
            },
            //清空外发结算勾选状态
            resetOutside() {
                this.nodeDataList.forEach(i => {
                    this.$set(i, 'allowOutsideBalance',false)
                })
            },
             // 外发结算选择
            changeCheck(item,allowOutsideBalance,index) {
                if(this.isCheck){
                    this.nodeDataList.forEach(i => {
                        this.$set(i, 'allowOutsideBalance',false)
                    })
                    this.$set(item,'allowOutsideBalance',allowOutsideBalance)
                }
            },
            small(index, item) {
                if (item > 0) {
                    this.$set(this.nodeDataList[index], 'differenceWarningMin',
                        -Number(this.nodeDataList[index].differenceWarningMin));
                }
                console.warn(item);
            },
            big(index, item) {
                if (item < 0) {
                    this.$set(this.nodeDataList[index], 'differenceWarningMax',
                        Math.abs(Number(this.nodeDataList[index].differenceWarningMax)));
                }
                console.warn(item);
            },
            warning(index, item) {
                if (item < 0) {
                    this.$set(this.nodeDataList[index], 'delayWarningNum',
                        Math.abs(Number(this.nodeDataList[index].delayWarningNum)));
                }
            },
            hiddenShow() {
                this.isShowNewNode = false;
            },
            addNodes() {
                this.hiddenShow();
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    token: ""
                };
                getAllNodeList(params).then(res => {
                    this.nodeList = res.data.prcdNodes;
                    if (this.index_node != -1) {
                        this.nodeDataList[this.index_node].id = this.nodeList[this.nodeList.length - 1].id;
                    }
                });
            },
            //nf-picker 接受值
            nodeBeTime(item, val) {
                item.beginAt = val;
            },
            nodeEnTime(item, val) {
                item.endAt = val;
            },
            delNode(index, idFlag) {
                this.nodeDataList.splice(index, 1);
                this.removeUpstreamNodeIdFlag(idFlag);
            },
            /**计算时间，使时间不能大于交货时间，没有则直接为空 */
            setNodeEndAt(nodeList) {
                for (var i = 0; i < nodeList.length; i++) {
                    if (false) {
                        if (nodeList[i].dafd != "") {
                            var now = this.addMissionInfo.deliveryAt.split("-");
                            now = new Date(
                                Number(now["0"]),
                                Number(now["1"]) - 1,
                                Number(now["2"])
                            );
                            let planTime = now.setDate(now.getDate() - nodeList[i].dafd);
                            let Time = new Date(planTime);
                            let times = this.formatTime(Time);
                            nodeList[i].beginAt = "";
                            nodeList[i].endAt = times;
                            console.warn(nodeList[i].endAt);
                        } else {
                            nodeList[i].beginAt = "";
                            nodeList[i].endAt = "";
                        }
                    } else {
                        this.$set(nodeList[i], "beginAt", "");
                        this.$set(nodeList[i], "endAt", "");
                    }
                }
                return nodeList;
            },
            editNode(index) {
                this.edit_node = index;
                this.edit_id = this.nodeDataList[index].id;
                for (let i = 0; i < this.nodeList.length; i++) {
                    if (this.nodeDataList[index].id == this.nodeList[i].id) {
                        this.editNamed = this.nodeList[i].name;
                    }
                }
                this.visible.editVisible = true;
            },
            newNode(index) {
                this.index_node = index;
                this.isShowNewNode = true;
            },
            selectNumType(val) {
                if (val == '5a1a92ba06c94bc3a077129e4c919803') {
                    this.numberType = true;
                } else {
                    this.numberType = false;
                }
            },
            addNewNode() {
                if (this.isLoading) {
                    return;
                }
                this.isLoading = true;
                let params = {
                    token: "",
                    name: this.formLabelAlign.nodename,
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    roleId: "",
                    targetId: this.formLabelAlign.id,
                    isClosed: false,
                    position: "",
                    defaultDoneRatio: "",
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                };
                addTaskNode(params).then(res => {
                    this.isLoading = false;
                    if (res.data.code == 2) {
                        this.nodeRepeat = true;
                    } else {
                        this.visible.createVisible = false;
                        this.getNodeList();
                    }
                });
            },
            successsEditNode() {
                let params = {
                    id: this.edit_id,
                    name: this.editNamed,
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                };
                if (!params.name) {
                    this.$message.error('请填写节点名称');
                    return
                }
                editNodeTypes(params).then(res => {
                    this.visible.editVisible = false;
                    this.getNodeList();
                });
            },
            //获取可选的节点类型
            // getNodeType() {
            //     this.formLabelAlign.nodename = "";
            //     this.formLabelAlign.id = "";
            //     this.nodeRepeat = false;
            //     this.numberType = false;
            //     getDicReportTypeList().then(res => {
            //         this.options = res.data;
            //     });
            // },
            bgcssHidden(index) {
                this.bgHiddenIndex = index;
            },
            bgcssHiddenPri(index) {
                this.bgHiddenPriceIndex = index;
            },
            validateDay(index) {
                this.bgHiddenIndex = false;
                if (!this.nodeDataList[index].daysAdvanced) {
                    this.validate_day = true;
                    return;
                }
                let reg = /^[1-9]\d*$/;
                if (!reg.test(this.nodeDataList[index].daysAdvanced)) {
                    this.$message.error('请输入正整数!');
                    this.validate_day = false;
                    return;
                }
                this.validate_day = true;
            },
            validateMoney(index) {
                this.bgHiddenPriceIndex = false;
                if (!this.nodeDataList[index].wages) {
                    this.validate_money = true;
                    return;
                }
                let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,3})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (!reg.test(this.nodeDataList[index].wages)) {
                    this.$message.error('请输入小数点三位以内的正数!');
                    this.validate_money = false;
                    return;
                }
                this.validate_money = true;
            },
            getNodeList() {
                //获取节点列表
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    token: ""
                };
                getAllNodeList(params).then(res => {
                    if(res.data.code === 0){
                        this.nodeList = res.data.prcdNodes;
                        if (this.index_node != -1) {
                            this.nodeDataList[this.index_node].id = this.nodeList[this.nodeList.length - 1].id;
                        }
                    }
                });
                //获取负责人接口
                let params1 = {
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                };
                getPersonList(params1).then(res => {
                    this.leaderList = res.data;
                });
            },
            showid(id, index, idFlag) {
                for (let i = 0; i < this.nodeList.length; i++) {
                    if (this.nodeList[i].id == id) {
                        this.$nextTick(() => {
                            this.nodeDataList[index]["name"] = this.nodeList[i].name;
                            this.nodeDataList[index]["typeName"] = this.nodeList[i].typeName;
                            this.nodeDataList[index]["targetId"] = this.nodeList[i].typeId;
                            this.$set(this.nodeDataList[index], "typeAilc", this.nodeList[i].typeAilc)
                            this.$set(this.nodeDataList[index], "typeAdoac", this.nodeList[i].typeAdoac)
                            this.$set(this.nodeDataList[index], "isAllowDifferenceWarning", this.nodeList[i].isAllowDifferenceWarning)
                            this.$set(this.nodeDataList[index], "allowDifferenceWarning", this.nodeList[i].allowDifferenceWarning)
                            this.$set(this.nodeDataList[index], "allowAssociateOutside", this.nodeList[i].allowAssociateOutside)
                            this.$set(this.nodeDataList[index], "typeCode", this.nodeList[i].typeCode)
                            this.$set(this.nodeDataList[index], "associateWYM", this.nodeList[i].associateWYM)
                            this.$set(this.nodeDataList[index], "associateLigation", this.nodeList[i].associateLigation)
                            this.$set(this.nodeDataList[index], "associateOutside", this.nodeList[i].associateOutside)
                            this.$set(this.nodeDataList[index], "idFlag", this.uuid())      //加一个id标识，上下游节点会使用这个id做关联
                            this.getUpstreamNodeList();
                        })
                    }
                    //如果当前节点已选了“上游节点”仍进行切换时，需要把表格中全部以此节点作为“上游节点”的值清空
                    this.removeUpstreamNodeIdFlag(idFlag);
                }
            },
            addNode() {
                this.nodeDataList.push(
                    {
                        id: "",
                        typeName: "",
                        chargerIds: [],
                        endAt: "",
                        beginAt: "",
                        daysAdvanced: '',
                        dlc: "",
                        dafd: '',
                        doac: false,
                        adoac: true,
                        ailc: true,
                        needDelayWarning: false,
                        needDifferenceWarning: false,
                        differenceWarningMin: "",
                        differenceWarningMax: "",
                        allowOutsideBalance:false, //外发
                        typeCode: '',
                        associateWYM: '',
                        associateLigation: '',
                        associateOutside:'',
                        idFlag:'',      // uuid
                        upstreamNodeIdFlag:'',      // 上游节点id
                        labelId:this.nodeDataList.length + 1,
                    }
                );
            },

            // 工厂负责人
            getUnitUser() {
                getUnitUser({unitId: JSON.parse(sessionStorage.getItem('last_login')).id}).then(res => {
                    console.log(res);
                    this.manList = res.data.data.facGroupDTOS
                })
            },

            //给表格数据增加 '是否上报为工单出货数' 参数
            setMissionShipment(){
                // 用户有选值
                if(this.missionShipment){
                    this.nodeDataList.forEach(item =>{
                        if(item.labelId === this.missionShipment){
                            item.missionShipment = true
                        }else{
                            item.missionShipment = false
                        }
                    });
                }
            },
        },
        created() {
            this.getNodeList();
            // this.getNodeType();
            this.getUnitUser();
        },
        updated() {
            this.setMissionShipment();
            this.$emit('nodeList', this.nodeDataList);
        }
    }
</script>

<style scope lang="scss">
    .little-gap {
        display: inline-block;
        margin: 0 4px;
        font-size: 12px;
    }

    .input-bg {
        text-align: center;
        width: 42px;
        height: 32px;
        background: #dbe6f7;
        border-radius: 2px;
    }

    .icon_size {
        width: 12px !important;
        height: 12px !important;
        margin: 0 4px;
        cursor: pointer;
    }

    .add_btn {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 12px;
        height: 48px;
        .el-button--text {
            color: #ff9c38;
        }
    }

    .new_node {
        width: 100%;
        color: #ff9c38;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .input-edit {
        width: 30px;
        height: 28px;
        margin: 0 4px;
        font-size: 14px;
        background-color: #f5f7fa;
        text-align: center;
        border-radius: 2px;
        border: 1px solid #fff;
        &:hover {
            background-color: #ebeff5;
        }
    }

    .input_change-focus {
        background-color: #fff;
        border: 1px solid #ff9c38;
        &:hover {
            background-color: #fff;
        }
    }

    .input_change-price-focus {
        background-color: #fff;
        border: 1px solid #ff9c38;
        &:hover {
            background-color: #fff;
        }
    }

    .node_list {
        font-size: 12px !important;
        min-height: 80px;
        width: 100%;
        border: 1px solid #e6eaf0;
        .node_title {
            height: 40px;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-color: #f5f7fa;
            div {
                height: 39px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #a2abb8;
                font-weight: 500;
                &:last-child {
                    border-right: none;
                    justify-content: center;
                }
                &:first-child {
                    justify-content: flex-start;
                    padding-left: 12px;
                    width: 240px;
                    box-sizing: border-box;
                }
                &:nth-child(3) {
                    justify-content: flex-start;
                    padding-left: 12px;
                    box-sizing: border-box;
                }
            }
        }
        .node_container {
            /*height: 48px;*/
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: stretch;
            border-bottom: 1px solid #e6eaf0;
            >div {
                /*height: 48px;*/
                display: flex;
                justify-content: center;
                align-items: center;
                &:last-child {
                    justify-content: flex-start;
                    border-right: none;
                    color: #000;
                }
            }
        }
        .node_name {
            width: 239px;
            /*border-bottom: 1px solid #e6eaf0;*/
            border-right: 1px solid #e6eaf0;
            .el-input__inner {
                border: none;
            }
        }
        .node_type {
            border-right: 1px solid #e6eaf0;
            /*border-bottom: 1px solid #e6eaf0;*/
            width: 100px;
        }
        .node_leaders {
            border-right: 1px solid #e6eaf0;
            /*border-bottom: 1px solid #e6eaf0;*/
            display: flex;
            flex: 1;
            min-width: 180px;
            .el-select {
                display: flex;
                flex: 1;
                .el-select__tags {
                    width: 100%;
                    justify-content: flex-start;
                }
            }
            .el-input__inner {
                border: none;
                /*height: 36px !important;*/
            }
        }
        .node_price {
            border-right: 1px solid #e6eaf0;
            /*border-bottom: 1px solid #e6eaf0;*/
            min-width: 100px;
        }
        .node_time {
            border-right: 1px solid #e6eaf0;
            /*border-bottom: 1px solid #e6eaf0;*/
            width: 125px;
        }
        .node_end-time {
            border-right: 1px solid #e6eaf0;
            /*border-bottom: 1px solid #e6eaf0;*/
            width: 130px;
        }
        .node_real-number {
            border-right: 1px solid #e6eaf0;
            /*border-bottom: 1px solid #e6eaf0;*/
            width: 108px;
        }
        .node_opera {
            border-right: 1px solid #e6eaf0;
            /*border-bottom: 1px solid #e6eaf0;*/
            width: 214px;
            padding: 0 6px;
            cursor: pointer;
        }
        .node_warning {
            border-right: 1px solid #e6eaf0;
            /*border-bottom: 1px solid #e6eaf0;*/
            width: 140px;
            padding: 0 6px;
            cursor: pointer;
        }
        .opera {
            justify-content: space-around !important;
        }
        .warning {
            justify-content: flex-start !important;
        }
        .dialog-title {
            padding-bottom: 24px;
            text-align: center;
            font-size: 18px;
            color: #626b7a;
            border-bottom: 1px solid #e6e8eb;
        }

        .dialog-form {
            padding: 48px 60px;
            border-radius: 2px;
            background-color: #f8f9fa;
            .el-input__inner {
                border-radius: 2px;
            }
            .el-select {
                width: 100%;
            }
            .text {
                line-height: 2;
                color: red;
                font-size: 12px;
            }
        }
        .el-form-item {
            &:last-child {
                margin-top: 48px;
            }
        }

        .submit {
            padding-top: 24px;
            margin-top: 24px;
            text-align: center;
            border-top: 1px solid #e6e8eb;
        }
        .description-table {
            // width:368px;
            // height:28px;
            line-height: 15px;
            padding: 5px 12px 0px;
            background-color: #f5f7fa;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
<style lang="scss">
    .peoListLeadNode-down{
        margin-left: 200px;
        width: 200px;
        min-width: 200px !important;
        .el-select-dropdown__item{
            max-width: 200px;
        }
    }
    .newSelUlNode {
        position: absolute;
        top: 0px;
        left: -200px;
        z-index: 999;
        width: 100%;
        background: #fff;
        max-height: 258px;
        border: 1px solid rgb(209, 216, 229);
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        overflow-y: auto;
        /*padding: 10px 0;*/
        box-sizing: border-box;
        border-radius: 4px;
        /*滚动条样式*/
        &::-webkit-scrollbar { /*滚动条整体样式*/
            width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
            margin-right: 2px;
        }
        &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
            border-radius: 4px;
            /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
            background: rgba(151, 168, 190, .26);
        }
        &::-webkit-scrollbar-track { /*滚动条里面轨道*/
            /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
            border-radius: 0;
            background: rgba(255, 255, 255, 1);
        }

        & li {
            line-height: 32px;
            padding-left: 10px;
            color: rgb(72, 82, 106);
            cursor: pointer;
        }
        & li:first-child {
            background: rgb(228, 230, 241);
        }
        /*.peoListLead {*/
        /*margin-left: 200px;*/

        /*}*/
    }


    .input_edit .el-input__inner {
        width: 80%;
    }

    .node_time .el-input__inner {
        border: none;
        font-size: 12px;
    }

    .node_time .el-date-editor.el-input {
        width: 100%;
    }
    .mission-shipment-radio{
        margin: 0 auto;
        .el-radio__label{
            display: none;
        }
    }
</style>
