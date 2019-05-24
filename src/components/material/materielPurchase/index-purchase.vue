<template>
    <div class="scroll-content">
        <div class="header">
            <div class="purchase-header">
                <div class="purchase-header_tab">
                    <div :class="['tab_name', $route.path == '/marterielPurchase' ? 'is-active' : '']"
                         @click="handleTab('/marterielPurchase',1)">采购需求看板
                        <div :class="[ $route.path == '/marterielPurchase' ? 'line' : '']"></div>
                    </div>
                    <div :class="['tab_name', $route.path == '/purchaseList' ? 'is-active' : '']"
                         @click="handleTab('/purchaseList',2)">采购单列表
                        <div :class="[ $route.path == '/purchaseList' ? 'line' : '']"></div>
                    </div>
                </div>
                <div>
                    <nf-button v-if="purchaseSel" fsize='12' style="width: 120px;" class="purchase-header_btn" @click="goNewPurchase" type="warning">+ 一键采到送</nf-button>
                    <nf-button fsize='12' class="purchase-header_btn" @click="newPurchase" type="warning">+新建采购单</nf-button>
                    <nf-button fsize='12'  @click="$router.push('purchaseAllocation')">采购配置</nf-button>
                </div>
            </div>
        </div>
        <div class="main-content">
            <keep-alive :include="keepAliveArr">
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </div>
</template>

<script>
    import {getFinanceConfigByUserId} from '@/api/material.js'
    import {purchaseConfig} from '@/api'
    import { mapState, mapMutations, mapGetters } from "vuex";
    export default {
        data(){
            return {
                activeGo:true,
                addtype:false,
                purchaseSel:false,
            }
        },
        computed: {
            ...mapState({
                keepAliveArr: state => state.TabView.keepAliveArr
            }),
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },

        },
        activated(){
            this.purchaseConfig()
        },
        methods: {
            //判断一键采到送是否有
            purchaseConfig() {
                let params = {
                    id: this.unitId
                };
                purchaseConfig(params).then(res => {

                    let selData = res.data.data.find(item=>item.code==='pro_mission_material');
                    this.purchaseSel = selData.select
                })
            },
            handleTab(path,type) {
                if(type===1){
                      // 权限
                      if(!this.powerJudgement.permissions("fac.purchaseOrder.queryKanban")){
                          return
                      }
                }else {
                      // 权限
                      if(!this.powerJudgement.permissions("fac.purchaseOrder.queryList")){
                          return
                      }
                }
                this.$router.push(path)
            },
            goNewPurchase() {
                // 权限
                if (!this.powerJudgement.permissions("fac.purchaseOrder.add")) {
                    return
                }
                this.$router.push({path:'/newPurchase',query:{type:'pickUpDelivery'}})
            },
            newPurchase() {
                // 权限
                if (!this.powerJudgement.permissions("fac.purchaseOrder.add")) {
                    return
                }
                this.$router.push('/newPurchase')
            },
            getFinanceConfigByUserId() {
                let params = {
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                }
                getFinanceConfigByUserId(params).then(res => {
                    if (res.data.code == 0) {
                        res.data.data.forEach((v, i) => {
                            if (v == 'PURCHASE_ORDER') {
                                this.addtype = true
                                console.log(this.addtype,'采购单addtype')
                            }
                        })
                    }
                })
            },
        },
        created(){
            this.getFinanceConfigByUserId()
        }
    }
</script>

<style lang="scss" scoped>
    .purchase-header {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(230, 234, 240, 1);
        box-sizing: border-box;
        margin-bottom: 16px;
        &_tab {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .tab_name {
                padding: 0 16px;
                font-size: 16px;
                color: #A2ABB8;
                height: 24px;
                position: relative;
                cursor: pointer;
                .line {
                    position: absolute;
                    width: 100%;
                    height: 3px;
                    background-color: rgba(255, 169, 20, 1);
                    bottom: -10px;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            .is-active {
                color: #3B3B3B;
            }
        }
        &_btn {
            width: 102px;
            height: 32px;
            background-color: rgba(255, 169, 20, 1);
        }
    }
</style>
