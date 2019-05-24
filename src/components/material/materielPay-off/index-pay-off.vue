<template>
    <div class="pay-off-index scroll-content">
        <div class="custom-tab-bar pdlr24">
            <div class="bar-list" style="min-width:212px; ">
                <div @click="handleTab('/marterielPayoff')" :class="['item',$route.path == '/marterielPayoff'?'active':'']">待送料看板</div>
                <div @click="handleTab('/marterielNotifyPayoffList')" :class="['item',$route.path == '/marterielNotifyPayoffList'?'active':'']">送料通知单列表</div>
                <div @click="handleTab('/marterielPayoffList')" :class="['item',$route.path == '/marterielPayoffList'?'active':'']">送料单列表</div>
            </div>
        </div>
        <div class="main-content">
            <keep-alive :include="keepAliveArr">
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <!--<router-view v-if="!$route.meta.keepAlive"></router-view>-->
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapGetters } from "vuex";
    export default {
        computed: {
            ...mapState({
                keepAliveArr: state => state.TabView.keepAliveArr
            }),

        },
        data(){
            return {
                status:1
            }
        },
        watch:{
            '$route':function (val) {
                if(val.path==='/marterielPayoff'){
                    this.status = 1
                }else if(val.fullPath ==='/marterielPayoffList?status=3'){
                    this.status = 3
                }else {
                    this.status = 2
                }
            }
        },
        methods:{
            // tab切换
            handleTab(path) {
                // 待送料看板权限
                if(!this.powerJudgement.permissions("fac.deliveryOrder.queryKanban")&& path ==='/marterielPayoff'){
                    return
                }
                // 送礼列表权限
                if(!this.powerJudgement.permissions("fac.deliveryOrder.queryList")&&path ==='/marterielPayoffList'){
                    return
                }
                // belongModule  0:送料单  1：样料送料单 2：样料通知单
                path ==='/marterielPayoff'?
                    this.$router.push(path):
                    this.$router.push({path,query:{belongModule:path ==='/marterielPayoffList'?0:2}})

            }
        }
    }
</script>

<style lang="scss" scoped>
    .pay-off-index {
        position: relative;
        min-width: 1165px;
       .custom-tab-bar{
           background: #fff;
       }
    }
</style>

