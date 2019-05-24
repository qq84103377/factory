<template>
    <section class="create-section" id="add_template">
        <div class="nf-scroll-container">
            <page-title title="添加模板">
                <nf-button @click="$router.push('/nodeManage')">
                    取消
                </nf-button>
                <nf-button type="warning" :loading="isLoading" @click="addNodeTemplate()">确定</nf-button>
            </page-title>
            <div class="nf-scroll-view">
                <div class="create-main">
                    <div class="main-title">
                        基本信息
                    </div>
                    <div class="procedure-name">
                        <div class="form-wrap">
                            <div class="form-item">
                                <label class="form-label is-require">工序名称</label>
                                <el-input placeholder="请输入名称" v-model.trim="tableData.name"></el-input>
                            </div>
                        </div>
                        <div class="form-wrap search-man">
                            <div class="form-item selLeader">
                                <label class="form-label">默认负责人</label>
                                <template>
                                    <workerLeader v-model="tableData.chargerIds" :placeholder="'请选择负责人'" ></workerLeader>

                                    <!--<el-select v-model="value10" multiple filterable allow-create placeholder="请选择负责人" @change="showSelect($event)">-->
                                        <!--<el-option v-for="item in options5" :key="item.value" :label="item.userName" :value="item.id">-->
                                        <!--</el-option>-->
                                    <!--</el-select>-->
                                </template>
                            </div>
                        </div>
                        <div class="form-wrap search-man">
                            <div class="form-item selLeader">
                                <el-checkbox @change="handleChange" v-model="tableData.defaultAllOrderOutside"></el-checkbox>
                                <span>&nbsp;&nbsp;默认整单外发</span>
                            </div>
                        </div>
                    </div>
                    <div class="procedure-flow">
                        <div class="main-title" style="margin-bottom:24px;">
                            工序流程
                        </div>
                        <node-list ref="nodeList" :time ="true" @nodeList="nodeLists" :isWholeHair="tableData.defaultAllOrderOutside"></node-list>
                    </div>
                    <div style="margin-top: 30px;">
                        <el-checkbox v-model="tableData.delayNotify">自定义配置工单延误提醒</el-checkbox>
                        <p style="color: #97a2be;font-size: 12px;margin: 6px 0 14px">当满足以下条件时，工单不再显示延误时间和延误状态。</p>
                        <el-form v-show="tableData.delayNotify" ref="form" :model="form" label-width="80px" label-position="left" inline>
                            <el-form-item label="节点">
                                <el-select v-model="tableData.prcdNodeId" placeholder="请选择节点">
                                    <el-option :label="item.name" :value="item.id" v-for="item in nodeListsCanSel" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="节点状态">
                                <el-select v-model="tableData.prcdNodeStatus" placeholder="请选择节点状态">
                                    <el-option label="进行中" value="1"></el-option>
                                    <el-option label="已完成" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import nodeList from "./children/nodeList"
