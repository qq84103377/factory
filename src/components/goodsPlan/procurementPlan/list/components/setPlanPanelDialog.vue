<!--"企划看板配置"组件-->
<template>
    <div class="set-plan-panel-dialog">
        <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" class="custom-dialog " title="企划工作看板配置"
                   :visible.sync="visible" size="small" @close="cancel">
            <div class="text-center">
                <el-checkbox v-model="item.isConfig" v-for="item in otbBackConfigList" :key="item.configId">{{item.configName}}</el-checkbox>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getUnitUser } from '@/api';
    import {getOtbBackConfigList,updateOtbBackConfig} from '@/api/goodsPlan.js'

    export default {
        props: ['visible'],
        components: {
        },
        data() {
            return {
                otbBackConfigList:[]
            }
        },
        created() {
            this.getOtbBackConfigList()
        },
        watch: {

        },
        computed: {
            unitId() {
                return  JSON.parse(sessionStorage.getItem('user_login')).unitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
        },
        methods: {
            // 获取组织企划回流配置
            getOtbBackConfigList(){
                let params ={
                    unitId:this.unitId,
                    userId:this.userId
                }
                getOtbBackConfigList(params).then(res =>{
                    if(res.data.code == 0){
                        this.otbBackConfigList = res.data.data
                    }
                })
            },
            cancel(){
                this.$emit('update:visible',false)
            },
            confirm(){
                let params = {
                    configs:this.otbBackConfigList
                }
                updateOtbBackConfig(params).then(res =>{
                    this.$emit('update:visible',false)
                    if(res.data.code == 0){
                        this.$message.success('配置成功')
                    } else{
                        this.$message.error(res.data.msg)
                    }
                })
            },

        }
    }
</script>

<style lang="scss">
    .set-plan-panel-dialog {
        .el-dialog--small {
            width: 360px;
        }
    }

</style>


<style lang="scss" scoped>
    .set-plan-panel-dialog {
    }

</style>
