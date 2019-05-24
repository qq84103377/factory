<template>
<div v-loading="visible.loading">
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
        <draggable class="table-body" v-model="listData" :move="checkMove" :options="{handle:'.draggable', forceFallback: false,}">
            <div class="table-tr"
                v-for="(item, index) in listData"
                :key="index">
                <div class="table-td">
                    <el-select popper-class="nodeSelect" v-model="item.id"  filterable  placeholder="选择节点">
                        <el-option disabled>
                            <div class="option__btn--add" @click.stop="showAddNodeSlide(item)">+新建</div>
                        </el-option>
                        <el-option

                            v-for="$item of nodeOptions"
                            :key="$item.id"
                            :value="$item.id"
                            :label="$item.name">
                            <div class="nodeSelectLabel" @click="nodeChange($item,item)">{{$item.name}}</div>
                        </el-option>
                    </el-select>
                </div>
                <!--<div class="table-td">-->
                    <!--&lt;!&ndash;<v-user-select&ndash;&gt;-->
                        <!--&lt;!&ndash;v-model="item.nodeSubmitIds"&ndash;&gt;-->
                        <!--&lt;!&ndash;:options="groupOptions"&ndash;&gt;-->
                        <!--&lt;!&ndash;@remote="fetchUnitUser"&ndash;&gt;-->
                        <!--&lt;!&ndash;placeholder="提交人"></v-user-select>&ndash;&gt;-->
                    <!--<workerLeader  v-if="groupOptions && groupOptions.length" :isDisabled="item.designPrcdNodeTypeId == 2"  v-model="item.nodeSubmitIds" placeholder="提交人" :manListProps="groupOptions"></workerLeader>-->
                <!--</div>-->
                <div class="table-td">
                    <!--<v-user-select-->
                        <!--v-model="item.nodeUserIds"-->
                        <!--:options="groupOptions"-->
                        <!--@remote="fetchUnitUser"-->
                        <!--placeholder="默认负责人"></v-user-select>-->
                    <workerLeader v-if="groupOptions && groupOptions.length"   v-model="item.nodeUserIds" placeholder="默认负责人" :manListProps="groupOptions"></workerLeader>

                    <!-- <el-select v-model="item.nodeUserIds" multiple  placeholder="默认负责人">
                        <el-option v-for="userItem of options.userOptions" :key="userItem.id" :value="userItem.id" :label="userItem.userName"></el-option>
                    </el-select> -->
                </div>
                <!--默认负责组-->
                <div class="table-td">
                    <charge-group-select v-if="groupOptions && groupOptions.length" v-model="item.nodeGroupId" :groupList="groupOptions"></charge-group-select>
                </div>
                <div class="table-td">
                    <workerLeader  v-if="groupOptions && groupOptions.length" :isDisabled="item.designPrcdNodeTypeId != 2" v-model="item.nodeAuditingIds" :manListProps="groupOptions"></workerLeader>

                    <!--<v-user-select-->
                    <!--v-model="item.nodeAuditingIds"-->
                    <!--:options="groupOptions"-->
                    <!--@remote="fetchUnitUser"-->
                    <!--placeholder="审核人"></v-user-select>-->
                    <!-- <el-select v-model="item.nodeAuditingIds" :disabled="auditSelectDisabled(item.id)" multiple  placeholder="审核人">
                        <el-option v-for="userItem of options.userOptions" :key="userItem.id" :value="userItem.id" :label="userItem.userName"></el-option>
                    </el-select> -->
                </div>
                <div class="table-td">
                    <el-row class="input-wrapper" align="middle" type="flex">
                        <span>预计完成前</span>
                        <div class="table-input">
                            <input class="input-inner" v-model="item.daysAdvanced" type="number"  @input="handleAdvancedInput(item)" />
                        </div>
                    </el-row>
                </div>
                <div class="table-td">
                    <el-row class="input-wrapper" type="flex" align="middle">
                        <el-checkbox v-model="item.needDelayWarning"></el-checkbox>
                        <span v-show="item.needDelayWarning">结束前</span>
                        <div class="table-input" v-show="item.needDelayWarning">
                            <input class="input-inner" type="number" v-model="item.delayWarningNum" @input="handleWarningNumInput(item)" />
                        </div>
                    </el-row>
                </div>
                <div class="table-td" style="width: 250px">
                    <div class="handle">
                        <div>
                            <icon-button v-show="item.id" class="btn" type="icon-edit" @click="showEditDialog(item)">修改节点</icon-button>
                        </div>
                        <div v-show="item.id" class="draggable">
                            <icon-button class="btn" type="icon-liebiaocaozuo_tuodong">拖动</icon-button>
                        </div>
                        <div v-show="item.id">
                            <icon-button class="btn" type="icon-liebiaocaozuo_shanchu" @click="handleDelete(index)">删除</icon-button>
                        </div>
                    </div>
                </div>
            </div>
        </draggable>
        <!-- </div> -->
        <div class="btn-wrapper">
            <el-button class="btn--add" type="text" @click="addListRow(null)">+添加节点</el-button>
        </div>
        <!-- 修改节点名称--dialog -->
        <el-dialog
            custom-class="nf-dialog-common edit-dialog"
            title="修改节点名称"
            size="tiny"
            :show-close="false"
            :visible.sync="visible.dialogVisible">
            <p class="edit-tip">
                <icon type="icon-waring" w="11" h="11"/>
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
                    @click="submit">确 定</nf-button>
            </el-row>
        </el-dialog>
        <div class="node-design-slide" v-if="visible.slideShow">
            <div class="slide-wrapper">
                <node-design-create
                    is-component
                    @on-cancel="visible.slideShow = false"
                    @on-success="handleAddNodeSuccess"></node-design-create>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import draggable from 'vuedraggable';
