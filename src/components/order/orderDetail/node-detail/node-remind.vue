<template>
<div class="node_tips">
    <header class="node_tips-header">
        <span>节点提醒</span>
        <span class="node_tips-header_remake" v-if="!notify.hideAddNoteButton" @click="addRemakeWindow(1)">+添加备注</span>
    </header>
    <section class="node_tips-list">
        <div :class="{'computed_remake':item.type===3,'computed_warning':item.type===0,
        'computed_system':item.type===1,'computed_balance':item.type===2,}"
        class="node_tips-computed_list" v-for="(item,index) in notify.notifies" :key="index">
            <!--备注-->
            <div v-if="item.type==3" class="node_tips-message_list-contaniner">
                <div style="margin-right:12px;">
                    <icon w="48" h="20" type="icon-beizhu"></icon>
                </div>
                <div>
                    <div class="computed_content">
                    {{item.creatorName}}添加备注：{{item.content}}
                    </div>
                    <span class="computed_charger">相关人员：</span><span class="computed_charger"
                    v-for="(charger,index) in item.chargers" :key="index">{{charger.chargerName}}
                    <i v-if="index!=item.chargers.length-1">、</i>
                    </span>
                    <ul class="node-pictures">
                        <li
                            v-for="(items, index) in item.notePictureList"
                            :key="index"
                            @click="showBigImg(index)">
                            <a>
                                <img :src="items" class="img-list">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <!--差额-->
            <div v-if="item.type==2" class="node_tips-message_list-contaniner">
                <div style="margin-right:12px;">
                    <icon w="48" h="20" type="icon-chae"></icon>
                </div>
                <div>
                    <div class="computed_content">
                        {{item.typeName}}：{{item.content}}</div>
                     <span class="computed_charger">相关人员：</span>
                     <span class="computed_charger"
                        v-for="(charger,index) in item.chargers" :key="index">{{charger.chargerName}}
                        <i v-if="index!=item.chargers.length-1">、</i>
                    </span>
                    <ul class="node-pictures">
                        <li
                                v-for="(items, index) in item.notePictureList"
                                :key="index"
                                @click="showBigImg(index)">
                            <a>
                                <img :src="items" class="img-list">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <!--延误-->
            <div v-if="item.type==1" class="node_tips-message_list-contaniner">
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
                    <ul class="node-pictures">
                        <li
                                v-for="(items, index) in item.notePictureList"
                                :key="index"
                                @click="showBigImg(index)">
                            <a>
                                <img :src="items" class="img-list">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <!--延期-->
            <div v-if="item.type==0" class="node_tips-message_list-contaniner">
                <div style="margin-left:12px;">
                    <icon w="48" h="20" type="icon-yanqi"></icon>
                </div>
                <div>
                    <div class="computed_content">
                        {{item.typeName}}：{{item.content}}</div>
                    <div v-if="item.chargers!==[]&&item.chargers[0].chargerName!==null" class="computed_charger" v-for="(charger,index) in item.chargers" :key="index">相关人员：{{charger.chargerName}}</div>
                    <div class="computed_charger" v-else>相关人员：未设置</div>
                    <ul class="node-pictures">
                        <li
                                v-for="(items, index) in item.notePictureList"
                                :key="index"
                                @click="showBigImg(index)">
                            <a>
                                <img :src="items" class="img-list">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="item.type==3" class="node_tips-message_list-right">
                <span class="change_remake" @click="changeRemakeGetId(item.id,2)">修改</span>
                <span class="delete_remake" @click="deleteRemakeGetId(item.id,3)">删除</span>
            </div>
            <div v-if="item.type==2" class="node_tips-message_list-right">
                <span class="balance_delete" @click="deleteGetId(item.id)">删除提醒</span>
            </div>
            <div v-if="item.type==1||item.type==0" class="node_tips-message_list-right">
                <span class="system_tips">只有完成节点才能解除系统警报</span>
            </div>
        </div>
    </section>
    <section class="node_tips-message">
        <div class="node_tips-message_list" v-for="(item,index) in notify.messages" :key="index">
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
            class="node-remark-dialog"
            :show-close="false"
            :visible.sync="visible.remake"
            size="tiny">
            <div class="remake_title" slot="title">
                {{remakeTitle}}
            </div>
            <div class="remake_person">
                相关人员：
                <workerLeader  v-model="remakePerson"  :placeholder="'全部'"  style="width: 240px;border: 1px solid rgb(169,169,169)"></workerLeader>
            </div>
            <div class="remake_content">
                <textarea v-model="remakeContent" class="remake_content-textarea" rows="3"></textarea>
            </div>
            <div class="upload-img" v-if="canUpload">
                <div class="upload-mes">
                    <template v-if="labelDisable">
                        <label for="upload-input" class="upload-label">添加图片</label>
                    </template>
                    <template v-else>
                        <span class="span-gray">添加图片</span>
                    </template>
                    <span class="upload-font">只能上传 jpg / png 文件，且不超过5m，最多8张</span>
                </div>
                <ul class="upload-lists">
                    <li v-for="(item,index) of pictureList"
                        :key="index">
                        <i class="imgCancel"
                           @click.stop="cancelImg(index)">
                            <img src="../../../../../static/el-icon-close@3x.png" class="img-cancel">
                        </i>
                        <img :src="item" class="img-lists">
                    </li>
                </ul>
                <div class="upload-hide">
                    <input type="file"
                           accept="image/png,image/jpeg,image/jpg,image/gif"
                           id="upload-input"
                           @change="imgUpload($event)">
                </div>
            </div>
            <div class="remake_footer">
                <nf-button style="margin-right:12px;" @click="visible.remake = false">取 消</nf-button>
                <nf-button type="warning" @click="remakeOpera">确 定</nf-button>
            </div>
    </el-dialog>
    <!--展示大图-->
    <imgPreview  @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible" :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
