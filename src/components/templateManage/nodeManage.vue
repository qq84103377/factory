<template>
    <section>
        <div class="node-header">
            <div class="search">
                <el-input @change="remoteSearch" v-model="searchNode" placeholder="请输入节点" icon="search">
                </el-input>
            </div>
            <nf-button type="warning" @click="click_isshow">
                <i class="el-icon-plus"></i>
                新建生产节点
            </nf-button>
        </div>
        <div class="node-section">
            <el-table
                    v-loading="loading"
                    :data="node"
                    border
                    style="width: 100%;font-size: 12px;">
                <el-table-column
                        prop="name"
                        label="节点名称">
                </el-table-column>
                <el-table-column
                        prop="prcdNodeTypeName"
                        label="数据类型"
                        width="140">
                </el-table-column>
                <el-table-column
                        label="以实裁数为准"
                        width="128">
                    <template slot-scope="scope">
                        <i style="color:rgba(255,156,56,1);" v-if="scope.row.doac" class="el-icon-check"></i>
                    </template>
                </el-table-column>
                <el-table-column
                        label="关联唯一码"
                        width="110">
                    <template slot-scope="scope">
                        <i style="color:rgba(255,156,56,1);" v-if="scope.row.associateWYM" class="el-icon-check"></i>
                    </template>
                </el-table-column>
                <el-table-column
                        label="关联扎号"
                        width="98">
                    <template slot-scope="scope">
                        <i style="color:rgba(255,156,56,1);" v-if="scope.row.associateLigation"
                           class="el-icon-check"></i>
                    </template>
                </el-table-column>
                <el-table-column
                        label="外发"
                        width="92">
                    <template slot-scope="scope">
                        <i style="color:rgba(255,156,56,1);" v-if="scope.row.associateOutside" class="el-icon-check"></i>
                    </template>
                </el-table-column>
                <el-table-column
                        label="节点标签">
                    <template slot-scope="scope">
                        <span v-for="(item,index) in scope.row.tags" :key="index"
                              style="border: 1px solid #FFA914;background: #FFF6E7;color: #FFA914;font-size: 12px;min-width: 67px;padding: 0 6px;display: inline-block;line-height: 20px;text-align: center;margin-right: 6px;">{{item.tagName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="160"
                        align="center">
                    <template slot-scope="scope">
                        <div style="display: flex;">
                            <!--3 12 5 8 4 6 7-->
                            <!--<span style="flex: 1;border-right: 1px solid #DFE6EC;text-align: center;"> <span-->
                                   <!--v-if="['3','4','5','6','7','8'].indexOf(scope.row.prcdNodeTypeId) > -1  " style="color: #1CA1FF;text-decoration: underline;cursor: pointer;"-->
                                    <!--@click="prcdNodeTypeId=scope.row.prcdNodeTypeId;visible.configNodeVisible=true">配置节点</span></span>-->
                            <!--<span style="flex: 1;border-right: 1px solid #DFE6EC;text-align: center;"><span-->
                                    <!--style="color: #1CA1FF;text-decoration: underline;cursor: pointer;"-->
                                    <!--@click="prcdNodeTypeId=scope.row.prcdNodeTypeId;visible.editTagVisible=true">编辑标签</span></span>-->
                            <!--<span style="flex: 1;border-right: 1px solid #DFE6EC;text-align: center;"><span-->
                                    <!--style="color: #1CA1FF;text-decoration: underline;cursor: pointer;"-->
                                    <!--@click="propTableData = scope.row.tags;prcdNodeId = scope.row.id;tagVisible=true">编辑标签</span></span>-->
                            <!--<span style="flex: 1;border-right: 1px solid #DFE6EC;text-align: center;"><span-->
                                    <!--style="color: #1CA1FF;text-decoration: underline;cursor: pointer;"-->
                                    <!--@click="editNode(scope.row,index)">修改名称</span></span>-->
                            <span style="flex: 1;text-align: center;"><span @click="goNodeEdit(scope.row)" style="color: #1CA1FF;text-decoration: underline;cursor: pointer;">编辑节点</span></span>
                            <span style="flex: 1;text-align: center;"><span @click="delX(scope.row,scope.$index)" style="color: #FA4150;text-decoration: underline;cursor: pointer;">删除节点</span></span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>


            <div class="page">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="20"
                               layout="total, prev, pager, next" :total="nodeCount">
                </el-pagination>
            </div>
        </div>

        <!-- 新建节点 -->
        <el-dialog size="tiny" :visible.sync="visible.createVisible" :show-close="false">
            <div class="dialog-title" slot="title">
                新增节点
            </div>
            <div class="dialog-form">
                <el-form label-position="top" :model="formLabelAlign" ref="formLabelAlign" :rules="rules">
                    <el-form-item label="节点名称" prop="name">
                        <el-input :maxlength="14" v-model.trim="formLabelAlign.nodename" placeholder="请输入节点名称"
                                  @change="nodeNameRepeat"></el-input>
                        <div class="text" v-if="nodeRepeat">此节点已存在，请检查后输入新的节点名称。</div>
                    </el-form-item>
                    <el-form-item label="节点类型" prop="region" v-popover:popover1>
                        <el-select filterable v-model="formLabelAlign.id" placeholder="请选择数据类型"
                                   @change="NodeTypeValue($event)">
                            <el-option v-for="(item,index) in options" :key="item.id"
                                       :label="item.name+'（ '+item.description+'）'" :value="item.id">
                            </el-option>
                        </el-select>
                        <div class="text" v-if="numberType">节点类型设置为“数量型”后，不可再修改。请慎重考虑。</div>
                        <el-popover ref="popover1" placement="top-start" width="200" :offset="180" height="86"
                                    trigger="hover">
                            <div style="color:#a2abb8">节点数据类型决定在工单里此节点的完成方式。</div>
                            <div style="color:#a2abb8">逻辑型：是否完成</div>
                            <div style="color:#a2abb8">数量型：已完成数量是否达到预设的数量</div>
                        </el-popover>
                    </el-form-item>
                </el-form>
            </div>
            <div class="submit">
                <nf-button @click="cancel">取消</nf-button>
                <nf-button type="warning" @click="addNewNode()">确定</nf-button>
            </div>
        </el-dialog>
        <!-- 编辑节点 -->
        <el-dialog size="tiny" :visible.sync="visible.editVisible" :show-close="false">
            <div class="dialog-title" slot="title">
                编辑节点
            </div>
            <div>
                <el-form label-position="top" ref="editNodeData" :model="editNodeData">
                    <el-form-item>
                        <template slot-scope="scope">
                            <div class="description-table">
                                <icon style="width:12px;height:12px;margin-right:4px;" type="icon-tips"></icon>
                                修改后，用到此节点的工单和工序模板的节点名称也会被修改。
                            </div>
                        </template>
                    </el-form-item>
                    <el-form-item>
                        <template slot-scope="scope">
                            <div class="input_edit" style="display:flex;justify-content:center;align-items:center;">
                                <div style="width:80px;">节点名称</div>
                                <el-input :maxlength="8" v-model.trim="editNamed" placeholder="请输入节点名称"
                                          @change="nodeNameRepeat"></el-input>
                            </div>
                            <div class="text" v-if="nodeRepeat">此节点已存在，请检查后输入新的节点名称。</div>
                        </template>
                    </el-form-item>
                </el-form>
            </div>
            <div class="submit">
                <nf-button @click="visible.editVisible = false">取消</nf-button>
                <nf-button type="warning" @click="successsEditNode()">确定</nf-button>
            </div>
        </el-dialog>
        <el-dialog :show-close="false" :modal="false" :visible.sync="visible.deleVisible" size="tiny" align="center">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip" style="margin:24px 0;">是否确定删除当前节点？</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="visible.deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="delColorNum">确 定</nf-button>
                </div>
            </div>
        </el-dialog>
        <!--编辑标签弹窗-->

        <node-tag-dialog v-if="tagVisible" :visible.sync="tagVisible" source="edit"  :propTableData="propTableData && propTableData.length?JSON.parse(JSON.stringify(propTableData)):[]" @getTagTableData="getTagTableData"></node-tag-dialog>

        <!--编辑标签弹窗-->
        <el-dialog :modal-append-to-body="false" class="custom-dialog" title="编辑标签"
                   :visible.sync="visible.editTagVisible" size="tiny">
            <div style="width: 100%;border: 1px solid #DFE6EC;font-size: 12px;">
                <div style="line-height: 32px;background: #F5F7FA;border-bottom: 1px solid #DFE6EC;display: flex;">
                    <span style="padding: 0 10px;border-right: 1px solid #DFE6EC;flex: 1">标签名称</span>
                    <span style="padding: 0 10px;text-align: center;flex: 0 0 134px;">操作</span>
                </div>
                <draggable v-model="tagList" :options="{handle:'.draggable'}">

                    <div v-for="(item,index) in tagList" :key="index"
                         style="border-bottom: 1px solid #DFE6EC;height: 32px;display: flex;">
                        <div style="line-height: 32px;padding: 0 10px;border-right: 1px solid #DFE6EC;flex: 1">
                            <div v-if="!item.isEdit">{{item.name}}</div>
                            <input v-focus="item.isEdit" v-else style="background: none;width: 100%;"
                                   v-model="item.tempName">
                        </div>
                        <div style="line-height: 32px;padding: 0 10px;flex: 0 0 134px;display: flex;align-items: center;">
                            <div v-if="!item.isEdit" style="display: flex;line-height: normal;width: 100%;">
                            <span style="text-align: center;flex: 1;cursor: pointer;border-right: 1px solid #DFE6EC;color: #808080"><span
                                    class="draggable">排序</span></span>
                                <span style="text-align: center;flex: 1;cursor: pointer;border-right: 1px solid #DFE6EC;color: #1CA1FF"><span
                                        @click="editTag(item)">编辑</span></span>
                                <span style="text-align: center;flex: 1;cursor: pointer;color: #FA4150"><span
                                        @click="tagList.splice(index,1)">删除</span></span>
                            </div>
                            <div v-else style="display: flex;line-height: normal;text-align: center;width: 100%;">
                            <span style="flex: 0 0 33%;cursor: pointer;color: #808080"
                                  @click="itemCancel(item)">取消</span>
                                <span style="flex: 0 0 33%;cursor: pointer;color: #FFA914"
                                      @click="itemConfirm(item)">确定</span>
                            </div>
                        </div>
                    </div>
                </draggable>
                <div @click="addTag"
                     style="cursor: pointer;color: #FFA914;line-height: 32px;padding: 0 10px;">+ 添加标签
                </div>
            </div>


            <div slot="footer">
                <el-button @click="visible.editTagVisible=false">取 消</el-button>
                <el-button type="primary"
                           @click="">确 定
                </el-button>
            </div>
        </el-dialog>

        <!--配置节点弹窗-->
        <el-dialog :modal-append-to-body="false" class="custom-dialog" title="配置节点"
                   :visible.sync="visible.configNodeVisible" size="tiny">
            <div style="display: flex;justify-content: center;">
                <!--3 12 8 4 6 5 7-->
                <!--送料型-->
                <div v-if="['3'].indexOf(prcdNodeTypeId) > -1" style="font-size: 12px;">
                    <span style="margin-right: 10px;">物料分类</span>
                    <el-select multiple v-model="material.materialKind" placeholder="请选择物料分类">
                        <el-option
                                v-for="item in material.options"
                                :key="item.id"
                                :label="item.no + item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-checkbox style="display: block;padding: 13px 0 0 60px;" v-model="material.materialCheck">以实裁数为准</el-checkbox>
                </div>
                <!--总数型,发货型,质检-单件流-->
                <div v-if="['4','6','8','5','7'].indexOf(prcdNodeTypeId) > -1" style="font-size: 12px;">
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox @change="handlerChange(index,$event)" v-if="!(['4','6','8'].indexOf(prcdNodeTypeId) > -1 && (index==3))" v-for="(item,index) in configNodeList" :key="index" :label="item"></el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>

            <div slot="footer">
                <el-button @click="visible.configNodeVisible=false">取 消</el-button>
                <el-button type="primary"
                           @click="">确 定
                </el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        addTaskNode,
        getDicReportTypeList,
        queryTaskNodeList,
        updateTaskNode,
        deleteTaskNodeByNodeId,
        getNodeTypes,
        addNodeTypes,
        editNodeTypes,
        getNodeLists,
        deleteNode,
        nodesTagUpdate,
        listMaterialsKinds
    } from "../../api/api";
    import draggable from "vuedraggable";
    import NodeTagDialog from './children/nodeTagDialog'
    export default {
        //自动获取焦点，对input进行DOM操作，实际上；
        directives: {
            focus: {
                inserted: (el, {value}) => {
                    if (value) {
                        el.focus();
                    }
                }
            }
        },
        components: {draggable,NodeTagDialog},
        data() {
            return {
                tagVisible:false,
                prcdNodeId:'',
                propTableData:[],
                configNodeList: ['以实裁数为准','关联唯一码','关联扎号','外发'],
                checkList: [],
                prcdNodeTypeId: '',
                material:{
                    materialCheck: '',
                    materialKind: [],
                    options: []
                },
                tagList: [{name: '标签名称1'}, {name: '标签名称2'}],
                loading: false,
                visible: {
                    configNodeVisible: false,
                    editTagVisible: false,
                    createVisible: false,
                    editVisible: false,
                    deleVisible: false
                },
                formLabelAlign: {
                    nodename: "",
                    region: "",
                    id: "",
                    type: "",
                    multiple: []
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: "此节点已存在，请检查后输入新的节点名称。",
                            trigger: "blur"
                        }
                    ],
                    region: [
                        {
                            required: true,
                            message: "数据类型设置为“数量型”后，不可再修改。请慎重考虑。",
                            trigger: "change"
                        }
                    ]
                },
                options: [],
                node: [],
                editNodeData: {
                    targetId: "",
                    name: ""
                },
                searchNode: "",
                currentPage1: 1,
                nodeCount: 1,
                nodeRepeat: false,
                numberType: false,
                targetId: "",
                typeId: "",
                editNamed: "",
                editTyped: "",
                delItem: {},
                delIndex: 0,
                searchValue: "",
                sign: "0"
            };
        },
        methods: {
            addTag() {
              this.tagList.push({name:'',isEdit:true})

            },
            handlerChange(index,e) {
                if(index){
                    if(e.target.checked && this.checkList.indexOf('以实裁数为准') == -1){
                        this.checkList.push('以实裁数为准')
                    }
                }else {
                    //选择以实裁数为准
                    if(!e.target.checked){
                        this.checkList = []
                    }
                }
            },
            //更新节点标签
            getTagTableData(val){
                val.forEach(item=>{
                    item.prcdNodeId = this.prcdNodeId
                    if(!item.id){
                        item.id = ''
                    }
                    if(!item.use){
                        item.use = false
                    }
                });
                nodesTagUpdate(val).then(res=>{
                    if(res.data.code === 0){

                        this.getNodeList();
                    }
                    this.tagVisible = false;
                })
            },
            //获取物料分类列表
            getMaterialList() {
                listMaterialsKinds({userId:this.userId}).then(res => {
                   this.material.options = res.data.kindsList
                    console.log(this.material.options,'========');
                })
            },
            itemConfirm(row) {
                row.name = row.tempName
                row.isEdit = false
            },
            itemCancel(row) {
                // row.name = row.tempName
                row.isEdit = false
            },
            //编辑标签
            editTag(row) {
                this.$set(row, 'isEdit', true)
                this.$set(row, 'tempName', row.name)
            },
            //   新建节点
            click_isshow() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist) {
                    for (let i = 0; i < datalist.length; i++) {

                        if (datalist[i] == "fac.node.operate") {
                            this.sign = "1";
                        }
                    }
                }
                console.log(this.sign, datalist);
                if (this.sign == "0" || !datalist) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.$router.push("/newNode");
            },

            cancel() {

                this.visible.createVisible = false;
            },
            goNodeEdit(row){
                this.$router.push({path:"/newNode",query:{id:row.id}});
            },
            // 删除节点
            delX(item, index) {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist) {
                    for (let i = 0; i < datalist.length; i++) {
                        if (datalist[i] == "fac.node.operate") {
                            this.sign = "1";
                        }
                    }
                }
                if (this.sign == "0" || !datalist) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.visible.deleVisible = true;
                this.delItem = item;
                this.delIndex = index;
            },
            delColorNum() {
                this.deleteNode(this.delItem, this.delIndex);
            },
            deleteNode(item, index) {
                let params = {
                    nodeId: item.id
                };
                deleteNode(params).then(res => {
                    if (res.data.code == 0) {
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "success"
                        });
                        this.visible.deleVisible = false;
                        this.getNodeList();
                        // this.node.splice(index, 1);
                        // this.nodeCount = this.nodeCount - 1;
                    } else {
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                    }
                });
            },
            nodeNameRepeat(val) {
                if (val == "") {
                    this.nodeRepeat = false;
                }
            },
            NodeTypeValue(value) {
                if (value == "5a1a92ba06c94bc3a077129e4c919803") {
                    this.numberType = true;
                } else {
                    this.numberType = false;
                }
                this.formLabelAlign.id = value;
            },
            NodeTypeValueEdit(val) {
                this.typeId = val;
                if (val == "5a1a92ba06c94bc3a077129e4c919803") {
                    this.numberType = true;
                } else {
                    this.numberType = false;
                }
                this.formLabelAlign.id = val;
            },
            addNewNode() {
                if (!this.checkNewNodeForm()) return;
                let params = {
                    token: "",
                    name: this.formLabelAlign.nodename,
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    prcdNodeTypeId: this.formLabelAlign.id
                };
                addNodeTypes(params).then(res => {
                    console.log(res);
                    if (res.data.code != 0) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.visible.editVisible = false;
                        this.visible.createVisible = false;
                    }
                    this.rules.name[0].message = res.data.msg;
                    this.getNodeList();
                });
            },
            checkNewNodeForm() {
                if (!this.formLabelAlign.nodename) {
                    this.$message.error("请填写节点名称");
                    return false;
                }
                if (!this.formLabelAlign.id) {
                    this.$message.error("请选择节点类型");
                    return false;
                }
                return true;
            },
            //获取可选的节点类型
            getNodeType() {
                this.formLabelAlign.nodename = "";
                this.formLabelAlign.id = "";
                this.nodeRepeat = false;
                this.numberType = false;
                this.visible.createVisible = true;
                this.getNodeTypes();
            },
            //获取当前节点列表，***带数据类型***的
            getNodeList() {
                this.loading = true
                let params = {
                    token: "",
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    pageNo: this.currentPage1,
                    pageSize: 20,
                    keyword: this.searchValue
                };
                getNodeLists(params).then(res => {
                    console.log(res);
                    this.loading = false
                    this.node = res.data.page.list;
                    this.nodeCount = res.data.page.totalCount;
                });
            },
            editNode(item, index) {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist) {
                    for (let i = 0; i < datalist.length; i++) {
                        if (datalist[i] == "fac.node.operate") {
                            this.sign = "1";
                        }
                    }
                }
                if (this.sign == "0" || !datalist) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.visible.editVisible = true;
                console.log(item, index, "点击的节点");
                this.nodeRepeat = false;
                this.targetId = item.targetId;
                this.editNodeData = item;
                this.editNamed = item.name;
                this.editTyped = item.targetId;
            },
            successsEditNode() {
                let params = {
                    id: this.editNodeData.id,
                    name: this.editNamed,
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                };
                if (!params.name) {
                    this.$message.error("请填写节点名称");
                    return;
                }
                editNodeTypes(params).then(res => {
                    console.log(res);
                    if (res.data.code != 0) {
                        this.$message.error(res.data.msg);
                        this.visible.editVisible = true;
                    } else {
                        this.visible.editVisible = false;
                        this.visible.createVisible = false;
                    }
                    this.getNodeList();
                });
            },
            remoteSearch(val) {
                this.searchValue = val;
                this.getNodeList();
            },
            handleCurrentChange(val) {
                this.currentPage1 = val;
                this.getNodeList();
            },
            getNodeTypes() {
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                };
                getNodeTypes(params).then(res => {
                    console.log(res);
                    this.options = res.data.prcdNodeTypes;
                });
            }
        },
        computed: {
            userId() {
                return this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId;
            }
        },
        created() {
            this.getMaterialList()
            this.getNodeList();
        }
    };
