<template>
    <div class="design-style-no-select">
        <el-select
                style="width: 100%"
                v-model="designStyleNos"
                remote
                reserve-keyword
                filterable
                :multiple ='multiple'
                :remote-method="getDesignStyleList"
                clearable
                placeholder="请选择或搜索"
                @change="change"
                >
            <el-option v-for="item in designStyleList" :key="item.id" :label="item.name"
                       :value="item.name">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import { getDesignStyleList } from '@/api/sample-centre';
    export default {
        name: "design-style-no-select",
        props:['value','multiple'],
        data() {
            return {
                designStyleNos:[],
                designStyleList:[], //设计款号列表
            }
        },
        watch: {
            value (v) {
                this.designStyleNos = v
            }
        },
        components:{
        },
        methods:{
            // 获取设计款号
            getDesignStyleList(key) {
                getDesignStyleList({
                    unitId: this.facId,
                    key: key
                }).then(res => {
                    this.designStyleList = res.data.data;
                });
            },
            change(val){
                this.$emit('input',val)
                this.$emit('change',val)

            },
            reset(){
                this.designStyleNos = [];
            }
        },
        computed:{
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
        },
    }
</script>

<style lang="scss">

</style>