</div>
</template>

<script>
//"延期预警", 0
//"延误警报", 1
//"差数提醒", 2,
//"备注提醒", 3;
import {
    getUploadToken, //获取七牛云上传token
    upDetailImgs, //上传图片的接口
    addNotifyRemake,
    updateNotifyRemake,
    deleteNotifyRemake,
    deleteNotifyBalance
} from "@/api"

const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
import md5 from "js-md5";

export default {
    props:{
        notify:{
            type:Object,
            require:true
        },
        nodeinfo:{
            type:Object,
            require:true
        },
        selectPersonList: [],
      remakePersonToSelect:[]
    },
    data() {
        return {
            visible:{
                deleVisible:false,
                remake:false
            },
            notifyId:{
                balanceId:"",
                remakeId:""
            },
            remakeTitle:"",
            remakePerson:[],
            remakeContent:"",
            remakeType:"",
            canUpload: true,    //是否可以使用上传图片功能
            centerDialogVisible: false, //是否显示大图弹窗
            imgLists:[],    //大图数组
            imgIndex: 0,     //大图数组下标
            pictureList:[], //上传图片数据数组
        }
    },
    computed:{
        //当上传图片数超过8张时，改变按钮样式
        labelDisable(){
            if(this.pictureList.length >= 8){
                return false
            }else{
                return true
            }
        },
    },
    watch:{
        'visible.remake':function(val){
            if(!val){

            }
        },
        notify: function(){
            this.imgLists = [];
            this.getImgList();
        }
    },
    methods:{
        //图片上传逻辑
        imgUpload(e) {
            const _this = this;
            let params = {
                appId: this.$globalConfig.appId.appId
            };
            const file = e.target.files;
            for (let i = 0; i < file.length; i++) {
                if (file[i].size > 5000000) {
                    _this.$message({
                        showClose: true,
                        message: "图片大小超过5M!,重新上传",
                        type: "error",
                        duration: config.elementUI.duration
                    });
                    return false;
                }
                getUploadToken(params).then(res => {
                    var params2 = new FormData();
                    params2.append("file", file[i]);
                    params2.append("token", res.data.uptoken);
                    params2.append("key", this.setImgKey(file[i].name));
                    upDetailImgs(params2, {}).then(result => {
                        const _imgUrl = this.$globalConfig.qiniu.baseUrl + result.data.key;
                        _this.pictureList.push(_imgUrl);
                        console.log(_this.pictureList);
                    });
                });
            }
        },
        //md5图片上传Key的拼接
        setImgKey(name) {
            const storeId =
                this.$store.state.userInfo.id ||
                JSON.parse(sessionStorage.getItem("user_login")).userId;
            const date = +new Date() + "";
            return storeId + "_" + _env + "_" + md5(storeId + date) + "_" + name;
        },
        //点击删除当前图片
        cancelImg(index) {
            this.pictureList.splice(index, 1);
        },
        //点击缩略图展示大图
        showBigImg(index){
            this.imgIndex = index;
            this.centerDialogVisible = true;
        },
        //封装图片数据格式
        getImgList(){
            if(this.notify.notifies.length){
                this.notify.notifies[0].notePictureList.forEach( item => {
                    let picObj = {};
                    picObj['path'] = item;
                    this.imgLists.push(picObj);     //大图展示组件数组
                })
            }
        },
        // 负责人分组
        getManId(arrId) {
            this.remakePerson = arrId
        },

        addRemake() {
            let params = {
                content:this.remakeContent,
                chargers:this.remakePerson,
                instanceId:this.notify.header.missionNodeId,
                notePictureList: this.pictureList
            };
            addNotifyRemake(params).then(res => {
                if(res.data.code == 0) {
                    this.visible.remake = false;
                    this.$message.success("添加成功");
                    this.$emit("on-report");
                }else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        changeRemake() {
            let params = {
                instanceId: this.notify.header.missionNodeId,
                content: this.remakeContent,
                chargers: this.remakePerson,
                id: this.notifyId.remakeId,
                notePictureList: this.pictureList
            };
            updateNotifyRemake(params).then(res => {
                if(res.data.code == 0) {
                    this.visible.remake = false;
                    this.$message.success("修改成功");
                    this.$emit("on-report");
                }else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        deleteRemake() {
            let params = {
                instanceId:this.notify.header.missionNodeId,
                deleteReason:this.remakeContent,
                id:this.notifyId.remakeId,
            };
            deleteNotifyRemake(params).then(res => {
                if(res.data.code == 0) {
                    this.visible.remake = false;
                    this.$emit("on-report");
                    this.$message.success("删除成功");
                }else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        deleteGetId(id) {
            this.visible.deleVisible = true;
            this.notifyId.balanceId = id;
        },
        addRemakeWindow(type) {
            var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                .permissionList;
            if (datalist.indexOf("fac.mission.node.remark.add") == -1) {
                this.$message.error("抱歉，您没有操作权限");
                return;
            }
            this.remakeTitle = "添加备注";
            this.remakeContent = "";
            this.remakePerson = [];
            this.canUpload = true;      //显示上传图片功能
            this.visible.remake = true;
            this.remakeType = type;
            this.pictureList = [];  //清空上传图片数组
            for(let item in this.nodeinfo.chargers) {
                this.remakePerson.push(this.nodeinfo.chargers[item].id);
            }
        },
        changeRemakeGetId(id,type) {
            console.log(this.notify.notifies[0],'节点提醒信息')
            var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                .permissionList;
            if (datalist.indexOf("fac.mission.node.remark.edit") == -1) {
                this.$message.error("抱歉，您没有操作权限");
                return;
            }
            this.remakeTitle = "修改备注";
            this.canUpload = true;      //显示上传图片功能
            this.visible.remake = true;
            this.remakeContent = this.notify.notifies[0].content;
            // this.remakePerson = this.notify.notifies[0].chargers;
            this.notifyId.remakeId = id;
            this.remakeType = type;
            this.remakePerson=[]
            for(let i=0;i<this.notify.notifies[0].chargers.length;i++){
              this.remakePerson.push(this.notify.notifies[0].chargers[i].chargerId)
            }
            // this.notify.notifies[0].chargers.forEach(item=>{
            //   this.remakePerson.push(this.notify.notifies[0].chargers[i].chargerId)
            // })
            console.log(this.remakePerson,9090)
            // for(let item in this.nodeinfo.chargers) {
            //     this.remakePerson.push(this.nodeinfo.chargers[item].id);
            // }

            this.pictureList = [];  //清空上传图片数组
            this.notify.notifies[0].notePictureList.forEach( item => {
                this.pictureList.push(item);    //赋值上传图片数组
            })
        },
        deleteRemakeGetId(id,type) {
            var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                .permissionList;
            if (datalist.indexOf("fac.mission.node.remark.delete") == -1) {
                this.$message.error("抱歉，您没有操作权限");
                return;
            }
            this.remakeTitle = "删除备注";
            this.remakeContent = "";
            this.remakePerson = [];
            this.canUpload = false;     //隐藏上传图片功能
            this.visible.remake = true;
            this.notifyId.remakeId = id;
            this.remakeType = type;
            for(let item in this.nodeinfo.chargers) {
                this.remakePerson.push(this.nodeinfo.chargers[item].id);
            }
        },
        deleteBalance() {
            let params = {
                instanceId:this.notify.header.missionNodeId,
                id:this.notifyId.balanceId
            };
            deleteNotifyBalance(params).then(res=> {
                if(res.data.code == 0) {
                    this.visible.deleVisible = false;
                    this.$emit("on-report");
                    this.$message.success("删除成功");
                }else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        remakeOpera() {
            if(this.remakePerson==[] || this.remakePerson.length===0) {
                this.$message.error("相关人员不能为空")
                return;
            }
            if(this.remakeContent=="") {
                this.$message.error("内容不能为空");
                return;
            }
            if(this.remakeType ==1) {
                this.addRemake();
            }
            if(this.remakeType==2) {
                this.changeRemake();
            }
            if(this.remakeType==3) {
                this.deleteRemake();
            }
        }
    },
    created(){
        this.getImgList();
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
         .node_tips-header_remake {
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
            display:flex;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 12px 15px;
            margin-bottom: 8px;
            .node_tips-message_list-contaniner {
                display:flex;
                justify-content: flex-start;
                .node-pictures{
                    margin: 5px -5px 0 0;
                    overflow: hidden;
                    li{
                        float: left;
                        margin: 0 10px 0 0;
                        width: 74px;
                        height: 74px;
                        line-height: 74px;
                        .img-list{
                            width: 100%;
                            max-height: 100%;
                            vertical-align: top;
                            cursor: pointer;
                        }
                    }
                }
            }
            .node_tips-message_list-right {
                display:flex;
                align-items: center;
                justify-content: flex-start;
                span{
                    cursor: pointer;
                }
                .change_remake {
                    margin-right: 16px;
                    color: #1CA1FF;
                    &:hover {
                        text-decoration: underline;
                    }
                }
                .delete_remake {
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
            }
         }
         .computed_remake {
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
     .remake_title {
         text-align: center;
         font-size: 20px;
     }
     .remake_footer {
         display:flex;
         justify-content: flex-end;
     }
     .remake_person {
         display:flex;
         align-items: center;
         margin-top: 20px;
         /*justify-content: flex-end;*/
     }
     .remake_content {
         margin:12px 0;
        .remake_content-textarea {
            font-size: 14px;
            outline:none;
            resize:none;
            display: block;
            width: 410px;
            padding: 10px;
        }
     }
     .upload-img{
         .upload-mes{
             margin-bottom: 10px;
             .upload-label{
                 display: inline-block;
                 width: 64px;
                 line-height: 28px;
                 font-size: 12px;
                 text-align: center;
                 color:#fff;
                 background-color: #1CA1FF;
                 border-radius: 2px;
                 margin-right: 7px;
                 cursor: pointer;
             }
             .span-gray{
                 display: inline-block;
                 width: 64px;
                 line-height: 28px;
                 font-size: 12px;
                 text-align: center;
                 color:#bfcbd9;
                 background-color: #eef1f6;
                 border-radius: 2px;
                 margin-right: 7px;
             }
             .upload-font{
                 font-size: 12px;
             }
         }
         .upload-lists{
             margin-right: -10px;
             max-height: 220px;
             overflow: hidden;
             li{
                 position: relative;
                 float: left;
                 width: 100px;
                 height: 100px;
                 line-height: 100px;
                 margin: 0 10px 10px 0;
             }
             .img-cancel{
                 position: absolute;
                 top: 0;
                 right: 0;
                 width: 13px;
                 height: 13px;
                 padding: 2px;
                 cursor: pointer;
                 background-color: #fff;
                 opacity: .8;
                 &:hover{
                     opacity: 1;
                 }
             }
             .img-lists{
                 width: 100%;
                 max-height: 100%;
                 vertical-align: middle;
             }
         }
         .upload-hide{
             display: none;
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
    .node_tips {
        .el-dialog__body {
            padding:0 20px 30px;
        }
        .node-remark-dialog{
            .el-dialog--tiny{
                width: 470px;
            }
        }
    }

    .remake_person .el-select .el-input__inner {
        border:none;
        width:100px;
    }

</style>

