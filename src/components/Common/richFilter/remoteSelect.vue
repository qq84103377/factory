<template>
    <div class="remote-select">
        <!--下拉框类型-->
        <el-select
                v-model="selected"
                @change="change"
                clearable
                filterable
                :remote="true"
                :remote-method="remoteMethod"
                :multiple="filterItem.item.type == 'MULTI_SELECT'"
                placeholder="全部">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>
<script>
    import {
        commonFilterRemoteSearch,
    } from '@/api'

    export default {
        props: ['value','filterItem','filterIndex','modelName'],
        data() {
            return {
                selected:[], //选中的值
                options:[],// 下拉选项列表
            }
        },
        watch: {
            value(val){
                if(!val.length&&this.selected.length){
                    this.selected = []
                }
            }
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
        },
        methods: {
            //选中的值改变时
            change(val){
                this.$emit('input',val)
            },
            //远程搜索
            remoteMethod(value){
                if(value){
                    let params = {
                        unitId:this.unitId,
                        key:value,
                        userId:this.userId,
                        modelName:this.modelName,
                        remoteFilterType:this.filterItem.item.remoteFilterType
                    }
                    commonFilterRemoteSearch(params).then(res =>{
                        // 将选中的option和搜索到的合并到一起
                        let selectedOptions = []
                        this.options.forEach(item => {
                            if(this.selected.includes(item.value)){
                                selectedOptions.push(item)
                            }
                        })
                        this.options = [...selectedOptions,...res.data.data]
                    })

                }
            },
        },
        created() {
        }
    }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">

</style>
