<template>
  <div id="standard">
        <div class="container-standard">
            <!-- 通用属性库 -->
            <div class="common-block">
                <content-wrap title="通用颜色库" type="big">
                    <div slot="headRight">
                        <nf-button svg="icon-edit1" style="width: 98px;height: 36px;padding: 0;" @click="isComponentsShow = true">编辑</nf-button>
                    </div>
                    <div>
                        <div class="colorArr" v-for="(item, index) in commonInfo.color" :key="index" style="display: flex">
                            <span style="min-width: 100px;display: inline-block">{{item.category}}：</span>
                            <div>
                                <item-base class="item" v-for="($item, $index) in item.colorList" :key="$index">
                                    {{$item.name?$item.value+'-'+$item.name:$item.value}}
                                </item-base>
                            </div>
                        </div>
                    </div>
				</content-wrap>
            </div>
            <!-- 物料规格 -->
            <div class="common-block">
                <content-wrap title="物料规格" type="big">
                    <div slot="headRight">
                        <nf-button svg="icon-edit1" style="width: 98px;height: 36px;padding: 0;" @click="materialSpecShow = true">编辑</nf-button>
                    </div>
                    <div>
                        <item-base class="item" v-for="(item, index) in orgMaterialSpecList" :key="index">
                            {{item.no}}
                        </item-base>
                    </div>
                </content-wrap>
            </div>
            <!-- 成衣货品规格 -->
            <div class="common-block">
                <content-wrap title="成衣货品规格" type="big">
                    <div slot="headRight">
                        <nf-button @click="goodsSpecShow=true" svg="icon-edit1" style="width: 98px;height: 36px;padding: 0;">编辑</nf-button>
                    </div>
                    <div class="goods-spec-block">
                        <div class="name-block">内长</div>
                        <item-base class="item" v-for="(item, index) in commonInfo.length" :key="index">
                            {{item.name}}
                        </item-base>                                               -->
                    </div>
                    <div class="goods-spec-block" >
                        <div class="name-block">尺码组</div>
                        <div class="detail-block" v-for="(item,index) in orgSizeCatagoryList">
                            <div class="group-name">
                                    {{item.category}}
                            </div>
                            <item-base class="item" v-for="(item, index) in item.commonSkuAttrDTOList" :key="index">
                                {{item.name}}
                            </item-base>
                        </div>
                    </div>
				</content-wrap>
            </div>
            <!--号型-->
            <div class="common-block">
                <content-wrap title="号型" type="big">
                    <div slot="headRight">
                        <nf-button svg="icon-edit1" style="width: 98px;height: 36px;padding: 0;" @click="sizeTypeCategoryShow = true">编辑</nf-button>
                    </div>
                    <div>
                        <item-base class="item" v-for="(item, index) in sizeTypeCategoryListData" :key="index">
                            {{item.sizeTypeCategory}}
                        </item-base>
                    </div>
                </content-wrap>
            </div>
        </div>
    	<transition name="right-move">
			<editColor :h='h' :info='commonInfo.color' v-if="isComponentsShow"  @hiddenWindow='addColor'></editColor>
		</transition>
        <transition name="right-move">
            <!--<goodsSpec :info='commonInfo' :h='h'@goodsSpecShow='addGoods' v-if="goodsSpecShow"></goodsSpec>-->
            <goodsSpec typeof="org" :sizeCategoryList="orgSizeCatagoryList" :infoL="commonInfoLength" :info='commonInfo' :h='h' @goodsSpecShow='addGoods' v-if="goodsSpecShow"></goodsSpec>
		</transition>
        <transition name="right-move">
            <goodsAttr :info='commonInfoAttr' :h='h' @goodsAttrShow='addAttr' v-if="goodsAttrShow"></goodsAttr>
		</transition>
        <transition name="right-move">
          <materialSpec :info='orgMaterialSpecList' v-if="materialSpecShow" @hiddenWindow='addMaterialSpec'></materialSpec>
        </transition>
        <transition name="right-move">
          <sizeTypeCategory :h='h' :info='sizeTypeCategoryListData' v-if="sizeTypeCategoryShow" @hiddenWindow='sizeTypeCategoryHide'></sizeTypeCategory>
        </transition>
		<transition name="opcity">
			<div style="z-index:10;" class="cover" v-if="isComponentsShow" @click="addColor">
			</div>
			<div style="z-index:10;" class="cover" v-if="goodsSpecShow" @click="addGoods">
			</div>
			<div style="z-index:10;" class="cover" v-if="goodsAttrShow" @click="addAttr">
			</div>
            <div style="z-index:10;" class="cover" v-if="materialSpecShow" @click="addMaterialSpec">
            </div>
            <div style="z-index:10;" class="cover" v-if="sizeTypeCategoryShow" @click="sizeTypeCategoryHide">
            </div>
		</transition>
  </div>
