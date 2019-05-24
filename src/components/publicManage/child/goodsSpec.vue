<template>
    <div class="goods-spec">
        <div class="goods-spec-header">
            <span>成衣货品规格</span>
            <span class="header_right">
                <nf-button style="width: 98px;" @click="sureGoods">
                    收起<icon style="width:12px;height:8px;position:relative;top:-1px;left:4px;"
                            type="icon-packup"></icon>
                </nf-button>
                <!--<nf-button style="width: 98px;" @click="handleClick">取消</nf-button>-->
                <!--<nf-button style="width: 98px;" type="warning" @click="sureGoods">确定</nf-button>-->
            </span>
        </div>

        <div class="goods-spec-container" :style="{'height':h-150+'px'}">
            <div class="goods-spec-block">
                <div>
                    <div class="name-block">内长</div>

                    <div class="color-table-title spec-table-title">

                        <div class="color-title-name title-name-bg" style="width: 30%!important;">
                            内长编号
                        </div>
                        <div class="color-title-name title-name-bg" style="width: 30%!important;">
                            内长描述
                        </div>
                        <div class="color-title-name title-name-bg" style="width: 40%!important;">
                            操作
                            <div style="width:14px;height:14px;cursor:pointer;" v-popover:popover1>
                                <icon style="width:14px;height:14px;margin-left:4px;" type="icon-tongyong-tishi"></icon>
                                <el-popover popper-class='backgroundPopover' ref="popover1" placement="top-start"
                                            width="180" :offset="180" height="86" trigger="hover">
                                    <div style="color:#fff;">只有未被货品引用才允许被删除。</div>
                                </el-popover>
                            </div>
                        </div>
                    </div>
                    <draggable v-model="infoLength" @update="updateLengthSort">
                        <transition-group>
                            <div v-for="(item,index) of infoLength" :key="'GoodsSpec'+index" class="color-table-title"
                                 style="margin-top:-1px;">
                                <div @click="isExpandVal(index)" style="border-right:1px solid #e6eaf0;"
                                     class="color-title-name activeGoods">
                                    <span v-if="!item.isExpandVal">{{item.value}}</span>
                                    <el-input @input='writeVal(item)' :maxlength="12" v-focus='item.isExpandVal'
                                              placeholder="不填则自动生成"
                                              v-if="item.isExpandVal" v-model.trim="item.value"></el-input>
                                </div>
                                <div @click="isExpandVal(index)" style="border-right:1px solid #e6eaf0;"
                                     class="color-title-name activeGoods">
                                    <span v-if="!item.isExpandVal">{{item.name}}</span>
                                    <el-input @input='writeVal(item)' :maxlength="12" v-focus='item.isExpandVal'
                                              v-if="item.isExpandVal" v-model.trim="item.name"></el-input>
                                </div>
                                <div v-if="!item.edit" class="color-title-name color-opera handle">
                                    <div class="color-sort draggable">
                                        <icon style="width:12px;height:12px;margin-right:4px;"
                                              type="icon-liebiaocaozuo_tuodong"></icon>
                                        排序
                                    </div>
                                    <div @click="editSpec(item)" class="color-sort">
                                        <icon style="width:12px;height:12px;margin-right:4px;" type="icon-edit1"></icon>
                                        编辑
                                    </div>
                                    <div class="color-sort" @click="delX('length',item,index,'length')"><span
                                            v-if="item.removeTag===1"><icon
                                            style="width:12px;height:12px;margin-right:4px;" type="icon-delete"></icon>删除</span>
                                    </div>
                                </div>
                                <div class="edit-color-opera" v-if="item.edit">
                                    <div @click="editCancel(item,index)" class="edit-color-cancel">取消</div>
                                    <div @click="editLenghtGo(item,index)" style="color:#ffa914;cursor:pointer;">确定
                                    </div>
                                </div>
                            </div>
                        </transition-group>
                    </draggable>
                    <div @click="addSpec" class="add-color">+添加</div>

                </div>
                <div class="group-size">
                    <div class="name-block">尺码组</div>
                    <draggable v-model="sizeCategoryList" @update="datadragEnd" :options="{handle:'.remove-btn'}">
                        <div class="detail-block" v-for="(item,index) in sizeCategoryList" :key="index">
                            <div class="header">
                                <div class="group-name-edit">
                                    <div v-if="!item.isEditing">
                                        <span class="group-name">{{ item.category}}</span>
                                        <!--<div style="display:inline-flex;" @click="delSizeCate(index)"><icon style="width:8px;height:8px;padding-left:4px;cursor:pointer;" type="icon-label-del"></icon></div>-->
                                        <el-button class="edit-btn" type="text" @click="toggleEdit(item)">
                                            <icon style="width:14px;height:14px;position:relative;top:-1px;
                                        margin: 0 4px 0 15px;" type="icon-edit"></icon>
                                            修改名称
                                        </el-button>
                                    </div>
                                    <div v-else @keyup.enter="saveGroupName(item,index)">
                                        <el-input class="group-name-input" v-model="editingGroupName"
                                                  placeholder="请输入尺码组名称"></el-input>
                                        <el-button type="text" @click="toggleEdit(item)">取消</el-button>
                                        <el-button class="save-btn" type="text" @click="saveGroupName(item,index)">确定
                                        </el-button>
                                    </div>
                                </div>
                                <div>
                                    <div class="remove-btn">
                                        <icon style="width:14px;height:12px;margin-bottom: 2px;"
                                              type="icon-liebiaocaozuo_tuodong"></icon>
                                        <span>调整排序</span>
                                    </div>
                                    <span @click="delelSizeCategoryList(index)"
                                          style="line-height: 36px;color: #808080;font-size: 14px;cursor: pointer">删除</span>
                                </div>
                            </div>
                            <div class="color-table-title spec-table-title">

                                <div class="color-title-name title-name-bg" style="width: 20%!important;">
                                    尺码编号
                                </div>
                                <div class="color-title-name title-name-bg" style="width: 30%!important;">
                                    尺码描述
                                </div>
                                <div class="color-title-name title-name-bg" style="width: 20%!important;">
                                    号型
                                </div>
                                <div class="color-title-name title-name-bg" style="width: 30%!important;">
                                    操作
                                    <div style="width:14px;height:14px;cursor:pointer;">
                                    </div>
                                </div>
                            </div>
                            <draggable v-model="item.commonSkuAttrDTOList" @update="datadragEnd">
                                <transition-group>
                                    <div v-for="($item, $index) in item.commonSkuAttrDTOList" :key="'GoodsSpec'+$index"
                                         class="color-table-title" style="margin-top:-1px;">
                                        <div style="border-right:1px solid #e6eaf0;"
                                             class="color-title-name activeGoods">
                                            <span v-if="!$item.isExpandVal"> {{$item.value}}</span>
                                            <el-input  :maxlength="12"
                                                      v-focus='$item.isExpandVal' v-if="$item.isExpandVal"
                                                      placeholder="不填则自动生成"
                                                      v-model.trim="$item.value"></el-input>
                                        </div>
                                        <div style="border-right:1px solid #e6eaf0;"
                                             class="color-title-name activeGoods">
                                            <span v-if="!$item.isExpandVal"> {{$item.name}}</span>
                                            <el-input  :maxlength="12"
                                                      v-focus='$item.isExpandVal' v-if="$item.isExpandVal"
                                                      v-model.trim="$item.name"></el-input>
                                        </div>
                                        <div style="border-right:1px solid #e6eaf0;"
                                             class="color-title-name activeGoods">
                                            <span v-if="!$item.edit"> {{$item.sizeTypeCategory}}</span>
                                            <el-select clearable v-if="$item.edit" v-model="$item.sizeTypeCategoryId" placeholder="请选择">
                                                <el-option
                                                        v-for="item in sizeTypeCategoryListData"
                                                        :key="item.id"
                                                        :label="item.sizeTypeCategory"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div v-if="!$item.edit" class="color-title-name color-opera handle">
                                            <div class="color-sort draggable">
                                                <icon style="width:12px;height:12px;margin-right:4px;"
                                                      type="icon-liebiaocaozuo_tuodong"></icon>
                                                排序
                                            </div>
                                            <div class="color-sort"
                                                 @click="editsizeCategory(item.commonSkuAttrDTOList,$item)">
                                                <icon style="width:12px;height:12px;margin-right:4px;"
                                                      type="icon-edit1"></icon>
                                                编辑
                                            </div>
                                            <div class="color-sort" @click="delX('other',$item,$index,index)"><span
                                                    v-if="$item.removeTag===1"><icon
                                                    style="width:12px;height:12px;margin-right:4px;"
                                                    type="icon-delete"></icon>删除</span></div>
                                        </div>
                                        <div class="edit-color-opera" v-if="$item.edit">
                                            <div @click="sizeEditCancel(item,index,$item,$index)"
                                                 class="edit-color-cancel">取消
                                            </div>
                                            <div @click="sizeEditSure($item,item)"
                                                 style="color:#ffa914;cursor:pointer;">确定
                                            </div>
                                        </div>
                                    </div>

                                </transition-group>
                            </draggable>
                            <div @click="addSizeSpec(index)" class="add-color">+添加</div>

                            <!--<add-size :sizeGroupItem="item"></add-size>-->
                        </div>
                    </draggable>
                    <div v-if="addGroupSizeObj.isAddSizeGroup" class="detail-block">
                        <div class="header">
                            <div class="group-name-edit">
                                <div @keyup.enter="addSizeGroup">
                                    <el-input class="group-name-input" v-model="addGroupSizeObj.category"
                                              placeholder="请输入尺码组名称"></el-input>
                                    <el-button type="text" @click="addGroupSizeObj.isAddSizeGroup = false">取消
                                    </el-button>
                                    <el-button class="save-btn" type="text" @click="addSizeGroup">确定</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="!addGroupSizeObj.isAddSizeGroup">
                    <span @click="showAddSizeGroup" class="add-group-btn">+添加尺码组</span>
                </div>
            </div>
        </div>
        <el-dialog
                :show-close="false"
                :modal="false"
                :visible.sync="visible.deleVisible"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定删除当前{{messageTypeDel}}？</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="visible.deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="delSpecSure">确 定</nf-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
                :modal="false"
                :visible.sync="visible.edit"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否将改动更新到货品条码？</p>
                </div>
                <div class="handle-delete">
                    <nf-button :loading="btnLoading" @click="editSize(editSizeValue,false)">否</nf-button>
                    <nf-button :loading="btnLoading" type="warning" @click="editSize(editSizeValue,true)">是</nf-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import draggable from "vuedraggable";
    // import addSize from "./addSize";
    // addCommonSize 旧的尺码 添加接口要变更
    import {
        commonSizeCatagoryDelete,
        commonSizeDelete,
        deleteFacCommonSettings,
        updateBossCommonSettings,
        addCommonSkuAttr,
        updateCommonSizeCatagory,
        updateSizeCatagorySort,
        addFacUnitSettings,
        addCommonSizeCatagory,
        updateFacCommonSettingsSort,
        commonSizeUpdate,
        commonSizeCatagoryList,
        sizeTypeCategoryList,
        editGoodsSku,
    } from '../../../api/api'

    export default {
        // type:体系层common 组织层 org
        props: ['h', 'info', 'infoL', 'sizeCategoryList', 'type'],
        data() {
            return {
                sizeTypeCategoryListData:[],
                infoLength: JSON.parse(JSON.stringify(this.infoL)),
                sizeCategoryListBf: [],          // 尺码组备份
                show: {
                    sizeShow: false,
                    lengthShow: false,
                },
                add: {
                    add_Size: '',
                    add_Length: '',
                },
                editingGroupName: '',
                addGroupSizeObj: {
                    isAddSizeGroup: false,
                    category: ''
                },
                visible: {
                    deleVisible: false,
                    edit: false
                },
                messageTypeDel:'内长',
                specEditOrAdd:'',
                delParamsIndex: null,
                delParamsBigIndex: null,
                delParams: {
                    type: '',
                    id: '',
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                },
                editSizeValue: {}, //备份单条尺码
                sizeValue: '', //备份尺码编号
                btnLoading: false
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
            // addSize,
            draggable
        },
        created(){
            this.sizeTypeCategoryList()
        },
        mounted() {
            this.infoLength = JSON.parse(JSON.stringify(this.infoL));
        },
        methods: {
            sizeTypeCategoryList(){
                sizeTypeCategoryList({unitId:this.unitId}).then(res=>{
                    this.sizeTypeCategoryListData = res.data.data

                })
            },
            updateLengthSort() {
                let arrId = [];
                for (let i = 0; i < this.infoLength.length; i++) {
                    arrId.push(this.infoLength[i].id)
                }
                let params = {
                    lengthIds: arrId,
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                }
                updateFacCommonSettingsSort(params).then(res => {
                    console.log(res);
                })
            },
            hideSelectLength() {
                this.show.lengthShow = false;
            },
            //点击取消后弹窗消失
            handleClick() {
                this.$emit('goodsSpecShow')
            },

            sureGoods() {
                let params = {
                    size: this.info.size,
                    length: this.info.length,
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                };
                updateBossCommonSettings(params).then(
                    res => {
                        console.log(res);
                        this.$emit('goodsSpecShow');
                    }
                )
            },
            toggleEdit(item) {
                this.$set(item, 'isEditing', !item.isEditing)
                if (item.isEditing) {
                    this.editingGroupName = item.category
                }
            },
            saveGroupName(item, index) {
                if (!this.editingGroupName) {
                    return
                }
                for (let i = 0; i < this.sizeCategoryList.length; i++) {
                    if (this.sizeCategoryList[i].category == this.editingGroupName && i != index) {
                        this.$message({
                            message: "已有该尺码组",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        this.editingGroupName = "";
                        return;
                    }
                }
                // 如果没修改
                if (item.category == this.editingGroupName) {
                    this.toggleEdit(item)
                    return;
                }
                let params = {
                    type:2,
                    categoryId: item.categoryId,
                    category: this.editingGroupName,
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                }

                updateCommonSizeCatagory(params).then(res => {
                    console.log(res)
                    if (res.data.code == 0) {
                        item.category = this.editingGroupName;
                        this.toggleEdit(item)
                    }
                })

            },
            addSizeGroup() {
                if (!this.addGroupSizeObj.category) {
                    return
                }
                for (let i = 0; i < this.sizeCategoryList.length; i++) {
                    if (this.sizeCategoryList[i].category == this.addGroupSizeObj.category) {
                        this.$message({
                            message: "已有该尺码组",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        this.addGroupSizeObj.category = "";
                        return;
                    }
                }
                let params = {
                    type:2,
                    category: this.addGroupSizeObj.category,
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    // value: this.addGroupSizeObj.value
                }

                addCommonSizeCatagory(params).then(res => {
                    if (res.data.code == 0) {
                        // 将结果push到尺码组列表
                        let sizeCategoryItem = res.data.commonSizeCategory;
                        sizeCategoryItem.commonSkuAttrDTOList = []
                        this.sizeCategoryList.push(res.data.commonSizeCategory)
                        // 隐藏添加尺码组的界面
                        //this.infoLength[this.infoLength.length-1].value = res.data.data.value
                        this.addGroupSizeObj.isAddSizeGroup = false
                    }
                })

            },


            // 显示添加尺码组的界面
            showAddSizeGroup() {
                this.addGroupSizeObj.isAddSizeGroup = true
                this.addGroupSizeObj.category = ''
            },
            // 尺码组拖拽和尺码拖拽共用
            datadragEnd() {
                let params = {
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    commonSizeCategoryList: this.sizeCategoryList
                }
                updateSizeCatagorySort(params).then(res => {
                    if (res.data.code == 0) {
                    }
                })
            },
            // 删除内长  和尺码
            delX(type, item, index, bigIndex) {
                if (item.removeTag == 1) {
                    this.visible.deleVisible = true;
                    this.delParams.id = item.id;
                    this.delParams.type = type;
                    this.delParamsIndex = index;
                    if (bigIndex != 'length') {
                        this.delParamsBigIndex = bigIndex;
                    }
                    if(type == 'other'){
                        this.messageTypeDel = '尺码'
                    }else {
                        this.messageTypeDel = '内长'
                    }
                }

            },
            delSpecSure() {
                if (this.delParams.type === 'other') {
                    commonSizeDelete({id: this.delParams.id, userId: this.delParams.userId}).then(res => {
                        this.visible.deleVisible = false;
                        if (res.data.code == 0) {
                            this.$message({
                                message: "删除成功",
                                duration: this.$globalConfig.elementUI.duration,
                                type: "success"
                            });

                            this.sizeCategoryList[this.delParamsBigIndex].commonSkuAttrDTOList.splice(this.delParamsIndex, 1)
                        } else {
                            this.$message.error(res.data.msg);
                        }


                    })
                } else {
                    deleteFacCommonSettings(this.delParams).then(
                        res => {
                            this.visible.deleVisible = false;
                            if (res.data.code == 0) {
                                this.$message({
                                    message: "删除成功",
                                    duration: this.$globalConfig.elementUI.duration,
                                    type: "success"
                                });
                                this.infoLength.splice(this.delParamsIndex, 1)
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        }
                    )
                }

            },

            // 内长编辑
            editSpec(item, index) {
                this.infoLength.forEach((items, index) => {
                    if (items.id === '') {
                        this.infoLength.splice(index, 1)
                    }
                    items.edit = false;
                    this.$set(items, 'isExpandVal', false); // input show/hide
                })
                item.edit = true;
                item.isExpandVal = true;
            },

            //点击编辑内长
            isExpandVal(index) {
                if (this.infoLength[index].edit == true) {
                    this.infoLength.forEach((item, index) => {

                        this.$set(item, 'isExpandVal', false); //  num input show/hide
                    })
                    this.infoLength.forEach(item => {
                        this.$set(item, 'edit', false); // color num input show/hide
                    })
                    this.$set(this.infoLength[index], 'isExpandVal', true);
                    this.$set(this.infoLength[index], 'edit', true);
                }

            },
            // 取消编辑
            editCancel(item, index) {
                if (item.id === '') {
                    if (item.value === '') {
                        this.infoLength.splice(index, 1);
                    } else if (item.noDel == 1) {
                        item.edit = false;
                        item.isExpandVal = false;
                    } else {
                        this.infoLength.splice(index, 1);
                    }
                } else {
                    item.edit = false;
                    item.isExpandVal = false;
                    item.value = this.info.length[index].value;
                }
            },

            writeVal(item) {
                // if((/^[A-Za-z0-9]{1,12}$/).test(item.value)) {
                if ((/^[A-Za-z0-9]{1,12}$/).test(item.value)) {
                    this.specEditOrAdd = item.value;
                } else {
                    item.value = '';
                }
            },
            writeValDot(item) {
                if ((/^[A-Za-z0-9]{1,12}$/).test(item.name)) {

                } else {
                    item.name = '';
                }
            },
            // 确定编辑或添加内长
            editLenghtGo(item, index) {
                if (item.name == '') {
                    this.$message({
                        message: "内长不能为空",
                        duration: this.$globalConfig.elementUI.duration,
                        type: "error"
                    });
                    // this.add.add_Length = "";
                    return;
                }
                for (let i = 0; i < this.info.length.length; i++) {
                    if (item.name == this.info.length[i].name && i != index) {
                        this.$message({
                            message: "已有该内长了",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        // this.add.add_Length = "";
                        return;
                    }
                    if (item.value == this.info.length[i].value  && i != index) { // 编号
                        this.$message({
                            message: "已有该编号了",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        // this.add.add_Length = "";
                        return;
                    }
                }


                //添加内长
                if (item.id === "" && index === this.infoLength.length - 1) {
                    let obj = {};
                    obj.value = item.value;
                    obj.name = item.name;
                    obj.removeTag = 1;

                    let params, apiUrl
                    params = {
                        type: 3,
                        value: item.value,
                        name: item.name,
                        userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                        facId: this.facIds || JSON.parse(sessionStorage.getItem("last_login")).id
                    };
                    apiUrl = addCommonSkuAttr
                    console.log('583')
                    apiUrl(params).then(
                        res => {
                            if (res.data.code == 0) {
                                obj.id =res.data.data.id;
                                this.infoLength[this.infoLength.length - 1].id = res.data.data.id;
                                this.infoLength[this.infoLength.length-1].value = res.data.data.value
                                item.edit = false;
                                item.isExpandVal = false;
                                // this.add.add_Length = "";
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    duration: this.$globalConfig.elementUI.duration,
                                    type: "error"
                                });
                            }
                        }
                    )
                } else {
                    //  编辑内长
                    let obj = {};
                    obj.id = item.id;
                    obj.name = item.name;
                    obj.value = item.value;
                    obj.type = 3;
                    editGoodsSku(obj).then(res => {
                        if (res.data.code == 0) {
                            this.$message.success('修改成功')
                            item.edit = false;
                            item.isExpandVal = false;
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            },

            //点击添加内长
            addSpec() {
                if (this.infoLength.length > 0 && this.infoLength[this.infoLength.length - 1].id == '') {
                    this.infoLength.splice(this.infoLength.length - 1, 1);
                    return
                }
                this.infoLength.push({
                    id: '',
                    value: '',
                    name: '',
                    userId: '',
                    facId: '',
                    edit: true,
                    removeTag: 1,
                })
                this.isExpandVal(this.infoLength.length - 1);
            },
            // 获取尺码组列表
            getSizeCatagoryList(callBack) {
                let paramsCommonMsg = {
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                };
                commonSizeCatagoryList(paramsCommonMsg).then(res => {
                    if (res.data.code == 0) {
                        this.sizeCategoryListBf = res.data.commonSizeCategoryList;
                        callBack()
                    }

                });
            },
            // 删除尺码组
            delelSizeCategoryList(index) {
                let params = {
                    categoryId: this.sizeCategoryList[index].categoryId,
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                }
                commonSizeCatagoryDelete(params).then(
                    res => {
                        this.$message({
                            message: "删除成功",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "success"
                        });
                        if (res.data.code == 0) {
                            this.sizeCategoryList.splice(index, 1);
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    }
                )
            },
            // 尺码编辑
            editsizeCategory(bigItem, item) {
                this.editSizeValue = item
                this.sizeValue = item.value // 备份尺码编号
                // 查找空的添加还没编辑的尺码进行删除
                this.sizeCategoryList.forEach((items) => {
                    items.commonSkuAttrDTOList.forEach((itemSmall, index) => {
                        if (itemSmall.id === '') {
                            items.commonSkuAttrDTOList.splice(index, 1)
                        }
                    })
                })
                bigItem.forEach((items) => {
                    // items.commonSkuAttrDTOList.forEach((itemsSmall) => {
                    items.edit = false;
                    this.$set(items, 'isExpandVal', false); // input show/hide


                })
                item.edit = true;
                item.isExpandVal = true;
            },
            // 尺码编辑取消
            sizeEditCancel(bigItem, bigItemIndex, item, itemIndex) {
                var that = this;
                if (item.id === '') {
                    this.sizeCategoryList[bigItemIndex].commonSkuAttrDTOList.splice(itemIndex, 1);
                } else {
                    this.getSizeCatagoryList(function () {

                        item.edit = false;
                        that.$set(item, 'isExpandVal', false); // input show/hide
                        that.$set(item, 'name', that.sizeCategoryListBf[bigItemIndex].commonSkuAttrDTOList[itemIndex].name); // input show/hide
                        that.$set(item, 'value', that.sizeCategoryListBf[bigItemIndex].commonSkuAttrDTOList[itemIndex].value); // input show/hide
                    });

                }

            },
            // 尺码编辑确认
            sizeEditSure(item, itemBig) {
                if (item.name == '') {
                    this.$message({
                        message: "尺码不能为空",
                        duration: this.$globalConfig.elementUI.duration,
                        type: "error"
                    });
                    // this.add.add_Length = "";
                    return;
                }

                if(this.sizeValue !== item.value && item.id !== '') {
                    this.visible.edit = true;
                    return
                }

                if (item.id === '') {
                    // 添加
                    let obj = {
                        userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                        categoryId: itemBig.categoryId,
                        sizeTypeCategoryId: item.sizeTypeCategoryId,
                        name: item.name,
                        type: 2,
                        value: item.value
                    }
                    console.log('尺码编辑确定',obj)
                    addCommonSkuAttr(obj).then(res => {
                        if (res.data.code == 0) {
                            let sizeType = this.sizeTypeCategoryListData.find($item=>$item.id===item.sizeTypeCategoryId)
                            let sizeTypeCategory = sizeType?sizeType.sizeTypeCategory:''
                            item.sizeTypeCategory = sizeTypeCategory
                            item.id = res.data.data.id;
                            item.edit = false;
                            this.$set(item, 'name', res.data.data.name)
                            this.$set(item, 'value', res.data.data.value)
                            this.$set(item, 'isExpandVal', false); // input show/hide
                            this.$message({
                                message: "添加成功",
                                duration: this.$globalConfig.elementUI.duration,
                                type: "success"
                            });
                        } else {
                            this.$message.error(res.data.msg);
                        }

                    })

                } else {
                   this.editSize(item,false)
                }

            },
            editSize(item,updateBarcode) {
                this.btnLoading = true;
                //  编辑
                let params = {};
                params.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
                params.id = item.id;
                params.sizeTypeCategoryId = item.sizeTypeCategoryId;
                params.name = item.name;
                params.value = item.value
                params.type = 2
                params.updateBarcode = updateBarcode
                editGoodsSku(params).then(res => {
                    this.visible.edit = false
                    this.btnLoading = false;
                    this.sizeTypeCategoryList()
                    if (res.data.code == 0) {
                        this.$message({
                            message: "修改成功",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "success"
                        });
                        item.edit = false;
                        this.$set(item, 'isExpandVal', false);
                    }else {
                        this.getSizeCatagoryList(() => {
                            let obj;
                            this.sizeCategoryListBf.forEach(v => {
                                obj = v.commonSkuAttrDTOList.find(_v => _v.id === item.id)
                            })
                            item.edit = false;
                            this.$set(item, 'isExpandVal', false); // input show/hide
                            this.$set(item, 'name', obj.name); // input show/hide
                            this.$set(item, 'value', obj.value); // input show/hide
                        });
                        this.$message.error(res.data.msg);
                    }
                    let sizeType = this.sizeTypeCategoryListData.find($item=>$item.id===item.sizeTypeCategoryId)
                    let sizeTypeCategory = sizeType?sizeType.sizeTypeCategory:''
                    console.log(sizeTypeCategory);
                    this.$set(item, 'sizeTypeCategory', sizeTypeCategory);
                })
            },
            // 点击尺码添加

            addSizeSpec(index) {
                var commonSkuAttrDTOList = this.sizeCategoryList[index].commonSkuAttrDTOList;
                if (commonSkuAttrDTOList.length > 0 && commonSkuAttrDTOList[commonSkuAttrDTOList.length - 1].id == '') {
                    commonSkuAttrDTOList.splice(commonSkuAttrDTOList.length - 1, 1);
                    return
                }
                var itemNew = {
                    userId: '',
                    categoryId: '',
                    id: '',
                    name: '',
                    value: '',
                    isExpandVal: true,
                    edit: true,
                    removeTag:1
                }
                commonSkuAttrDTOList.forEach(item => {
                    this.$set(item, 'edit', false)
                    this.$set(item, 'isExpandVal', false)
                })
                commonSkuAttrDTOList.push(itemNew)
            }

            // addCommonSize
        },
    }
</script>
<style lang="scss">
    .goods-spec {
        .dialog-content-wrap {
            text-align: center;
            .delete-tip {
                padding-top: 14px;
                font-size: 16px;
            }
        }
        .handle-delete {
            margin-top: 34px;
        }
    }

    .activeGoods {
        .el-input__inner {
            border: 1px solid #ffa914;
            border-radius: 0px;
            text-align: center;
        }
    }
</style>
<style lang="scss" scoped>
    @import "~scss_vars";

    /*要合并的*/

    .color-table-title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 36px;
        color: #a2abb8;
        border: 1px solid #e6eaf0;

    }

    .color-title-name {
        width: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 36px;
        color: #3b3b3b;
        position: relative;
    }
    .title-name-bg {
        background-color: #f5f7fa;
    }
    .color-opera {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 36px;
        width: 40%;
    }

    .add-color {
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 36px;
        color: #ffa914;
        border: 1px solid #e6eaf0;
        margin-top: -1px;
        box-sizing: border-box;
        &:hover {
            background-color: #f7f9fc;
            cursor: pointer;
        }
    }

    .color-sort {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        border-right: 1px solid #e6eaf0;
        height: 36px;
        color: #808080;
        &:hover {
            color: #3b3b3b;
            cursor: pointer;
        }
    }

    .del-color {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
    }

    .del-text {
        color: #808080;
        &:hover {
            color: #3b3b3b;
        }
    }

    .color-table-scroll {
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 600px;
    }

    .edit-color-opera {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40%;
        height: 100%;
        .edit-color-cancel {
            margin-right: 24px;
            cursor: pointer;
        }
    }

    .color-draggable {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        min-width: 90%;
    }

    .text-sort {
        color: #a2abb8;
        padding-bottom: 16px;
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
        .goods-spec-container {
            margin: 32px;
            display: flex;
            height: 100%;
            overflow: auto;
            flex: 1;
            .goods-spec-block {
                width: 100%;
                padding-right: 10%;
            }
            .name-block {
                font-size: 16px;
                color: #3b3b3b;
                margin: 8px 0;
            }
            .item {
                margin-right: 12px;
                margin-bottom: 12px;
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
            .add-btn {
                display: inline-block;
                line-height: 30px;
                width: 100%;
                text-align: center;
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
        .group-size {
            padding: 12px 0 0;
            margin: 20px 0 0;
            border-top: 1px solid #d3dce6;
            .detail-block {
                padding-bottom: 12px;
                border-bottom: 1px solid #d3dce6;
                .header {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 0 8px;
                    .group-name-edit {
                        &:hover {
                            .edit-btn {
                                display: inline-block;
                            }
                        }
                        .group-name {
                            position: relative;
                            display: inline-block;
                            padding: 0 0 0 12px;

                            &:before {
                                content: '';
                                position: absolute;
                                left: 0;
                                top: 4px;
                                display: block;
                                width: 6px;
                                height: 6px;
                                background-color: #1ca1ff;
                                border-radius: 50%;

                            }
                        }
                        .edit-btn {
                            color: #1ca1ff;
                            display: none;
                            cursor: pointer;
                        }
                        .group-name-input {
                            width: 150px;
                            margin-right: 16px;
                        }
                        .save-btn {
                            color: #ffa914;
                        }
                    }

                    .remove-btn {
                        display: inline-block;
                        cursor: pointer;
                        line-height: 36px;
                        font-size: 16px;
                        color: #808080;
                        margin-right: 20px;

                    }
                }
                &:last-child {
                    border-bottom: none;
                }
            }
        }
        .add-group-btn {
            line-height: 36px;
            color: #ffa914;
            cursor: pointer;
            float: right;
            border: 1px solid #ffa914;
            padding: 0 10px;
        }
    }
</style>
