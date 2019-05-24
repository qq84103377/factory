<template>
    <div>
        <div class="table" id="flow-table" ref="flow-table">
            <div class="table-header">
                <div class="table-tr">
                    <div
                            class="table-th"
                            v-for="(item, index) of tableHeaderConf"
                            :key="index"
                            :style="item.style || {}">
                        {{ item.label }}
                    </div>
                </div>
            </div>
            <!-- <div class="table-body"> -->
            <draggable class="table-body" v-model="listData" :move="checkMove"
                       :options="{handle:'.draggable', forceFallback: false,}">
                <div class="table-tr"
                     v-for="(item, index) in listData"
                     :key="index">
                    <div class="table-td">
                        <el-select filterable @change="selectNode(index)" v-model="item.prcdNodeId" placeholder="选择节点">
                            <el-option disabled="true"
                                       style="color:#ff9c38;padding-left:10px;padding-top:5px;width:100%;cursor:pointer;">
                                <div @click="isShowNewNode = true;nodeIndex=index" class="new_node">
                                    <span>+新建</span>
                                </div>
                            </el-option>
                            <el-option
                                    v-for="item of nodeList"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.name+'('+ item.typeName +')'"></el-option>
                        </el-select>
                    </div>
                    <div class="table-td">
                        <el-select filterable v-model="item.checkChargerIds" multiple placeholder="选择负责人">
                            <el-option v-for="userItem of userList" :key="userItem.id" :value="userItem.id"
                                       :label="userItem.userName"></el-option>
                        </el-select>
                    </div>
                    <div class="table-td">
                        <el-row class="input-wrapper" type="flex" align="middle">
                            <div class="table-input">
                                <input v-if="item.defaultLabourCost!=-1" class="input-inner" type="number"
                                       v-model="item.defaultLabourCost"
                                       @input="handleWarningNumInput(item,'defaultLabourCost')"/>
                                <span v-if="item.defaultLabourCost==-1">----</span>
                            </div>
                        </el-row>
                    </div>
                    <div class="table-td">
                        <el-row class="input-wrapper" type="flex" align="middle">
                            <span>交货前</span>
                            <div class="table-input">
                                <input class="input-inner" type="number" v-model="item.defaultAdvanceFinishDay"
                                       @input="handleWarningNumInput(item,'defaultAdvanceFinishDay')"/>
                            </div>
                        </el-row>
                    </div>
                    <div class="table-td">
                        <el-row class="input-wrapper" type="flex" align="middle">
                            <el-checkbox @change="v => !v.target.checked?item.delayWarningNum='':''" v-model="item.needDelayWarning"></el-checkbox>
                            <span v-show="item.needDelayWarning">结束前</span>
                            <div class="table-input" v-show="item.needDelayWarning">
                                <input class="input-inner" type="number" v-model="item.delayWarningNum"
                                       @input="handleWarningNumInput(item,'delayWarningNum')"/>
                            </div>
                        </el-row>
                    </div>
                    <div class="table-td">
                        <el-row class="input-wrapper" type="flex" align="middle">
                            <el-checkbox @change="v => {if(!v.target.checked){
                                    item.differenceWarningMin=''
                                    item.differenceWarningMax=''
                                }}" v-model="item.needDifferenceWarning"></el-checkbox>&nbsp;&nbsp;
                            <div class="table-input" v-show="item.needDifferenceWarning">
                                <input @input="small(item)" class="input-inner" type="number" v-model="item.differenceWarningMin"/>
                                -<input class="input-inner" type="number" v-model="item.differenceWarningMax"
                                        @input="handleWarningNumInput(item,'differenceWarningMax')"/>
                            </div>
                        </el-row>
                    </div>
                    <div class="table-td" style="width: 250px">
                        <div class="handle">
                            <div>
                                <icon-button v-show="item.prcdNodeId" class="btn" type="icon-edit"
                                             @click="showEditDialog(item)">修改节点
                                </icon-button>
                            </div>
                            <div v-show="isShowBtn(item)" class="draggable">
                                <icon-button class="btn" type="icon-liebiaocaozuo_tuodong">拖动</icon-button>
                            </div>
                            <div>
                                <icon-button class="btn" type="icon-liebiaocaozuo_shanchu" @click="handleDelete(index)">
                                    删除
                                </icon-button>
                            </div>
                        </div>
                    </div>
                </div>
            </draggable>
            <!-- </div> -->
            <div class="btn-wrapper">
                <el-button class="btn--add" type="text" @click="addListRow">+添加节点</el-button>
            </div>
            <!-- 修改节点名称--dialog -->
            <el-dialog
                    :modal-append-to-body="false"
                    custom-class="nf-dialog-common edit-dialog"
                    title="修改节点名称"
                    size="tiny"
                    :show-close="false"
                    :visible.sync="visible.dialogVisible">
                <p class="edit-tip">
                    <icon type="icon-tips" w="11" h="11"/>
                    修改后，用到此节点的工单和工序模板的节点名称也会被修改。
                </p>
                <el-row class="edit-dialog-form" type="flex" justify="center">
                    <el-form ref="edit-form" :model="editForm" :rules="editRules" inline>
                        <el-form-item label="节点名称" prop="name">
                            <el-input v-model="editForm.name" placeholder="请输入节点名称"></el-input>
                        </el-form-item>
                    </el-form>
                </el-row>
                <!-- footer -->
                <el-row type="flex" justify="center" slot="footer">
                    <nf-button @click="visible.dialogVisible = false">取 消</nf-button>
                    <nf-button
                            class="btn--submit"
                            type="warning"
                            :loading="visible.btnLoading"
                            @click="submit">确 定
                    </nf-button>
                </el-row>
            </el-dialog>
        </div>

        <!--添加节点弹窗-->
        <node-dialog @hiddenShow="isShowNewNode = false" @addNode="isShowNewNode = false;$message.success('新建成功');getAllNode()" :isShow="isShowNewNode"></node-dialog>

    </div>
