<template>
    <div class="goods-spec">
        <div class="goods-spec-header">
            <span>成衣货品规格</span>
            <span class="header_right">
                <nf-button style="width: 98px;" @click="handleClick">取消</nf-button>
                <nf-button style="width: 98px;" type="warning" @click="sureGoods">确定</nf-button>
            </span>
        </div>
        <div class="goods-spec-container" :style="{'height':h-150+'px'}">
            <div class="goods-spec-block">
                <div class="text-sort">提示：拖拽标签可调整排序</div>
                <div>
                    <div class="name-block">尺码</div>
                    <draggable v-model="info.size">
                        <transition-group>
                            <item-base class="item" v-for="(item, index) in info.size" :key="item.value+index">
                                {{item.value}} <div style="display:inline-flex;" @click="delSize(index)"><icon style="width:8px;height:8px;padding-left:4px;cursor:pointer;" type="icon-label-del"></icon></div>
                            </item-base>
                        </transition-group>
                    </draggable>
                    <span  class="container_set_specific_add" :key="1" v-clickoutside="hideSelectSize">
                        <span @click="addSizeShow">+ 添加</span>
                        <div class="add_specific" v-if="show.sizeShow" @keyup.enter="addSize()">
                            <input type="text" @input="searchSize('size',add.add_Size)" :maxlength="12" v-model.trim="add.add_Size" placeholder="请输入新尺码名称">
                            <span :class="{'add_specific_right':add.add_Size.length>0}">
                                <span><i class="el-icon-search"></i></span>
                            </span>
                            <div class="search">
                                <div class="new" @click="addSize()" style="color:#ffa914;">+新建尺码</div>
                                <ul v-if="searchData.length>0">
                                    <li @click="addSearchSize(sindex)" v-for="(sitem,sindex) in searchData" :key="sindex" class="li">{{sitem.name}}</li>
                                </ul>
                            </div>
                        </div>
                    </span>
                </div>
                <div>
                    <div class="name-block">内长</div>
                     <draggable v-model="info.length">
                        <transition-group>
                            <item-base class="item" v-for="(item, index) in info.length" :key="item.value+index">
                                {{item.value}}<span @click="delLength(index)"><icon style="width:8px;height:8px;padding-left:4px;" type="icon-label-del"></icon></span>
                            </item-base>
                        </transition-group>
                    </draggable>
                    <span  class="container_set_specific_add" :key="1" v-clickoutside="hideSelectLength">
                        <span @click="addLengthShow">+ 添加</span>
                        <div class="add_specific" v-if="show.lengthShow" @keyup.enter="addLength">
                            <input type="text" @input="searchLength('length',add.add_Length)" :maxlength="12" v-model.trim="add.add_Length" placeholder="请输入新内长名称">
                            <span :class="{'add_specific_right':add.add_Length.length>0}">
                                <span><i class="el-icon-search"></i></span>
                            </span>
                            <div class="search">
                                <div class="new" @click="addLength()" style="color:#ffa914;">+新建内长</div>
                                <ul v-if="searchData.length>0">
                                    <li  @click="addSearchLength(sindex)" v-for="(sitem,sindex) in searchData" :key="sindex" class="li">{{sitem.name}}</li>
                                </ul>
                            </div>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import draggable from "vuedraggable";
