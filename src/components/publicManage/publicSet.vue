<!--<template>-->

  <!--<div id="standard">-->
        <!--<div class="header-standard">-->
            <!--<page-title style="margin-top:8px;margin-bottom:24px;line-height:1;height:24px;" title="规格属性库">-->
            <!--</page-title>-->
        <!--</div>-->
        <!--<div class="container-standard">-->
            <!--&lt;!&ndash; 通用属性库 &ndash;&gt;-->
            <!--<div class="common-block">-->
                <!--<content-wrap title="通用颜色库" type="big">-->
                    <!--<div slot="headRight">-->
                        <!--<nf-button svg="icon-edit1" style="width: 98px;height: 36px;padding: 0;" @click="isComponentsShow = true">编辑</nf-button>-->
                    <!--</div>-->
                    <!--<div>-->
                        <!--<item-base class="item" v-for="(item, index) in commonInfo.color" :key="index">-->
                            <!--{{item.name?item.value+'-'+item.name:item.value}}-->
                            <!--&lt;!&ndash;{{item.value}}<span v-if="item.value">-</span>{{item.name}}&ndash;&gt;-->
                        <!--</item-base>-->
                        <!--&lt;!&ndash; <span v-show="commonInfo.color.length==0" class="nothing-data">暂无数据</span> &ndash;&gt;-->
                    <!--</div>-->
				<!--</content-wrap>-->
            <!--</div>-->
            <!--&lt;!&ndash; 物料规格 &ndash;&gt;-->
            <!--<div class="common-block">-->
                <!--<content-wrap title="物料规格" type="big">-->
                    <!--<div slot="headRight">-->
                        <!--<nf-button svg="icon-edit1" style="width: 98px;height: 36px;padding: 0;" @click="materialSpecShow = true">编辑</nf-button>-->
                    <!--</div>-->
                    <!--<div>-->
                        <!--<item-base class="item" v-for="(item, index) in materialSpecList" :key="index">-->
                            <!--{{item.no}}-->
                        <!--</item-base>-->
                        <!--&lt;!&ndash; <span v-show="commonInfo.color.length==0" class="nothing-data">暂无数据</span> &ndash;&gt;-->
                    <!--</div>-->
                <!--</content-wrap>-->
            <!--</div>-->
            <!--&lt;!&ndash; 成衣货品规格 &ndash;&gt;-->
            <!--<div class="common-block">-->
                <!--<content-wrap title="dddd成衣货品规格" type="big">-->
                    <!--<div slot="headRight">-->
                        <!--<nf-button @click="goodsSpecShow=true" svg="icon-edit1" style="width: 98px;height: 36px;padding: 0;">编辑</nf-button>-->
                    <!--</div>-->
                    <!--<div class="goods-spec-block">-->
                        <!--<div class="name-block">内长</div>-->
                        <!--<item-base class="item" v-for="(item, index) in commonInfo.length" :key="index">-->
                            <!--{{item.name}}-->
                        <!--</item-base>-->
                        <!--&lt;!&ndash; <span v-if="commonInfo.length.length==0" class="nothing-data">暂无数据</span>                                                 &ndash;&gt;-->
                    <!--</div>-->
                    <!--<div class="goods-spec-block">-->
                        <!--<div class="name-block">尺码组</div>-->
                            <!--<div class="detail-block" v-for="(item, index) in sizeCategoryList" :key="index">-->
                                <!--<div class="group-name">{{ item.category}}</div>-->
                                <!--<item-base class="item" v-for="(item, index) in item.commonSkuAttrDTOList" :key="index">-->
                                    <!--{{item.name}}-->
                                <!--</item-base>-->
                            <!--</div>-->
                        <!--&lt;!&ndash; <span v-if="commonInfo.size.length==0" class="nothing-data">暂无数据</span>                         &ndash;&gt;-->
                    <!--</div>-->
				<!--</content-wrap>-->
            <!--</div>-->
            <!--&lt;!&ndash; 成衣货品属性 &ndash;&gt;-->
            <!--<div class="common-block">-->
                <!--<content-wrap title="属性库" type="big">-->
                    <!--<div slot="headRight">-->
                        <!--<nf-button  @click="goodsAttrShow = true" svg="icon-edit1" style="width: 98px;height: 36px;padding: 0;">编辑</nf-button>-->
                    <!--</div>-->
                    <!--<div class="goods-spec-block">-->
                        <!--<div class="name-block">品牌</div>-->
                        <!--<item-base class="item" v-for="(item, index) in commonInfo.brand" :key="index">-->
                            <!--{{item.value}}-->
                        <!--</item-base>-->
                        <!--<span v-if="commonInfo.brand==undefined||commonInfo.brand.length==0" class="nothing-data">无数据</span>                                                                        -->
                    <!--</div>-->
                    <!--<div class="goods-spec-block">-->
                        <!--<div class="name-block">设计师</div>-->
                        <!--<item-base class="item" v-for="(item, index) in commonInfo.designer" :key="index">-->
                            <!--{{item.value}}-->
                        <!--</item-base>-->
                        <!--<span v-if="commonInfo.designer==undefined||commonInfo.designer.length==0" class="nothing-data">无数据</span>                                                                        -->
                    <!--</div>-->
                    <!--<div class="goods-spec-block">-->
                        <!--<div class="name-block">分类</div>-->
                        <!--<item-base class="item" v-for="(item, index) in commonInfo.kind" :key="index">-->
                            <!--{{item.value}}-->
                        <!--</item-base>-->
                        <!--<span v-if="commonInfo.kind==undefined||commonInfo.kind.length==0" class="nothing-data">无数据</span>                        -->
                    <!--</div>-->
                    <!--<div class="goods-spec-block">-->
                        <!--<div class="name-block">风格</div>-->
                        <!--<item-base class="item" v-for="(item, index) in commonInfo.style" :key="index">-->
                            <!--{{item.value}}-->
                        <!--</item-base>-->
                        <!--<span v-if="commonInfo.style==undefined||commonInfo.style.length==0" class="nothing-data">无数据</span>                        -->
                    <!--</div>-->
                    <!--<div class="goods-spec-block">-->
                        <!--<div class="name-block">标签</div>-->
                        <!--<item-base class="item" v-for="(item, index) in commonInfo.tag" :key="index">-->
                            <!--{{item.value}}-->
                        <!--</item-base>-->
                        <!--<span v-if="commonInfo.tag==undefined||commonInfo.tag.length==0" class="nothing-data">无数据</span>                        -->
                    <!--</div>-->
                    <!--<div class="goods-spec-block">-->
                        <!--<div class="name-block">年份</div>-->
                        <!--<item-base class="item" v-for="(item, index) in commonInfo.year" :key="index">-->
                            <!--{{item.value}}-->
                        <!--</item-base>-->
                        <!--<span v-if="commonInfo.year==undefined||commonInfo.year.length==0" class="nothing-data">无数据</span>                        -->
                    <!--</div>-->
                    <!--<div class="goods-spec-block">-->
                        <!--<div class="name-block">季节</div>-->
                        <!--<item-base class="item" v-for="(item, index) in commonInfo.season" :key="index">-->
                            <!--{{item.value}}-->
                        <!--</item-base>-->
                        <!--<span v-if="commonInfo.season==undefined||commonInfo.season.length==0" class="nothing-data">无数据</span>                        -->
                    <!--</div>-->
                    <!--<div class="goods-spec-block">-->
                        <!--<div class="name-block">月份</div>-->
                        <!--<item-base class="item" v-for="(item, index) in commonInfo.month" :key="index">-->
                            <!--{{item.value}}-->
                        <!--</item-base>-->
                        <!--<span v-if="commonInfo.month==undefined||commonInfo.month.length==0" class="nothing-data">无数据</span>                        -->
                    <!--</div>-->
                    <!--<div class="goods-spec-block">-->
                        <!--<div class="name-block">波段</div>-->
                        <!--<item-base class="item" v-for="(item, index) in commonInfo.wave" :key="index">-->
                            <!--{{item.value}}-->
                        <!--</item-base>-->
                        <!--<span v-if="commonInfo.wave==undefined||commonInfo.wave.length==0" class="nothing-data">无数据</span>-->
                    <!--</div>-->
				<!--</content-wrap>-->
            <!--</div>            -->
        <!--</div>-->
    	<!--<transition name="right-move">-->
			<!--<editColor :h='h' :info='commonInfo.color' v-if="isComponentsShow" @hiddenWindow='addColor'></editColor>-->
		<!--</transition>-->
        <!--<transition name="right-move" v-if="commonInfoLengthEnd">-->
            <!--<goodsSpec type="common" :sizeCategoryList="sizeCategoryList" :info='commonInfo' :infoL="commonInfoLength"  :h='h' @goodsSpecShow='addGoods' v-show="goodsSpecShow"></goodsSpec>-->
		<!--</transition>-->
        <!--<transition name="right-move">-->
            <!--<goodsAttr :info='commonInfo' :h='h' @goodsAttrShow='addAttr' v-show="goodsAttrShow"></goodsAttr>-->
		<!--</transition>-->
        <!--<transition name="right-move">-->
          <!--<materialSpec :h='h' :info='materialSpecList' v-if="materialSpecShow" @hiddenWindow='addMaterialSpec'></materialSpec>-->
        <!--</transition>-->

		<!--<transition name="opcity">-->
			<!--<div class="cover" v-if="isComponentsShow" @click="addColor">-->
			<!--</div>-->
			<!--<div class="cover" v-if="goodsSpecShow" @click="addGoods">-->
			<!--</div>-->
            <!--<div class="cover" v-if="goodsAttrShow" @click="addAttr">-->
            <!--</div>-->
            <!--<div class="cover" v-if="materialSpecShow" @click="addMaterialSpec">-->
			<!--</div>-->
		<!--</transition>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--import { getFacCommonSettings,commonSizeCatagoryList,listCommonMaterialsSpecifications } from "../../api/api";-->
