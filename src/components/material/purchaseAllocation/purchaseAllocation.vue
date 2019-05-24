<template>
    <div class="purchase-allocation">
        <page-title title="物料采购配置">
            <nf-button fsize='12' class="purchase-header_btn" @click="$router.back()">返回</nf-button>
        </page-title>
        <div class="content">
            <div class="content-title"><i></i>物料采购需求来源</div>
            <div class="content-bottom" v-loading="loading">
                <div :class="['item', item.secName ? '' : 'h40']" v-for="(item, index) in formData" :key="index">
                    <div style="position: relative;">
                        <div class="mark" @click="change(item, index)"></div>
                        <el-radio :label="index" v-model="radio.purchase">{{item.name}}</el-radio>
                    </div>
                    <transition name='fade' v-if="radio.purchase==1&&item.secName">
                        <el-checkbox class="mgt10" :checked="item.plan" v-model="item.plan" @change="selected(item)">
                            {{item.secName}}
                        </el-checkbox>
                    </transition>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="content-title"><i></i>主动占用设置</div>
            <div class="content-bottom" v-loading="loading">
                <div class="item">
                    <el-radio label="0" v-model="radio.occupy">手动占用</el-radio>
                </div>
                <div class="item">
                    <el-radio label="1" v-model="radio.occupy">自动占用</el-radio>
                    <transition name='fade' v-if="radio.occupy==1">
                        <el-checkbox class="mgt10" @change="handleCheck" style="display: block;" v-model="radio.handleOccupy">
                            可手动修改主动占用的数值
                        </el-checkbox>
                    </transition>
                </div>
            </div>
        </div>
        <el-dialog class="custom-dialog tip-dialog" :visible.sync="isVisible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">{{title}}</p>
                <p class="remark">{{text}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isVisible = false">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" @click="confirm">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        purchaseConfig,
        configUpdate
    } from '../../../api/material.js'
    import {stockSkuPreuseConfig, stockSkuPreuseConfigSetting} from '@/api'

    export default {
        data() {
            return {
                purchaseIndex: '',
                radio: {purchase:'',occupy:'',handleOccupy:false},
                formData: [],
                isVisible: false,
                title: '',
                text: '',
                curRow: {},
                curIndex: 0,
                isSaving: false,
                loading: false,
                firstLoading: false
            }
        },
        computed: {
            userId() { // 用户id
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            facId() { // 工厂id
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
        },
        watch: {
          'radio.occupy'(v) {
              if(v==='0'){
                  this.radio.handleOccupy = false
              }
              this.handleCheck()
          }
        },
        methods: {
            handleCheck() {
                if(!this.firstLoading) {
                    this.firstLoading = true
                    return
                }
                let params = {
                    preuseType: this.radio.occupy==='0'?'MANUAL_PREUSE':'AUTO_PREUSE',
                    canManualModify: this.radio.handleOccupy,
                    unitId: this.unitId
                }
                stockSkuPreuseConfigSetting(params).then(res => {
                    if(res.data.code==0){
                        this.$message.success('更新成功')
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            change(row, index) {
                console.log(index)
                if(row.select)return
                this.curRow = row
                this.purchaseIndex = index
                // this.curIndex = index
                if (index == '0') {
                    if (!row.select) {
                        this.title = '确定勾选【生产工单的送料节点】？'
                        this.text = '勾选后，工单中送料节点的物料需求生成时自动显示在采购需求看板，并且后续的采购到料都根据工单的送料需求进行。'
                    } else {
                        this.title = '确定取消勾选【生产工单的送料节点】？'
                        this.text = '取消勾选后，工单中送料节点的物料需求 不会再显示在采购需求看板。'
                    }
                } else if (index == '1') {
                    if (!row.select) {
                        this.title = '确定勾选【生产订单】？'
                        this.text = '勾选后，生产订单里生成采购计划的物料需求会显示在采购需求 看板，并且后续的采购到料都根据生产订单需求进行。'
                    } else {
                        this.title = '确定取消勾选【生产订单】？'
                        this.text = '取消勾选后，生产订单里生成采购计划的物料需求 不会再显示在采购需求看板。'
                    }
                    row.plan = true
                }
                this.isVisible = true
            },
            confirm() {
                this.curRow.select = !this.curRow.select
                let params = {
                    id: this.curRow.id,
                    facConfigId: this.curRow.facConfigId,
                    plan: this.curRow.plan,
                    select: this.curRow.select
                }
                this.isSaving = true
                configUpdate(params).then(res => {
                    if (res.data.code == 0) {
                        this.radio.purchase = this.purchaseIndex
                        this.$message.success('修改成功')
                        // this.purchaseConfig()
                    }
                    this.isVisible = false
                    this.isSaving = false
                })

                // 由于物料采购需求从多选改为单选 所以需要对另外一个取消选择
                const row = this.formData[this.purchaseIndex==1?0:1]
                row.select = false
                let p = {
                    id: row.id,
                    facConfigId: row.facConfigId,
                    plan: false,
                    select: false
                }
                configUpdate(p)
            },
            selected(item) {
                let params = {
                    id: item.id,
                    facConfigId: item.facConfigId,
                    plan: item.plan,
                    select: this.radio.purchase ? true : false
                }
                configUpdate(params).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success('修改成功')
                        // this.purchaseConfig()
                    }
                })
            },
            purchaseConfig() {
                let params = {
                    id: this.facId
                }
                this.loading = true
                purchaseConfig(params).then(res => {
                    this.formData = res.data.data
                    this.radio.purchase = this.formData.findIndex(v => v.select === true)
                    this.loading = false
                    console.log(res.data)
                })
            },
            getOccupySetting() {
                stockSkuPreuseConfig({unitId:this.unitId}).then(res => {
                    if(res.data.code==0) {
                        this.radio.occupy = res.data.data.preuseType === 'MANUAL_PREUSE'?'0':'1'
                        this.radio.handleOccupy = res.data.data.canManualModify
                    }
                })
            }
        },
        created() {
            this.purchaseConfig()
            this.getOccupySetting()
        }
    }
</script>
<style lang="scss" scoped>
    .purchase-allocation {
        .content {
            background-color: #fff;
            padding: 24px;
            .content-title {
                font-size: 14px;
                i {
                    display: inline-block;
                    border: 2px solid #FFA914;
                    height: 10px;
                    vertical-align: middle;
                    margin-top: -2px;
                    margin-right: 4px;
                }
            }
            .content-bottom {
                margin-top: 16px;
                margin-right: 8px;
                display: flex;
                justify-content: flex-start;
                .item {
                    width: 320px;
                    box-sizing: border-box;
                    margin-right: 12px;
                    padding: 9px 12px;
                    border: 1px solid #E6EAF0;
                    border-radius: 2px;
                    background-color: #F7F9FC;
                    position: relative;
                    &:last-child {
                        margin-right: 0;
                    }
                    .mark {
                        display: inline-block;
                        position: absolute;
                        left: 0;
                        top: 0;
                        border: 1px solid rgb(191, 200, 217);
                        border-radius: 4px;
                        opacity: 0;
                        box-sizing: border-box;
                        width: 100%;
                        height: 100%;
                        background-color: #fff;
                        z-index: 99;
                    }
                }
                .h40 {
                    height: 40px;
                }
                .mgt10 {
                    margin-top: 10px;
                }
            }
        }
        .remark {
            margin-top: 8px;
            color: #A2ABB8;
            text-align: center;
            line-height: 18px;
        }
    }
</style>


