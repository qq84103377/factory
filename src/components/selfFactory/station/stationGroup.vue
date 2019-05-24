<template>
    <div class="worker-manager" id="group">
        <page-wrap class="table-wrap">
            <div class="table" id="table">
                <div class="color-table">
                    <div class="color-table-title">
                        <div class="color-title-name table-title-text"><span>分组名称</span></div>
                        <div class="color-title-name table-title-text title-num"><span>分组人数</span></div>
                        <div class="color-title-name table-title-text text-center"><span>操作</span></div>
                    </div>
                    <div class="color-table-scroll">
                        <draggable
                                v-model="tableData"
                                :options="{handle:'.draggable'}"
                                @update="datadragEnd(tableData)">
                            <transition-group>
                                <div v-for="(leave1,index1) of tableData" :key="'CategoryOne'+index1">
                                    <!-- 一级分组 -->
                                    <div class="color-table-title" style="margin-top:-1px;">
                                        <!-- 分组名称 -->
                                        <div style="border-right:1px solid #e6eaf0;"
                                             class="color-title-name item-title">
                                            <i :class="[leave1.isActive ?'el-icon-arrow-up' : 'el-icon-arrow-down', 'item-icon']"
                                               @click="getShow(leave1)" v-if="!leave1.isEdit"></i>
                                            <span v-if="!leave1.isEdit">{{leave1.name}}</span>
                                            <el-input
                                                    v-if="leave1.isEdit"
                                                    class="group-name-input"
                                                    :maxlength="30"
                                                    v-model.trim="leave1.name"
                                                    placeholder="请输入分组名称">
                                            </el-input>
                                        </div>
                                        <!-- 分组人数 -->
                                        <div style="border-right:1px solid #e6eaf0;" class="color-title-name title-num">
                                            <span @click="handleGroupNum(leave1.id)">{{leave1.num}}</span>
                                        </div>
                                        <!-- 操作 -->
                                        <div v-if="!leave1.isEdit" class="color-title-name color-opera handle">
                                            <div @click="handleConfig(leave1.id)" class="color-sort">配置数据权限</div>
                                            <div @click="editClick(leave1)" class="color-sort">修改名称</div>
                                            <div class="color-sort draggable">排序</div>
                                            <div @click="delShow(leave1.id)" class="color-sort red">删除</div>
                                        </div>
                                        <div class="edit-color-opera" v-if="leave1.isEdit">
                                            <div @click="editCancel(index1, leave1)" class="edit-color-cancel">取消</div>
                                            <el-button :disabled="leave1.disabled" @click="save(leave1)"
                                                       style="color:#ffa914;border:none;background:#fff;">确定
                                            </el-button>
                                        </div>
                                    </div>
                                    <!-- 二级分组 -->
                                    <div v-show="leave1.isActive">
                                        <draggable
                                                v-model="leave1.childrenFactoryGroupList"
                                                :options="{handle:'.draggable'}"
                                                @update="datadragEnd(leave1.childrenFactoryGroupList)"
                                                v-if="leave1.childrenFactoryGroupList && leave1.childrenFactoryGroupList.length > 0">
                                            <transition-group>
                                                <div v-for="(leave2,index2) of leave1.childrenFactoryGroupList"
                                                     :key="'CategoryTwo'+index2">
                                                    <div class="color-table-title" style="margin-top:-1px;">
                                                        <!-- 分组名称 -->
                                                        <div style="border-right:1px solid #e6eaf0;"
                                                             class="color-title-name item-title">
                                                            <i :class="[leave2.isActive ?'el-icon-arrow-up' : 'el-icon-arrow-down', 'item-icon','mgl20']"
                                                               @click="getShow(leave2)" v-if="!leave2.isEdit"></i>
                                                            <span v-if="!leave2.isEdit">{{leave2.name}}</span>
                                                            <el-input
                                                                    v-if="leave2.isEdit"
                                                                    class="group-name-input"
                                                                    :maxlength="30"
                                                                    v-model.trim="leave2.name"
                                                                    placeholder="请输入分组名称">
                                                            </el-input>
                                                        </div>
                                                        <!-- 分组人数 -->
                                                        <div style="border-right:1px solid #e6eaf0;"
                                                             class="color-title-name title-num">
                                                            <span @click="handleGroupNum(leave2.id)">{{leave2.num}}</span>
                                                        </div>
                                                        <!-- 操作 -->
                                                        <div v-if="!leave2.isEdit" class="color-title-name color-opera handle">
                                                            <div @click="handleConfig(leave2.id)" class="color-sort">配置数据权限</div>
                                                            <div @click="editClick(leave2,leave1.childrenFactoryGroupList)"class="color-sort">修改名称</div>
                                                            <div class="color-sort draggable">排序</div>
                                                            <div @click="delShow(leave2.id)" class="color-sort red">删除</div>
                                                        </div>
                                                        <div class="edit-color-opera" v-if="leave2.isEdit">
                                                            <div @click="editCancel(index1, leave2, leave1, index2)"
                                                                 class="edit-color-cancel">取消
                                                            </div>
                                                            <el-button :disabled="leave2.disabled"
                                                                       @click="save(leave2,leave1.id)"
                                                                       style="color:#ffa914;border:none;background:#fff;">
                                                                确定
                                                            </el-button>
                                                        </div>
                                                    </div>
                                                    <!-- 三级分组 -->
                                                    <div v-show="leave2.isActive">
                                                        <draggable
                                                                v-model="leave2.childrenFactoryGroupList"
                                                                :options="{handle:'.draggable'}"
                                                                @update="datadragEnd(leave2.childrenFactoryGroupList)"
                                                                v-if="leave2.childrenFactoryGroupList && leave2.childrenFactoryGroupList.length > 0">
                                                            <transition-group>
                                                                <div v-for="(leave3,index3) of leave2.childrenFactoryGroupList"
                                                                     :key="'CategoryThree'+index3">
                                                                    <div class="color-table-title"
                                                                         style="margin-top:-1px;">
                                                                        <!-- 分组名称 -->
                                                                        <div style="border-right:1px solid #e6eaf0;"
                                                                             class="color-title-name item-title">
                                                                            <i :class="[leave3.isActive ?'el-icon-arrow-up' : 'el-icon-arrow-down', 'item-icon','mgl40']"
                                                                               @click="getShow(leave3)"
                                                                               v-if="!leave3.isEdit"></i>
                                                                            <span v-if="!leave3.isEdit">{{leave3.name}}</span>
                                                                            <el-input
                                                                                    v-if="leave3.isEdit"
                                                                                    class="group-name-input"
                                                                                    :maxlength="30"
                                                                                    v-model.trim="leave3.name"
                                                                                    placeholder="请输入分组名称">
                                                                            </el-input>
                                                                        </div>
                                                                        <!-- 分组人数 -->
                                                                        <div style="border-right:1px solid #e6eaf0;"
                                                                             class="color-title-name title-num">
                                                                            <span @click="handleGroupNum(leave3.id)">{{leave3.num}}</span>
                                                                        </div>
                                                                        <!-- 操作 -->
                                                                        <div v-if="!leave3.isEdit" class="color-title-name color-opera handle">
                                                                            <div @click="handleConfig(leave3.id)" class="color-sort">配置数据权限</div>
                                                                            <div @click="editClick(leave3,leave2.childrenFactoryGroupList)"class="color-sort">修改名称</div>
                                                                            <div class="color-sort draggable">排序</div>
                                                                            <div @click="delShow(leave3.id)" class="color-sort red">删除</div>
                                                                        </div>
                                                                        <div class="edit-color-opera"
                                                                             v-if="leave3.isEdit">
                                                                            <div @click="editCancel(index1, leave3, leave2, index3)"
                                                                                 class="edit-color-cancel">取消
                                                                            </div>
                                                                            <el-button :disabled="leave3.disabled"
                                                                                       @click="save(leave3,leave2.id)"
                                                                                       style="color:#ffa914;border:none;background:#fff;">
                                                                                确定
                                                                            </el-button>
                                                                        </div>
                                                                    </div>
                                                                    <!-- 四级分组 -->
                                                                    <div v-show="leave3.isActive">
                                                                        <draggable
                                                                                v-model="leave3.childrenFactoryGroupList"
                                                                                :options="{handle:'.draggable'}"
                                                                                @update="datadragEnd(leave3.childrenFactoryGroupList)"
                                                                                v-if="leave3.childrenFactoryGroupList && leave3.childrenFactoryGroupList.length > 0">
                                                                            <transition-group>
                                                                                <div v-for="(leave4,index4) of leave3.childrenFactoryGroupList"
                                                                                     :key="'CategoryThree'+index4">
                                                                                    <div class="color-table-title"
                                                                                         style="margin-top:-1px;">
                                                                                        <!-- 分组名称 -->
                                                                                        <div style="border-right:1px solid #e6eaf0;"
                                                                                             class="color-title-name item-title">
                                                                                            <i :class="[leave4.isActive ?'el-icon-arrow-up' : 'el-icon-arrow-down', 'item-icon','mgl60']"
                                                                                               @click="getShow(leave4)"
                                                                                               v-if="!leave4.isEdit"></i>
                                                                                            <span v-if="!leave4.isEdit">{{leave4.name}}</span>
                                                                                            <el-input
                                                                                                    v-if="leave4.isEdit"
                                                                                                    class="group-name-input"
                                                                                                    :maxlength="30"
                                                                                                    v-model.trim="leave4.name"
                                                                                                    placeholder="请输入分组名称">
                                                                                            </el-input>
                                                                                        </div>
                                                                                        <!-- 分组人数 -->
                                                                                        <div style="border-right:1px solid #e6eaf0;"
                                                                                             class="color-title-name title-num">
                                                                                            <span @click="handleGroupNum(leave4.id)">{{leave4.num}}</span>
                                                                                        </div>
                                                                                        <!-- 操作 -->
                                                                                        <div v-if="!leave4.isEdit" class="color-title-name color-opera handle">
                                                                                            <div @click="handleConfig(leave4.id)" class="color-sort">配置数据权限</div>
                                                                                            <div @click="editClick(leave4,leave3.childrenFactoryGroupList)" class="color-sort">修改名称</div>
                                                                                            <div class="color-sort draggable">排序</div>
                                                                                            <div @click="delShow(leave4.id)" class="color-sort red">删除</div>
                                                                                        </div>
                                                                                        <div class="edit-color-opera"
                                                                                             v-if="leave4.isEdit">
                                                                                            <div @click="editCancel(index1, leave4, leave3, index4)"
                                                                                                 class="edit-color-cancel">
                                                                                                取消
                                                                                            </div>
                                                                                            <el-button
                                                                                                    :disabled="leave4.disabled"
                                                                                                    @click="save(leave4,leave3.id)"
                                                                                                    style="color:#ffa914;border:none;background:#fff;">
                                                                                                确定
                                                                                            </el-button>
                                                                                        </div>
                                                                                    </div>
                                                                                    <!-- 五级分组 -->
                                                                                    <div v-show="leave4.isActive">
                                                                                        <draggable
                                                                                                v-model="leave4.childrenFactoryGroupList"
                                                                                                :options="{handle:'.draggable'}"
                                                                                                @update="datadragEnd(leave4.childrenFactoryGroupList)"
                                                                                                v-if="leave4.childrenFactoryGroupList && leave4.childrenFactoryGroupList.length > 0">
                                                                                            <transition-group>
                                                                                                <div v-for="(leave5,index5) of leave4.childrenFactoryGroupList"
                                                                                                     :key="'CategoryThree'+index5">
                                                                                                    <div class="color-table-title"
                                                                                                         style="margin-top:-1px;">
                                                                                                        <!-- 分组名称 -->
                                                                                                        <div style="border-right:1px solid #e6eaf0;"
                                                                                                             class="color-title-name item-title">
                                                                                                            <span v-if="!leave5.isEdit"
                                                                                                                  class="leave5-text">{{leave5.name}}</span>
                                                                                                            <el-input
                                                                                                                    :maxlength="30"
                                                                                                                    class="group-name-input"
                                                                                                                    v-if="leave5.isEdit"
                                                                                                                    v-model.trim="leave5.name"
                                                                                                                    placeholder="请输入分组名称">
                                                                                                            </el-input>
                                                                                                        </div>
                                                                                                        <!-- 分组人数 -->
                                                                                                        <div style="border-right:1px solid #e6eaf0;"
                                                                                                             class="color-title-name title-num">
                                                                                                            <span @click="handleGroupNum(leave5.id)">{{leave5.num}}</span>
                                                                                                        </div>
                                                                                                        <!-- 操作 -->
                                                                                                        <div v-if="!leave5.isEdit" class="color-title-name color-opera handle">
                                                                                                            <div @click="handleConfig(leave5.id)" class="color-sort">配置数据权限</div>
                                                                                                            <div @click="editClick(leave5,leave4.childrenFactoryGroupList)" class="color-sort">修改名称</div>
                                                                                                            <div class="color-sort draggable">排序</div>
                                                                                                            <div @click="delShow(leave5.id)" class="color-sort red">删除</div>
                                                                                                        </div>
                                                                                                        <div class="edit-color-opera"
                                                                                                             v-if="leave5.isEdit">
                                                                                                            <div @click="editCancel(index1, leave5, leave4, index5)"
                                                                                                                 class="edit-color-cancel">
                                                                                                                取消
                                                                                                            </div>
                                                                                                            <el-button
                                                                                                                    :disabled="leave5.disabled"
                                                                                                                    @click="save(leave5,leave4.id)"
                                                                                                                    style="color:#ffa914;border:none;background:#fff;">
                                                                                                                确定
                                                                                                            </el-button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </transition-group>
                                                                                        </draggable>
                                                                                        <div @click="add(leave4)"
                                                                                             class="add-color pdl110">
                                                                                            +添加五级分组
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </transition-group>
                                                                        </draggable>
                                                                        <div @click="add(leave3)"
                                                                             class="add-color pdl195">+添加四级分组
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </transition-group>
                                                        </draggable>
                                                        <div @click="add(leave2)" class="add-color pdl70">+添加三级分组</div>
                                                    </div>
                                                </div>
                                            </transition-group>
                                        </draggable>
                                        <div @click="add(leave1)" class="add-color pdl55">+添加二级分组</div>
                                    </div>
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                    <div @click="add([], 'leave1')" class="add-color pdl30">+添加一级分组</div>
                </div>
            </div>
        </page-wrap>

        <el-dialog
                :show-close="false"
                :visible.sync="visible.deleVisible"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定删除当前工位分组？</p>
                    <p style="color:#a2abb8;">删除分组后，会清除所有属于该分组工位的关联关系。</P>
                </div>
                <div class="handle-delete">
                    <nf-button @click="visible.deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="delGroup" class="mgl20">确 定</nf-button>
                </div>
            </div>
        </el-dialog>

        <goods-attr-dialog-config
                :isShow.sync="configVisible"
                :factoryGroupId="factoryGroupId"
                :goodsAttrConfigInfo="attrsDialogData"
                :isReset="isReset"
                @confirm="getAllAttrId">
        </goods-attr-dialog-config>
    </div>
