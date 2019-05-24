<template>
  <div class="create-node">
        <!-- 节点类型 -->
      <content-wrap class="node-type border-bottom" title="节点类型" type="big">
          <p class="error-tip" slot="titleDesc" v-show="!newNodeData.prcdNodeTypeId">
              请选择节点类型
          </p>
          <el-radio-group style="width: 100%" v-model="newNodeData.prcdNodeTypeId"
                          @change="radioSelect">
              <div v-for="(el, key) in options" :key="key">
                  <div class="node-type-title">
                      {{el.nodeClassifyName}}
                  </div>
                  <el-row :gutter="12">
                      <el-col :span="12" v-for="(item, index) of el.prcdNodeTypes" :key="index">
                          <div class="node-type-item">
                              <el-radio :disabled="newNodeData.usedByTemplate" :label="item.id">
                            <span class="node-type-item__label">
                                {{ item.name }}
                            </span>
                                  <span class="node-type-item__desc">
                                ({{item.description}})
                            </span>
                              </el-radio>
                          </div>
                      </el-col>
                  </el-row>
              </div>
          </el-radio-group>
      </content-wrap>
      <content-wrap title="基本信息" type="big" class="border-bottom" style="padding-top: 10px;">
          <el-form class="create-form" ref="create-form" :model="newNodeData" :rules="rules" label-width="70px">
              <el-form-item class="create-form__item" label="节点名称" prop="name">
                  <el-input v-model="newNodeData.name" placeholder="请输入节点名称（20字符内）"></el-input>
              </el-form-item>
              <nf-button style="height: 38px;" @click="tagVisible = true" >预设标签</nf-button>
          </el-form>
      </content-wrap>
      <content-wrap v-if="showConfigure || showFinish" title="节点配置" type="big" class="border-bottom" style="margin-top: 10px;">
          <template v-if="showConfigure">
              <p>功能配置</p>
              <div class="node-type-item_text">
                  <el-form label-width="80px" class="node-form" v-if="nodeConfig.allowMaterialConfig">
                      <el-form-item label="物料分类">
                          <el-select
                                  v-model="newNodeData.materialKindIds"
                                  multiple
                                  filterable
                                  remote
                                  reserve-keyword
                                  placeholder="请选择"
                                  :loading='loading'
                                  @change="selectMaterial" :remote-method="listMaterialsKinds">
                              <!-- <el-option
                              key="ALL"
                              label="全部"
                              value="ALL">
                              </el-option> -->
                              <el-option
                                      v-for="items in materialKindList"
                                      :key="items.id"
                                      :label="items.id == 'ALL'? items.name : `${items.no}-${items.name}`"
                                      :value="items.id">
                              </el-option>
                          </el-select>
                      </el-form-item>
                  </el-form>

                  <el-checkbox :disabled="newNodeData.usedByFacMission || newNodeData.becomeUpstreamNode" @change="wymChange" v-if="nodeConfig.allowAssociateWYM"
                               class="show-true-num" v-model="newNodeData.associateWYM">关联唯一码</el-checkbox>
                  <el-checkbox :disabled="newNodeData.usedByFacMission || newNodeData.becomeUpstreamNode" @change="zhChange" v-if="nodeConfig.allowAssociateLigation"
                               class="show-true-num" v-model="newNodeData.associateLigation">关联扎号</el-checkbox>
                  <el-checkbox :disabled="newNodeData.usedByFacMission" @change="inStoreChange" v-if="nodeConfig.allowAssociateInStore"
                               class="show-true-num" v-model="newNodeData.associateInStore">入库</el-checkbox>
                  <el-checkbox v-if="newNodeData.associateInStore"
                               class="show-true-num" v-model="newNodeData.selectDefaultStore">自动选择默认仓库</el-checkbox>
                  <el-checkbox :disabled="newNodeData.usedByFacMission" @change="outsideChange" v-if="nodeConfig.allowAssociateOutside"
                               class="show-true-num" v-model="newNodeData.allowAssociateOutside">外发/分活</el-checkbox>
                  <el-checkbox :disabled="newNodeData.usedByFacMission" v-if="newNodeData.allowAssociateOutside"
                               class="show-true-num" v-model="newNodeData.outsideNextFollowPre">本节点外发/分活明细跟随上游节点</el-checkbox>
                  <!-- <el-checkbox @change="zhChange" v-if="item.allowAssociateLigation"
                  class="show-true-num" v-model="newNodeData.associateLigation">关联多客户订货数</el-checkbox> -->
              </div>
          </template>
          <template v-if="showFinish">
              <p style="margin-top: 10px;">完成情况配置</p>
              <div class="node-type-finish-config">
                  <div class="node-type-finish-config-ct" v-if="nodeConfig.adoac">
                      <span style="margin-right: 178px;">目标数</span>
                      <el-checkbox :disabled="newNodeData.usedByFacMission" class="show-true-num"  @change="shiChange" v-model="newNodeData.doac">以实裁数为准</el-checkbox>
                  </div>

                  <div class="node-type-finish-config-ct" v-if="nodeConfig.allowBillCompleteNum">
                      <span class="complete-dynamic">
                          <span>完成数</span>
                          <span class="blue-underline" @click="dynamicHeadShowGo('FAC_MISSION_COMPLETE','完成数单')">完成数单据配置</span>
                      </span>
                      <div class="complete-wrap" v-if="nodeConfig.allowCompleteExcess">
                          <el-checkbox
                                  class="show-true-num"
                                  @change="shiChange"
                                  v-model="newNodeData.allowCompleteExcess">
                              上报不允许超过目标数的
                          </el-checkbox>
                          <el-input v-model="newNodeData.completeExcessPercent"
                                    @input="completeExcessPercent"
                                    type="number"
                                    min="0"
                                    step="0.01">
                          </el-input>
                          <span>%</span>
                      </div>
                  </div>

                  <div class="node-type-finish-config-ct" v-if="nodeConfig.allowBillAdjustNum">
                      <el-checkbox style="margin-left: -24px;"   @change="adjustmentNumberChange" v-model="newNodeData.allowAdjustNum">调整数</el-checkbox>
                      <span class="blue-underline" @click="dynamicHeadShowGo('FAC_MISSION_ADJUST','调整数单')">调整数单据配置</span>
                  </div>

                  <div class="node-type-finish-config-ct" v-if="nodeConfig.allowReportSendSelectUser">
                      <span style="margin-right: 178px;">发出数</span>
                      <el-checkbox class="show-true-num"  @change="sendToChange" v-model="newNodeData.reportSendSelectUser">上报完成数的同时上报发往工厂、工位</el-checkbox>
                      <el-checkbox class="show-true-num"  v-model="newNodeData.reportSendSelectUserDefComplete" v-if="newNodeData.reportSendSelectUser">发往工厂、工位默认取完成工厂、工位</el-checkbox>
                  </div>

                  <div class="node-type-finish-config-ct" v-if="nodeConfig.allowBillDefectiveNum">
                      <span>次品数</span>
                      <span class="blue-underline" @click="dynamicHeadShowGo('FAC_MISSION_DEFECTIVE','次品数单')">次品数单据配置</span>
                  </div>

                  <div class="node-type-finish-config-ct" v-if="nodeConfig.allowBillWasteNum">
                      <span>废品数</span>
                      <span class="blue-underline" @click="dynamicHeadShowGo('FAC_MISSION_WASTE','废品数单')">废品数单据配置</span>
                  </div>

              </div>
          </template>

      </content-wrap>
      <!--动态配置表头组件-->

      <dynamic-head
              v-if="dynamicHeadShow"
              source="createNode"
              title="单据配置"
              :billName="billName"
              :dynamicVisible="dynamicHeadShow"
              :allSelectItem="dynamicAllItem"
              :checkedArr="checkedArr"
              :sortArr="sortArr"
              @closeDynamicHead="dynamicHeadShow = false"
              @dynamicCommit="dynamicCommit"
              @dynamicReset="openDynamicHeader"
      >
      </dynamic-head>
      <!--<node-tag-dialog v-if="tagVisible" :visible.sync="tagVisible" source="edit"  :propTableData="propTableData && propTableData.length?JSON.parse(JSON.stringify(propTableData)):[]" @getTagTableData="getTagTableData"></node-tag-dialog>-->

      <node-tag-dialog v-if="tagVisible" :visible.sync="tagVisible" :propTableData="newNodeData.prcdNodeTages&&newNodeData.prcdNodeTages.length?JSON.parse(JSON.stringify(newNodeData.prcdNodeTages)):[]" @getTagTableData="getTagTableData"></node-tag-dialog>
  </div>
