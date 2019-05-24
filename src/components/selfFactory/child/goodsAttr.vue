<template>
    <div class="goods-spec">
        <div class="goods-spec-header">
            <span>编辑属性库</span>
            <span class="header_right">
                 <nf-button style="width: 98px;" @click="$emit('goodsAttrShow')">
                    收起<icon style="width:12px;height:8px;position:relative;top:-1px;left:4px;" type="icon-packup"></icon>
                </nf-button>
                <!--<nf-button style="width: 98px;" @click="handleClick">取消</nf-button>-->
                <!--<nf-button style="width: 98px;" type="warning" @click="sureGoods">确定</nf-button>-->
            </span>
        </div>
        <div class="goods-spec-container" :style="{'height':h-120+'px'}">
            <div class="goods-spec-block">
                <div class="text-sort">提示：拖拽标签可调整排序</div>
                <div>
                    <div class="name-block">品牌</div>
                    <draggable v-model="info.brand" @update="updateInfo('brandIds',info.brand)">
                        <transition-group>
                            <item-base class="item" v-for="(item, index) in info.brand" :key="item.value+index">
                                {{item.value}}
                                <!--<div style="display:inline-flex;" @click="delAttr(index,'brand')"><icon style="width:8px;height:8px;padding-left:4px;cursor:pointer;" type="icon-label-del"></icon></div>-->
                            </item-base>
                        </transition-group>
                    </draggable>
                    <span  class="container_set_specific_add" :key="1" v-clickoutside="hideSelectBrand">
                        <span @click="show.brandShow=!show.brandShow">+ 添加</span>
                            <div class="add_specific" v-if="show.brandShow" @keyup.enter="addBrand">
                                <input type="text" :maxlength="12" v-model.trim="add.add_Brand" placeholder="请输入新品牌名称">
                                <span class="add_specific_right">
                                    <span @click="addBrand">+ 添加</span>
                                </span>
                            </div>
                    </span>
                </div>
                <div>
                    <div class="name-block">设计师</div>
                    <draggable v-model="info.designer" @update="updateInfo('designerIds',info.designer)">
                        <transition-group>
                            <item-base class="item" v-for="(item, index) in info.designer" :key="item.value+index">
                                {{item.value}}
                                <!--<div style="display:inline-flex;" @click="delAttr(index,'designer')"><icon style="width:8px;height:8px;padding-left:4px;cursor:pointer;" type="icon-label-del"></icon></div>-->
                            </item-base>
                        </transition-group>
                    </draggable>
                    <span  class="container_set_specific_add" :key="1" v-clickoutside="hideSelectDesigner">
                        <span @click="show.designerShow=!show.designerShow">+ 添加</span>
                            <div class="add_specific" v-if="show.designerShow" @keyup.enter="addDesigner">
                                <input type="text" :maxlength="12" v-model.trim="add.add_Designer" placeholder="请输入新设计师名称">
                                <span class="add_specific_right">
                                    <span @click="addDesigner">+ 添加</span>
                                </span>
                            </div>
                    </span>
                </div>
                <div>
                    <div class="name-block">波段</div>
                    <draggable v-model="info.wave" @update="updateInfo('waveIds',info.wave)">
                        <transition-group>
                            <item-base class="item" v-for="(item, index) in info.wave" :key="item.value+index">
                                {{item.value}}
                                <!--<div style="display:inline-flex;" @click="delAttr(index,'wave')"><icon style="width:8px;height:8px;padding-left:4px;cursor:pointer;" type="icon-label-del"></icon></div>-->
                            </item-base>
                        </transition-group>
                    </draggable>
                    <span  class="container_set_specific_add" :key="1" v-clickoutside="hideSelectWave">
                        <span @click="show.waveShow=!show.waveShow">+ 添加</span>
                            <div class="add_specific" v-if="show.waveShow" @keyup.enter="addWave">
                                <input type="text" :maxlength="12" v-model.trim="add.add_Wave" placeholder="请输入新波段名称">
                                <span class="add_specific_right">
                                    <span @click="addWave">+ 添加</span>
                                </span>
                            </div>
                    </span>
                </div>
                <div>
                    <div class="name-block">分类</div>
                    <draggable v-model="info.kind" @update="updateInfo('kindIds',info.kind)">
                        <transition-group>
                            <item-base class="item" v-for="(item, index) in info.kind" :key="item.value+index">
                                {{item.value}}
                                <!--<div style="display:inline-flex;" @click="delAttr(index,'kind')"><icon style="width:8px;height:8px;padding-left:4px;cursor:pointer;" type="icon-label-del"></icon></div>-->
                            </item-base>
                        </transition-group>
                    </draggable>
                    <span  class="container_set_specific_add" :key="1" v-clickoutside="hideSelectKind">
                        <span @click="show.kindShow=!show.kindShow">+ 添加</span>
                            <div class="add_specific" v-if="show.kindShow" @keyup.enter="addKind">
                                <input type="text" :maxlength="12" v-model.trim="add.add_Kind" placeholder="请输入新分类名称">
                                <span class="add_specific_right">
                                    <span @click="addKind">+ 添加</span>
                                </span>
                            </div>
                    </span>
                </div>
                <div>
                    <div class="name-block">季节</div>
                    <draggable v-model="info.season" @update="updateInfo('seasonIds',info.season)">
                        <transition-group>
                            <item-base class="item" v-for="(item, index) in info.season" :key="item.value+index">
                                {{item.value}}
                                <!--<div style="display:inline-flex;" @click="delAttr(index,'season')"><icon style="width:8px;height:8px;padding-left:4px;cursor:pointer;" type="icon-label-del"></icon></div>-->
                            </item-base>
                        </transition-group>
                    </draggable>
                    <span  class="container_set_specific_add" :key="1" v-clickoutside="hideSelectSeason">
                        <span @click="show.seasonShow=!show.seasonShow">+ 添加</span>
                            <div class="add_specific" v-if="show.seasonShow" @keyup.enter="addSeason">
                                <input type="text" :maxlength="12" v-model.trim="add.add_Season" placeholder="请输入新季节名称">
                                <span class="add_specific_right">
                                    <span @click="addSeason()">+ 添加</span>
                                </span>
                            </div>
                    </span>
                </div>
                <div>
                    <div class="name-block">年份</div>
                    <draggable v-model="info.year" @update="updateInfo('yearIds',info.year)">
                        <transition-group>
                            <item-base class="item" v-for="(item, index) in info.year" :key="item.value+index">
                                {{item.value}}
                                <!--<div style="display:inline-flex;" @click="delAttr(index,'year')"><icon style="width:8px;height:8px;padding-left:4px;cursor:pointer;" type="icon-label-del"></icon></div>-->
                            </item-base>
                        </transition-group>
                    </draggable>
                    <span  class="container_set_specific_add" :key="1" v-clickoutside="hideSelectYear">
                        <span @click="show.yearShow=!show.yearShow">+ 添加</span>
                            <div class="add_specific" v-if="show.yearShow" @keyup.enter="addYear">
                                <input type="text" :maxlength="12" v-model.trim="add.add_Year" placeholder="请输入新年份名称">
                                <span class="add_specific_right">
                                    <span @click="addYear">+ 添加</span>
                                </span>
                            </div>
                    </span>
                </div>
                <div>
                    <div class="name-block">标签</div>
                    <draggable v-model="info.tag" @update="updateInfo('tagIds',info.tag)">
                        <transition-group>
                            <item-base class="item" v-for="(item, index) in info.tag" :key="item.value+index">
                                {{item.value}}
                                <!--<div style="display:inline-flex;" @click="delAttr(index,'tag')"><icon style="width:8px;height:8px;padding-left:4px;cursor:pointer;" type="icon-label-del"></icon></div>-->
                            </item-base>
                        </transition-group>
                    </draggable>
                    <span  class="container_set_specific_add" :key="1" v-clickoutside="hideSelectTag">
                        <span @click="show.tagShow=!show.tagShow">+ 添加</span>
                            <div class="add_specific" v-if="show.tagShow" @keyup.enter="addTag()">
                                <input type="text" :maxlength="12" v-model.trim="add.add_Tag" placeholder="请输入新尺码名称">
                                <span class="add_specific_right">
                                    <span @click="addTag()">+ 添加</span>
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
    import {deleteFacCommonSettings,updateBossCommonSettings,addFacCommonSettings,updateFacCommonSettingsSort} from '../../../api/api'
    export default {
        props:['h','info'],
        data() {
            return {
                show:{
                    brandShow:false,
                    designerShow:false,
                    waveShow:false,
                    kindShow:false,
                    seasonShow:false,
                    yearShow:false,
                    tagShow:false,
                },
                add:{
                    add_Brand:'',
                    add_Designer:'',
                    add_Wave:'',
                    add_Kind:'',
                    add_Season:'',
                    add_Tag:'',
                    add_Year:''
                }
            }
        },
        components: {
            draggable,
        },
        methods: {
            delAttr(index,type) {
                if(this.info[type][index].id == '') {
                    this.info[type].splice(index,1);
                } else {
                    let params = {
                        id:this.info[type][index].id,
                        userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                        type:'other'
                    }
                    deleteFacCommonSettings(params).then(
                        res => {
                            console.log(res);
                            if(res.data.code == 0) {
                                this.info[type].splice(index,1);
                            }else {
                                this.$message.error(res.data.msg);
                            }
                        }
                    )
                }
            },
            updateInfo(type,arr){
                let arrId = [];
                for (let i = 0; i < arr.length; i++) {
                    arrId.push(arr[i].id)
                }
                let params = {
                    userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                }
                params[type] = arrId;
                updateFacCommonSettingsSort(params).then(res => {
                    console.log(res.data);
                })
            },
            //点击后消失
            hideSelectBrand() {
                this.show.brandShow = false;
            },
            hideSelectDesigner() {
                this.show.designerShow = false;
            },
            hideSelectWave() {
                this.show.waveShow = false;
            },
            hideSelectKind() {
                this.show.kindShow = false;
            },
            hideSelectSeason() {
                this.show.seasonShow = false;
            },
            hideSelectTag() {
                this.show.tagShow = false;
            },
            hideSelectYear() {
                this.show.yearShow = false;
            },
            //点击取消后弹窗消失
            handleClick() {
                this.$emit('goodsAttrShow')
            },
            addBrand() {
                if( this.add.add_Brand == '') {
                    return;
                }
                let obj = {};
                obj.value = this.add.add_Brand;
                obj.name = this.add.add_Brand;
                obj.id = '';
                for (let i = 0; i < this.info.brand.length; i++) {
                    if (obj.value ==  this.info.brand[i].value) {
                        this.$message({
                            message: "已有该品牌了",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        this.add.add_Brand = "";
                        return;
                    }
                }
                this.info.brand.push(obj);
                this.add.add_Brand = "";
                this.sureGoods(obj,'brand')
            },
            addDesigner() {
                if( this.add.add_Designer == '') {
                    return;
                }
                let obj = {};
                obj.value = this.add.add_Designer;
                obj.name = this.add.add_Designer;
                obj.id = '';
                for (let i = 0; i < this.info.designer.length; i++) {
                    if (obj.value ==  this.info.designer[i].value) {
                        this.$message({
                            message: "已有该设计师了",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        this.add.add_Designer = "";
                        return;
                    }
                }
                this.info.designer.push(obj);
                this.add.add_Designer = "";

                this.sureGoods(obj,'designer')
            },
            addWave() {
                if( this.add.add_Wave == '') {
                    return;
                }
                let obj = {};
                obj.value = this.add.add_Wave;
                obj.name = this.add.add_Wave;
                obj.id = '';
                for (let i = 0; i < this.info.wave.length; i++) {
                    if (obj.value ==  this.info.wave[i].value) {
                        this.$message({
                            message: "已有该波段了",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        this.add.add_Wave = "";
                        return;
                    }
                }
                this.info.wave.push(obj);
                this.add.add_Wave = "";
                this.sureGoods(obj,'wave')
            },
            addKind() {
                if( this.add.add_Kind == '') {
                    return;
                }
                let obj = {};
                obj.value = this.add.add_Kind;
                obj.name = this.add.add_Kind;
                obj.id = '';
                for (let i = 0; i < this.info.kind.length; i++) {
                    if (obj.value ==  this.info.kind[i].value) {
                        this.$message({
                            message: "已有该分类了",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        this.add.add_Kind = "";
                        return;
                    }
                }
                this.info.kind.push(obj);
                this.add.add_Kind = "";
                this.sureGoods(obj,'kind')
            },
            addSeason() {
                if( this.add.add_Season == '') {
                    return;
                }
                let obj = {};
                obj.value = this.add.add_Season;
                obj.name = this.add.add_Season;
                obj.id = '';
                for (let i = 0; i < this.info.season.length; i++) {
                    if (obj.value ==  this.info.season[i].value) {
                        this.$message({
                            message: "已有该季节了",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        this.add.add_Season = "";
                        return;
                    }
                }
                this.info.season.push(obj);
                this.add.add_Season = "";
                this.sureGoods(obj,'season')
            },
            addYear() {
                if( this.add.add_Year == '') {
                    return;
                }
                let obj = {};
                obj.value = this.add.add_Year;
                obj.name = this.add.add_Year;
                obj.id = '';
                for (let i = 0; i < this.info.year.length; i++) {
                    if (obj.value ==  this.info.year[i].value) {
                        this.$message({
                            message: "已有该年份了",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        this.add.add_Year = "";
                        return;
                    }
                }
                this.info.year.push(obj);
                this.add.add_Year = "";
                this.sureGoods(obj,'year')
            },
            addTag() {
                if( this.add.add_Tag == '') {
                    return;
                }
                let obj = {};
                obj.value = this.add.add_Tag;
                obj.name = this.add.add_Tag;
                obj.id = '';
                for (let i = 0; i < this.info.tag.length; i++) {
                    if (obj.value ==  this.info.tag[i].value) {
                        this.$message({
                            message: "已有该标签了",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        this.add.add_Tag = "";
                        return;
                    }
                }
                this.info.tag.push(obj);
                this.add.add_Tag = "";
                this.sureGoods(obj,'tag')
            },
            sureGoods(obj,type) {
                let params = {
                    name:obj.name,
                    type:type,
                    userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                };
                addFacCommonSettings(params).then(
                    res=> {
                        console.log(res);
                        // this.$emit('goodsAttrShow');
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
            padding: 32px;
            box-sizing: border-box;
            overflow-y: scroll;
            overflow-x: hidden;
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
                z-index: 1;
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