import {
    addTaskNode,
    getEasyTaskNodeList,
    addTemplate,
    queryTaskNodeList,
    getWorkbayList,
    checkTemplateName,
    getPersonList,
    getDicReportTypeList,
    createNodeTemplate,
    getUnitUser,
} from "../../api/api";
export default {
    data() {
        return {
            nodeListsCanSel:[],

            form:{
                nodeSelId:'',
                status:'',
            },
            isLoading: false,
            formInline: {},
            arr: [],
            selectVal: "",
            tableData: {
                prcdNodeId:'',
                prcdNodeStatus:'',
                delayNotify:false,
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                name: "",
                chargerIds: [],
                defaultAllOrderOutside: false,
                nodes: [
                    {
                        nodeId: "",
                        targetType: "",
                        nodeUserIds: [],
                        endAt: "",
                        beginAt: "",
                        allowOutsideBalance: false,
                        upstreamNodeId: ""
                    }
                ]
            },
            options5:[],
            nodeList: [],
            nodeId: "",
            targetType: "",
            //搜索
            restaurants: [],
            state4: "",
            timeout: null,
            value10: [],
        };
    },
    components: {
        nodeList,
    },
    methods: {
        handleChange(v) {
                this.$refs['nodeList'].resetOutside()
        },
        nodeLists(val) {
            console.log(val);
            //节点下拉框
            let valSel = JSON.parse(JSON.stringify(val));
            //数组去空的id值
            valSel = valSel.filter(item=>item.id);
            let nodeListsCanSel = valSel.map(item=>{
                return {
                    id:item.id,
                    name:item.name,
                }
            }),nodeListsCanSelNoRepeat=[];
            //数组去重
            nodeListsCanSel.forEach(item=>{
                let flag = true;
                nodeListsCanSelNoRepeat.forEach($item=>{
                    if($item.id===item.id){
                        flag = false
                    }

                })
                if(flag){
                    nodeListsCanSelNoRepeat.push(item)
                }
            });
            this.nodeListsCanSel = nodeListsCanSelNoRepeat;
            //已经删掉的节点要重新选择
            if(!this.nodeListsCanSel.find(item=>item.id===this.form.nodeSelId)){
                this.form.nodeSelId = ''
            }
            this.tableData.nodes = val;
        },
        //------添加节点接口---------
        addNodeTemplate() {
            if (!this.tableData.name) {
                this.$message({
                    message: "模板名为空",
                    duration: this.$globalConfig.elementUI.duration,
                    type: "error"
                });
                return false;
            }
            let params1 = {
                token: "",
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                name: this.tableData.name
            };
            this.isLoading = true;
            checkTemplateName(params1).then(res => {
                if (res.data.code == 0) {
                    this.$message({
                        message: "已经有该模板了哟",
                        duration: this.$globalConfig.elementUI.duration,
                        type: "error"
                    });
                    this.isLoading = false;
                    return false;
                } else {
                    let params = this.tableData;
                    console.log(params);
                    const arr = [];
                    for (let i = 0; i < params.nodes.length; i++) {
                        // if(params.nodes[i].needDelayWarning===false) {
                        //     this.$message.error('请设置预警提醒天数');
                        //     return;
                        // }
                        // if(params.nodes[i].delayWarningNum<=0) {
                        //     this.$message.error('预警提醒天数不能小于等于0')
                        //     return;
                        // }
                        if (params.nodes[i].id) {
                            arr.push(params.nodes[i]);
                        }
                    }
                    params.nodes = arr;
                    if (arr.length == 0) {
                        this.$message({
                            message: "节点不能为空",
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                        this.isLoading = false;
                        return false;
                    } else {
                        createNodeTemplate(params).then(res => {
                            if(res.data.code ==0) {
                                this.$router.push("/nodeManage");
                            }else {
                                this.$message.error(res.data.msg);
                            }
                            this.isLoading = false;
                        });
                    }
                }
            });
        },
        getNodeList() {
            //获取负责人接口
            let params1 = {
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                keyword: "",
                token: "",
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id
            };
            getPersonList(params1).then(res => {
                this.options5 = res.data;
            });
        },
        showSelect(val) {
            this.tableData.chargerIds = val;
        },


        getManId(val) {
            this.tableData.chargerIds = val;
        },
    },
    created() {
        this.getNodeList();

    }
};
</script>

<style scoped lang="scss">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    margin-bottom: 15px;
    line-height: 64px;
    background: #ffffff;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
    .title {
        font-size: 18px;
        color: #2c2c2c;
    }
    .btn-wrap {
        display: inline-block;
        text-align: center;
    }
}

.create-main {
    padding: 32px;
    background: #ffffff;
    .main-title {
        font-size: 20px;
        border-left: 6px solid #ff9c38;
        text-indent: 12px;
    }
    .procedure-name {
        margin: 32px 0;
    }
    .form-wrap {
        display: inline-block;
        margin-right: 57px;
    }
    .form-item {
        display: flex;
        align-items: center; // width: 250px;
        .el-input {
            width: 180px;
        }
    }
    .form-label {
        font-size: 14px;
        padding-right: 10px;
        &.is-require::before {
            content: "*";
            color: #ff0000;
            margin-right: 4px;
        }
    }
}

.procedure-flow {
    .form-label {
        display: inline-block;
        margin-bottom: 16px;
    }
}
.add {
    width: 100%;
    padding: 6px 0;
    text-indent: 16px;
    border: 1px solid #e6e8eb;
    border-top: none;
    .el-button--text {
        color: #ff9c38;
    }
}
</style>
<style lang="scss">
#add_template {
    width: 100%;
    height: 100%;
}
#add_template .table .el-input__inner {
    border: none;
    border-radius: 0;
    &::-webkit-input-placeholder {
        color: #636363;
    }
}

#add_template .table .node_user .el-input__inner {
    border: none;
    border-radius: 0;
    width: 350px;
    &::-webkit-input-placeholder {
        color: #636363;
    }
}

#add_template .table .node_user .el-tag--primary {
    background-color: #fff;
    border: none;
    color: #2c2c2c;
    .el-icon-close {
        color: #d7d7d7;
        &:hover {
            color: #ccc;
        }
    }
}

#add_template .search-man .el-input__inner {
    width: 180px;
    &::-webkit-input-placeholder {
        color: #636363;
    }
    &:focus {
        outline: 0;
        border-color: #ff9c38;
    }
}

#add_template .search-maned .el-input__inner {
    width: 490px;
    &::-webkit-input-placeholder {
        color: #636363;
    }
    &:focus {
        outline: 0;
        border-color: #ff9c38;
    }
}

#add_template .search-man .el-tag--primary {
    background-color: #fff;
    border: none;
    color: #2c2c2c;
    .el-icon-close {
        color: #d7d7d7;
    }
}

#add_template .search-man .el-icon-close {
    &:hover {
        color: #d7d7d7;
    }
}

.el-input__inner:focus {
    outline: 0;
    border-color: #ff9c38;
}
.el-select .el-input__inner:focus {
    border-color: #ff9c38;
}
.el-select .el-input__inner:hover {
    border-color: #ff9c38;
}
#new_node {
    background-color: #fff !important;
    &:hover {
        background-color: #fff;
    }
}
#new_node.el-select-dropdown__item.selected.hover {
    background-color: #fff;
}
#new_node.el-select-dropdown__item.selected.hover {
    background-color: transparent;
    color: #2c2c2c;
}
#new_node.el-select-dropdown__item.selected {
    color: #2c2c2c;
    background-color: transparent;
}
</style>