<!--import editColor from './child/editColor';-->
<!--import goodsSpec from './child/goodsSpec'-->
<!--import goodsAttr from './child/goodsAttr2'-->
<!--import materialSpec from './child/materialSpec'-->

<!--export default {-->
    <!--data() {-->
        <!--return {-->
            <!--commonInfo:{},-->
            <!--commonInfoLength:[],-->
            <!--commonInfoLengthEnd:false,-->
            <!--isComponentsShow:false,-->
            <!--goodsSpecShow:false,-->
            <!--goodsAttrShow:false,-->
            <!--materialSpecShow:false,-->
            <!--h:'',-->
            <!--timer:false,-->
            <!--sizeCategoryList:[],-->
            <!--materialSpecList:[],-->
        <!--}-->
    <!--},-->
    <!--components: {-->
        <!--editColor,-->
        <!--goodsSpec,-->
        <!--goodsAttr,-->
        <!--materialSpec-->
    <!--},-->
    <!--watch: {-->
            <!--h (val) {-->
                <!--if (!this.timer) {-->
                    <!--this.h = val;-->
                    <!--this.timer = true;-->
                    <!--let that = this;-->
                    <!--setTimeout( () => {-->
                        <!--// console.log(that.h);-->
                        <!--that.timer = false-->
                    <!--}, 400)-->
                <!--}-->
            <!--}-->
    <!--},-->
    <!--methods: {-->
        <!--//获取公共属性-->
        <!--async getCommonInfo() {-->
            <!--let paramsCommonMsg = {-->
                <!--type: "all",-->
                <!--userId: await(this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId),-->
                <!--token: ""-->
            <!--};-->
            <!--getFacCommonSettings(paramsCommonMsg).then(res => {-->
                <!--console.log(res);-->
                <!--this.commonInfo = res.data.data;-->
                <!--for(let k in res.data.data){-->
                    <!--if(k === 'length'){-->
                        <!--console.log(res.data.data[k]);-->
                        <!--this.commonInfoLength = res.data.data[k]-->
                        <!--// this.$set(this.commonInfoLength, res.data.data[k])-->
                        <!--console.log(this.commonInfoLength);-->
                        <!--this.commonInfoLengthEnd = true-->
                    <!--}-->
                <!--}-->

                <!--this.$set(this.commonInfo, 'color', this.commonInfo['color'])-->

                <!--// console.warn(this.commonInfo);-->
            <!--});-->
        <!--},-->
        <!--addGoods() {-->
            <!--this.goodsSpecShow = false;-->
            <!--this.getCommonInfo();-->
            <!--this.getSizeCatagoryList();-->
        <!--},-->
        <!--addAttr() {-->
            <!--this.goodsAttrShow = false;-->
            <!--this.getCommonInfo();-->
        <!--},-->
        <!--addColor() {-->
            <!--this.isComponentsShow = false;-->
            <!--this.getCommonInfo();-->
        <!--},-->
        <!--addMaterialSpec() {-->
            <!--console.warn(1111)-->
            <!--this.materialSpecShow = false;-->
            <!--this.getCommonInfo();-->
            <!--this.getMaterialSpecList();-->
        <!--},-->
        <!--// 获取尺码组列表-->
        <!--getSizeCatagoryList() {-->
            <!--let paramsCommonMsg = {-->
                <!--userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId-->
            <!--};-->
            <!--commonSizeCatagoryList(paramsCommonMsg).then(res => {-->
                <!--if(res.data.code == 0){-->
                    <!--this.sizeCategoryList = res.data.commonSizeCategoryList;-->
                    <!--console.log(this.sizeCategoryList);-->
                <!--}-->

            <!--});-->
        <!--},-->
        <!--// 获取体系层物料规格列表-->
        <!--getMaterialSpecList() {-->
            <!--let params = {-->
                <!--userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId-->
            <!--};-->
            <!--listCommonMaterialsSpecifications(params).then(res => {-->
                <!--this.materialSpecList = res.data;-->
            <!--});-->

        <!--}-->
    <!--},-->
    <!--mounted(){-->

        <!--this.getCommonInfo();-->
        <!--this.getSizeCatagoryList();-->
        <!--this.getMaterialSpecList();-->
        <!--this.h = document.documentElement.clientHeight || document.body.clientHeight;         -->
        <!--//用onresize这个方法来监听高度变化-->
        <!--window.onresize = () => {-->
            <!--return (() => {-->
                <!--this.h = document.documentElement.clientHeight || document.body.clientHeight; -->
                <!--// console.log(this.h);              -->
            <!--})()-->
        <!--}-->
    <!--},-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
    <!--#standard {-->
        <!--.common-block{-->
            <!--background-color: #fff;-->
            <!--min-height: 136px;-->
            <!--padding:32px 32px 24px 32px;-->
            <!--box-sizing: border-box;-->
            <!--margin-bottom:16px;-->
        <!--}-->
        <!--.item{-->
            <!--margin-right:12px;-->
            <!--margin-bottom:12px;-->
        <!--}-->
        <!--.name-block{-->
            <!--font-size:16px;-->
            <!--color:#a2abb8;-->
            <!--margin-bottom:8px;-->
        <!--}-->
        <!--.goods-spec-block{-->
            <!--margin-bottom:16px;-->
        <!--}-->
        <!--.nothing-data{-->
            <!--color: #c4c6cc;-->
            <!--font-size:14px;-->
        <!--}-->
    <!--}-->

