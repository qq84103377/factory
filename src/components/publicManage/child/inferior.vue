<template>
    <div class="goods-spec">
        <div class="goods-spec-header">
            <span>次品标签</span>
            <span class="header_right">
                <nf-button style="width: 98px;" @click="handleClick">取消</nf-button>
                <nf-button style="width: 98px;" type="warning" @click="sureGoods">确定</nf-button>
            </span>
        </div>
        <div class="goods-spec-container" :style="{'height':h-150+'px'}">
            <div class="goods-spec-block">
                <div class="text-sort">提示：拖拽标签可调整排序</div>
                <div>
                    <!-- <div class="name-block">次品标签</div> -->
                     <draggable v-model="info">
                        <transition-group>
                            <item-base class="item" v-for="(item, index) in info" :key="item.name+index">
                                {{item.name}}
                            </item-base>
                        </transition-group>
                    </draggable>
                    <span  class="container_set_specific_add" :key="1" v-clickoutside="hideSelectLength">
                        <span @click="showInferior">+ 添加</span>
                            <div class="add_specific" v-if="show.lengthShow" @keyup.enter="addLength">
                                <input type="text" :maxlength="12" v-model.trim="add.add_Length" placeholder="请输入新次品标签名称">
                                <span class="add_specific_right">
                                    <span @click="addLength">+ 添加</span>
                                </span>
                            </div>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import draggable from "vuedraggable";
import {allDefectiveLabel} from '../../../api/api'
export default {
    props:['h','info'],
    data() {
        return {
            show:{
                lengthShow:true,
            },
            add:{
                add_Length:'',
            }

        }
    },
    components: {
        draggable,
    },
    methods: {
        //点击后消失
        showInferior() {
            this.show.lengthShow = !this.show.lengthShow;
            this.add.add_Length='';
        },
        hideSelectLength() {
            this.show.lengthShow = false;
        },
        //点击取消后弹窗消失
        handleClick() {
            this.$emit('goodsSpecShow')
        },
        addLength() {
            if(this.add.add_Length=='') {
                return;
            }
            let obj = {};
            obj.value = this.add.add_Length;
            obj.name = this.add.add_Length;
            obj.id = '';
            for (let i = 0; i < this.info.length; i++) {
                if (obj.value ==  this.info[i].name) {
                    this.$message({
                        message: "已有该次品标签了",
                        duration: this.$globalConfig.elementUI.duration,
                        type: "error"
                    });
                    this.add.add_Length = "";
                    return;
                }
            }
            this.info.push(obj);
            this.add.add_Length = "";
        },
        sureGoods() {
            let params = {
                labels:this.info,
                userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            };
            allDefectiveLabel(params).then(
                res=> {
                    console.log(res);
                    this.$emit('goodsSpecShow');
                }
            )
        },
    },
}
</script>
<style lang="scss" scoped>
@import "~scss_vars";
.text-sort{
    color: #a2abb8;
    padding-bottom:16px;
}
.goods-spec {
    position: fixed;
    top: 0;
    right: 0;
    width: 850px !important;
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: #fff;
    z-index: 101;
    .goods-spec-header {
        width: 850px;
        height: 88px;
        color: #3b3b3b;
        font-size: 24px;
        padding: 16px 32px 20px 32px;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e0e6ed;
        z-index: 2;
    }
    .goods-spec-container{
        margin: 32px;
        display: flex;
        height: 100%;
        flex: 1;
        .name-block{
            font-size:16px;
            color:#3b3b3b;
            margin:8px 0;
        }
        .item{
            margin-right:12px;
            margin-bottom:12px;
        }
    }
    .container_set_specific_add {
        display: flex;
        border: 1px solid #dce0e6;
        border-radius: 2px;
        color: #808080;
        height: 32px;
        width: 80px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
    &:hover {
        background-color: #fafafa;
    }
    .add_specific {
        position: absolute;
        top: 38px;
        left: 0;
        width: 220px;
        height: 40px;
        border: 1px solid #d3dce6;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04),
        0 2px 4px 0 rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        background-color: #fff;
        input {
            width: 70%;
            height: 38px;
            text-indent: 0.4em;
            font-size: 14px;
        }
        .add_specific_right {
            border-left: 1px solid #d3dce6;
            padding-left: 8px;
        }
    }
    }
}
</style>