</template>

<script>
import {updateOrgStatus,commonSizeCatagoryList,listCommonMaterialsSpecifications,getFacCommonSettings, getFacCommonAttrs,sizeTypeCategoryList} from "../../api/api";
// import editColor from './child/editColor';
import editColor from '@/components/publicManage/child/editColor'
import goodsSpec from '@/components/publicManage/child/goodsSpec'
import goodsAttr from '@/components/publicManage/child/goodsAttr2'
import materialSpec from '@/components/publicManage/child/materialSpec';
import sizeTypeCategory from '@/components/publicManage/child/sizeTypeCategory';

export default {
    data() {
        return {
            commonInfo:{},
            commonInfoAttr:{},
            isComponentsShow:false,
            goodsSpecShow:false,
            goodsAttrShow:false,
            materialSpecShow:false,
            h:'',
            timer:false,
            sizeTypeCategoryShow:false,
            commonInfoLength:[],
            sizeTypeCategoryListData:[],
            orgSizeCatagoryList:[],
            orgMaterialSpecList:[]
        }
    },
    computed:{
        userId(){
            return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
        },
        unitId() {
            return JSON.parse(sessionStorage.getItem("user_login")).unitId;
        }
    },
    components: {
        editColor,
        goodsSpec,
        goodsAttr,
        sizeTypeCategory,
        materialSpec
    },
    watch: {
            h (val) {
                if (!this.timer) {
                    this.h = val;
                    this.timer = true;
                    let that = this;
                    setTimeout( () => {
                        that.timer = false
                    }, 400)
                }
            }
    },
    created(){
        this.sizeTypeCategoryList()
    },
    methods: {
        sizeTypeCategoryList(){
            sizeTypeCategoryList({unitId:this.unitId}).then(res=>{
                this.sizeTypeCategoryListData = res.data.data

            })
        },
        //获取组织属性
        getCommonInfo() {
            let paramsCommonMsg = {
                type: "all",
                userId: this.userId,

            };
            getFacCommonSettings(paramsCommonMsg).then(res => {
                this.commonInfo = res.data.data;
                for(let k in res.data.data){
                    if(k === 'length'){
                        this.commonInfoLength = res.data.data[k]
                    }
                }
            });
        },
        //获取组织十种属性
        getCommonInfoAttr() {
            let paramsCommonMsg = {
                type: "all",
                userId: this.userId,

            };
            getFacCommonAttrs(paramsCommonMsg).then(res => {
                this.commonInfoAttr = res.data.data;
                // for(let k in res.data.data){
                //     if(k === 'length'){
                //         this.commonInfoLength = res.data.data[k]
                //     }
                // }
                this.$set(this.commonInfoAttr, 'color', this.commonInfoAttr['color'])
            });
        },
        addGoods() {
            this.goodsSpecShow = false;
            this.getCommonInfo();
            this.getOrgSizeCatagoryList()

        },
        addAttr() {
            this.goodsAttrShow = false;
            this.getCommonInfo();
        },
        addColor() {
            this.isComponentsShow = false;
            this.getCommonInfo();
        },
        addMaterialSpec() {
            this.materialSpecShow = false;
            this.getCommonInfo();
            this.getOrgMaterialSpecList();
        },
        sizeTypeCategoryHide(){
            this.sizeTypeCategoryShow = false;
            this.sizeTypeCategoryList()
        },
        // 获取组织层尺码组信息
        getOrgSizeCatagoryList() {
            // let params = {
            //     userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
            //     facId: JSON.parse(sessionStorage.getItem('last_login')).id
            // };
            // orgSizeCatagoryList(params).then(res => {
            //     console.warn('组织尺码组列表')
            //     console.log(res)
            //     if(res.data.code == 0){
            //         this.orgSizeCatagoryList = res.data.commonSizeCategoryList;
            //
            //     }
            //
            // });
            let paramsCommonMsg = {
                userId: this.userId
            };
            commonSizeCatagoryList(paramsCommonMsg).then(res => {
                if(res.data.code == 0){
                    this.orgSizeCatagoryList = res.data.commonSizeCategoryList;
                }

            });
        },
        updateSizeCatagoryStatus(index) {

            let params={
                userId: this.userId,
                unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                commonCategoryId:this.orgSizeCatagoryList[index].categoryId,
                status: this.orgSizeCatagoryList[index].status==1?0:1
            }
            updateOrgStatus(params).then(res => {
                if(res.data.code == 0){
                    this.orgSizeCatagoryList[index].status==1?
                        this.orgSizeCatagoryList[index].status=0:this.orgSizeCatagoryList[index].status=1
                }

            });


        },
        // 获取组织层物料规格列表
        getOrgMaterialSpecList() {
            // let params = {
            //     unitId: JSON.parse(sessionStorage.getItem("last_login")).id
            // };
            // listOrgMaterialsSpecifications(params).then(res => {
            //     console.log(11111)
            //     console.log(res.data)
            //     this.orgMaterialSpecList = res.data;
            // });
            let params = {
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            };
            listCommonMaterialsSpecifications(params).then(res => {
                this.orgMaterialSpecList = res.data;
            });
        }
    },
    mounted(){
        this.getCommonInfo();
        this.getCommonInfoAttr();
        // this.getSizeCatagoryList();
        this.getOrgSizeCatagoryList();
        this.getOrgMaterialSpecList();
        this.h = document.documentElement.clientHeight || document.body.clientHeight;
        //用onresize这个方法来监听高度变化
        window.onresize = () => {
            return (() => {
                this.h = document.documentElement.clientHeight || document.body.clientHeight;
                // console.log(this.h);
            })()
        }
    },
}
</script>

<style lang="scss" scoped>
    #standard {
        .common-block{
            background-color: #fff;
            min-height: 136px;
            padding:32px 32px 24px 32px;
            box-sizing: border-box;
            margin-bottom:16px;
        }
        .item{
            margin-right:12px;
            margin-bottom:12px;
        }
        .name-block{
            font-size:16px;
            color:#a2abb8;
            margin-bottom:8px;
        }
        .goods-spec-block{
            margin-bottom:16px;
        }
        .nothing-data{
            color: #c4c6cc;
            font-size:14px;
        }
    }

</style>
<style lang="scss">
    .right-move-enter-active,
    .right-move-leave-active {
        transition: all 0.3s ease;
        transform: translateX(0);
    }

    .right-move-enter,
    .right-move-leave-to {
        transform: translateX(100%);
    }

    .opcity-enter-active,
    .opcity-leave-active {
        transition: all 0.5s ease;
        opacity: 0.5;
    }

    .opcity-enter,
    .opcity-leave-to {
        opacity: 0;
    }
    .cover {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        top: 0;
        left: 0;
        z-index: 100;
    }
    .detail-block{
        .group-name{
            padding:12px 0 8px;
        }
    }
</style>

