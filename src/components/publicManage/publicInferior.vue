<template>
  <div id="standard">
        <div class="header-standard">
            <page-title style="margin-top:8px;margin-bottom:24px;line-height:1;height:24px;" title="次品标签管理">
            </page-title>
        </div>
        <div class="container-standard">
            <!-- 成衣货品规格 -->
            <div class="common-block">
                <content-wrap title="次品标签" type="big">
                    <div slot="headRight">
                        <nf-button @click="goodsSpecShow=true" svg="icon-edit1" style="width: 98px;height: 36px;padding: 0;">编辑</nf-button>
                    </div>
                    <div class="goods-spec-block">
                        <item-base class="item" v-for="(item, index) in commonInfo" :key="index">
                            {{item.name}}
                        </item-base>
                    </div>
				</content-wrap>
            </div>
        </div>
        <transition name="right-move">
            <inferior :info='commonInfo' :h='h' @goodsSpecShow='addGoods' v-show="goodsSpecShow"></inferior>
		</transition>
		<transition name="opcity">
			<div class="cover" v-if="goodsSpecShow" @click="goodsSpecShow = false">
			</div>
		</transition>
  </div>
</template>

<script>
import { queryAllDefectiveLabel } from "../../api/api";
import inferior from './child/inferior.vue'
export default {
    data() {
        return {
            commonInfo:{},
            goodsSpecShow:false,
            h:'',
            timer:false,
        }
    },
    components: {
        inferior,
    },
    watch: {
            h (val) {
                if (!this.timer) {
                    this.h = val;
                    this.timer = true;
                    let that = this;
                    setTimeout( () => {
                        // console.log(that.h);
                        that.timer = false
                    }, 400)
                }
            }
    },
    methods: {
        //获取公共属性
        async getCommonInfo() {  
            let paramsCommonMsg = {
                keyword: "",
                userId: await(this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId),
            };
            queryAllDefectiveLabel(paramsCommonMsg).then(res => {
                console.log(res);
                this.commonInfo = res.data.data;            
            });
        },
        addGoods() {
            this.goodsSpecShow = false;
            this.getCommonInfo();
        },
    },
    mounted(){
        this.getCommonInfo();
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
</style>

