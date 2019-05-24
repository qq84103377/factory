<!--商品款号-商品名称（厂家货号）组件-->
<template>
    <div class="goods-select">
        <el-select
                v-model="value"
                remote
                filterable
                clearable
                placeholder="输入款号/名称/货号搜索"
                :laoding="loading"
                :multiple='multiple'
                :remote-method="getGoodsList"
                @visible-change="visibleChange"
                @change="handleChange">
            <el-option :value="''" disabled style="cursor:pointer;"  v-if="isShowAdd">
                <div class="orange" @click="addGoods">新建
                </div>
            </el-option>
            <el-option v-for="item in goodsList" :key="item.styleId" :label="item.show"
                       :value="needStyleNo?item.styleNo:item.styleId">
                <img style="float:left;width: 30px;height:30px;margin:-5px 5px 0 0;background-color:lightgray"
                     :src="item.path" v-errorLogo>
                {{item.show}}
            </el-option>
        </el-select>

    </div>
</template>

<script>
    import {
        goodsStyleSimpleList,
        commonGoodsStyleSimpleList,
    } from '@/api';

    export default {
        name: "goods-select",
        props: ['value', 'multiple','needStyleNo','isShowAdd','systemFlag','modelName'],
        /***************************
         *
         *  multiple  是否支持多选 （单选的时候返回字符串，多选返回数组）
         *  defaultSelected  默认选中的值
         *  needStyleNo  需要回传出去的是styleNo的时候，就用 needStyleNo = true
         * isShowAdd  显示新建按钮
         * systemFlag 体系层标识
         *
         * modelName 模块名称对应的值（用于权限配置）
         *      ALL	全部模块
         *      GOODS_STYLE	商品档案
         *      SPL_DESIGN_STYLE	设计档案
         *      FAC_PRD_ORDER	生产订单
         *      FACTORY_MISSION	生产工单
         *      GOODS_STOCK	商品库存
         *
         *
         * ****************************/
        data() {
            return {
                loading: false,
                styleIds:[],
                selectedItems: [], //选中的商品(包含图片、商品款号、商品名称)
                goodsList: [], //商品列表
                timer: ''
            }
        },
        methods: {
            // 获取商品
            getGoodsList(key) {
                if(key==this.value) return
                if(this.timer){
                    clearTimeout(this.timer)
                }
                if (key) {
                    let params = {
                        unitId: this.facId,
                        key: key,
                    }
                    this.loading = true
                    this.timer=setTimeout(() => {
                        this.loading = false;
                        //获取体系层商品款号
                        if(this.systemFlag){
                            commonGoodsStyleSimpleList(params).then(res => {
                                this.loading = false;
                                this.goodsList = res.data.data;
                            });
                        }
                        //获取组织层商品款号
                        else{
                            params.userId = this.userId;
                            params.modelName = this.modelName;
                            goodsStyleSimpleList(params).then(res => {
                                this.loading = false;
                                this.goodsList = res.data.data;
                            });
                        }
                    }, 500);

                } else {
                    this.goodsList = JSON.parse(JSON.stringify(this.selectedItems))
                }

            },
            handleChange(val) {
                this.$emit('input', this.value) //默认只回传商品styleId给v-model
                // 获取选中的styleId所在的item
                this.selectedItems = []
                // 单选情况下
                if(!this.multiple&&val){
                    let goodsItem = this.goodsList.find(item => item.styleId === val)
                    if(goodsItem){
                        this.selectedItems.push(goodsItem)
                    }
                }
                // 多选情况下
                else if(this.multiple&&val.length){
                    val.forEach(styleId =>{
                        let goodsItem = this.goodsList.find(item => item.styleId === styleId)
                        if(goodsItem){
                            this.selectedItems.push(goodsItem)
                        }

                    })
                }
                this.$emit('change', this.selectedItems) // 如果要拿所有选中的商品相关的信息，在change里面拿
            },
            visibleChange(visible) {
                if (visible && (this.selectedItems || this.selectedItems.length)) {
                    this.goodsList = JSON.parse(JSON.stringify(this.multiple ? this.selectedItems : [this.selectedItems]))
                }
            },
            getStyleIds(){
                let styleIds = []
                if (this.multiple) {
                    styleIds = this.selectedItems.map(item => {
                        return item.styleId
                    })
                } else {
                    styleIds = val ? val.styleId : ''
                }
                 return styleIds
            },
            addGoods(){
                this.$emit('addGoods')
            }
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        created() {
            let params = {
                unitId: this.facId,
                styleIds:Array.isArray(this.value)?this.value:[this.value]
            }
            this.loading = true
            this.timer=setTimeout(() => {
                this.loading = false;
                //获取体系层商品款号
                if(this.systemFlag){
                    commonGoodsStyleSimpleList(params).then(res => {
                        this.loading = false;
                        this.selectedItems = JSON.parse(JSON.stringify(res.data.data));
                        this.goodsList = JSON.parse(JSON.stringify(res.data.data))
                    });
                }
                //获取组织层商品款号
                else{
                    params.userId = this.userId;
                    params.modelName = this.modelName;
                    goodsStyleSimpleList(params).then(res => {
                        this.loading = false;
                        this.selectedItems = JSON.parse(JSON.stringify(res.data.data));
                        this.goodsList = JSON.parse(JSON.stringify(res.data.data))
                    });
                }
            }, 500);
        },
    }
</script>

<style lang="scss" scoped>
</style>
