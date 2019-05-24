<template>
<div class="node_tips">
    <header class="node_tips-header">
        <span>节点提醒</span>
        <icon-button class="btn btn--add" v-if="!isHideBtn" @click="showRemarkDialog('new')">+添加备注</icon-button>
        <!-- <span class="node_tips-header_remark" @click="addremarkWindow(1)">+添加备注</span> -->
    </header>
    <section class="node_tips-list">
        <div 
            class="node_tips-computed_list"
            v-for="(item,index) in notifies"
            :key="index"
            :class="{
                'computed_warning':item.type == 0,
                'computed_system': item.type == 1,
                'computed_remark': item.type == 2,
            }">
            <!-- 备注 -->
            <div v-if="item.type == 2" class="node_tips-message_list-contaniner">
                <div style="margin-right:12px;">
                    <icon w="48" h="20" type="icon-beizhu"></icon>                                        
                </div>
                <div>
                    <div class="computed_content">
                        {{item.typeName}}：{{item.content}}</div>
                     <span class="computed_charger">相关人员：</span>
                     <span class="computed_charger" 
                        v-for="(charger,index) in item.chargers" :key="index">{{charger.chargerName}}
                        <i v-if="index!=item.chargers.length-1">、</i>
                    </span>
                </div>
            </div>
            <!-- 延误 -->
            <div v-if="item.type == 1" class="node_tips-message_list-contaniner">
                <div style="margin-right:12px;">
                    <icon w="48" h="20" type="icon-yanwu"></icon>                                                            
                </div>
                <div>
                    <div class="computed_content">
                        {{item.typeName}}：{{item.content}}</div>
                    <span class="computed_charger">相关人员：</span>
                     <span class="computed_charger" 
                        v-for="(charger,index) in item.chargers" :key="index">{{charger.chargerName}}
                        <i v-if="index!=item.chargers.length-1">、</i>
                    </span>
                </div>
            </div>
            <!-- 延期预警 -->
            <div v-if="item.type == 0" class="node_tips-message_list-contaniner">
                <div style="margin-right:12px;">
                    <icon w="48" h="20" type="icon-yanqi"></icon>                                                                                
                </div>
                <div>
                    <div class="computed_content">
                        {{item.typeName}}：{{item.content}}
                    </div>
                    <div>
                        <span class="computed_charger">相关人员：</span>
                        <span class="computed_charger" 
                            v-for="(charger,index) in item.chargers" :key="index">{{charger.chargerName}}
                            <i v-if="index!=item.chargers.length-1">、</i>

                        </span>
                    </div>
                </div>
            </div>
            <div v-if="item.type==1||item.type==0" class="node_tips-message_list-right">
                <span class="system_tips">只有完成节点才能解除系统警报</span>
            </div>
            <div v-if="item.type==2" class="node_tips-message_list-right">
                <icon-button class="btn--edit" @click="showRemarkDialog('edit', item.id)">修改</icon-button>
                <icon-button @click="showRemarkDialog('del', item.id)">删除</icon-button>
            </div>
        </div>        
    </section>
    <section class="node_tips-message">
        <div class="node_tips-message_list" v-for="(item,index) in messages" :key="index">
            {{item}}
        </div>
    </section>  
    <el-dialog
            :show-close="false"
            :visible.sync="visible.deleVisible"
            size="tiny">
        <div class="dialog-content-wrap">
            <div>
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="delete-tip">是否确定删除此节点的差额提醒？</p>
            </div>
            <div class="handle-delete">
                <nf-button @click="visible.deleVisible = false">取 消</nf-button>
                <nf-button type="warning" @click="deleteBalance">确 定</nf-button>
            </div>
        </div>
    </el-dialog> 
    <!-- 弹窗共用，type:1添加，type:2修改，type:3删除  -->
    <el-dialog
            custom-class="nf-dialog-common"
            :title="remarkDialogTitle"
            :show-close="false"
            :visible.sync="visible.remarkVisible"
            size="tiny">
            <el-row type="flex" justify="end" align="middle">
                相关人员：
                <workerLeader  v-model="remarkForm.chargers"  :placeholder="'全部'"  style="margin-top: 0"></workerLeader>
            </el-row>
            <div class="remark_content">
                <el-input type="textarea" :rows="6" v-model="remarkForm.content" placeholder="请输入备注信息（必填）"></el-input>
            </div>
             <!-- footer -->
            <el-row type="flex" justify="center" slot="footer">
                <nf-button style="margin-right:12px;" @click="visible.remarkVisible = false">取 消</nf-button>
                <nf-button
                    class="btn--submit"
                    type="warning"
                    :loading="visible.btnLoading"
                    @click="handleRemark">确 定</nf-button>
            </el-row>
    </el-dialog>  
