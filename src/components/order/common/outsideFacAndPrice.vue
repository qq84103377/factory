<template>
    <div class="outsideFac-price">
        <el-form
                ref="reportForm"
                :model="formData"
                :label-width="80"
                inline>
            <el-form-item class="dialog__form-item is-required" label="外发厂">
                <el-select
                        v-model="outSideFactoryId"
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
            <el-form-item v-if="false" class="dialog__form-item" label="工价" style="margin-left: 50px">
                <el-input v-model="price"
                          type="number"
                          step="0.01"
                          placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {
        nodeReportOutsideFactoryList,
    } from '@/api';
    export default {
        props: ['formModel','information','outSideFactory'],
        /*******************
         *
         * outSideFactory :子矩阵上报完成数或调整数时，要显示对应的外发厂
         *
         *
         * ******************/
        computed: {
            formData(){
                    return this.formModel;
            },
        },
        data() {
            return {
                outsideFactoryList: [], // 外发厂列表
                outSideFactoryId:'',
                price:'',
            };
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            unitId(){
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
        },
        methods: {
            getOutSideFactoryId(){
                //如果工单是整单外发，外发厂值为整单外发的外发厂
                if(this.information.header.missionOutSideFactoryId){
                    this.outSideFactoryId = this.information.header.missionOutSideFactoryId;
                    return
                }
                if(this.outSideFactory){
                    this.outSideFactoryId = this.outSideFactory;
                }else{
                    this.outSideFactoryId = '';
                }
            },
            getOutsideFactoryList(){
                let params= {
                    missionNodeId: this.information.header.missionNodeId,  // 工单节点id
                    userId: this.userId,        // 用户id
                    unitId: this.unitId,        // 当前所在工厂id
                    // keyword:""                                       // 按外发厂名称模糊搜索,暂时不实现
                };
                nodeReportOutsideFactoryList(params).then(res=>{
                    if(res.data.code ===0){
                        this.outsideFactoryList = res.data.data;
                        //加一个本厂对象，固定id值用来标识本厂，提交时会删掉
                        let factory = {id: 'ourFactory', name: '本厂'};
                        this.outsideFactoryList.unshift(factory);
                    }
                })
            },
            getPrice(){
                //若该工单为整单外发，则取整单外发时填写的工价
                if(this.information.facMissionOutsideFlag){
                    this.price = this.information.machinigPrice;
                }
                //否则取该节点的工价
                else{
                    this.price = this.information.labourCost;
                }
            },
        },
        created(){
            this.getOutsideFactoryList();
            this.getPrice();
            this.getOutSideFactoryId();
        }
    }
</script>

<style lang="scss" scoped>
    .outsideFac-price{
        margin: 15px 0;
        .el-form-item{
            margin-bottom: 0;
        }
    }
</style>