</template>

<script>
    import {getAllNodeList, editNodeTypes} from '@/api'
    import nodeDialog from '../../templateManage/children/newNodeDialog'
    import draggable from 'vuedraggable';
    import {formatDate} from '@/utils';

    export default {
        props: {
            editable: Boolean,
            editData: Array, // 编辑的数据
            options: Object,
            userList: Array,
            nodeList: Array
        },
        data() {
            return {
                nodeIndex: 0, //新建的节点属于第几个
                isShowNewNode: false, //添加节点弹窗
                visible: {
                    dialogVisible: false,
                    btnLoading: false
                },
                editForm: {
                    name: '',
                    id: '',
                },
                editRules: {
                    name: [
                        {
                            required: true, message: '请输入节点名称'
                        },
                        {
                            max: 20, message: '长度在20个字符内'
                        }
                    ]
                },
                designPrcdNodeTypeId: '',
                listData: [],
                rowData: {
                    prcdNodeId: '',
                    typeId: '',
                    checkChargerIds: [],
                    ailc: false, //是否允许输入工价
                    defaultLabourCost: '', //工价
                    needDifferenceWarning: false, //允许差额提醒
                    defaultAdvanceFinishDay: '', //默认结束日期
                    needDelayWarning: false, //是否需要延期警告
                    delayWarningNum: '', //预警结束日期
                    differenceWarningMin: '',
                    differenceWarningMax: ''
                },
                tableHeaderConf: [
                    {
                        label: '节点名称'
                    },
                    {
                        label: '默认负责人'
                    },
                    {
                        label: '默认工价(元/件)'
                    },
                    {
                        label: '默认结束时间（天）'
                    },
                    {
                        label: '预警提醒 (天)'
                    },
                    {
                        label: '差额提醒(数量)'
                    },
                    {
                        label: '操作',
                        style: {
                            width: '188px',
                            textAlign: 'center'
                        }
                    }
                ]
            };
        },
        watch: {
            options: {
                handler(v) {
                    console.log(v, 'watch');
                    if(v){
                        this.listData = v.nodes.map(item => {
                            return {
                                prcdNodeId: item.id || item.prcdNodeId,
                                // name: item.name,
                                typeId: item.typeId,
                                checkChargerIds:item.chargers?item.chargers.map(charger => {
                                    return charger.id
                                }):item.checkChargerIds.map(charger => {
                                    return charger
                                }),
                                ailc: item.ailc || item.defaultLabourCost<0?false:true, //是否允许输入工价
                                defaultLabourCost: item.dlc || item.defaultLabourCost, //工价
                                needDifferenceWarning: item.allowDifferenceWarning || item.needDifferenceWarning, //允许差额提醒
                                defaultAdvanceFinishDay: item.dafd || item.defaultAdvanceFinishDay, //默认结束日期
                                needDelayWarning: item.needDelayWarning, //是否需要延期警告
                                delayWarningNum: item.delayWarningNum, //预警结束日期
                                differenceWarningMin: item.differenceWarningMin,
                                differenceWarningMax: item.differenceWarningMax
                            }
                        })
                    }
                },
                deep: true
            }
        },
        created() {

        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            }
        },
        components: {
            draggable, nodeDialog
        },
        methods: {
            //设置差额负数
            small(item) {
                if (item.differenceWarningMin > 0) {
                    this.$set(item, 'differenceWarningMin',
                        -Number(item.differenceWarningMin));
                }
            },
            getAllNode(type){
                getAllNodeList({unitId:this.unitId}).then(res => {
                    console.log(res.data,'所有节点');
                    this.nodeList = res.data.prcdNodes
                    if(!type){
                        //区分是属于修改节点名称还是新建节点
                        this.listData[this.nodeIndex].prcdNodeId = this.nodeList[this.nodeList.length-1].id
                        this.selectNode(this.nodeIndex)
                    }
                })
            },
            // 选择节点
            selectNode(index) {
                this.nodeList.forEach(item => {
                    if (item.id == this.listData[index].prcdNodeId) {
                        this.listData[index].prcdNodeId = item.id
                        this.listData[index].typeId = item.typeId
                        this.listData[index].ailc = item.ailc
                        this.listData[index].defaultLabourCost = item.defaultLabourCost || item.ailc?'':-1
                        this.listData[index].needDifferenceWarning = item.allowDifferenceWarning || false
                        this.listData[index].defaultAdvanceFinishDay = ''
                        this.listData[index].needDelayWarning = false
                        this.listData[index].delayWarningNum = ''
                        this.listData[index].differenceWarningMin = ''
                        this.listData[index].differenceWarningMax = ''
                        // this.listData[index] = {
                        //     id: item.id,
                        //     // name: item.name,
                        //     typeId: item.typeId,
                        //     checkChargerIds: [],
                        //     ailc: item.ailc, //是否允许输入工价
                        //     defaultLabourCost: '', //工价
                        //     needDifferenceWarning: item.allowDifferenceWarning, //允许差额提醒
                        //     defaultAdvanceFinishDay: '', //默认结束日期
                        //     needDelayWarning: true, //是否需要延期警告
                        //     delayWarningNum: '', //预警结束日期
                        //     differenceWarningMin: '',
                        //     differenceWarningMax: ''
                        // }
                    }
                })
                // this.listData[index] = obj
                console.log(this.listData,'选择节点');
            },
            handleDateChange(item, index) {
                if (!item.end) return;
                item.end = formatDate(item.end, 'yyyy-MM-dd')
            },
            validName(rule, value, callback) {
                if (!value) {
                    return callback(new Error('请输入节点名称'))
                }
                else {
                    // 此节点已存在，请检查后输入新的节点名称。
                    callback();
                }
            },
            isShowBtn(item) {
                if (this.editable) {
                    return item.designPrcdNodeTypeId != 5;
                }
                return this.designPrcdNodeTypeId !== item.id;
            },
            // 添加一行
            addListRow() {
                this.listData.push(JSON.parse(JSON.stringify(this.rowData)));
            },
            // 移除一行
            handleDelete(index) {
                this.listData.splice(index, 1);
                console.log('删除');
            },
            checkMove(evt, originalEvent) {
                // const lastIndex = evt.draggedContext.futureIndex;
                // const id = this.listData[lastIndex].id;
                // if (!id) return;
                // const finalNode = this.options.nodeOptions.find(item => id === item.id);
                // if (finalNode.designPrcdNodeTypeId == '5') {
                //     // 取消排序
                //     return false;
                // }
            },
            handleWarningNumInput(item, key) {
                item[key] = item[key].toString().replace(/-/g, '')
                if(key == 'defaultLabourCost'){
                    let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                    if (!reg.test(item[key])) {
                        item[key] = item[key].slice(0,-1)
                    }
                }else if(key == 'defaultAdvanceFinishDay' || key == 'delayWarningNum'){
                    if(item[key].split('.').length>1){
                        item[key] = item[key].split('.')[0]
                    }
                }
            },
            showEditDialog(row) {
                console.log(row);
                const fItem = this.nodeList.find(item => item.id === row.prcdNodeId);
                this.editForm = {
                    name: fItem.name,
                    id: fItem.id,
                    userId: this.userId,
                    unitId: this.unitId
                };
                this.visible.dialogVisible = true;
            },
            // 提供外部父组件获取数据
            getNodeList() {
                return this.listData;
            },
            submit() {
                this.$refs['edit-form'].validate((valid) => {
                    if (valid) {
                        const params = this.editForm;
                        this.visible.btnLoading = true;
                        editNodeTypes(params)
                            .then(res => {
                                this.visible.btnLoading = false;
                                if (res.data.code === 0) {
                                    this.$message.success('修改成功');
                                    this.visible.dialogVisible = false
                                    this.getAllNode(1)
                                }
                                else {
                                    this.$message.error(res.data.msg || '修改失败');
                                }
                            });
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    #flow-table {
        .table-body input {
            height: 30px;
            font-size: 12px;
            border: none
        }
        .el-checkbox__inner {
            width: 14px;
            height: 14px;
            border-radius: 2px;
            &::after {
                border-width: 1px;
                height: 8px;
                left: 4px;
                top: 0
            }
        }
        .edit-dialog {
            .el-dialog__body {
                position: relative;
            }
        }
    }
</style>


<style lang="scss" scoped>
    .table {
        $--border-color: #e6e8eb;
        box-sizing: border-box;
        display: table;
        table-layout: fixed;
        width: 100%;
        margin-top: 12px;
        font-size: 12px;
        color: #808080;
        border: 1px solid $--border-color;
        .table-tr {
            display: table-row;
            box-sizing: border-box;
        }
        .table-td,
        .table-th {
            box-sizing: border-box;
            display: table-cell;
            vertical-align: middle;
            padding: 0 10px;
            border-bottom: 1px solid $--border-color;
            &:not(:last-child) {
                border-right: 1px solid $--border-color;
            }
        }
        .table-th {
            height: 28px;
            line-height: 28px;
            background: #F7F9FC;
        }
        .table-header {
            display: table-header-group;
        }
        .table-body {
            display: table-row-group;
            .table-td {
                padding: 2px 10px;
            }
        }
        .handle {
            display: flex;
            color: #929aa6;
            div {
                display: inline-block;
                cursor: pointer;
                margin-right: 12px;
                &:last-child {
                    margin-right: 0;
                }
            }
            .btn {
                font-size: 12px;
            }
        }
        .btn--add {
            margin-left: 10px;
            color: #FFA914;
            font-size: 12px;
        }
    }

    .input-wrapper {
        span {
            padding: 0 5px;
        }
        .table-input {
            display: flex;
            align-items: center;
            flex: 1
        }
        .input-inner {
            width: 100%;
            box-sizing: border-box;
            height: 24px !important;
            vertical-align: middle;
            padding: 2px 5px;
            background: #F5F7FA;
            border-radius: 2px;
        }
    }

    .btn--submit {
        margin-left: 12px;
    }

    .edit-dialog-form {
        margin-top: 22px;
    }

    .edit-tip {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        font-size: 12px;
        padding: 5px 16px;
        background: #F5F7FA
    }
</style>
