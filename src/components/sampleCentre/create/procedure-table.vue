<template>
    <div class="table" id="procedure-table" ref="procedure-table">
        <div class="table-header">
            <div class="table-tr">
                <div class="table-th" v-for="(item, index) of tableHeaderConf" :key="index">
                    {{ item.label }}
                </div>
            </div>
        </div>
        <draggable class="table-body" v-model="procedureList" :move="checkMove" :options="{handle:'.draggable'}">  
            <div class="table-tr"
                v-for="(item, index) in procedureList"
                :key="index">
                <div class="table-td">
                    <el-select v-model="item.nodeId" filterable :disabled="nodeSelectDisable(item.nodeId)" placeholder="选择节点">
                        <el-option disabled>
                            <div class="option__btn--add" @click.stop="showAddNodeSlide(item)">+新建</div>
                        </el-option>
                        <el-option
                            v-for="item of nodeOptions"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"
                            :disabled="item.designPrcdNodeTypeId == 5"></el-option>
                    </el-select>
                </div>
                <div class="table-td">
                    <!-- <el-select v-model="item.nodeSubmitIds" multiple  placeholder="选择提交人">
                        <el-option v-for="userItem of options.userOptions" :key="userItem.id" :value="userItem.id" :label="userItem.userName"></el-option>
                    </el-select> -->
                    <v-user-select
                        v-model="item.nodeSubmitIds"
                        :options="groupOptions"
                        @remote="fetchUnitUser"
                        placeholder="选择提交人"></v-user-select>
                </div>
                <div class="table-td">
                        <!-- <el-select v-model="item.nodeAuditingIds" multiple  placeholder="审核人">
                            <el-option v-for="userItem of options.userOptions" :key="userItem.id" :value="userItem.id" :label="userItem.userName"></el-option>
                        </el-select> -->
                        <v-user-select
                            v-model="item.nodeAuditingIds"
                            :options="groupOptions"
                            @remote="fetchUnitUser"
                            placeholder="审核人"></v-user-select>
                </div>
                <div class="table-td">
                    <!-- <el-select v-model="item.nodeUserIds" multiple  placeholder="默认负责人">
                        <el-option v-for="userItem of options.userOptions" :key="userItem.id" :value="userItem.id" :label="userItem.userName"></el-option>
                    </el-select> -->
                    <v-user-select
                            v-model="item.nodeUserIds"
                            :options="groupOptions"
                            @remote="fetchUnitUser"
                            placeholder="默认负责人"></v-user-select>
                </div>
                <div class="table-td">
                    <el-date-picker
                        @change="handleDateChange(item, index)"
                        v-model="item.endAt"
                        type="date"
                        placeholder="选择结束日期">
                    </el-date-picker>
                </div>
                <div class="table-td">
                    <el-row class="input-wrapper" type="flex" align="middle">
                        <el-checkbox v-model="item.needDelayWarning"></el-checkbox>
                        <span v-show="item.needDelayWarning">结束前</span>
                        <div class="table-input" v-show="item.needDelayWarning">
                            <input class="input-inner" type="number" v-model="item.delayWarningNum" />
                        </div>
                    </el-row>
                </div>
                <div class="table-td">
                    <div class="handle">
                        <div class="draggable" v-show="!nodeSelectDisable(item.nodeId)">
                            <i class="fa fa-bars"></i>拖动
                        </div>
                        <div @click="handleDelete(index)" v-show="!nodeSelectDisable(item.nodeId)">
                            <i class="fa fa-times"></i>删除
                        </div>
                    </div>
                </div>
            </div>
        </draggable>
        <div class="btn-wrapper">
            <el-button class="btn--add" type="text" @click="addListRow(null)">+添加节点</el-button>
        </div>
        <div class="node-design-slide" v-if="slideShow">
            <div class="slide-wrapper">
                <node-design-create
                    is-component
                    @on-cancel="slideShow = false"
                    @on-success="handleAddNodeSuccess"></node-design-create>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import { formatDate } from '@/utils';
