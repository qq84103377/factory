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
                <div>
                    <item-base class="item" v-for="(item, index) in info" :key="index">
                        {{item.name}}
                        <!--<div @click="delInferior(index)" style="display:inline-flex;"><icon style="width:8px;height:8px;padding-left:4px;cursor:pointer;" type="icon-label-del"></icon></div>-->
                    </item-base>
                    <span  class="container_set_specific_add" :key="1" v-clickoutside="hideSelectInferior">
                        <span @click="addInferiorShow">+ 添加</span>
                        <div class="add_specific" v-if="show.inferiorShow" @keyup.enter="addInferior()">
                            <input @input="searchInferior(add.add_Inferior)" type="text" :maxlength="12" v-model.trim="add.add_Inferior" placeholder="请输入新次品标签名称">
                            <span :class="{'add_specific_right':add.add_Inferior.length>0}">
                                <span><i class="el-icon-search"></i></span>
                            </span>
                            <div class="search">
                                <div class="new" @click="addInferior()" style="color:#ffa914;">+新建次品标签</div>                                    
                                <!--<ul v-if="searchData.length>0">-->
                                    <!--<li @click="addSearchSize(sindex)" v-for="(sitem,sindex) in searchData" :key="sindex" class="li">{{sitem.name}}</li>                               -->
                                <!--</ul>-->
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
import {allDefectiveLabel,allFacDefectiveLabel,queryAllDefectiveLabel,facWouldDelete} from '../../../api/api'
export default {
    props:['h','info'],
    data() {
        return {
            show:{
                inferiorShow:false,
            },
            add:{
                add_Inferior:'',
            },
            searchData:[]
            
        }
    },
    components: {
        draggable,
    },
    methods: {
        //控制显示隐藏
        addInferiorShow() {
            this.show.inferiorShow = !this.show.inferiorShow;
            this.searchData = [];
            this.add.add_Inferior = '';
        },
        //删除单个
        delInferior(index) {
            if(this.info[index].id == '') {
                this.info.splice(index,1);                
            } else {
                let params = {
                    id:this.info[index].id,
                }
                facWouldDelete(params).then(
                    res => {
                        console.log(res);
                        if(res.data.code == 0) {
                            this.info.splice(index,1);                                            
                        }else {
                            this.$message.error(res.data.msg);                                                                                        
                        }
                    }
                )
            }
        },
        //点击后消失
        hideSelectInferior() {
            this.show.inferiorShow =false;
        },
        //点击取消后弹窗消失
        handleClick() {
            this.$emit('goodsSpecShow')
        },
        //添加搜索到的
        addSearchSize(index) {
            for (let i = 0; i < this.info.length; i++) {
                if (this.searchData[index].name ==  this.info[i].value) {
                    this.$message.error("已有该次品标签了");                                                            
                    this.add.add_Inferior = "";
                    return;
                }
            }
            this.info.push({
                    value:this.searchData[index].name,
                    labelName:this.searchData[index].name,
                    name:this.searchData[index].name,
                    id:'',
            });
        },
        //原有的添加
        addInferior() {
            if(this.add.add_Inferior=='') {
                return;
            }
            let obj = {};
            obj.value = this.add.add_Inferior;
            obj.name = this.add.add_Inferior;
            obj.labelName = this.add.add_Inferior;
            obj.id = '';
            for (let i = 0; i < this.info.length; i++) {
                if (obj.name ==  this.info[i].name) {
                    this.$message.error("已有该次品标签了");                                                            
                    this.add.add_Inferior = "";
                    return;
                }
            }
            this.info.push(obj);
            this.add.add_Inferior = "";            
        },
        //搜索
        searchInferior(name) {
            // this.search(name);
        },
        search(name) {
            let params = {
                keyword:name,
                userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,            
            }
            queryAllDefectiveLabel(params).then(
                res => {
                    console.log(res);
                    this.searchData = res.data.data;
                }
            )
        },
        sureGoods() {
            // let params = {
            //     labels:this.info,
            //     userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
            //     facId: JSON.parse(sessionStorage.getItem("last_login")).id,
            // };
            // allFacDefectiveLabel(params).then(
            //     res=> {
            //         console.log(res);
            //         this.$emit('goodsSpecShow');
            //     }
            // )
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





