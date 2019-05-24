<template>
    <section class="reporting" v-loading="visible.loading">
        <page-title class="reporting_title" title="上报数量">
            <nf-button class="w98 mar20" @click="$router.go(-1)">取 消</nf-button>
            <nf-button class="w98" type="warningsimple" :loading="visible.btnLoading1" @click="submit('DRAFT')">存为草稿</nf-button>
            <nf-button class="w98" type="warning" :loading="visible.btnLoading2" @click="submit('REPORT')">提 报</nf-button>
        </page-title>
        <mission-info class="reporting__mission-info" :mission-info="instanceWorkflow.mission"></mission-info>
        <div class="reporting_content">
            <div>
                <el-form
                        :model="reportFormData"
                        :label-width="80"
                        inline>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item class="dialog__form-item is-required" label="完成时间">
                                <el-date-picker
                                        :disabled="finishtimeSet"
                                        v-model="reportFormData.finishAt"
                                        type="date" placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        @change="handlePickerDate">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="outSideFlag">
                            <el-form-item class="dialog__form-item is-required" label="完成工厂">
                                <el-select
                                        filterable
                                        v-model="outSideFactoryId"
                                        :disabled="facMissionOutsideFlag"
                                        placeholder="请选择完成工厂">
                                    <el-option
                                            v-for="item in outsideFactoryList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item class="dialog__form-item is-required" label="完成人员">
                                <template v-if="nextFollowOtherFinishUserSelect">
                                    <el-select
                                            v-model="reportFormData.finishBy"
                                            :disabled="finishpeopleSet"
                                            placeholder="选择完成人员">
                                        <el-option
                                                v-for="item in reportUserOptions"
                                                :key="item.id"
                                                :value="item.id"
                                                :label="item.name"></el-option>
                                    </el-select>
                                </template>
                                <template v-else>
                                    <workerLeader :single="'single'" :isDisabled="finishpeopleSet" v-model="reportFormData.finishBy" :placeholder="'请选择完成人员'" ></workerLeader>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="isLigationNode&&associateInStore">
                            <el-form-item class="dialog__form-item is-required" label="入库仓库">
                                <el-select v-model="storehouseId" placeholder="请选择">
                                    <el-option
                                            v-for="item in storehouseList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <outsideFacAndStation
                                    v-if="!isLigationNode && reportSendSelectUser"
                                    :formModel="reportFrom"
                                    :information="information">
                            </outsideFacAndStation>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <!-- 扎号型 -->
            <div class="reporting-ligation" v-if="isLigationNode">
                <ligation-report-list
                    :metadatas="instanceWorkflow.metadatas"
                    :options="options"
                    :ligation-list="ligationSelectOption"
                    :defectiveLabelList="defectiveLabelList"
                    v-model="ligationParams"></ligation-report-list>
                <div class="reporting-ligation__collapse" v-if="isLigationNode" @click="visible.isCollapse = !visible.isCollapse">
                    <span>无扎号上报（丢扎）</span><i class="el-icon-arrow-down"></i>
                </div>
            </div>
            <div class="reporting-ligation__collapse--wrapper" v-show="visible.isCollapse || !isLigationNode">
                <base-box class="reporting_content--item">
                    <div class="mar16">
                        <div style="display: flex;justify-content: space-between;">
                            <div>
                                <span class="tag good">合格品</span>
                                <span class="total">合计：{{ totalNum }}件</span>
                            </div>
                            <div v-if="associateInStore&&!isLigationNode">
                                <span style="color: red">*</span>  仓库：
                                <el-select v-model="storehouseId" placeholder="请选择">
                                    <el-option
                                            v-for="item in storehouseList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div v-if="instanceWorkflow.metadatas && instanceWorkflow.quantities">
                            <nf-sku-table
                                ref="nfskutable"
                                editable
                                :metadatas="instanceWorkflow.metadatas"
                                :quantities="instanceWorkflow.quantities"
                                style="margin-top: 16px"
                                @change="handleSkuValChange"></nf-sku-table>
                        </div>
                    </div>
                    <div class="qualified-good" v-show="associateInStore" >
                        <span class="qulified-text">入库备注</span>
                        <el-input class="qualified-textarea" type="textarea" placeholder="请输入20字以内的备注" maxlength="20" v-model="reportFormData.qualifiedCause"></el-input>
                    </div>
                </base-box>
                <base-box class="reporting_content--item">
                    <div style="display: flex;justify-content: space-between;margin-bottom:12px;">
                        <div class="mar16">
                            <span class="tag nogood">次品</span>
                            <span class="total">合计：{{ defectiveNums }}件</span>
                        </div>
                        <div v-if="associateInStore">
                            <span style="color: red">*</span>  仓库：
                            <el-select v-model="defectivedsStorehouseId" placeholder="请选择">
                                <el-option
                                        v-for="item in defectivedsStorehouseList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="item" v-for="(listItem, index) in reportFormData.qcDefectiveDetailDTOList" :key="index">
                        <span class="label">货品sku</span>
                        <el-select class="select"
                        v-model="listItem.colorId"
                        @change="handleSelectColor(listItem, options.colorOptions)"
                        placeholder="颜色">
                            <el-option
                                v-for="item in options.colorOptions"
                                :key="item.color_id"
                                :label="item.color_name"
                                :value="item.color_id">
                            </el-option>
                        </el-select>
                        <el-select class="select"
                        v-if="options.standardOptions.length"
                        @change="handleSelectStandard(listItem, options.standardOptions)"
                        v-model="listItem.standardId"
                        placeholder="内长">
                            <el-option
                                v-for="item in options.standardOptions"
                                :key="item.standard_id"
                                :label="item.standard_value"
                                :value="item.standard_id">
                            </el-option>
                        </el-select>
                        <el-select class="select"
                        @change="handleSelectSize(listItem, options.sizeOptions)"
                        v-model="listItem.sizeId"
                        placeholder="尺码">
                            <el-option
                            v-for="item in options.sizeOptions"
                            :key="item.size_id"
                            :label="item.size_value"
                            :value="item.size_id">
                            </el-option>
                        </el-select>
                        <span class="label nogood">次品标签</span>
                        <el-select class="select"
                        multiple
                        v-model="listItem.defectiveLabelIds" placeholder="请选择">
                            <el-option disabled style="cursor:pointer;color:#ff7f14 !important;">
                                <div style="width:100%;" v-if="isShow"  @click="addDev(index)">+新建</div>
                            </el-option>
                            <el-option
                            v-for="item in defectiveLabelList"
                            :key="item.id"
                            :label="item.labelName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        <span class="label">次品数量</span>
                        <el-input style="width: 60px;" v-model="listItem.num" placeholder=""></el-input>
                        <span class="dele" @click="handleDeleteRow('qcDefectiveDetailDTOList', index)">删除</span>
                    </div>
                    <icon-button class="btn-add" @click.native="handleAddDefective">+ 记录次品</icon-button>
                    <div class="qualified-good" v-show="associateInStore">
                        <span class="qulified-text">入库备注</span>
                        <el-input class="qualified-textarea" type="textarea" placeholder="请输入20字以内的备注" maxlength="20" v-model="reportFormData.defectiveCause"></el-input>
                    </div>
                    <!-- <nf-button class="btn_add">+ 记录次品</nf-button> -->
                </base-box>
                <base-box class="reporting_content--item">
                    <div style="display: flex;justify-content: space-between;margin-bottom:12px;">
                        <div class="mar16">
                            <span class="tag waste">废品</span>
                            <span class="total">合计：{{ wastedNums }}件</span>
                        </div>
                        <div v-if="associateInStore">
                            <span style="color: red">*</span>  仓库：
                            <el-select v-model="wastedsStorehouseId" placeholder="请选择">
                                <el-option
                                        v-for="item in wastedsStorehouseList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="item" v-for="(listItem, index) in reportFormData.qcWastedDetailDTOList" :key="index">
                        <span class="label">货品sku</span>
                        <el-select class="select"
                        @change="handleSelectColor(listItem, options.colorOptions)"
                        v-model="listItem.colorId" placeholder="颜色">
                            <el-option
                                v-for="item in options.colorOptions"
                                :key="item.color_id"
                                :label="item.color_name"
                                :value="item.color_id">
                            </el-option>
                        </el-select>
                        <el-select class="select"
                        v-if="options.standardOptions.length"
                        @change="handleSelectStandard(listItem, options.standardOptions)"
                        v-model="listItem.standardId" placeholder="内长">
                            <el-option
                                v-for="item in options.standardOptions"
                                :key="item.standard_id"
                                :label="item.standard_value"
                                :value="item.standard_id">
                            </el-option>
                        </el-select>
                        <el-select class="select"
                        @change="handleSelectSize(listItem, options.sizeOptions)"
                        v-model="listItem.sizeId" placeholder="尺码">
                            <el-option
                            v-for="item in options.sizeOptions"
                            :key="item.size_id"
                            :label="item.size_value"
                            :value="item.size_id">
                            </el-option>
                        </el-select>
                        <span class="label nogood">报废原因</span>
                        <el-input class="select" v-model="listItem.reason" placeholder="请输入">
                        </el-input>
                        <span class="label">废品数量</span>
                        <el-input style="width: 60px;" v-model="listItem.num" placeholder=""></el-input>
                        <span class="dele" @click="handleDeleteRow('qcWastedDetailDTOList', index)">删除</span>
                        <!-- <span class="dele">删除</span> -->
                    </div>
                    <icon-button class="btn-add" @click.native="handleAddWaste">+ 记录废品</icon-button>
                    <div class="qualified-good" v-show="associateInStore">
                        <span class="qulified-text">入库备注</span>
                        <el-input class="qualified-textarea" type="textarea" placeholder="请输入20字以内的备注" maxlength="20" v-model="reportFormData.scrapCause"></el-input>
                    </div>
                </base-box>
            </div>
        </div>
        <el-dialog size="tiny" :visible.sync="visible.DefectiveLabel" :show-close="false" width="30%">
            <div  slot="title" class="color-title">请输入次品标签名称</div>
            <div class="nf-input">
                <el-input placeholder="请输入次品标签名称" maxlength="20" v-model.trim="defectiveLabel"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <nf-button @click="visible.DefectiveLabel = false" class="cancel is-plain">取消</nf-button>
                <nf-button @click="addDefective" type="warning">确定</nf-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