</template>

<script>
import {getNodeTypes, listMaterialsKinds,editNodeDetail,billConfigField} from '../../../api/api'
import NodeTagDialog from './nodeTagDialog'
import DynamicHead from '@/components/Common/dynamicHead';
export default {
    components: {NodeTagDialog,DynamicHead},
    data() {
        return {
            billName:'',
            billType:'',
            dynamicHeadShow:false,
            dynamicAllItem:[],
            checkedArr:[],
            sortArr:[],
            tagVisible:false,
            editTagName:'',
            newNodeData:{
                name:'',
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                prcdNodeTypeId: '',
                doac:false,
                associateWYM:false,
                associateLigation:false,
                allowCompleteExcess:false,
                allowMaterialConfig:false, // 判断是否是属于送料型的
                allowAssociateOutside: false, // 判断是否是外发
                associateInStore: false, // 判断是否入库
                selectDefaultStore: false, //默认选择仓库
                outsideNextFollowPre: false,     //本节点外发明细跟随上游节点
                materialKindIds:[],
                prcdNodeTages:[],
                allowAdjustNum:false,
                billConfigs:[],
                completeExcessPercent:0,   //超额百分比
                reportSendSelectUser: false,     //上报完成数的同时上报发往工厂、工位
                reportSendSelectUserDefComplete: false,     //发往工厂、工位默认取完成工厂、工位
            },
            newNodeDataBackup: {
                name:'',
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                prcdNodeTypeId: '',
                doac:false,
                associateWYM:false,
                associateLigation:false,
                allowMaterialConfig:false, // 判断是否是属于送料型的
                allowAssociateOutside: false, // 判断是否是外发
                materialKindIds:[]
            },
            options:[],
            nodeConfig:[],
            nodeTypeChangeTime:1,
            materialKindList:[],
            kindsBackup:[],
            isAll:false,
            disabled:false,
            loading:false,
            materielList:[{name:'送料型',}],
            radio:'',
            rules: {
                name: [
                    {
                        required: true, message: '请输入节点名称',
                    },
                    {
                        max: 20, message: '长度在20个字符内'
                    }
                ]
            },
        }
    },
    computed:{
        //是否显示节点配置 - 功能配置
        showConfigure(){
            if(this.newNodeData.prcdNodeTypeId && (this.nodeConfig.allowMaterialConfig || this.nodeConfig.allowAssociateWYM || this.nodeConfig.allowAssociateLigation || this.nodeConfig.allowAssociateOutside || this.nodeConfig.allowAssociateInStore)){
                return true
            }else{
                return false
            }
        },
        //是否显示节点配置 - 完成情况配置
        showFinish(){
            if(this.nodeConfig.adoac || this.nodeConfig.allowBillCompleteNum || this.nodeConfig.allowBillCompleteNum || this.nodeConfig.allowCompleteExcess || this.nodeConfig.allowBillAdjustNum || this.nodeConfig.allowBillDefectiveNum || this.nodeConfig.allowBillWasteNum){
                return true
            }else{
                return false
            }
        },
        bossUnitId() {
            return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
        },
    },
    methods:{
        //勾选完成数单选框
        completeExcessPercent(val){
            // input值大于0 && 此时没勾选单选框
            if(parseFloat(val) > 0 && !this.newNodeData.allowCompleteExcess){
                this.newNodeData.allowCompleteExcess = true;
            }
        },
        dynamicHeadShowGo(billType,billName){
            this.billType = billType;

            let obj = {
                billType,
                bossUnitId:this.bossUnitId
            };
            if(this.$route.query.id){
                obj.prcdNodeId = this.$route.query.id
            }
            console.log(this.newNodeData.billConfigs);
            if(this.newNodeData.billConfigs.length){
                let flag = true;
                this.newNodeData.billConfigs.forEach(item=>{
                    if(item.billType===billType){
                        this.checkedArr = item.checkedFields.map(item=>item.id);
                        this.sortArr = item.checkedFields;
                        this.billName = item.billName;
                        // this.dynamicAllItem = item.allFields;
                        billConfigField(obj).then(res=>{
                            this.dynamicAllItem = res.data.data.fields;
                        })
                        flag=false
                    }
                });
                if(!flag) {
                    this.dynamicHeadShow = true;
                    return
                }
            }
            billConfigField(obj).then(res=>{
                console.log(res);
                this.billName = res.data.data.billName;
                this.dynamicAllItem = res.data.data.fields;
                this.checkedArr = res.data.data.checkedFields.map(item=>item.id);
                this.sortArr = res.data.data.checkedFields;
                this.$nextTick(function () {
                    this.dynamicHeadShow = true
                })
            })
        },
        //恢复默认
        openDynamicHeader(){
            billConfigField({billType:this.billType,bossUnitId:this.bossUnitId}).then(res=>{
                console.log(res);
                this.checkedArr = res.data.data.checkedFields.map(item=>item.id);
                this.sortArr = res.data.data.checkedFields;
                this.billName = res.data.data.billName;
            })
        },
        dynamicCommit(val,billName){
            // dynamicHeadShow
            console.log(val);
            this.billName = billName;
            let index = this.newNodeData.billConfigs.findIndex(item=>item.billType===this.billType);

            let obj = {
                billType:this.billType,
                billName:this.billName,
                checkedFields:val,
                allFields:JSON.parse(JSON.stringify(this.dynamicAllItem)),
            };
            console.log(index);
            console.log(this.newNodeData.billConfigs);
            if(index!==-1){
                this.newNodeData.billConfigs[index].checkedFields=val
            }else {
                this.newNodeData.billConfigs.push(obj)

            }
            this.dynamicHeadShow = false;
        },
        //getTagTableData
        getTagTableData(val){
            this.tagVisible = false
            val.forEach(item=>{
                item.prcdNodeId = this.$route.query.id
                if(!item.id){
                    item.id = ''
                }
                if(!item.use){
                    item.use = false
                }
            });
            this.newNodeData.prcdNodeTages = val
        },

        selectMaterial(item) {
            let arr = this.newNodeData.materialKindIds
            if (item.length > 1 && arr[0] == "ALL") {
                for (let i = 0; i < item.length; i++) {
                    if (item[i] == "ALL") {
                        item.splice(i, 1);
                        for (let j = 0; j < arr.length; j++) {
                            if (arr[j] == "ALL") {
                                arr.splice(j, 1);
                            }
                        }
                    }
                }
                return;
            }
            for (let i = 0; i < item.length; i++) {
                if (item[i] == "ALL") {
                    console.log('2222')
                    for (let j = 0; j < arr.length; j++) {
                        if (arr[j] != "ALL") {
                            arr.splice(j, 1);
                        }
                    }
                }
            }
        },
        // 物料分类列表
        listMaterialsKinds(key) {
            let params = {
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                pageNum:1,
                pageSize:20,
                key:key
            }
            this.loading = true
            listMaterialsKinds(params).then(res => {
                let obj = {
                    id: "ALL",
                    name: "全部",
                    value: ""
                };
                if (res.data.kindsList.length) {
                    res.data.kindsList.unshift(obj)
                }
                this.materialKindList = res.data.kindsList
                this.loading = false
            })
        },
        shiChange() {
            if(!this.newNodeData.doac) {
                this.newNodeData.associateWYM = false;
                this.newNodeData.associateLigation = false;
            }
            // if(item.associateLigation) {
            //     item.doac = true;
            // }
        },
        //判断如果扎号选了唯一码不能选
        wymChange() {
            if(this.newNodeData.associateWYM) {
                this.newNodeData.doac = true;
                this.newNodeData.allowAdjustNum = false;
                this.newNodeData.associateInStore = false;
                this.newNodeData.allowAssociateOutside = false;
                this.newNodeData.outsideNextFollowPre = false;
                this.newNodeData.reportSendSelectUser = false;
            }
            if(this.newNodeData.associateLigation) {
                this.$message.error('扎号选了唯一码不能选')
                this.newNodeData.associateWYM = false;
            }
        },
        //判断如果唯一码选了扎号不能选
        zhChange() {
            if(this.newNodeData.associateLigation) {
                this.newNodeData.doac = true;
                this.newNodeData.allowAdjustNum = false;
                this.newNodeData.associateInStore = false;
                this.newNodeData.allowAssociateOutside = false;
                this.newNodeData.outsideNextFollowPre = false;
                this.newNodeData.reportSendSelectUser = false;
            }
            if(this.newNodeData.associateWYM) {
                this.$message.error('唯一码选了扎号不能再选')
                this.newNodeData.associateLigation = false;
            }
        },
        //选了唯一码或扎号就不允许勾选调整数
        adjustmentNumberChange(val){
            if (this.newNodeData.allowAdjustNum &&(this.newNodeData.associateLigation || this.newNodeData.associateWYM) ){
                this.$message.error('关联唯一码或者扎号不允许勾选调整数');
                this.newNodeData.allowAdjustNum = false
            }
        },
        inStoreChange(){
            if(this.newNodeData.associateInStore && (this.newNodeData.associateWYM || this.newNodeData.associateLigation)){
                this.$message.error('关联唯一码或者扎号不允许勾选入库');
                this.newNodeData.associateInStore = false
            }
        },
        outsideChange(){
            if(this.newNodeData.allowAssociateOutside && (this.newNodeData.associateWYM || this.newNodeData.associateLigation)){
                this.$message.error('关联唯一码或者扎号不允许勾选外发/分活');
                this.newNodeData.allowAssociateOutside = false
            }
            //去掉外发勾选的时，同时取消“本节点外发明细跟随上游节点”勾选
            if(!this.newNodeData.allowAssociateOutside){
                this.newNodeData.outsideNextFollowPre = false
            }
        },
        sendToChange(){
            if(this.newNodeData.reportSendSelectUser && (this.newNodeData.associateWYM || this.newNodeData.associateLigation)){
                this.$message.error('关联唯一码或者扎号不允许勾选');
                this.newNodeData.reportSendSelectUser = false
            }
            //去掉“上报完成数的同时上报发往工厂、工位”勾选的时，同时取消“发往工厂、工位默认取完成工厂、工位”勾选
            if(!this.newNodeData.reportSendSelectUser){
                this.newNodeData.reportSendSelectUserDefComplete = false
            }
        },
        getNodeTypes() {
            let params = {
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id
            }
            getNodeTypes(params).then(res => {
                if(res.data.code === 0){
                    this.options = res.data.kinds;
                    this.$nextTick(function () {
                        if(this.$route.query.id){
                            editNodeDetail(this.$route.query.id).then(res=>{
                                for(let k in res.data.data){
                                    // if(k!=='billConfigs'){
                                        this.newNodeData[k] = res.data.data[k]
                                    // }
                                }
                                this.newNodeData.allowCompleteExcess = !this.newNodeData.allowCompleteExcess;
                                this.newNodeData.prcdNodeTages =res.data.data.prcdNodeTags
                                if(res.data.data.configAllMaterial){
                                    this.$set(this.newNodeData,'materialKindIds',['ALL'])
                                }
                                this.$set(this.newNodeData,'prcdNodeTypeId',res.data.data.nodeTypeId)
                            })
                        }
                    })

                    res.data.kinds.forEach(i => {
                        if(i.nodeClassifyName == '物料类') {
                            this.kindsBackup = i.prcdNodeTypes
                        }
                    })
                }
            })
        },
        radioSelect(val) {
            if(!this.$route.query.id || this.nodeTypeChangeTime===2){
                this.newNodeData.doac = false;
                this.newNodeData.associateWYM = false;
                this.newNodeData.associateLigation = false;
                this.newNodeData.allowMaterialConfig = false
                this.newNodeData.allowAssociateOutside = false
                this.newNodeData.associateInStore = false
                this.newNodeData.materialKindIds = [];
            }
            this.nodeTypeChangeTime=2;


             this.options.forEach(item=>{
                item.prcdNodeTypes.forEach($item=>{
                    if($item.id===val){
                        this.nodeConfig = $item
                    }
                })

            })
            this.$emit('nodeData',this.newNodeData);
        }
    },
    created() {
        this.getNodeTypes();
        this.listMaterialsKinds();
    },

    updated() {
        // if(this.newNodeData.associateWYM) {
        //     this.newNodeData.doac = true;
        // }
        // if(this.newNodeData.prcdNodeTypeId) {
        //     this.kindsBackup.forEach(i => {
        //         if(this.newNodeData.prcdNodeTypeId == i.id) {
        //             if(i.allowMaterialConfig) {
        //                 this.newNodeData.allowMaterialConfig = true
        //             }
        //         }
        //     })
        // }
        // console.log(this.newNodeData,'this.newNodeData')
        this.$emit('nodeData',this.newNodeData);
        // this.newNodeData = this.newNodeDataBackup

    }
}
</script>

