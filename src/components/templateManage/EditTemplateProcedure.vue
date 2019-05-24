<template>
    <section class="create-section" id="add_template">
        <div class="nf-scroll-container">
            <div class="header">
                <div class="title">修改模板</div>
                <div class="btn-wrap">
                    <nf-button @click="$router.push('/procedureInfo?id='+$route.query.id)">
                        <a>取消</a>
                    </nf-button>
                    <nf-button type="warning" @click="changeNodeTemplate">确定</nf-button>
                </div>
            </div>
            <div class="nf-scroll-view">
                <div class="create-main">
                    <div class="main-title">
                        基本信息
                    </div>
                    <div class="procedure-name">
                        <div class="form-wrap">
                            <div class="form-item">
                                <label class="form-label is-require">工序名称</label>
                                <el-input placeholder="请输入名称" v-model="tableData.name"></el-input>
                            </div>
                        </div>
                        <div class="form-wrap search-man">
                            <div class="form-item">
                                <label class="form-label">默认负责人</label>
                                <template >
                                    <workerLeader v-model="tableData.chargerIds"  :placeholder="'请选择负责人'" ></workerLeader>
                                </template>
                            </div>
                        </div>
                        <div class="form-wrap search-man">
                            <div class="form-item">
                                <el-checkbox @change="$refs['nodeList'].resetOutside()" v-model="tableData.defaultAllOrderOutside"></el-checkbox>
                                <span>&nbsp;&nbsp;默认整单外发</span>
                            </div>
                        </div>
                    </div>
                    <div class="procedure-flow">
                        <div class="main-title" style="margin-bottom:24px;">
                            工序流程
                        </div>
                        <node-list ref="nodeList" @nodeList ="nodeLists" :time ="true" :nodeData='tableData.nodes' :isWholeHair="tableData.defaultAllOrderOutside"></node-list>
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
import draggable from 'vuedraggable'
import nodeList from './children/nodeList'
import { editNodeTemplate,templateInfo,addTaskNode, getEasyTaskNodeList,getDicReportTypeList, addTemplate, queryTaskNodeList, getWorkbayList, checkTemplateName, getTemplate, updateTemplate,getPersonList } from '../../api/api'
export default {
    data() {
        return {
            nodeListsCanSel:[],
            configChecked:false,
            form:{
                nodeSelId:'',
                status:'',
            },
            leaderIdGetOver:false,
            formInline: {},
            arr: [],
            selectVal: '',
            tableData: {
                delayNotify:false,
                prcdNodeId:'',
                prcdNodeStatus:'',
                "unitId": JSON.parse(sessionStorage.getItem('last_login')).id,
                "name": "",
                "token": "token",
                "chargerIds": [],
                "defaultAllOrderOutside":false,
                "nodes": [
                ],
            },
            nodeList: [],
            nodeId: '',
            value10: [],
            options5: [],
            test: [],
            options:[],
            formLabelAlign: {
                nodename: "",
                region: "",
                id: "",
                type: "",
                multiple: []
            },
            index_node: -1,
        }
    },
    components: {
        draggable,
        nodeList
    },
    methods: {
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
        addNewNode() {
            if( this.formLabelAlign.nodename=='') {
                this.$message({
                    message: '请填写节点名称',
                    duration: this.$globalConfig.elementUI.duration,
                    type: "error"
                });
                return;
            }
            if( this.formLabelAlign.id=='') {
                this.$message({
                    message: '请选择节点类型',
                    duration: this.$globalConfig.elementUI.duration,
                    type: "error"
                });
                return;
            }
            let params = {
                token: "",
                name: this.formLabelAlign.nodename,
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                roleId: "",
                targetId: this.formLabelAlign.id,
                isClosed: false,
                position: "",
                defaultDoneRatio: "",
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            };
            addTaskNode(params).then(res => {
                if (res.data.code == 2) {
                    this.nodeRepeat = true;
                } else {
                this.visible.editVisible = false;
                this.visible.createVisible = false;
                }
                this.getNodeList();
            });
        },
        //获取可选的节点类型
        getNodeType(index) {
            this.formLabelAlign.nodename = "";
            this.formLabelAlign.id = "";
            this.nodeRepeat = false;
            this.numberType = false;
            this.visible.createVisible = true;
            getDicReportTypeList().then(res => {
                this.options = res.data;
                this.index_node = index;
            });
        },
        changeNodeTemplate() {
            //修改模板信息
            if(!this.tableData.name){
                this.$message({
                    message: '模板名为空',
                    duration: this.$globalConfig.elementUI.duration,
                    type: "error"
                });
                return false;
            }
            this.tableData.id = this.$route.query.id;
            let params = this.tableData;
            console.log(params);
            // return;
            const arr = [];
            for(let i = 0;i<params.nodes.length;i++) {
                // if(params.nodes[i].delayWarningNum<=0) {
                //             this.$message.error('预警提醒天数不能小于等于0')
                //             return;
                // }
                if(params.nodes[i].id){
                    arr.push(params.nodes[i]);
                }
            }
            params.nodes = arr;
            if(arr.length==0){
                this.$message({
                    message: '节点不能为空',
                    duration: this.$globalConfig.elementUI.duration,
                    type: "error"
                });
                return false;
            }else{
                editNodeTemplate(params).then(async (res) => {
                    (await res.data.code) === 0 && this.$router.push('/procedureInfo?id=' + this.$route.query.id);
                    (await res.data.code) !== 0 && this.$message.error(res.data.msg);
                });
            }

        },
        //当前总负责人
        showSelect(val) {
            this.tableData.chargerIds = val;
        },
        getManId(val) {
            this.tableData.chargerIds = val;
        },
        showSelectNode(val){},
        //--------获取当前节点的列表-------
        getNodeList() {
            let params = {
                "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
            };
            getEasyTaskNodeList(params).then(
                res => {
                    this.nodeList = res.data.data.taskNodes;
                        if(this.index_node!=-1){
                            this.tableData.nodes[this.index_node].nodeId = this.nodeList[this.nodeList.length-1].id;
                        }
                }
            )
            let params1 = {
                "userId": this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                "keyword": "",
                "token": "",
                "unitId": JSON.parse(sessionStorage.getItem('last_login')).id,
            }
            getPersonList(params1).then(
                res => {
                    this.options5 = res.data;
                }
            )
        },
        //删除当前列
        deleteNode(index) {
            this.tableData.nodes.splice(index, 1);
        },
        //添加节点
        addNode() {
            this.tableData.nodes.push({
                "nodeId": "",
                "nodeType": '',
                "nodeUserIds": [],
            });
        },
        //当前模板信息
        getTemplate() {
            let params = {
                "templateId": this.$route.query.id,
            }
            templateInfo(params).then(
                res => {
                    console.log(res, "获取当前模板信息");
                    this.tableData.name = res.data.template.name;
                    for (let i = 0; i < (res.data.template.chargers).length; i++) {
                        this.value10.push((res.data.template.chargers)[i].id);
                    }
                    this.tableData.chargerIds = this.value10;
                    for(let i = 0;i<res.data.template.nodes.length;i++) {
                        if(res.data.template.nodes[i].id!=='') {
                            res.data.template.nodes[i].chargerIds = [];
                            res.data.template.nodes[i].daysAdvanced = res.data.template.nodes[i].dafd;
                            for(let j = 0;j<res.data.template.nodes[i].chargers.length;j++){
                                res.data.template.nodes[i].chargerIds.push(res.data.template.nodes[i].chargers[j].id);
                            }
                        }
                    }
                    this.leaderIdGetOver = true;
                    this.tableData.nodes = res.data.template.nodes;
                    this.tableData.delayNotify = res.data.template.delayNotify;
                    this.tableData.prcdNodeId = res.data.template.prcdNodeId;
                    this.tableData.prcdNodeStatus = res.data.template.prcdNodeStatus.toString();
                    this.tableData.defaultAllOrderOutside = res.data.template.defaultAllOrderOutside
                }
            )
        }
    },
    computed: {
    },
    created() {
        this.getNodeList();
        this.getTemplate();
    },
}
</script>

<style scoped lang="scss">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .title {
        font-size: 24px;
        color: #2c2c2c;
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
            content: '*';
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
    text-indent: 16px; // box-sizing: border-box;
    border: 1px solid #e6e8eb;
    border-top: none;
    .el-button--text {
        color: #ff9c38;
    }
}
.submit {
  padding-top: 24px;
  margin-top: 24px;
  text-align: center;
  border-top: 1px solid #e6e8eb;
  button {
    width: 112px;
    height: 36px;
    font-size: 14px;
    background: none;
    border-radius: 2px;
    border: solid 1px #ff9c38;
  }
  .cancle-btn {
    color: #ff9c38;
  }
  .submit-btn {
    color: #ffffff;
    background: #ff9c38;
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
#new_nodes{
    background-color: #fff !important;
    &:hover{
        background-color: #fff;
    }
}
#new_nodes.el-select-dropdown__item.selected.hover {
    background-color: #fff;
}
#new_nodes.el-select-dropdown__item.selected.hover {
    background-color:transparent;
    color:#2c2c2c;
}
#new_nodes.el-select-dropdown__item.selected {
    color: #2c2c2c;
    background-color: transparent;
}
</style>
