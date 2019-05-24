<template>
    <div class="outsideFac-station">
        <el-form
                ref="reportForm"
                :model="formData"
                :label-width="80"
                inline>
            <div class="form-wrap">
                <el-col :span="12">
                    <el-form-item class="dialog__form-item is-required" label="发往工厂">
                        <el-select
                                v-model="formData.sendToFactoryId"
                                :disabled="information.facMissionOutsideFlag"
                                filterable
                                placeholder="请选择">
                            <el-option
                                    v-for="item in outsideFactoryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="text-align">
                    <el-form-item class="dialog__form-item" label="发往工位">
                        <workerLeader :single="'single'" v-model="formData.sendToUserId" :placeholder="'请选择完成人员'" ></workerLeader>
                    </el-form-item>
                </el-col>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {
        outsideFactoryListForSelect,
    } from '@/api';
    export default {
        props: ['formModel','information'],
        /*******************
         *
         *
         *
         *
         * ******************/
        computed: {
            formData: {
                get() {
                    return this.formModel;
                },
                set() {
                    this.$emit('input', val);
                }
            },
        },
        data() {
            return {
                outsideFactoryList: [],     //外发厂列表
            };
        },
        methods: {
            //外发厂下拉列表
            getOutsideFactoryList(){
                let params= {
                    userId: this.$common.userId(),
                    factoryId: this.$common.facId(),
                };
                outsideFactoryListForSelect(params).then(res=>{
                    if(res.data.code ===0){
                        this.outsideFactoryList = res.data.data;
                        //加一个本厂对象
                        let factory = {id: 'ourFactory', name: '本厂'};
                        this.outsideFactoryList.unshift(factory);
                    }
                })
            },
        },
        created(){
            this.getOutsideFactoryList();
        }
    }
</script>

<style lang="scss" scoped>
    .outsideFac-station{
        margin-top: 15px;
        .form-wrap{
            overflow: hidden;
        }
        .text-align{
            text-align: right;
        }
        .dialog__form-item {
            margin: 0;
        }
        .el-select{
            width: 193px;
        }
    }
</style>