</div>
</template>

<script>
//"延期预警", 0
//"延误警报", 1
//"备注提醒", 2;
import { addDesignNodeRemark, editDesignNodeRemark, getDesignNodeRemarkInfo, deleteDesignNodeRemark } from '@/api/sample-centre';
export default {
    props:{
        nodeDetailData: {
            type: Object,
            default: {}
        },
        selectPersonList: []
    },
    data() {
        return {
            resetChargers: [],
            visible:{
                remarkVisible: false,
                deleVisible: false,
                btnLoading: false,
                remark:false
            },
            notifyId:{
                balanceId:"",
                remarkId:""
            },
            remarkForm: {
                chargers: [],
                content: ''
            },
            handleType: 'new', // new = 添加 ‘edit=编辑
            remarkTitle:"",
            remarkPerson:[],
            remarkContent:"",
            remarkType:""
        }
    },
    computed: {
        userId() {
            return JSON.parse(sessionStorage.getItem("user_login")).userId;
        },
        notify() {
            return this.nodeDetailData.notify;
        },
        notifies() {
            return this.notify && this.notify.notifies;
        },
        messages() {
            return this.notify && this.notify.messages;
        },
        isHideBtn() {
            return this.nodeDetailData.status === 2 || (this.notify && this.notify.hideAddNoteButton);
        }, 
        remarkDialogTitle() {
            switch(this.handleType) {
                case 'new': return '添加';
                case 'edit': return '编辑';
                case 'del': return '删除'
            }
        }
    },
    methods:{
        // 负责人分组
        getManId(arrId) {
            console.log(arrId);
            this.remarkForm.chargers = arrId;
        },
        fetchEditRemarkInfo(id) {
            getDesignNodeRemarkInfo({ notifyId: id })
            .then(res => {
                const data = res.data.data;
                this.remarkForm = {
                    notifyId: data.id,
                    content: data.content,
                    chargers: data.chargers.map(item => item.id)
                };
                this.$nextTick(() => {
                    this.visible.remarkVisible = true;
                })
            });
        },
        showRemarkDialog(type, handleId) {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.mission.node.remark.insert") ||
                !this.powerJudgement.permissions("fac.spl.design.mission.node.remark.edit") ||
                !this.powerJudgement.permissions("fac.spl.design.mission.node.remark.delete")){
                return
            }
            this.handleType = type;
            if (type === 'edit') return this.fetchEditRemarkInfo(handleId);
            this.resetChargers = [];
            this.initRemarkForm(handleId);
            this.visible.remarkVisible = true;
        },
        initRemarkForm(handleId) {
            this.remarkForm = {
                content: '',
                chargers: []
            };
            if (this.handleType == 'del') {
                this.remarkForm.notifyId = handleId;
            }
        },
        handleRemark() {
            if (this.handleType == 'new') {
                return this.addRemark();
            }
            if (this.handleType == 'del') {
                return this.deleteRemark();
            }
            return this.editRemark();
        },
        deleteRemark() {
            if (!this.validRemarkForm()) return;
            const params = {
                ...this.remarkForm,
                deleteReason: this.remarkForm.content,
                userId: this.userId,
                missionPrcdNodeId: this.nodeDetailData.missionPrcdNodeId
            };
            this.visible.btnLoading = true;
            deleteDesignNodeRemark(params)
            .then(res => {
                this.visible.btnLoading = false;
                if (res.data.code === 0) {
                    this.visible.remarkVisible = false;
                    this.$emit('on-update');
                    return this.$message.success('删除备注成功');
                }
                this.$message.error(res.data.msg || '删除备注失败');
            })
        },
        // 添加备注
        addRemark() {
            if (!this.validRemarkForm()) return;
            const params = {
                ...this.remarkForm,
                userId: this.userId,
                missionPrcdNodeId: this.nodeDetailData.missionPrcdNodeId
            };
            this.visible.btnLoading = true;
            addDesignNodeRemark(params)
            .then(res => {
                this.visible.btnLoading = false;
                if (res.data.code === 0) {
                    this.visible.remarkVisible = false;
                    this.$emit('on-update');
                    return this.$message.success('添加备注成功');
                }
                this.$message.error('添加备注失败');
            });
        },
        // 添加备注
        editRemark() {
            if (!this.validRemarkForm()) return;
            const params = {
                ...this.remarkForm,
                userId: this.userId,
                missionPrcdNodeId: this.nodeDetailData.missionPrcdNodeId
            };
            this.visible.btnLoading = true;
            editDesignNodeRemark(params)
            .then(res => {
                this.visible.btnLoading = false;
                if (res.data.code === 0) {
                    this.visible.remarkVisible = false;
                    this.$emit('on-update');
                    return this.$message.success('修改备注成功');
                }
                this.$message.error(res.data.msg || '修改备注失败');
            });
        },
        validRemarkForm() {
            if (!this.remarkForm.chargers.length) {
                this.$message.error('相关人员不能为空');
                return false;
            }
            if (!this.remarkForm.content || this.remarkForm.content > 50) {
                this.$message.error('请输入50个字符内备注');
                return false;
            }
            return true;
        }
    }
}
</script>

