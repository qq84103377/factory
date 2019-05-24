<template>
    <div class="bill-filter custom-filter-form">
        <el-form :model="filterData" status-icon ref="ruleForm2" label-width="90px" style="margin-left: -30px">
            <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="单据">
                        <el-input v-model="filterData.billNo" placeholder="搜索单据号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="完成日期">
                        <el-date-picker
                                v-model="businessDataList"
                                @change="changeCreateDate"
                                type="daterange"
                                placeholder="选择日期范围"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="完成人员">
                        <el-select
                                v-model="filterData.chargerId"
                                placeholder="请搜索"
                                clearable
                                filterable
                                remote
                                :remote-method="workRemoteMethod">
                            <el-option
                                    v-for="item in purchaserList"
                                    :key="item.id"
                                    :label="item.userName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <template>
                        <div class="btn-group">
                            <el-button class="btn btn-reset" @click="reset">重置</el-button>
                            <el-button class="btn btn-submit" @click="submit">筛选</el-button>
                        </div>
                    </template>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    import {
        billReportNodeList,
        billReportBillType,
        billReportBillList,
        billReportBillStatus,
        workbays,
    } from "@/api";
    export default {
        name:'billFilter',
        props:[],
        /*******************
         *
         *
         *
         * **********************/
        data() {
            return {
                filterData: {
                    billNo: "",       //单据名
                    chargerId: "",    //完成人员ID
                    dateStart: "",    //开始时间
                    dateEnd: "",      //结束时间
                },
                businessDataList: [],   //时间
                purchaserList:[],       //完成人员列表
            }
        },
        methods:{
            //工位搜索
            workRemoteMethod(query) {
                if(this.timer){
                    clearTimeout(this.timer)
                }
                this.timer = setTimeout(() => {
                    let params = {
                        facId: this.$common.facId(),
                        groupIds: ['ALL'],
                        keyword: query,
                    };
                    workbays(params).then(res => {
                        if(res.data.code === 0){
                            this.purchaserList = res.data.data;
                            let factory = {id: 'ALL', userName: '全部'};
                            this.purchaserList.unshift(factory);
                        }else{
                            this.purchaserList = [];
                            this.$message.error(res.data.msg)
                        }
                    })
                }, 300);
            },

            // 业务时间处理
            changeCreateDate(filterDate) {
                let operateDataList = filterDate.split("至");
                //返回开始时间、结束时间
                if (operateDataList.length) {
                    this.filterData.dateStart = operateDataList[0];
                    this.filterData.dateEnd = operateDataList[1];
                }
            },

            reset() {
                this.filterData.billNo = '';
                this.filterData.dateStart = '';
                this.filterData.dateEnd = '';
                this.filterData.chargerId = '';
                this.businessDataList = [];
            },
            submit() {
                this.$emit('filter',this.filterData);
            },
        },
        created() {
            this.workRemoteMethod('');
        }
    }
</script>

<style lang="scss" scoped>
    .bill-filter{
        background-color: #fff;
    }
</style>