<style lang="scss" scoped>
    .create-form-wrapper {
        border-bottom: 1px solid #E6EAF0;
    }
    .create-form__item {
        width: 360px;
        display: inline-block;
        margin-bottom: 6px;
        font-size:12px;
        margin-right: 20px;
    }
    .node-type {
        margin-top: 16px;
        .error-tip {
            display: inline-block;
            margin-left: 12px;
            font-size: 12px;
            color: #FA4150;
        }
        .node-type-title{
            padding:16px 0 8px;
            color:#3B3B3B;
            font-weight:bold;
            font-size:12px;
            &:first-child{
                padding-top:0;
            }
        }
    }
    .node-type-item {
        padding: 8px 12px;
        margin-bottom: 12px;
        background: #F7F9FC;
        border: 1px solid #E6EAF0;
        font-size: 12px;
        .node-type-item__label {
            font-size: 12px;
        }

        .node-type-item__desc {
            font-size: 12px;
            color: #A2ABB8
        }
    }
    .node-type-item_text{
        background: #F7F9FC;
        border: 1px solid #E6EAF0;
        margin-top: 10px;
        font-size:12px;
        cursor: pointer;
        /*margin-left:34px;*/
        display:flex;
        // justify-content:space-between;
        .node-form{
            padding:9px 0;
            .el-form-item{
                margin-bottom:0;
            }
        }
        .show-true-num{
            padding:18px 0 10px;
            margin-left:24px;
        }
    }
    .node-type-finish-config{
        background: #F7F9FC;
        border: 1px solid #E6EAF0;
        margin-top: 10px;
        border-bottom: none;
        .node-type-finish-config-ct{
            height: 40px;
            padding:0px 40px;
            line-height: 40px;
            border-bottom: 1px solid #E6EAF0;
            .blue-underline{
                color: #1CA1FF;
                text-decoration: underline;
                cursor: pointer;
                margin: 0 40px;
            }
            .complete-dynamic{
                float: left;
            }
            .complete-wrap{
                .el-input{
                    display: inline-block;
                    width: 60px;
                    font-size: 12px;
                }
            }
        }
    }
    .node-select{
        display:flex;
        justify-content:space-between;
        .node-form{
            padding-top:9px;
            .el-form-item{
                margin-bottom:0;
            }
        }
        .show-true-num{
            padding:18px 0 10px;
            margin-left:24px;
        }
    }

</style>
<style lang="scss">
    @import "../../../assets/style/reset.css";
    @import "../../../assets/style/element-reset.scss";
.create-node{
    .el-table--enable-row-hover .el-table__body tr:hover > td{
        background-color: transparent;
    }
    .row-active>td:first-child .cell{
        border: 1px solid #ff8d37;
    }
        .createNodeInput .el-input__inner{
            border: none;
        }
        .show-true-num{
        .el-checkbox__label{
            font-size:12px;
        }
    }
    .el-form-item__label{
        font-size:12px;
    }
    .el-input__inner{font-size:12px;}
    .content_wrap--title{
            font-size:14px !important;
        }
        .border-bottom{
            border-bottom:1px solid #DFE6EC;
        }
        .el-form-item{
            margin-top:0 !important;
        }
    .complete-wrap{
        .el-input{
            .el-input__inner{
                height: 30px;
            }
        }
    }
}

</style>


