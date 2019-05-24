<template>
    <div class="slide-filter">
        <el-input class="fs12" :placeholder="placeholder" @focus="filterFormVisible = true" icon="caret-bottom"></el-input>
        <!-- 右侧弹窗 -->
        <transition name="right-move">
            <!-- 属性右侧滑窗 -->
            <div v-show="filterFormVisible" class="slide-filter-form" :style="{'width':width}">
                <div class="filter-header">
                    <div class="title">筛选器</div>
                    <div>
                        <nf-button @click="cancel" class="mgl8" fsize='12' >取消</nf-button>
                        <nf-button @click="reset" class="mgl8" fsize='12' >重置</nf-button>
                        <nf-button @click="filter" class=" green-btn mgl8" fsize='12' >筛选</nf-button>
                    </div>
                </div>
                <div class="filter-body">
                    <slot></slot>
                </div>
            </div>
        </transition>
        <transition name="opcity">
            <div style="z-index: 999" v-show="filterFormVisible" class="cover" @click="cancel"></div>
        </transition>
    </div>
</template>
<script>
    import {formatDate} from "@/utils";

    export default {
        // props:['placeholder'],
        props:{
            placeholder: {
                type: '',
            },
            width: {
                type: '',
                default: '660px'
            },
        },
        data() {
            return {
                filterFormVisible: false,
                // backupFilterForm:{}
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
        watch: {
            // filterFormVisible(val){
            //     if(val){
            //         this.backupFilterForm = JSON.parse(JSON.stringify(this.value))
            //     }
            // }
        },
        methods: {
            // 重置
            reset() {
                this.$emit('reset')
                this.filterFormVisible = false
            },
            // 取消
            cancel() {
                this.$emit('cancel')
                this.filterFormVisible = false
                // this.$emit('input',JSON.parse(JSON.stringify(this.backupFilterForm)))
            },
            // 确定筛选
            filter() {
                this.$emit('filter')
                this.filterFormVisible = false
            },


        },
        created() {
        }
    }
</script>
<style lang="scss" scoped>
    .slide-filter {
        display: inline-block;
        .green-btn{
            color:#fff;
            background-color: #54D1BC;
            border:1px solid #54D1BC;
        }
        .slide-filter-form {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            right: 0;
            width: 660px;
            height: 100%;
            background-color: #fff;
            z-index: 1000;
            .filter-header{
                display: flex;
                justify-content: space-between;
                padding: 16px 24px 8px 24px;
                border-bottom: 1px solid  #e6eaf0;
                .title{
                    font-size: 16px;
                }
            }
            .filter-body{
                flex: 1;
                overflow-y: auto;
                padding: 24px;
            }
        }
    }
</style>
<style lang="scss">
    .slide-filter {
        .filter-body>.el-form>.el-row>.el-col>.el-form-item{
            margin-right: 0;
            display: flex;
            margin-bottom: 12px;
            &>.el-form-item__label{
                font-size: 12px;
            }
            &>.el-form-item__content{
                flex: 1;
                .el-select,
                .el-input{
                    font-size: 12px;
                    width: 100%;
                }
            }
        }
        /*.el-form--inline .el-form-item{*/
            /*display: flex;*/
            /*margin-bottom: 12px;*/
            /*&>.el-form-item__label{*/
                /*font-size: 12px;*/
            /*}*/
            /*&>.el-form-item__content{*/
                /*flex: 1;*/
                /*.el-select,*/
                /*.el-input{*/
                    /*font-size: 12px;*/
                    /*width: 100%;*/
                /*}*/
            /*}*/
        /*}*/

    }

</style>