import MissionInfo from '../common/mission-info';
import LigationReportList from './ligation-report-list';
import outsideFacAndStation from '@/components/order/common/outsideFacAndStation';
import Utils from '@/utils/format'
import {
        getPersonList,
        getTaskInstanceWorkflow,
        instanceMissionNodeInfo,
        facDefectiveLabels,
        qcReportInfo,
        ligationNodeReport,
        addDefectiveLabel,
        getLigationListWithoutReport,
        nodeReportOutsideFactoryList,
        getStorehousesByUserId} from '@/api';
import mixins from '../orderDetail/mixin';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            outSideFlag:false,
            facMissionOutsideFlag:false,
            outsideFactoryList: [], // 完成工厂列表
            outSideFactoryId:'',
            selectDefaultStore: false, //是否勾选默认仓库
            associateInStore: false, //是否能入库
            storehouseList: [],
            storehouseId: '',
            defectivedsStorehouseId: '', //次品仓库id
            wastedsStorehouseId: '', //废品仓库id
            defectivedsStorehouseList: [], //次品仓库列表
            wastedsStorehouseList: [], //废品仓库列表
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            visible: {
                DefectiveLabel: false,
                isCollapse: false,
                loading: false,
                btnLoading1: false,
                btnLoading2: false,
            },
            reportFormData: {
                finishAt: '',
                finishBy: '',
                qcQualifiedDetailDTOList: [],
                qcDefectiveDetailDTOList: [],
                qcWastedDetailDTOList: [],
                qualifiedCause:'',//合格品备注
                defectiveCause:'',//次品备注
                scrapCause:'',//废品备注
            },
            options: {
                colorOptions: [],
                standardOptions: [],
                sizeOptions: []
            },
            ligationSelectOption: [],
            ligationParams: [],
            defectiveLabel:"",
            instanceWorkflow: {},
            skuList: [],
            personOptions: [],
            defectiveLabelList: [],
            activeIndex: '',
            dateValue: '', // 上报时间
            workerValue: '', // 上报的工位
            commonStyleSkuBarcodeDTO: {},
            isHideLength: false, // 是否显示内长
            listItemIndex:"a",
            totalNum: 0,
            isShow: true, // 权限判断
            reportFrom: {
                sendToFactoryId: "ourFactory",
                sendToUserId: "",
            },
            information: {},
        };
    },
    components: {
        MissionInfo,
        outsideFacAndStation,
        LigationReportList
    },
    mixins: [mixins],
    computed: {
        ...mapState({
            editRow: (state) => state.QualityChecking.editRow
        }),
        isBoss() {
            const info = sessionStorage.getItem('user_login');
            return JSON.parse(info).role === 1
        },
        facId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId;
        },
        userId() {
            return this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;;
        },
        reportSkuVal() {
            return this.$refs['nfskutable'] && this.$refs['nfskutable'].getSkuTableValue();
        },
        isLigationNode() {
            return this.instanceWorkflow.components && this.instanceWorkflow.components.status.associateLigation;
        },
        defectiveNums() {
            return this.countDefectiveAndWastedNums('qcDefectiveDetailDTOList')
        },
        wastedNums() {
            return this.countDefectiveAndWastedNums('qcWastedDetailDTOList')
        },
        finishtimeSet() {
            var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (datalist.indexOf("fac.mission.node.finishDate.update")=== -1) {
                return true;
            }else {
                return false;
            }
        },
        finishpeopleSet() {
            var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (datalist.indexOf("fac.mission.node.finishBy.update")=== -1) {
                return true;
            }else {
                return false;
            }
        },
        associateInStore(){
            return this.$route.query.associateInStore;
        },
        // 上游节点
        upstreamNodeId(){
            return this.information.upstreamNodeId;
        },
        // 本节点外发/分活明细跟随上游节点
        outsideNextFollowPre(){
            return this.information.outsideNextFollowPre;
        },
        // 上游节点发往工位
        reportUserOptions(){
            return this.information.reportUserOptions;
        },
        // 本节点有上游节点 && 本节点外发/分活明细跟随上游节点 && 上游节点的发往工位不为空
        nextFollowOtherFinishUserSelect(){
            if(this.upstreamNodeId && this.outsideNextFollowPre && (this.reportUserOptions && this.reportUserOptions.length)){
                return true
            }else{
                return false
            }
        },
        // 是否上报完成数的同时上报发往工厂、工位
        reportSendSelectUser(){
            return this.information.reportSendSelectUser;
        },
        // 是否发往工厂、工位默认取完成工厂、工位
        reportSendSelectUserDefComplete(){
            return this.information.reportSendSelectUserDefComplete;
        },
    },
    watch: {
        'visible.isCollapse'(val) {
            if (!val) {
                this.$refs['nfskutable'].resetSkuTableData();
                this.reportFormData.qcDefectiveDetailDTOList = [];
                this.reportFormData.qcWastedDetailDTOList = [];
            }
        },
        outSideFactoryId(val){
            //工单整单外发时，强制“发往工厂”跟随“完成工厂”
            if(this.reportSendSelectUserDefComplete || this.information.facMissionOutsideFactoryId){
                if(val === ''){
                    this.reportFrom.sendToFactoryId = 'ourFactory';
                }else{
                    this.reportFrom.sendToFactoryId = val;
                }
            }
        },
        'reportFormData.finishBy': {
            handler(val){
                if(this.reportSendSelectUserDefComplete){
                    this.reportFrom.sendToUserId = val;
                }
            },
            deep:true
        },
    },
    created() {
        // 次品标签新建权限
        let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
        if (powerlist.indexOf('fac.defectiveLabel.queryAllDefectiveLabel') == -1) {
            this.isShow = false
        }
        this.getOutsideFactoryList()
        this.fetchPersonList();
        this.fetchFacDefectiveLabels();
        this.getOutSideFactoryId();
        this.fetchInstanceMissionNodeInfo({
            missionId: this.$route.query['missionId'],
            instanceWorkflowId: this.$route.query['instanceWorkflowId'],
            facId: this.facId,
        }).then(res => {
            if (this.isLigationNode) {
                this.fetchWithoutReportList();
            }
            if (this.$route.query.skuId &&  this.$route.query.isEdit) {
                // 从质检查看唯一码状态列表编辑上报
                this.reportFormData.finishAt = this.editRow.finishDate;
                this.reportFormData.finishBy = this.editRow.finishUserId;
                return;
            }
            this.reportFormData.finishAt = Utils.formatDate(new Date(), 'yyyy-MM-dd');
        });
    },
    methods: {
        //获取发往工厂id
        getSendToFactoryId(){
            let id = '';
            // 上报完成数的同时上报发往工厂、工位时
            if(this.reportSendSelectUser){
                id = this.reportFrom.sendToFactoryId === 'ourFactory' ? '' : this.reportFrom.sendToFactoryId;
            }
            // 上报弹窗不存在发往工厂、工位时，取完成工厂的id
            else{
                id = this.reportFrom.outSideFactoryId === 'ourFactory' ? '' : this.reportFrom.outSideFactoryId;
            }
            return id
        },
        //初始化完成人员的值
        initFinishUser(){
            //总矩阵跳过来时
            if(!this.reportFormData.finishBy){
                if(this.nextFollowOtherFinishUserSelect){
                    this.reportFormData.finishBy = this.reportUserOptions[0].id;
                }else{
                    // 完成人员取值逻辑：1.老板号登录，完成人员默认选节点负责人    2.员工号登录，完成人员默认选自己
                    const chargers = this.instanceWorkflow.components.information.chargers;
                    this.reportFormData.finishBy = !this.isBoss ? this.userId : (chargers.length ? chargers[0].id : '');
                }
            }
            //整单外发 || “发往工厂”和“发往工位”跟随“完成工厂”和“完成人员”
            if(this.information.facMissionOutsideFactoryId || this.information.reportSendSelectUserDefComplete){
                this.reportFrom.sendToFactoryId = this.outSideFactoryId;
                this.reportFrom.sendToUserId = this.reportFormData.finishBy;
            }
        },
        getOutSideFactoryId(){
            this.outSideFactoryId = this.$route.query.outsideFacId;
            this.reportFormData.finishBy = this.$route.query.finishId;
        },
        getOutsideFactoryList(){
            let params= {
                missionNodeId: this.$route.query.instanceWorkflowId,  // 工单节点id
                userId: this.userId,        // 用户id
                unitId: this.facId,        // 当前所在工厂id
                // keyword:""                                       // 按完成工厂名称模糊搜索,暂时不实现
            };
            nodeReportOutsideFactoryList(params).then(res=>{
                if(res.data.code ===0){
                    this.outsideFactoryList = res.data.data;
                    this.outsideFactoryList.forEach(item => {
                        if(item.name === '本厂'){
                            item.id = 'ourFactory'
                        }
                    })
                }
            })
        },
        getStorehousesList(){
            getStorehousesByUserId({facId:this.facId,userId:this.userId,kind: 1}).then(res => {
                this.storehouseList = res.data.data
                this.storehouseList.push({id: '', name: '无'})
                const defaultStorehouseTag = res.data.data.find(
                    item => item.defaultStorehouseTag === 1
                );
                const defective = res.data.data.find(
                    item => item.type === 'DEFECTIVE'
                );
                if (defective) {
                    this.defectivedsStorehouseId = defective.id;
                    this.defectivedsStorehouseList.push(defective,{id: '', name: '无'})
                }
                const wasted= res.data.data.find(
                    item => item.type === 'WASTE'
                );
                if (wasted) {
                    this.wastedsStorehouseId = wasted.id;
                    this.wastedsStorehouseList.push(wasted,{id: '', name: '无'})
                }
                if (this.selectDefaultStore) {
                    this.storehouseId = defaultStorehouseTag?defaultStorehouseTag.id:res.data.data[0].id;
                }
                else {
                    this.storehouseId = null;
                }
            })
        },
        addDev(index) {
            this.listItemIndex = index;
            this.visible.DefectiveLabel = true;
        },
        handleSkuValChange(val) {
            this.totalNum = Object.keys(val).reduce((total, key) => {
                total += Number(val[key].num);
                return total;
            }, 0);
        },
        addDefective() {
            let params = {
                facId: this.facId,
                userId: this.userId,
                labelName:this.defectiveLabel
            }
            addDefectiveLabel(params).then(res => {
                    console.log(res);
                    if(res.data.code == 0) {
                        this.fetchFacDefectiveLabels();
                        this.visible.DefectiveLabel = false;

                    }else {
                        this.$message.error(res.data.msg);
                    }
                }
            )
        },
        getSkuListOptions(facGoodsSkuList) {
            let colorOptions = []
                , sizeOptions = []
                , standardOptions = []
                , json = {};
            for (let item of facGoodsSkuList) {
                if (!json[item['color_id']]) {
                    colorOptions.push({
                        color_id: item['color_id'],
                        color_name: item['color_no_name'] || item['color_name']
                    });
                    json[item['color_id']] = item['color_id'];
                }
                if (!json[item['size_id']]) {
                    sizeOptions.push({
                        size_id: item['size_id'],
                        size_value: item['size_value']
                    });
                    json[item['size_id']] = item['size_id'];
                }
                if (item['standard_value'] && !json[item['standard_id']]) {
                    standardOptions.push({
                        standard_id: item['standard_id'],
                        standard_value: item['standard_value']
                    });
                    json[item['standard_id']] = item['standard_id'];
                }
            }
            if (standardOptions.length === 1 && (!standardOptions[0].standard_value || standardOptions[0].standard_value === '无')) {
                standardOptions = [];
                this.isHideLength = true;
            }
            return {
                colorOptions,
                standardOptions,
                sizeOptions
            }
        },
        fetchFacDefectiveLabels() {
            facDefectiveLabels({
                userId: this.userId,
                facId: this.facId
            })
            .then(res => {
                this.defectiveLabelList = res.data.data;
                if(this.listItemIndex !="a") {
                        this.reportFormData.qcDefectiveDetailDTOList[this.listItemIndex].defectiveLabelIds.push(
                            this.defectiveLabelList[this.defectiveLabelList.length-1].id);
                }
            })
        },
        fetchInstanceMissionNodeInfo(params) {
            params.userId = this.userId;
            this.visible.loading = true;
            return instanceMissionNodeInfo(params)
                .then(async res => {
                    this.instanceWorkflow = res.data;
                    this.getStorehousesList()
                    let information = res.data.components.information;
                    this.information = information;
                    this.facMissionOutsideFlag = information.facMissionOutsideFlag
                    this.outSideFlag = information.outSideFlag
                    // 节点关联外发
                    if(this.outSideFlag){
                        //整单外发
                        if(information.facMissionOutsideFactoryId){
                            this.outSideFactoryId=information.facMissionOutsideFactoryId
                        }
                    }
                    this.associateInStore = information.associateInStore
                    this.selectDefaultStore = information.selectDefaultStore
                    this.skuList = res.data.metadatas;
                    this.options = this.getSkuListOptions(res.data.metadatas);
                    this.initFinishUser();
                    this.$nextTick(() => {
                        this.visible.loading = false;
                    });
                    return res.data;
                });
        },
        // 获取关联人员列表
        fetchPersonList() {
            const params = {
                unitId: this.facId
            };
            getPersonList(params)
            .then(res => {
                this.personOptions = res.data;
            });
        },
        handleSelectType(index) {
            this.activeIndex = index;
            const skuId = this.commonStyleSkuBarcodeDTO.goodsSkuId
            if (index === 0) {
                // 合格品
                this.setScanSkuValBySkuId(skuId)
            } else if (index === 1) {
                // 次品
                this.setDefectiveSkuNum(skuId)
            } else {
                // 废品
                this.setWastedSkuNum(skuId)
            }
        },
        handleAddDefective() {
            const item = {
                remark: '',
                skuId: '',
                defectiveLabelIds: '',
                colorId: '',
                standardId: '',
                sizeId: '',
                num: ''
            }
            this.reportFormData['qcDefectiveDetailDTOList'].push(item)
        },
        handleAddWaste() {
            const item = {
                reason: '',
                skuId: '',
                colorId: '',
                standardId: '',
                sizeId: '',
                num: ''
            }
            this.reportFormData['qcWastedDetailDTOList'].push(item)
        },
        handleDeleteRow(delObj, index) {
            this.reportFormData[delObj].splice(index, 1)
        },
        handleSelectColor(listItem, options) {
            const colorItem = options.find(item => item.color_id === listItem.colorId);
            if (colorItem) listItem.colorName = colorItem.color_name;
            console.log(listItem)
        },
        handleSelectStandard(listItem, options) {
            const standard = options.find(item => item.standard_id === listItem.standardId);
            if (standard) listItem.standardName = standard.standard_value;
        },
        handleSelectSize(listItem, options) {
            const size = options.find(item => item.size_id === listItem.sizeId);
            if (size) listItem.sizeName = size.size_value;
        },
        countDefectiveAndWastedNums(name) {
            let num = 0;
            for (let item of this.reportFormData[name]) {
                const bol = this.isHideLength ? (item.colorId && item.sizeId) : (item.colorId && item.standardId && item.sizeId);
                if (bol) {
                    num += Number(item.num);
                }
            }
            return num;
        },
        handlePickerDate(val) {
            this.reportFormData.finishAt = val;
        },
        submit(actionType) {
            if (!this.validForm()) return;
            if (this.isLigationNode) {
                return this.ligationReport(actionType);
            }
            const reportAt = Utils.formatDate(new Date(), 'yyyy-MM-dd');
            const qcQualifiedDetailDTOList = this.getQualityParams();
            const qcDefectiveDetailDTOList = this.getDefectiveOrWastedParams('qcDefectiveDetailDTOList');
            const qcWastedDetailDTOList = this.getDefectiveOrWastedParams('qcWastedDetailDTOList');
            if (!this.validDefectiveOrWasted('qcDefectiveDetailDTOList') || !this.validDefectiveOrWasted('qcWastedDetailDTOList')) {
                this.$alert('有次品或废品数据未填写完整颜色/尺码/内长信息，请确保无误后提交', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                    }
                });
                return
            }
            this.qcReportInfoApi({
                reportAt,
                qcQualifiedDetailDTOList,
                qcDefectiveDetailDTOList,
                qcWastedDetailDTOList,
                actionType,
            });
        },
        // 非扎号上报
        qcReportInfoApi({ reportAt, qcQualifiedDetailDTOList, qcDefectiveDetailDTOList, qcWastedDetailDTOList,actionType, }) {
            let sendToFacId = this.getSendToFactoryId();
            const params = {
                    facId: this.facId,
                    userId: this.userId,
                    missionId: this.$route.query.missionId,
                    instanceId: this.$route.query.instanceWorkflowId,
                    dateCompleted: this.reportFormData.finishAt,
                    chargerId: this.reportFormData.finishBy,
                    qualifieds: qcQualifiedDetailDTOList,
                    defectiveds: qcDefectiveDetailDTOList,
                    wasteds: qcWastedDetailDTOList,
                    storehouseId:this.storehouseId,
                    defectivedsStorehouseId:this.defectivedsStorehouseId,
                    wastedsStorehouseId:this.wastedsStorehouseId,
                    outsideFactoryId: this.outSideFactoryId === 'ourFactory' ? '' : this.outSideFactoryId,    //完成工厂
                    sendToFactoryId:  sendToFacId,
                    sendToUserId:  this.reportSendSelectUser ? this.reportFrom.sendToUserId : '',  //发往工位
                    quRemark:this.reportFormData.qualifiedCause,//合格品备注
                    dcRemark:this.reportFormData.defectiveCause,//次品备注
                    wsRemark:this.reportFormData.scrapCause,//废品备注
                    actionType: actionType,
            };
            if(actionType === 'DRAFT'){
                this.visible.btnLoading1 = true;
            }else if(actionType === 'REPORT'){
                this.visible.btnLoading2 = true;
            }
            qcReportInfo(params).then(res => {
                if(actionType === 'DRAFT'){
                    this.visible.btnLoading1 = false;
                }else if(actionType === 'REPORT'){
                    this.visible.btnLoading2 = false;
                }
                if (res.data.code === 0) {
                    this.$message.success('上报成功');
                    this.$router.go(-1);
                    return
                }
                this.$message.error(res.data.msg);
            })
        },
        getQualityParams() {
            const arr = [];
            Object.keys(this.reportSkuVal).map(key => {
                if (+this.reportSkuVal[key].num) {
                    const sku = this.skuList.find(item => item.id === this.reportSkuVal[key].skuId);
                    const obj = {
                        skuId: this.reportSkuVal[key].skuId,
                        quantity: this.reportSkuVal[key].num,
                    };
                    arr.push(obj);
                }
            })
            return arr;
        },
        getDefectiveOrWastedParams(name) {
            const list = [];
            for (let item of this.reportFormData[name]) {
                const index = this.skuList.findIndex(skuItem => {
                    if (this.isHideLength) {
                        return (item.colorId === skuItem.color_id
                            && item.sizeId === skuItem.size_id)
                    }
                    return (item.colorId === skuItem.color_id
                            && item.sizeId === skuItem.size_id
                            && item.standardId === skuItem.standard_id);
                });
                if (index > -1 && item.num) {
                    item.skuId = this.skuList[index].id;
                    list.push(item);
                }
            }
            return list;
        },
        validDefectiveOrWasted(name) {
            const isNullSkuId = this.reportFormData[name].some(item => !item.skuId);
            if (isNullSkuId) {
                return false;
            }
            return true;
        },
        validForm() {
            if (!this.reportFormData.finishAt) {
                this.$message.error('请选择完成时间！')
                return false;
            }
            if (this.outSideFlag&&!this.outSideFactoryId) {
                this.$message.error('请选择完成工厂！')
                return false;
            }
            if (!this.reportFormData.finishBy) {
                this.$message.error('请选择完成人员！')
                return false;
            }
            if (this.storehouseId === null&&this.associateInStore) {

                this.$message.error('请选择仓库！')
                return false;
            }
            if (this.isLigationNode) {
                return true;
            }
            if (!this.totalNum && !this.defectiveNums && !this.wastedNums) {
                this.$message.error('请输入上报数量！')
                return false;
            }
            return true;
        },
        // 设置次品sku数量
        setDefectiveSkuNum(skuId) {
            const setItem = this.skuList.find(item => item.id === skuId);
            const item = {
                remark: '',
                skuId: skuId,
                defectiveLabelIds: '',
                defectiveLabelName: '',
                colorId: setItem.color_id,
                standardId: setItem.standard_id,
                sizeId: setItem.size_id,
                colorName: setItem.color_name,
                standardName: setItem.standard_value,
                sizeName: setItem.size_value
            }
            this.reportFormData['qcDefectiveDetailDTOList'].push(item);
        },
        // 设置次品sku数量
        setWastedSkuNum(skuId) {
            const setItem = this.skuList.find(item => item.id === skuId);
            const item = {
                reason: '',
                skuId: skuId,
                colorId: setItem.color_id,
                standardId: setItem.standard_id,
                sizeId: setItem.size_id,
                colorName: setItem.color_name,
                standardName: setItem.standard_value,
                sizeName: setItem.size_value
            }
            this.reportFormData['qcWastedDetailDTOList'].push(item);
        },
        // 获取当前节点未上报的扎号列表
        fetchWithoutReportList() {
            const { missionId, instanceWorkflowId } = this.$route.query;
            getLigationListWithoutReport({ missionId, missionNodeId: instanceWorkflowId })
            .then(res => {
                this.ligationSelectOption = res.data.ligations.map(item => {
                    item.qualified = '';
                    item.wasteNum = '';
                    item.defectiveNum = '';
                    return item;
                });
            });
        },
        // 扎号型上报
        ligationReport(actionType) {
            const reports = this.getLigationReportListParams();
            if (!this.ligationSelectOption.length) {
                return this.$message.error('暂无可上报的扎号');
            }
            if (!reports.length && !this.defectiveNums && !this.wastedNums && !this.totalNum) {
                return this.$message.error('请添加上报数量');
            }
            const lost = this.getLostLigationParams();
            const params = {
                userId: this.userId,
                missionNodeId: this.$route.query.instanceWorkflowId,
                finishDate: this.reportFormData.finishAt,
                finishUserId: this.reportFormData.finishBy,
                storehouseId: this.storehouseId,
                actionType: actionType,
                reports,
                ...lost
            };
            if(actionType === 'DRAFT'){
                this.visible.btnLoading1 = true;
            }else if(actionType === 'REPORT'){
                this.visible.btnLoading2 = true;
            }
            ligationNodeReport(params)
            .then(res => {
                if(actionType === 'DRAFT'){
                    this.visible.btnLoading1 = false;
                }else if(actionType === 'REPORT'){
                    this.visible.btnLoading2 = false;
                }
                if (res.data.code === 0) {
                    this.$message.success('上报成功');
                    this.$router.go(-1);
                    return
                }
                this.$message.error(res.data.msg || '上报失败');
            });
        },
        // 获取扎号参数
        getLigationReportListParams() {
            return this.ligationParams.reduce((arr, item) => {
                if (item.qualified || item.wasteNum || item.defectiveNum) {
                    arr.push({
                        reportId: item.reportId || '',
                        skuId: item.skuId,
                        qualified: item.qualified,
                        ligationId: item.ligationId,
                        defectiveds: item.defectiveds || [],
                        wasteds: item.wasteds || []
                    });
                }
                return arr;
            }, [])
        },
         // 获取无扎号参数
        getLostLigationParams() {
            const lostLigationSkuList = Object.keys(this.reportSkuVal).reduce((arr, key) => {
                if (this.reportSkuVal[key].num) {
                    arr.push({
                        skuId: this.reportSkuVal[key].skuId,
                        quantity: this.reportSkuVal[key].num
                    })
                }
                return arr;
            }, []);
            const lostLigationDefectiveds = this.getDefectiveOrWastedParams('qcDefectiveDetailDTOList');
            const lostLigationWasteds = this.getDefectiveOrWastedParams('qcWastedDetailDTOList');
            return {
                lostLigationSkuList,
                lostLigationDefectiveds,
                lostLigationWasteds
            }
        },
    }
};
</script>