</script>

<style scoped lang="scss">
    .el-icon-warning {
        color: #93a3b8;
        margin-left: 5px;
    }

    .line {
        height: 1px;
        width: 100%;
        background: #e6eaf0;
    }

    .node-header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 16px 0;
        .el-icon-plus {
            font-size: 12px;
            margin-right: 5px;
        }
        .el-input__inner {
            border-radius: 2px;
        }
        .search {
            display: inline-block;
            margin-right: 24px;
        }
    }

    .node-section {
        background-color: #fff;
        padding-bottom: 24px;
        width: 100%;
        box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
        min-height: 500px;
        border-radius: 4px;
    }

    .table {
        display: table;
        width: 100%;
        font-size: 14px;
        border-bottom: none;
        .table-th,
        .table-tr {
            display: table-row;
        }
        .tbody {
            display: table;
            width: 100%;
        }
        .table-tr {
            &:nth-child(even) {
                background-color: #f7f9fc;
            }
            &:nth-child(odd) {
                background-color: #fff;
            }
            &:hover {
                background-color: #f0f3f7;
            }
            .table-td {
                color: #3b3b3b;
                &:last-child {
                    border-right: none;
                }
            }
        }
        .table-th {
            color: #a2abb8;
            font-weight: 600;
            .table-td {
                height: 40px;
            }
        }
        .table-td {
            display: table-cell;
            height: 48px;
            padding-left: 32px;
            vertical-align: middle;
        }
        .handle {
            color: #636363;
            cursor: pointer;
            .el-icon-edit {
                color: #1e96ff;
                margin-right: 5px;
            }
            &:hover {
                color: #2c2c2c;
            }
        }
    }

    .dialog-title {
        padding-bottom: 24px;
        text-align: center;
        font-size: 18px;
        color: #626b7a;
        border-bottom: 1px solid #e6e8eb;
    }

    .dialog-form {
        padding: 48px 60px;
        border-radius: 2px;
        background-color: #f8f9fa;
        .el-input__inner {
            border-radius: 2px;
        }
        .el-select {
            width: 100%;
        }
        .text {
            line-height: 2;
            color: red;
            font-size: 12px;
        }
    }

    .description-table {
        // width:368px;
        // height:28px;
        line-height: 15px;
        padding: 5px 0px 5px 5px;
        background-color: #f5f7fa;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .submit {
        padding-top: 24px;
        margin-top: 24px;
        text-align: center;
        border-top: 1px solid #e6e8eb;
    }

    .page {
        text-align: right;
        margin-top: 24px;
        padding-right: 32px;
        color: purple;
    }

    .tips_font {
        color: #a2abb8;
    }
</style>
<style lang="scss">
    .input_edit .el-input__inner {
        width: 95%;
    }

    .node-header .search .el-input__inner {
        width: 320px;
        border-radius: 2px;
    }

    .node-section .dialog-content-wrap {
        text-align: center;
        .delete-tip {
            padding-top: 4px;
            font-size: 16px;
        }
        p {
            line-height: 26px;
        }
    }

    .node-section .handle-delete {
        margin-top: 34px;
    }
</style>



