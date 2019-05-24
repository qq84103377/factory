<template>
    <div class="store">
        <div class="store-header">
            <div class="store-header_tab">
                <div :class="['tab_name', status === 1 ? 'is-active' : '']" @click="handleTab('/home/repertory')">自用仓库
                    <div :class="[ status === 1 ? 'line' : '']"></div>
                </div>
                <div :class="['tab_name', status === 2 ? 'is-active' : '']" @click="handleTab('/home/repertory/factoryStore')">加工厂仓库
                    <div :class="[ status === 2 ? 'line' : '']"></div>
                </div>
            </div>
        </div>
        <div class="store-router">
                <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
        },
        data(){
            return {
                status:1,
            }
        },
        watch:{
            '$route':function (val) {
                if(val.path==='/home/repertory/factoryStore'){
                    this.status = 2
                }else {
                    this.status = 1
                }
            }
        },
        methods:{
            // tab切换
            handleTab(path) {
                this.$router.push(path)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .store {
        .store-header {
            width:100%;
            height:40px;
            display:flex;
            justify-content: space-between;
            border-bottom:1px solid rgba(230,234,240,1);
            box-sizing: border-box;
            margin-bottom:12px;
            &_tab {
                display:flex;
                justify-content: flex-start;
                align-items: center;
                .tab_name {
                    padding: 0 16px;
                    font-size: 16px;
                    color:#A2ABB8;
                    height:24px;
                    position: relative;
                    cursor: pointer;
                    .line {
                        position: absolute;
                        width:100%;
                        height:3px;
                        background-color: rgba(255,169,20,1);
                        bottom: -10px;
                        left:50%;
                        transform: translate(-50%, -50%);
                    }
                }
                .is-active {
                    color: #3B3B3B;
                }
            }
            &_btn {
                width:102px;
                height:32px;
                background-color: rgba(255,169,20,1);
            }
        }
    }
</style>