</template>

<script type="text/ecmascript-6">
    import draggable from "vuedraggable";
    import goodsAttrDialogConfig from '@/components/Common/goodsAttrDialogConfig.vue' //  商品属性查询弹窗
    import {
        queryFactoryGroupList,
        addFacGroups,
        deleteFacGroups,
        updateFacGroups,
        updateFactoryGroupSort,
        getGoodsAttrConfigInfoByGroupId,
    } from '../../../api/api'
    export default {
        props: {
            groupVisible: {
                type: Boolean,
                default: false,

            },
            groupName: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                tableData: [],
                groupVisible: false,
                groupName: '',
                visible: {
                    deleVisible: false,
                },
                curName: '',    //保存分组名
                isReset: false, // 是否重置
                configVisible: false,
                factoryGroupId: '', //工厂分组id
                attrsDialogData: {},    //属性弹窗所有数据
            }
        },
        components: {
            draggable,
            goodsAttrDialogConfig,
        },
        computed: {
            userId(){
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            facId(){
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            }
        },
        methods: {
            //分组人数跳转
            handleGroupNum(id){
                this.$router.push(`/home/setting/selfFacStationManager?gruopId=${id}`);
            },
            //配置数据权限
            handleConfig(id){
                this.factoryGroupId = id;
                let params = {
                    facId: this.facId,
                    userId: this.userId,
                    factoryGroupId: this.factoryGroupId,
                    type: 'goodsAttrs',
                };
                getGoodsAttrConfigInfoByGroupId(params).then(res => {
                    if(res.data.code === 0){
                        this.attrsDialogData = res.data.data;
                        this.configVisible = true;
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },

            // 展开
            getShow(row) {
                this.$set(row, 'isActive', !row.isActive)
            },
            //添加
            add(item, type) {
                let addRow = {
                    name: '',
                    isEdit: true,
                    id: '',
                    isActive: false
                };
                addRow.childrenFactoryGroupList = [];
                if (type === "leave1") {
                    addRow.grade = 0;
                    if (this.tableData.length > 0 && this.tableData[this.tableData.length - 1].id == '') {
                        this.tableData.splice(this.tableData.length - 1, 1);
                    }
                    else {
                        // 取消其他item的编辑状态
                        this.tableData.forEach(list => {
                            this.$set(list, 'isEdit', false);
                        });
                        this.tableData.push(addRow)
                    }
                } else {
                    let childs = item.childrenFactoryGroupList;
                    addRow.grade = item.grade + 1;
                    if (childs.length > 0 && childs[childs.length - 1].id == '') {
                        childs.splice(childs.length - 1, 1);
                    } else {
                        // 取消其他item的编辑状态
                        childs.forEach(list => {
                            this.$set(list, 'isEdit', false);
                        });
                        childs.push(addRow)
                    }
                }
            },
            // 编辑
            editClick(item, upLevel) {
                // 2-5级分组
                if (upLevel) {
                    // 取消编辑状态
                    upLevel.forEach(items => {
                        this.$set(items, 'isEdit', false);
                    })
                }
                // 1级分组
                else {
                    // 取消编辑状态
                    this.tableData.forEach(items => {
                        this.$set(items, 'isEdit', false);
                    })
                }
                this.curName = item.name;
                item.isEdit = true
            },
            // 取消编辑
            editCancel(index1, item, childGroup, childIndex) {
                //新增的分组取消修改
                if (item.id === '') {
                    //2-5级分组
                    if (childGroup && childGroup.childrenFactoryGroupList) {
                        let upLevel = childGroup.childrenFactoryGroupList;
                        upLevel.splice(childIndex, 1);
                    }
                    //1级分组
                    else {
                        this.tableData.splice(index1, 1);
                    }
                }
                //已存在的分组取消修改
                else {
                    item.name = this.curName;
                    item.isEdit = false;
                }
            },
            // 保存新建、编辑
            save(item, parentId) {
                if (item.name == '') {
                    this.$message.error('请输入分组名称！');
                    return;
                }
                let params = {
                    facId: this.facId,
                    name: item.name,
                };
                //编辑
                if (item.id) {
                    params.groupId = item.id;
                    updateFacGroups(params).then(res => {
                        if (res.data.code == 0) {
                            this.getAllWorkerList();
                            this.$message.success("修改成功");
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }
                //新建
                else {
                    params.grade = item.grade;
                    params.parentId = parentId;
                    addFacGroups(params).then(res => {
                        if (res.data.code == 0) {
                            this.$message.success("创建成功");
                            this.getAllWorkerList();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            },
            // 拖动结束，发送排序请求
            datadragEnd(arr) {
                let attrIds = [];
                if (arr && arr.length > 0) {
                    arr.forEach(i => {
                        if (i.id) {
                            attrIds.push(i.id);
                        }
                    });
                    let params = {
                        userId: this.userId,
                        ids: attrIds
                    };
                    updateFactoryGroupSort(params).then(res => {
                        if (res.data.code !== 0) {
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            },
            delShow(id) {
                this.visible.deleVisible = true;
                this.groupId = id;
            },
            //删除分组
            delGroup() {
                let params = {
                    groupId: this.groupId,
                    token: '',
                };
                deleteFacGroups(params).then(res => {
                    if (res.data.code == 0) {
                        this.visible.deleVisible = false;
                        this.getAllWorkerList();
                        this.$message.success("删除成功");
                    }
                })
            },
            getAllWorkerList() {
                let params = {
                    facId: this.facId,
                };
                queryFactoryGroupList(params).then(res => {
                    if(res.data.code === 0){
                        this.tableData = res.data.data;
                    }else{
                        this.$message.error(res.data.msg);
                    }

                })
            },
        },
        created() {
            this.getAllWorkerList();
        }
    }
</script>

<style lang="scss" scoped>
    .red {
        color: #fa4150;
    }
    .test {
        display: flex;
    }
    .mgl50 {
        margin-left: 45% !important;
    }
    .mgl20 {
        margin-left: 20px;
    }
    .mgl40 {
        margin-left: 40px;
    }
    .mgl60 {
        margin-left: 60px;
    }
    .mgl80 {
        margin-left: 80px;
    }
    .leave5-text {
        padding-left: 100px;
    }
    .color-table {
        margin: 32px;
        box-sizing: border-box;
        .color-table-title {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 36px;
            color: #a2abb8;
            border: 1px solid #e6eaf0;
        }
        .color-title-name {
            width: 45%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 36px;
            color: #3b3b3b;
            position: relative;
            border-right: 1px solid rgb(230, 234, 240);
            &.title-num {
                width: 10%;
            }
            &:last-child {
                border-right: none;
            }
            span {
                display: block;
                width: 100%;
                margin-left: 10px;
                cursor: pointer;
            }
        }
        .item-title {
            cursor: pointer;
            .item-icon {
                color: #a2abb8;
                padding-left: 10px;
            }
        }
        .color-opera {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 36px;
        }
        .add-color {
            height: 36px;
            display: flex;
            justify-content: flex-start;
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
            &.pdl30 {
                padding-left: 30px;
            }
            &.pdl55 {
                padding-left: 55px;
            }
            &.pdl70 {
                padding-left: 70px;
            }
            &.pdl195 {
                padding-left: 95px;
            }
            &.pdl110 {
                padding-left: 110px;
            }
        }
        .color-sort {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50%;
            border-right: 1px solid #e6eaf0;
            height: 36px;
            color: #1CA1FF;
            &.red{
                color: #FA4150;
            }
            &:hover {
                color: #3b3b3b;
                cursor: pointer;
            }
            &:last-child{
                border-right: none;
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
        .edit-color-opera {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 45%;
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
        .table-title-text{
            color: #808080;
            &.text-center{
                span{
                    width: 100%;
                    margin-left: 0;
                }
            }
        }
    }
</style>

<style lang="scss" scoped>
    @import '~scss_vars';

    .disabled-color {
        color: #c4c6cc;
    }

    .caret-wrapper {
        z-index: 1;
    }

    .worker-manager {
        min-width: 1100px;
        .el-row {
            height: 64px;
            line-height: 64px;
            background-color: #fff;
            margin-bottom: 16px;
            border-radius: 2px;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
            .el-col {
                font-family: MicrosoftYaHei;
                font-size: 18px;
                text-align: right;
                padding-right: 40px;
                color: #2c2c2c;
                .worker-title {
                    font-size: 24px;
                    text-align: left;
                    span {
                        padding-left: 32px;
                    }
                }
                .add-worker-btn {
                    text-align: right;
                    width: 112px;
                    border-radius: 2px;
                    background-color: $color-btn;
                    color: #fff;
                    border: none;
                }
            }
        }
        .table-search {
            background-color: #fff;
            box-sizing: border-box;
            line-height: 1;
            padding: 24px 32px;
            margin-bottom: 16px;
            box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
            overflow: hidden;
            .remote-search {
                border-radius: 2px;
                min-width: 260px;
                margin-right: 32px;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                .el-input {
                    width: 95%;
                }
                .el-select {
                    width: 95%;
                }
            }
            .search-btn {
                text-align: right;
            }

        }
        .table-wrap {
            padding: 0;
            padding-bottom: 32px;
            width: 100%;
            overflow: hidden;
        }
        .set {
            color: #808080;
            display: inline-block;
            margin-right: 48px;
            &:hover {
                text-decoration: underline;
                color: #2b2b2b;
                cursor: pointer;
            }
        }
        #table {
            z-index: -1;
            .disabled {
                background-color: red;
            }
            .prepare-list {
                .prepare-item:not(:last-child) {
                    &::after {
                        content: '、'
                    }
                }
            }
        }
        .color-title {
            display: flex;
            justify-content: center;
            color: #2c2c2c;
        }
        .color-set {
            display: flex;
            justify-content: center;
            &.edit-group {
                padding-left: 40px;
            }
            .edit-group-title {
                margin-bottom: 16px;
            }
            .error-desc {
                color: #fa4150;
                font-size: 12px;
                margin-top: 5px;
            }
            input {
                width: 260px;
                border: 1px solid #d5d5d5;
                height: 34px;
                border-radius: 2px;
                text-indent: .2em;
                font-size: 14px;
                &::-webkit-input-placeholder {
                    color: #babdc2;
                }
            }
        }
        .dialog-footer {
            display: flex;
            justify-content: center;
            .cancel {
                margin-right: 16px;
            }
        }
        .nf-input {
            display: inline-block;
            width: 260px;
        }
        .dialog-content-wrap {
            text-align: center;
            .delete-tip {
                font-size: 16px;
            }
            p {
                line-height: 26px;
            }
        }
        .handle-delete {
            margin-top: 34px;
        }
    }
</style>
<style lang="scss">
    #group{
        .color-table{
            .group-name-input{
                input{
                    border: none;
                    background-color: #FFF9ED;
                }
            }
        }
    }
</style>