<!--</style>-->
<!--<style lang="scss" scoped>-->
    <!--.right-move-enter-active,-->
    <!--.right-move-leave-active {-->
        <!--transition: all 0.3s ease;-->
        <!--transform: translateX(0);-->
    <!--}-->
    <!---->
    <!--.right-move-enter,-->
    <!--.right-move-leave-to {-->
        <!--transform: translateX(100%);-->
    <!--}-->
    <!---->
    <!--.opcity-enter-active,-->
    <!--.opcity-leave-active {-->
        <!--transition: all 0.5s ease;-->
        <!--opacity: 0.5;-->
    <!--}-->
    <!---->
    <!--.opcity-enter,-->
    <!--.opcity-leave-to {-->
        <!--opacity: 0;-->
    <!--}  -->
    <!--.cover {-->
        <!--position: fixed;-->
        <!--width: 100%;-->
        <!--height: 100%;-->
        <!--background-color: #000;-->
        <!--opacity: 0.5;-->
        <!--top: 0;-->
        <!--left: 0;-->
        <!--z-index: 100;-->
    <!--}-->
    <!--.detail-block{-->
        <!--.group-name{-->
            <!--padding:12px 0 8px;-->
        <!--}-->
    <!--}-->
<!--</style>-->
<template>
    <div class="purchase">
        <div class="purchase-header">
            <div class="purchase-header_tab">
                <div :class="['tab_name', $route.path == '/publicSet' ? 'is-active' : '']"
                     @click="handleTab('/publicSet',1)">规格库
                    <div :class="[ $route.path == '/publicSet' ? 'line' : '']"></div>
                </div>
                <div :class="['tab_name', $route.path == '/publicSet/selfField' ? 'is-active' : '']"
                     @click="handleTab('/publicSet/selfField',2)">属性库
                    <div :class="[ $route.path == '/publicSet/selfField' ? 'line' : '']"></div>
                </div>
            </div>
        </div>
        <div class="purchase">
            <keep-alive :include="keepAliveArr">
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                addtype:false
            }
        },
        methods: {
            handleTab(path) {
                this.$router.push(path)
            }
        },
        created(){
        }
    }
</script>

<style lang="scss" scoped>
    .purchase {
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
    }
</style>