import { getUnitUser } from '@/api';
import { getDesignNodeList } from '@/api/sample-centre';
import NodeDesignCreate from '../design/node-design-create';
export default {
    props: {
        options: Object,
        value: []
    },
    computed: {
        procedureList: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        },
        unitId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId;
        },
    },
    data() {
        return {
            slideShow: false,
            nodeOptions: [],
            groupOptions: [],
            addNodeItem: {},
            rowData: {
                nodeId: '',
                endAt: '',
                nodeSubmitIds: [],
                nodeAuditingIds: [],
                nodeUserIds: [],
                needDelayWarning: false,
                delayWarningNum: ''
            },
            tableHeaderConf: [
                {
                    label: '节点名称'
                },
                {
                    label: '提交人'
                },
                {
                    label: '审核人'
                },
                {
                    label: '默认负责人'
                },
                {
                    label: '计划结束日期'
                },
                {
                    label: '预警提醒 (天)'
                },
                {
                    label: '操作'
                }
            ]
        };
    },
    components: {
        draggable,
        NodeDesignCreate
    },
    created() {
        this.fetchUnitUser();
        this.fetchNodeList();
    },
    methods: {
        fetchUnitUser(keyword = '') {
            getUnitUser({
                keyword,
                unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                // keyword: val
            }).then(res => {
                if (!res.data.data.facGroupDTOS) {
                    return;
                }
                this.groupOptions = res.data.data.facGroupDTOS;
            });
        },
        nodeSelectDisable(id) {
            return this.nodeOptions.some(item => {
                return item.id === id && item.designPrcdNodeTypeId == 5;
            });
        },
        // 获取节点列表
        fetchNodeList() {
            const params = {
                unitId: this.unitId
            }
            return getDesignNodeList(params)
            .then(res => {
                const { data } = res.data;
                this.nodeOptions = data;
                return data;
            });
        },
        async handleAddNodeSuccess(id) {
            const data = await this.fetchNodeList();
            this.addNodeItem.nodeId = id;
            this.$nextTick(() => {
                this.slideShow = false;
            });
        },
        showAddNodeSlide(item) {
            this.addNodeItem = item;
            this.slideShow = true;
        },
        handleDateChange(item, index) {
            if (!item.endAt || typeof item.endAt !== 'object') return;
            item.endAt = formatDate(item.endAt, 'yyyy-MM-dd')
            console.log(item)
        },
         // 添加一行
        addListRow(id) {
            const cloneRow = JSON.parse(JSON.stringify(this.rowData));
            cloneRow.nodeId = id ? id : cloneRow.nodeId;
            const index = this.procedureList.length ? this.procedureList.length - 1 : 0;
            this.procedureList.splice(index, 0, cloneRow);
        },
        // 移除一行
        handleDelete(index) {
            this.procedureList.splice(index, 1);
        },
        checkMove(evt, originalEvent) {
            const lastIndex  = evt.draggedContext.futureIndex;
            const id = this.procedureList[lastIndex].designPrcdNodeTypeId;
            if (!id) return;
            if (id == 5) {
                // 取消排序
                return false;
            }
        },
    }
}
</script>

<style lang="scss">
    #procedure-table {
        .table-body input {
            height: 30px;
            font-size: 12px;
            border: none
        }
        .el-date-editor.el-input {
            width: 100%
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
        .draggable-table {
           display: table;
            table-layout: fixed;
        }
        .handle {
            color: #929aa6;
            div {
                display: inline-block;
                cursor: pointer;
                margin: 0 8px;
            }
            .el-icon-edit {
                color: #1e96ff;
                margin-right: 5px;
            }
            i.fa {
                vertical-align: middle;
                font-size: 18px;
                margin-right: 6px;
            }
            .fa-pencil-square-o {
                color: #1e96ff;
            }
            .fa-times {
                color: #f03535;
            }
        }
        .btn--add {
            margin-left: 10px;
            color: #FFA914;
            font-size: 12px;
        }
    }
    .option__btn--add {
        color: #FF7F14;
        cursor: pointer;
        text-align: center;
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
