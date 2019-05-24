<template>
    <main class="detail-main">
        <el-row class="btn-wrapper" v-if="isLastReview">


            <nf-button
            type="success"
            :loading="visible.btnLoading"
            style="padding-left: 28px;padding-right: 28px;"
            :disabled="!nodeDetailData.functionData.canGenerateStyle"
            @click="fetchCheckListData">审核完毕，点击生成商品档案</nf-button>
            <el-popover
                popper-class="tips-popper"
                ref="popover1"
                placement="top-start"
                :visible-arrow="false"
                width="200"
                trigger="hover">
                <p class="tips">生成商品档案前提条件：</p>
                <p class="tips">1、审核列表审核状态全部为已通过；</p>
                <p class="tips">2、设计档案中的商品款号、颜色、尺寸 三个字段不为空。</p>
            </el-popover>
            <icon type="icon-tongyong-tishi" v-popover:popover1 w="14" h="14" />
        </el-row>
        <el-row class="btn-wrapper">
            <nf-button type="warning" :disabled="nodeDetailData.status === 2" plain @click="viewDesignDetail">查看设计档案</nf-button>
            <nf-button type="warning" :disabled="nodeDetailData.status === 2" plain @click="editDesignFile">编辑设计档案</nf-button>
        </el-row>
        <!-- 提交和审核表格 -->
        <detail-main-table
            :participants="nodeDetailData.participants"
            :submitters="submitters"
            :reviewers="reviewers"></detail-main-table>

        <!-- 终身节点--dialog -->
        <el-dialog
            custom-class="nf-dialog-common no-dialog-header"
            title="提示"
            size="tiny"
            :show-close="false"
            :visible.sync="visible.doneVisible">
            <div class="dialog-content">
                <img class="tip-icon" src="../../../../assets/images/icon_question.png" />
                <p class="delete-tip">审核完毕，是否立刻生成商品档案？</p>
            </div>
            <!-- footer -->
            <el-row type="flex" justify="center" slot="footer">
                <nf-button @click="visible.doneVisible = false">取 消</nf-button>
                <nf-button
                    class="btn--submit"
                    type="warning"
                    :loading="visible.btnLoading"
                    @click="fetchCheckListData">确 定</nf-button>
            </el-row>
        </el-dialog>

        <!-- 生成商品档案 -->
        <el-dialog
            custom-class="nf-dialog-common audit-dialog"
            title="生成商品档案"
            :show-close="false"
            :visible.sync="visible.createVisible">
            <p class="audit-tip">
                <icon type="icon-tips" w="11" h="11"/>
                提交成功后将生成一份新的商品档案
            </p>
            <div class="collapse-wrap" >
                <info-collapse-item
                    v-for="(item, key, index) of checkConf"
                    :key="index"
                    :style="{'borderBottom': index !== 3 ? 'none' : ''}"
                    v-model="item.model"
                    :check-type="key"
                    :prop="item.prop || 'id'"
                    :title="item.title"
                    :tip-show="index === 1"
                    :children-list="item.list"
                    @change="handleChange"
                    @change-all="handleSelectAllChange"></info-collapse-item>
            </div>
            <!-- footer -->
            <el-row type="flex" justify="center" slot="footer">
                <nf-button @click="visible.createVisible = false">取 消</nf-button>
                <nf-button
                    class="btn--submit"
                    type="warning"
                    :loading="visible.btnLoading"
                    @click="submit">确 定</nf-button>
            </el-row>
        </el-dialog>
    </main>
</template>