<style lang="scss" scoped>
.reporting {
    &_title {
        border-bottom: 1px solid #e6eaf0;
    }
    &__mission-info {
        margin-bottom: 16px;
        border: none !important;
        background: #fff;
        box-shadow: 0px 6px 10px -3px rgba(13,51,128,0.05);
    }
    &__ligation {
        background: #fff;
    }
    &-ligation__collapse {
        display: inline-block;
        cursor: pointer;
        margin-top: 24px;
        font-size: 12px;
    }
    &_content {
        &--header {
            display: flex;
            p {
                margin-right: 32px;
                span {
                    display: inline-block;
                    width: 68px;
                    color: #3b3b3b;
                    font-size: 14px;
                }
            }
        }
        &--item {
            margin-top: 16px;
            .tag {
                padding-right: 24px;
                font-size: 20px;
                font-weight: 500;
            }
            .good {
                color: #23c811;
            }
            .nogood {
                color: #ff7f14;
            }
            .waste {
                color: #fa4150;
            }
            .total {
                color: #3b3b3b;
            }
            .item {
                margin-bottom: 12px;
                .label {
                    padding-right: 12px;
                    color: #3b3b3b;
                    &.nogood {
                        padding-left: 32px;
                    }
                }
                .select {
                    width: 180px;
                }
                .dele {
                    display: inline-block;
                    margin-left: 32px;
                    color: #fa4150;
                    cursor: pointer;
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
}

%green {
    color: #23c811;
    border-color: #23c811;
    .icon-quality {
        background: url(../../../assets/images/pic_qualified-pick.png) no-repeat;
    }
    .icon-checked {
        border-bottom-color: #23c811
    }
}
%orange {
    color: #ff7f14;
    border-color: #ff7f14;
    .icon-defective {
        background: url(../../../assets/images/pic_defective-pick.png) no-repeat;
    }
    .icon-checked {
        border-bottom-color: #ff7f14
    }
}
%red {
    color: #fa4150;
    border-color: #fa4150;
    .icon-waste {
        background: url(../../../assets/images/pic_waste-pick.png) no-repeat;
    }
    .icon-checked {
        border-bottom-color: #fa4150
    }
}

.dialog-content {
    & {
        display: flex;
        justify-content: space-around;
    }
    .good-type-item {
        position: relative;
        width: 100px;
        height: 100px;
        text-align: center;
        font-size: 14px;
        color: #a2abb8;
        cursor: pointer;
        border-radius: 2px;
        border: solid 1px #c4c6cc;
        // &.default-active {
        //     border-color: #c4c6cc;
        //     .icon-checked {
        //         border-bottom-color: #fa4150
        //     }
        // }
        &:hover {
            &.hover-green {
                @extend %green;
            }
            &.hover-orange {
                @extend %orange;
            }
            &.hover-red {
                @extend %red;
            }
        }
        &.active {
            &.hover-green {
                @extend %green;
            }
            &.hover-orange {
                @extend %orange;
            }
            &.hover-red {
                @extend %red;
            }
        }
        .icon-good-type {
            display: inline-block;
            width: 54px;
            height: 46px;
            margin-top: 17px;
        }
        p {
            margin-top: 9px;
        }
        .icon-quality {
            background: url(../../../assets/images/pic_qualified-disable.png) no-repeat;
            background-size: 100% 100%;
        }
        .icon-defective {
            background: url(../../../assets/images/pic_defective-disable.png) no-repeat;
            background-size: 100% 100%;
        }
        .icon-waste {
            background: url(../../../assets/images/pic_waste-disable.png) no-repeat;
            background-size: 100% 100%;
        }
        .icon-checked {
            position: absolute;
            display: block;
            right: 0;
            bottom: 0;
            border-bottom: 35px solid #c4c6cc;
            border-left: 35px solid transparent;
            &::after {
                position: absolute;
                top: 15px;
                right: 5px;
                display: block;
                content: '';
                width: 6px;
                height: 12px;
                border-radius: 2px;
                transform: rotate(45deg);
                border-right: 3px solid #fff;
                border-bottom: 3px solid #fff;
            }
        }
    }
}

.w98 {
    width: 98px !important;
}
.mar20 {
    margin-right: 10px;
}
.mar16 {
    margin-bottom: 16px;
}
.qualified-good{
    margin-top: 16px;
}
.qulified-text{
    float: left;
    width: 80px;
}
.qualified-textarea{
    width: 50%;
}
.btn-add {
    margin-left: 50px;
    color: #1ca1ff;
    font-size: 16px;
    &:hover {
        color: #1ca1ff;
    }
}
.color-title {
    font-size:20px;
    display: flex;
    justify-content: center;
    margin-bottom:24px;
    color: #2c2c2c;
}
</style>
<style lang="scss">
    .reporting {
        .el-form-item{
            margin-bottom: 0;
        }
        .outsideFac-station .text-align{
            text-align: left !important;
            .el-input__inner{
                margin-left: 10px;
                width: 217px;
            }
        }
        .dialog-footer {
            display: flex;
            justify-content: center;
            .cancel {
                margin-right: 16px;
            }
        }
        .nf-input {
            display: flex;
            justify-content: center;
            width: 260px;
            margin: 0 auto
        }
    }

</style>