import { formatDate } from '@/utils';
import { getUnitUser } from '@/api';
import { editDesignNodeName, getDesignNodeList } from '@/api/sample-centre';
import NodeDesignCreate from './node-design-create';
import chargeGroupSelect from '@/components/Common/custom-select/chargeGroupSelect'
export default {
    props: {
        editable: Boolean,
        options: Object,
        value: []
    },
    data() {
        return {
            addNodeItem: {}, // 点击添加新节点的数据
            visible: {
                dialogVisible: false,
                btnLoading: false,
                slideShow: false,
                loading: false
            },
            nodeOptions: [],
            groupOptions: [],
            editForm: {
                name: '',
                prcdNodeId: ''
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
            // listData: [],
            rowData: {
                id: '',
                nodeSubmitIds: [],
                nodeAuditingIds: [],
                nodeUserIds: [],
                daysAdvanced: 0,
                needDelayWarning: false,
                delayWarningNum: ''
            },
            tableHeaderConf: [
                {
                    label: '节点名称'
                },
                // {
                //     label: '提交人'
                // },
                {
                    label: '默认负责人'
                },
                {
                    label: '默认负责组'
                },
                {
                    label: '评审人'
                },
                {
                    label: '默认结束日期（天）'
                },
                {
                    label: '预警提醒 (天)'
                },
                {
                    label: '操作',
                    style: {
                        width: '250px'
                    }
                }
            ]
        };
    },
    components: {
        draggable,
        NodeDesignCreate,
        chargeGroupSelect,
    },
    watch: {
    },
    computed: {
        listData: {
            get() {
                return this.value;
            },
            set(val) {
                console.log(val);
                this.$emit('input', val);
            }
        },
        unitId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId;
        },
    },
    async created() {
        this.fetchUnitUser();
        await this.fetchNodeList();
        if (this.editable) {
            // this.listData = this.editData;
            return;
        }
        this.addFinalRow();
    },
    methods: {
        fetchUnitUser(keyword = '') {
            console.log(keyword)
            getUnitUser({
                keyword,
                unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                // keyword: val
            }).then(res => {
                if (!res.data.data.facGroupDTOS) {
                    return;
                }
                this.groupOptions = res.data.data.facGroupDTOS;

                console.log(res);
            });
        },
        // 获取节点列表
        fetchNodeList() {
            const params = {
                unitId: this.unitId
            }
            this.visible.loading = true;
            return getDesignNodeList(params)
            .then(res => {
                const { data } = res.data;
                this.nodeOptions = data;
                this.visible.loading = false;
                return data;
            });
        },
        auditSelectDisabled(id) {
            return this.editable && this.nodeOptions.some(item => {
                // return this.listData.some(listItem => {
                    return item.id === id && item.designPrcdNodeTypeId == 2;
                // });
            });
        },
        nodeChange($item,item){
            this.$set(item,'designPrcdNodeTypeId',$item.designPrcdNodeTypeId)
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
        // isShowBtn(item) {
        //     if (this.editable) {
        //         return item.designPrcdNodeTypeId != 5;
        //     }
        //     return this.designPrcdNodeTypeId !== item.id;
        // },
        // 默认增加一行终审节点
        addFinalRow() {
            const finalNode = this.options.nodeOptions.find(item => item.designPrcdNodeTypeId == '5');
            this.designPrcdNodeTypeId = finalNode.id;
            this.addListRow(finalNode.id);
        },
        // 添加一行
        addListRow(id) {
            const cloneRow = JSON.parse(JSON.stringify(this.rowData));
            cloneRow.designPrcdNodeTypeId = id ? '5' : '';   // 默认增加的一行终审节点需添加designPrcdNodeTypeId
            cloneRow.id = id ? id : cloneRow.id;
            this.listData.push(cloneRow)
            // const index = this.listData.length ? this.listData.length - 1 : 0;
            // const arr = this.listData.slice();
            // this.listData.splice(index, 0, cloneRow);
        },
        // 移除一行
        handleDelete(index) {
            this.listData.splice(index, 1);
        },
        checkMove(evt, originalEvent) {
            const lastIndex  = evt.draggedContext.futureIndex;
            const id = this.listData[lastIndex].id;
            if (!id) return;
            const finalNode = this.options.nodeOptions.find(item => id === item.id);
            if (finalNode.designPrcdNodeTypeId == '5') {
                // 取消排序
                return false;
            }
        },
        handleAdvancedInput(item) {
            item.daysAdvanced = item.daysAdvanced.replace(/-/g, '');
        },
        handleWarningNumInput(item) {
            item.delayWarningNum = item.delayWarningNum.replace(/-/g, '');
        },
        async handleAddNodeSuccess(id) {
            const data = await this.fetchNodeList();
            this.addNodeItem.id = id;
            this.$nextTick(() => {
                this.visible.slideShow = false;
            });
        },
        showAddNodeSlide(item) {
            this.addNodeItem = item;
            this.visible.slideShow = true;
        },
        showEditDialog(row) {
            console.log(row, this.options.nodeOptions)
            const fItem = this.nodeOptions.find(item => item.id === row.id);
            this.editForm = {
                name: fItem.name,
                prcdNodeId: fItem.id
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
                    editDesignNodeName(params)
                    .then(res => {
                        this.visible.btnLoading = false;
                        if (res.data.code === 0) {
                            this.$message.success('修改成功');
                            this.fetchNodeList();
                            this.visible.dialogVisible = false
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
    .nodeSelect {
        .el-select-dropdown__item{
            padding: 0;
        }
        .nodeSelectLabel{
            width: 100%;
            height: 100%;
            padding: 8px 10px;
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
                margin: 0 8px;
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
            flex: 1
        }
        .input-inner {
            width: 100%;
            box-sizing: border-box;
            height: 24px!important;
            vertical-align: middle;
            padding: 2px 5px;
            background: #F5F7FA;
            border-radius: 2px;
        }
    }
    .option__btn--add {
        color: #FF7F14;
        cursor: pointer;
        text-align: center;
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
        color: red;
        background: #F5F7FA
    }
    .node-design-slide {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 99;
        background: rgba(0, 0, 0, .4);
        .slide-wrapper {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 60%;
            background: #fff;
            height: 100%;
            box-sizing: border-box;
            padding: 32px;
        }
    }
</style>