<script>
import DetailMainTable from '../common/detail-main-table';
import InfoCollapseItem from '../common/info-collapse-item';
import DispatchMixin from '@/components/stock/mixins';
import { getDesignNodeGenerateStyle, createDesignNodeGenerateStyle } from '@/api/sample-centre';
export default {
    props: {
        nodeDetailData: Object
    },
    mixins: [DispatchMixin],
    data() {
        return {
            visible: {
                dialogVisible: false,
                btnLoading: false,
                doneVisible: false,
                createVisible: false
            },
            checkData: {},
            checkConf: {
                baseInfo: {
                    title: '设计资料基础信息',
                    prop: 'id',
                    model: [1, 2, 3, 4, 5],
                    list: [
                        {
                            label: '设计款号',
                            disabled: true,
                            id: 1,
                            value: true
                        },
                        {
                            label: '货品款号',
                            disabled: true,
                            id: 2,
                            value: true
                        },
                        {
                            label: '设计负责人',
                            disabled: true,
                            id: 3,
                            value: true
                        },
                        {
                            label: '颜色',
                            disabled: true,
                            id: 4,
                            value: true
                        },
                        {
                            label: '尺寸',
                            disabled: true,
                            id: 5,
                            value: true
                        },
                        {
                            label: '内长',
                            disabled: false,
                            id: 6,
                            value: false
                        },
                        {
                            label: '分类信息',
                            disabled: false,
                            id: 7,
                            value: false
                        }
                    ]
                },
                samples: {
                    title: '样衣信息',
                    prop: 'id',
                    model: [],
                    list: []
                },
                processForms: {
                    title: '工艺信息',
                    prop: 'id',
                    model: [],
                    list: []
                },
                boms: {
                    title: 'BOM 表',
                    prop: 'id',
                    model: [],
                    list: []
                }
            }
        }
    },
    watch: {
        nodeDetailData(val) {
            if (this.isLastReview && this.nodeDetailData.functionData.canGenerateStyle) {
                this.visible.doneVisible = true;
            }
            else {
                this.visible.doneVisible = false;
            }
        }
    },
    created() {
        if (this.isLastReview && this.nodeDetailData.functionData.canGenerateStyle) {
            this.visible.doneVisible = true;
        }
    },
    computed: {
        userId() {
            return JSON.parse(sessionStorage.getItem('user_login')).userId;
        },
        unitId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId;
        },
        // 终审节点
        isLastReview() {
            return this.nodeDetailData.prcdNodeTypeCode === 'LAST_REVIEW';
        },
        // 提交区数据
        submitters() {
            return this.nodeDetailData.functionData && this.nodeDetailData.functionData.submitters;
        },
        // 审核区数据
        reviewers() {
            return this.nodeDetailData.functionData && this.nodeDetailData.functionData.reviewers;
        }
    },
    components: {
        DetailMainTable,
        InfoCollapseItem
    },
    methods: {
        viewDesignDetail() {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.style.view")){
                return
            }
            this.$store.dispatch('setDesignStyleNo',this.nodeDetailData.designStyleNo);
            sessionStorage.setItem("setDesignStyleNo", this.nodeDetailData.designStyleNo);

            this.$router.push({
                path: '/designFile/designFileDetail',
                query: {
                    prcdNodeId: this.nodeDetailData.missionPrcdNodeId,
                    designStyleId: this.nodeDetailData.functionData.designStyleId
                }
            });
        },
        editDesignFile() {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.style.edit")){
                return
            }
            this.$router.push({
                path: '/designFile/createDesignFile',
                query: {
                    prcdNodeId: this.nodeDetailData.missionPrcdNodeId,
                    designStyleId: this.nodeDetailData.functionData.designStyleId
                }
            });
        },
        // 获取生成档案选择数据列表
        fetchCheckListData() {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.mission.node.generate")){
                return
            }
            const designStyleId = this.nodeDetailData.functionData.designStyleId;
            this.visible.btnLoading = true;
            getDesignNodeGenerateStyle({ designStyleId })
            .then(res => {
                this.visible.btnLoading = false;
                this.checkData = res.data.data;
                this.initCheckList(res.data.data);
                this.visible.createVisible = true
            });
        },
        initCheckList(data) {
            this.checkConf['samples'].list = data['samples'].map(item => {
                return {
                    label: item.sampleName,
                    id: item.sampleId,
                    disabled: false,
                    bomIds: item.bomIds || [],
                    processFormIds: item.processFormIds || []
                }
            });
            this.checkConf['boms'].list = data['boms'].map(item => {
                return {
                    label: item.bomName,
                    id: item.bomId,
                    disabled: false,
                    hasSingleDosage: item.hasSingleDosage,
                    hasStyleSku:item.hasStyleSku,
                    selectedCount:0 //用于存储被选中的次数

                }
            });
            this.checkConf['processForms'].list = data['processForms'].map(item => {
                return {
                    label: item.processFormName,
                    id: item.processFormId,
                    disabled: false,
                    selectedCount:0 //用于存储被选中的次数

                }
            });
        },
        handleChange(val, type) {
            if (type === 'samples') {
                const samplesChecked = this.checkConf['samples'].list.find(item => item.id === val);
                const { bomIds, processFormIds } = samplesChecked;
                const isCancel = this.checkConf['samples'].model.indexOf(val) === -1; // 当选中的数据不存在val时，为取消
                console.log(bomIds, processFormIds,'传过去的关联id')
                if (isCancel) {
                    // 取消某个勾选
                    this.filterCheckedModel(bomIds, processFormIds);
                }
                else {
                    // 勾选某个
                    this.concatCheckedModel(bomIds, processFormIds);
                }
            }
        },
        handleSelectAllChange(checkAll, type) {
            if (type === 'samples') {
                if (checkAll) {
                    this.checkConf['samples'].list.forEach(item => {
                        const { bomIds, processFormIds } = item;
                        this.concatCheckedModel(bomIds, processFormIds);
                    });
                }
                else {
                    this.checkConf['samples'].list.forEach(item => {
                        const { bomIds = [], processFormIds = [] } = item;
                        this.filterCheckedModel(bomIds, processFormIds);
                    });
                }
            }
        },
        // 样衣选中值关联工艺和bom（选中的时候，在对应的bom表或工艺信息里面存被选中的次数，取消的时候，根据被选中的次数是否为1来判断要不要取消选中）
        concatCheckedModel(bomIds, processFormIds) {
            this.setSelectedCount('processForms', processFormIds, true);
            this.setSelectedCount('boms', bomIds, true);
            processFormIds.forEach(item =>{
              if(this.checkConf['processForms'].model.indexOf(item)===-1){
                this.checkConf['processForms'].model = this.checkConf['processForms'].model.concat(item);
              }
            })
            bomIds.forEach(item =>{
              if(this.checkConf['boms'].model.indexOf(item)===-1){
                this.checkConf['boms'].model = this.checkConf['boms'].model.concat(item);
              }
            })
            this.setDisabled('processForms', processFormIds, true);
            this.setDisabled('boms', bomIds, true);

        },
        // 样衣取消选中过滤
        filterCheckedModel(bomIds, processFormIds) {
          // 通过在bom表和工艺信息对应的item里面存储selectedCount（被选中的次数），来决定样衣信息取消选中的时候，工艺信息和bom表对应被引用的item要不要取消选中
          // 为什么这样做？因为不同样衣信息item里面的所引用的工艺信息和bom表有可能是同一个
          this.setSelectedCount('processForms', processFormIds, false);
          this.setSelectedCount('boms', bomIds, false);
          // this.checkConf['processForms'].model = []
          this.checkConf['processForms'].list.forEach(item =>{
            // 检查selectedCount===0并且和样衣档案有关联的id
            if(item.selectedCount===0&&processFormIds.indexOf(item.id)>-1){
              item.disabled = false
              console.log( this.checkConf['processForms'].model,'删除前')
              let itemIdIndex =  this.checkConf['processForms'].model.indexOf(item.id)
              console.log(itemIdIndex,'要删除的索引')
              this.checkConf['processForms'].model.splice(itemIdIndex,1)
              console.log( this.checkConf['processForms'].model,'删除后')

            }
          })
          this.checkConf['boms'].list.forEach(item =>{
            // 检查selectedCount===0并且和样衣档案有关联的id
            if(item.selectedCount===0&&bomIds.indexOf(item.id)>-1){
              console.log(item.label,'进来了')
              item.disabled = false
              let itemIdIndex =  this.checkConf['boms'].model.indexOf(item.id)
              this.checkConf['boms'].model.splice(itemIdIndex,1)
            }
          })
          // this.checkConf['processForms'].model = this.checkConf['processForms'].model.filter(modelItem => processFormIds.indexOf(modelItem) === -1);
          // this.checkConf['boms'].model = this.checkConf['boms'].model.filter(modelItem => bomIds.indexOf(modelItem) === -1);
          // this.setDisabled('processForms', processFormIds, false);
          // this.setDisabled('boms', bomIds, false);
        },
        //checkbox设置不可用
        setDisabled(obj, arr, disabled) {
            if (!arr) return;
            this.checkConf[obj].list.forEach(item => {
                if (arr.indexOf(item.id) > -1) {
                    item.disabled = disabled;
                }
            });
        },
        setSelectedCount(obj,arr,isAdd){
          if (!arr) return;
          this.checkConf[obj].list.forEach(item => {
            if (arr.indexOf(item.id) > -1) {
              if(isAdd){
                item.selectedCount = item.selectedCount+1
              } else{
                item.selectedCount = item.selectedCount-1
              }
            }
          });
        },
        // 提交生成商品档案
        submit() {
            const designStyleId = this.nodeDetailData.functionData.designStyleId;
            const params = {
                userId: this.userId,
                unitId: this.unitId,
                designStyleId,
                missionPrcdNodeId: this.nodeDetailData.missionPrcdNodeId,
                checkStandard: this.checkConf['baseInfo'].model.includes(6),
                checkCategory: this.checkConf['baseInfo'].model.includes(7),
                sampleIds: this.checkConf['samples'].model,
                bomIds: this.checkConf['boms'].model,
                processFormIds: this.checkConf['processForms'].model
            };
            const hasSingleDosage = params.bomIds.length && this.checkConf['boms'].list.some(item => params.bomIds.includes(item.id) && !item.hasSingleDosage);
            if (hasSingleDosage) {
                return this.$message.error('尚未填单件用量');
            }
            this.visible.btnLoading = true;
            console.log(params,'商品自动生成的参数')
            createDesignNodeGenerateStyle(params)
            .then(res => {
                this.visible.btnLoading = false;
                if (res.data.code === 0) {
                    this.visible.createVisible = false;
                    this.dispatch('SampleMissionDetail', 'update.mission.detail'); // index.vue created中$on的方法
                    this.$emit('on-update');
                    return this.$message.success('生成商品档案成功');
                };
                this.$message.error(res.data.msg || '生成商品档案失败');
            });
        }
    }
}
</script>
<style lang="scss">
    .audit-dialog {
        .el-dialog__body {
            position: relative;
        }
    }
    .tips-popper {
        background: #95A0B9;
    }
</style>


<style lang="scss" scoped>
    @import './common.scss';
    .tips {
        line-height: 18px;
        color: #fff;
    }
    .btn--submit {
        margin-left: 12px;
    }
    // 审核dialog
    .audit-tip {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        font-size: 12px;
        padding: 5px 16px;
        background: #F5F7FA
    }
    .audit-select {
        margin: 12px 0;
    }
    .collapse-wrap {
        margin-top: 12px;
    }
    // 审核完--dialog
    .dialog-content {
        text-align: center;
        p {
            margin: 24px 0;
        }
    }
</style>
