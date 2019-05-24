<template>
    <el-form
            ref="reportForm"
            class="report-form"
            :model="formData"
            :rules="currentRules"
            :label-width="80"
            inline>
        <div class="form-wrap report-top-form">
            <el-col :span="12">
                <el-form-item class="dialog__form-item" label="完成日期" prop="endAt">
                    <el-date-picker
                            v-model="formData.endAt"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            @change="handlePickDate"
                            :disabled="dateDisable"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12" class="align-right" v-if="!isWYMOrLigation && information.outSideFlag">
                <el-form-item class="dialog__form-item" label="完成工厂" prop="outSideFactoryId">
                    <el-select
                            v-model="formData.outSideFactoryId"
                            :disabled="information.facMissionOutsideFlag"
                            filterable
                            placeholder="请选择外发厂">
                        <el-option
                                v-for="item in outsideFactoryList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" :class="{'align-right' : !(!isWYMOrLigation && information.outSideFlag)}">
                <el-form-item class="dialog__form-item" label="完成人员" prop="finishUserId">
                    <template v-if="nextFollowOtherFinishUserSelect">
                        <el-select
                                v-model="formData.finishUserId"
                                :disabled="userDisable"
                                placeholder="选择完成人员">
                            <el-option
                                    v-for="item in reportUserOptions"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.name"></el-option>
                        </el-select>
                    </template>
                    <template v-else>
                        <workerLeader :single="'single'" :isDisabled="userDisable" v-model="formData.finishUserId" :placeholder="'请选择完成人员'" ></workerLeader>
                    </template>
                </el-form-item>
            </el-col>
        </div>
    </el-form>
</template>

<script>
import { formatDate } from '@/utils';
import {
    nodeReportOutsideFactoryList,
} from '@/api';
export default {
    props: {
        selectUserOptions: [],
        formModel: {},
        outSideFactory: '',
        information: [],
    },
    props:["selectUserOptions", "formModel", "outSideFactory", "information", "isWYMOrLigation", "isShow","isSubmatrixComponents"],
    /**********
     *
     * outSideFactory 默认外发厂
     * isSubmatrixComponents false代表总矩阵，true代码子矩阵
     *
     * *********/
    computed: {
        formData: {
            get() {
                return this.formModel;
            },
            set() {
                this.$emit('input', val);
            }
        },
        dateDisable() {
            const datalist = JSON.parse(sessionStorage.getItem('user_login')).permissionList;
            return datalist.indexOf('fac.mission.node.finishDate.update') === -1;
        },
        userDisable() {
            const datalist = JSON.parse(sessionStorage.getItem('user_login')).permissionList;
            return datalist.indexOf('fac.mission.node.finishBy.update') === -1;
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
    },
    watch:{
        isShow(val){
            if(val){
                this.initFinishUser();
            }
        }
    },
    data() {
        return {
            currentRules: {
                finishUserId: [
                    {
                        required: true,
                        message: '请选择完成人员！',
                        trigger: 'blur'
                    }
                ],
                outSideFactoryId: [
                    {
                        required: true,
                        message: '请选择外发厂！'
                    }
                ],
                endAt: [
                    {
                        required: true,
                        message: '请选择完成日期！'
                    }
                ],
            },
            outsideFactoryList: [], // 外发厂列表
        };
    },
    methods: {
        //初始化完成人员的值
        initFinishUser(){
            //满足nextFollowOtherFinishUserSelect条件 && 总矩阵上报
            if(this.nextFollowOtherFinishUserSelect && !this.isSubmatrixComponents){
                //完成人员默认值在下拉列表中匹配不到时，取第一个
                let arr = this.reportUserOptions.filter(item => item.id === this.formData.finishUserId);
                if(!arr.length){
                    this.formData.finishUserId = this.reportUserOptions[0].id;
                }
            }
        },
        getOutSideFactoryId(){
            //如果工单是整单外发，外发厂值为整单外发的外发厂
            if(this.information.header.missionOutSideFactoryId){
                this.formData.outSideFactoryId = this.information.header.missionOutSideFactoryId;
                return
            }
            this.formData.outSideFactoryId = this.outSideFactory ? this.outSideFactory : '';
        },
        getOutsideFactoryList(){
            let params= {
                missionNodeId: this.information.header.missionNodeId,  // 工单节点id
                userId: this.$common.userId(),        // 用户id
                unitId: this.$common.unitId(),        // 当前所在工厂id
                // keyword:""                                       // 按外发厂名称模糊搜索,暂时不实现
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
        handlePickDate(val) {
            this.formData.endAt = val;
        },
        // 初始化表单数据
        resetFields() {
            this.$refs['reportForm'] && this.$refs['reportForm'].resetFields();
            this.formData.endAt = formatDate(new Date(), 'yyyy-MM-dd');
        },
        valid() {
            return new Promise(resolve => {
                this.$refs['reportForm'].validate((valid) => {
                   if (valid) {
                       return resolve(valid);
                   }
                    resolve(false);
                });
            })
        },
    },
    created(){
        this.getOutsideFactoryList();
        this.getOutSideFactoryId();
        this.initFinishUser();
    },
}
</script>

<style lang="scss" scoped>
    .report-form{
        .report-top-form > div{
            height: 52px !important;
        }
        .form-wrap{
            overflow: hidden;
        }
        .align-right{
            text-align: right;
        }
        .dialog__form-item {
            margin: 0 0 15px 0;
        }
        .el-select{
            width: 193px;
        }
    }
</style>