import {updateUnitSettings,selectDifSettings,judgeDeleteUnitSettings} from '../../../api/api'
export default {
    props:['h','info'],
    data() {
        return {
            show:{
                sizeShow:false,
                lengthShow:false,
            },
            add:{
                add_Size:'',
                add_Length:'',
            },
            searchData:[]

        }
    },
    components: {
        draggable,
    },
    methods: {
        //控制显示隐藏
        addLengthShow() {
            this.show.lengthShow = !this.show.lengthShow;
            this.searchData = [];
            this.add.add_Length = '';
        },
        addSizeShow() {
            this.show.sizeShow = !this.show.sizeShow;
            this.searchData = [];
            this.add.add_Size = '';
        },
        //删除单个
        delLength(index) {
            if(this.info.length[index].id == '') {
                this.info.length.splice(index,1);
            } else {
                let params = {
                    id:this.info.length[index].id,
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    type:'length'
                }
                judgeDeleteUnitSettings(params).then(
                    res => {
                        console.log(res);
                        if(res.data.code == 0) {
                            this.info.length.splice(index,1);
                        }else {
                            this.$message.error(res.data.msg);
                        }
                    }
                )
            }
        },
        delSize(index) {
            if(this.info.size[index].id == '') {
                this.info.size.splice(index,1);
            } else {
                let params = {
                    id:this.info.size[index].id,
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    type:'size'
                }
                judgeDeleteUnitSettings(params).then(
                    res => {
                        console.log(res);
                        if(res.data.code == 0) {
                            this.info.size.splice(index,1);
                        }else {
                            this.$message.error(res.data.msg);
                        }
                    }
                )
            }
        },
        //点击后消失
        hideSelectSize() {
            this.show.sizeShow = false;
        },
        hideSelectLength() {
            this.show.lengthShow = false;
        },
        //点击取消后弹窗消失
        handleClick() {
            this.$emit('goodsSpecShow')
        },
        //添加搜索到的
        addSearchSize(index) {
            for (let i = 0; i < this.info.size.length; i++) {
                if (this.searchData[index].name ==  this.info.size[i].value) {
                    this.$message.error("已有该尺码了");
                    this.add.add_Size = "";
                    return;
                }
            }
            this.info.size.push({
                    value:this.searchData[index].name,
                    name:this.searchData[index].name,
                    id:'',
            });
            this.add.add_Size = "";
        },
        addSearchLength(index) {
            for (let i = 0; i < this.info.length.length; i++) {
                if (this.searchData[index].name ==  this.info.length[i].value) {
                    this.$message.error("已有该内长了");
                    this.add.add_Length = "";
                    return;
                }
            }
            this.info.length.push({
                    value:this.searchData[index].name,
                    name:this.searchData[index].name,
                    id:'',
            });
            this.add.add_Length = "";
        },
        //原有的添加
        addSize() {
            if(this.add.add_Size=='') {
                return;
            }
            let obj = {};
            obj.value = this.add.add_Size;
            obj.name = this.add.add_Size;
            obj.id = '';
            for (let i = 0; i < this.info.size.length; i++) {
                if (obj.value ==  this.info.size[i].value) {
                    this.$message.error("已有该尺码了");
                    this.add.add_Size = "";
                    return;
                }
            }
            this.info.size.push(obj);
            this.add.add_Size = "";
        },
        addLength() {
            if(this.add.add_Length=='') {
                return;
            }
            let obj = {};
            obj.value = this.add.add_Length;
            obj.name = this.add.add_Length;
            obj.id = '';
            for (let i = 0; i < this.info.length.length; i++) {
                if (obj.value ==  this.info.length[i].value) {
                    this.$message.error("已有该尺码了");
                    this.add.add_Length = "";
                    return;
                }
            }
            this.info.length.push(obj);
            this.add.add_Length = "";
        },
        //搜索
        searchSize(type,name) {
            this.search(type,name);
        },
        searchLength(type,name) {
            this.search(type,name);
        },
        search(type,name) {
            let params = {
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                namekeyword:name,
                valuekeyword:'',
                type:type,
                selectIds:this.selectedIds,
            }
            selectDifSettings(params).then(
                res => {
                    console.log(res);
                    this.searchData = res.data.data.result;
                }
            )
        },
        sureGoods() {
            let params = {
                size:this.info.size,
                length:this.info.length,
                userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
            };
            updateUnitSettings(params).then(
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
            box-sizing: border-box;
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
        z-index: 1;
        width: 220px;
        height: 40px;
        border: 1px solid #d3dce6;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04),
        0 2px 4px 0 rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        background-color: #fff;
        input {
            width: 88%;
            height: 38px;
            text-indent: 0.4em;
            font-size: 14px;
        }
        .add_specific_right {
            color: #ffa914;
        }
        .search{
            width:100%;
            background-color: #fff;
            border: solid 1px #dce0e6;
            box-shadow: 0 4px 10px 0 rgba(0, 17, 51, 0.1);
            box-sizing: border-box;
            ul{
                overflow-y: auto;
                overflow-x: hidden;
                max-height:144px;
            }
            .new{
                height:36px;
                width:100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding-left:12px;
                box-sizing: border-box;
            }
            .li {
                height:36px;
                width:100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding-left:12px;
                box-sizing: border-box;
                &:hover {
                    background-color: #ebeff5;
                }
            }
        }
    }
    }
}
</style>