<style lang="scss" scoped>
 .node_tips {
     padding: 16px 0;
     border-bottom: 1px solid rgba(230,234,240,1);
     .node_tips-header {
         font-size: 16px;
         color:#3b3b3b;
         display:flex;
         align-items: center;
         justify-content: space-between;
         margin-bottom: 12px;
         .btn--add {
             color: #1CA1FF;
             cursor: pointer;
             &:hover {
                 text-decoration: underline;
             }
         }
     }
     .node_tips-list {
         .node_tips-computed_list {
            width: 100%;
            height: 56px;
            display:flex;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 12px 15px;
            margin-bottom: 8px;
            .node_tips-message_list-contaniner {
                display:flex;
                justify-content: flex-start;
            }
            .node_tips-message_list-right {
                display:flex;
                align-items: center;
                justify-content: flex-start;
                span{
                    cursor: pointer;
                }
                .change_remark {
                    margin-right: 16px;
                    color: #1CA1FF;
                    &:hover {
                        text-decoration: underline;
                    }    
                }
                .delete_remark {
                    color: #808080;
                    &:hover {
                        text-decoration: underline;
                        color: #3b3b3b;                        
                    }                  
                }
                .system_tips {
                    cursor: auto;
                    font-size: 12px;
                    color: #A2ABB8;
                }
                .balance_delete {
                    color: #808080;
                    font-size: 14px;  
                    &:hover {
                        text-decoration: underline;
                        color: #3b3b3b;
                    }                  
                }
                .btn--edit {
                    color: #1CA1FF;
                    margin-right: 12px;
                }
            }
         }
         .computed_remark {
             background-color: rgba(242,243,246,1);;
         }
         .computed_warning {
             background:rgba(255,242,231,1);
         }
         .computed_system {
             background:rgba(255,240,241,1);
         }
         .computed_balance {
             background:rgba(242,243,255,1);
         }
         .computed_charger {
             font-size: 12px;
             color:rgba(162,171,184,1);
             line-height: 18px;
         }
         .computed_content {
             line-height: 21px;
             color:rgba(59,59,59,1);
         }
     }
     .node_tips-message {
         color:#A2ABB8;   
         line-height: 21px;      
     }
     .remark_title {
         text-align: center;
         font-size: 20px;
     }
     .remark_footer {
         display:flex;
         justify-content: flex-end;
     }
     .remark_person {
         display:flex;
         align-items: center;
         margin-top: 20px;
         /*justify-content: flex-end;*/
     }
     .remark_content {
         margin:12px 0;
        .remark_content-textarea {
            font-size: 14px;
            outline:none;
            resize:none;
            width: 100%;
            height:160px;
        }
     }
 }
</style>
<style lang="scss">
    .dialog-content-wrap {
        text-align: center;
        .delete-tip {
            font-size: 16px;
            margin:14px 0;
        }
        p {
            line-height: 26px;
        }
    }
    .node_tips .el-dialog__body {
        padding:0 20px 30px;
    }
    .remark_person .el-select .el-input__inner {
        border:none;
        width:100px;
    }
</style>

