<template>
<!-- <div class="item-wrap">
    <div class="item-header msg-item">
        <div class="good-img">
            <img v-if="msgItem.headImg" :src="msgItem.headImg" />
            <span v-if="!msgItem.headImg && msgItem.senderId !== 'SYSTEM'">{{msgItem.userName || '员工'}}</span>
            <span v-if="!msgItem.headImg && msgItem.senderId === 'SYSTEM'">{{'系统'}}</span>
        </div>
        <div class="msg-handle">
            <div class="msg-info">
                <p class="sender-name" v-if="msgItem.senderId !== 'SYSTEM'">{{msgItem.senderName}}</p>
                <p class="sender-name" v-if="msgItem.senderId === 'SYSTEM'">系统</p>
                <p class="time" >{{msgItem.createAt|filterTime}}</p>
                <p class="handle-msg">
                    <el-button type="text" 
                    @click.stop="$emit('getMsgItem', msgItem)"
                    v-if="msgItem.senderId !== userId"><span class="blue">回复</span></el-button>
                    <el-button type="text" 
                    v-if="msgItem.senderId === userId"
                    @click.stop="$emit('getMsgItem', msgItem, true)"><span class="blue">编辑</span></el-button>
                    <el-button type="text" 
                    v-if="msgItem.senderId === userId"
                    @click.stop="$emit('deleteMsg', msgItem)"><span class="blue">删除</span></el-button>
                    <el-button type="text" @click="viewNodeDetail(msgItem)"><span class="blue">查看节点详情</span></el-button>
                </p>
            </div>
            <div class="msg-main">
                <span class="about">所属节点：{{msgItem.nodeName || '未设置节点'}}</span>
            </div>
        </div>
    </div>
    <div class="msg-content">
        <div class="user-msg is-info" v-if="!msgItem.alertStatus && msgItem.senderId === 'SYSTEM'">
            <icon type="icon-gongdan-xitongtixing" w="24" h="22"></icon>
            <p>{{msgItem.message}}</p>
        </div>
        <div class="user-msg" v-if="!msgItem.specialType && msgItem.senderId !== 'SYSTEM'"  :class="{'is-warning': msgItem.alertStatus}">
            <icon type="icon-gongdan-dongtaijingbao" w="24" h="22"></icon>
            <p v-if="msgItem.senderId === 'SYSTEM'">{{msgItem.message}}</p>
            <p v-if="msgItem.senderId !== 'SYSTEM'">
                <span class="default-color" v-if="msgItem.alertStatus">添加警报：</span>
                <span v-html="msgItem.message"></span>
            </p>
        </div>
        <div class="user-msg" v-if="msgItem.specialType && msgItem.senderId !== 'SYSTEM'" :class="{'is-rm-warning': msgItem.specialType}">
            <icon type="icon-gongdan-jiechujingbao" w="24" h="22"></icon>
            <p>解除了  {{msgItem.replyUserName}}  添加的警报：{{msgItem.message}}</p>
        </div>
        <p v-if="msgItem.specialType && msgItem.senderId !== 'SYSTEM'" class="warn-content">警报内容：{{msgItem.replyMessage}}</p>
        <div class="img-list" v-if="msgItem.pictures.length">
            <div class="item" v-for="(imgItem, imgIndex) in msgItem.pictures" :key="imgIndex">
                <img :src="imgItem.path" />
                <div class="preview" @click.stop="handlePreview(msgItem.pictures, imgIndex)"><i class="el-icon-view"></i></div>
            </div>
        </div>
        <div class="upload-file" v-if="msgItem.attachments.length">
            <div class="file-item" v-for="(fileItem, fileIndex) in msgItem.attachments" :key="fileIndex">
                <div class="file">
                    <a :href="fileItem.path + '?attname=' + fileItem.name" download><i class="fa fa-file-o"></i><span>{{fileItem.name}}</span></a>
                </div>
            </div>
        </div>
        <div class="view-detail" v-if="msgItem.notifyNodes.length || msgItem.notifyUsers.length" @click.stop="visble = !visble">查看关联节点和人员
            <svg 
            :class="{'rotate': visble}"
            class="icon"
            aria-hidden="true">
                <use xlink:href="#icon-drop-down"></use>
            </svg>
        </div>
        <div v-show="visble">
            <div class="relation type" v-if="msgItem.notifyNodes.length">
                <icon type="icon-guanlianjiedian"></icon>
                <div>
                    <span v-for="(nodeItem, nodeIndex) in msgItem.notifyNodes" :key="nodeIndex">{{nodeItem.name}}</span>
                </div>
            </div> 
            <div class="relation principal-name" v-if="msgItem.notifyUsers.length">
                <icon type="icon-guanlianrenyuan"></icon>
                <div>
                    <span v-for="(userItem, userIndex) in msgItem.notifyUsers" :key="userIndex">{{userItem.userName}}</span>
                </div>
            </div>
        </div>
    </div>
</div> -->

<div class="item-wrap">
    <div class="item-header msg-item" :class="[msgItem.senderName!=login?'item-header':'item-header-self']">
        <div :class="[msgItem.senderName!=login?'good-img':'good-img-self']">
            <img v-if="msgItem.headImg" :src="msgItem.headImg" />
            <span v-if="!msgItem.headImg && msgItem.senderId !== 'SYSTEM'">{{msgItem.senderName | filterName}}</span>
            <span v-if="!msgItem.headImg && msgItem.senderId === 'SYSTEM'">{{'系统'}}</span>
        </div>
        <div class="msg-handle">
            <div :class="[msgItem.senderName!=login?'msg-info':'msg-info-self']">
                <p class="sender-name" v-if="msgItem.senderId !== 'SYSTEM'">{{msgItem.senderName}}</p>
                <p class="sender-name" v-if="msgItem.senderId === 'SYSTEM'">系统</p>
                <p class="time" >{{msgItem.createAt|filterTime}}</p>
                <p class="handle-msg">
                    <el-button type="text" 
                    @click.stop="$emit('getMsgItem', msgItem)"
                    v-if="msgItem.senderId !== userId"><span class="blue">回复</span></el-button>
                    <el-button type="text" 
                    v-if="msgItem.senderId === userId && msgItem.specialType === 0"
                    @click.stop="$emit('getMsgItem', msgItem, true)"><span class="blue">编辑</span></el-button>
                    <el-button type="text" 
                    v-if="msgItem.senderId === userId"
                    @click.stop="$emit('deleteMsg', msgItem)"><span class="blue">删除</span></el-button>
                    <el-button type="text" 
                    @click="viewNodeDetail(msgItem)"
                    v-if="msgItem.nodeId">
                    <span class="blue">查看节点详情</span></el-button>
                </p>
            </div>
            <!-- <div class="msg-main">
                <span class="about">所属节点：{{msgItem.nodeName || '未设置节点'}}</span>
            </div> -->
        </div>
    </div>
    <!-- 别人发的 -->
    <div v-if="msgItem.senderName!=login" :class="[msgItem.alertStatus && msgItem.flag?'msg-content':'msg-content-no']">
        <div class='triangle'></div>
        <div class="user-msg is-info" v-if="msgItem.alertStatus && msgItem.senderId === 'SYSTEM'">
            <!-- <icon type="icon-gongdan-xitongtixing" w="24" h="22"></icon> -->
            <p>{{msgItem.message}}</p>
        </div>
        <div class="user-msg is-info" v-if="!msgItem.alertStatus && msgItem.senderId === 'SYSTEM'">
            <!-- <icon type="icon-gongdan-xitongtixing" w="24" h="22"></icon> -->
            <p>{{msgItem.message}}</p>
        </div>
        <div class="user-msg" 
        v-if="!msgItem.specialType && msgItem.senderId !== 'SYSTEM'"  
        :class="{'is-warning': msgItem.alertStatus}">
            <icon type="icon-gongdan-dongtaijingbao" w="24" h="22"></icon>
            <p v-if="msgItem.senderId === 'SYSTEM'">{{msgItem.message}}</p>
            <p v-if="msgItem.senderId !== 'SYSTEM'">
                <span>
                    <icon
                    type="icon-gongdan-dongtaijingbao"
                    w="16" h="16"
                    style="margin-right:6px;"
                    v-if="!(msgItem.alertStatus && msgItem.flag)"></icon>
                        {{msgItem.nodeName}}
                        <i v-if="msgItem.nodeName">：</i>
                </span>
                <span  v-if="msgItem.alertStatus">{{msgItem.nodeName ? '|' : ''}} 警报：</span>
                <span v-html="msgItem.message"></span>
            </p>
        </div>
        <div class="user-msg" v-if="msgItem.specialType && msgItem.senderId !== 'SYSTEM'" :class="{'is-rm-warning': msgItem.specialType}">
            <p><icon type="icon-gongdan-jiechujingbao" w="16" h="16" style="margin-right:6px;"></icon>解除了  {{msgItem.replyUserName}}  添加的警报：{{msgItem.message}}</p>
        </div>
        <p v-if="msgItem.specialType && msgItem.senderId !== 'SYSTEM'" class="warn-content">警报内容：{{msgItem.replyMessage}}</p>
        <div class="img-list" v-if="msgItem.pictures.length">
            <div class="item" v-for="(imgItem, imgIndex) in msgItem.pictures" :key="imgIndex">
                <img :src="imgItem.path" />
                <div class="preview" @click.stop="handlePreview(msgItem.pictures, imgIndex)"><i class="el-icon-view"></i></div>
            </div>
        </div>
        <div class="upload-file" v-if="msgItem.attachments.length">
            <div class="file-item" v-for="(fileItem, fileIndex) in msgItem.attachments" :key="fileIndex">
                <div class="file">
                    <a :href="fileItem.path + '?attname=' + fileItem.name" download><i class="fa fa-file-o"></i><span>{{fileItem.name}}</span></a>
                </div>
            </div>
        </div>
        <div class="about_man">
            <div class="about_man_left">
                <div>
                    <icon v-if="msgItem.notifyNodes.length>0" type="icon-xiaoxi-guanlianjiedian" style="margin-top:-2px;width:14px;height:14px;"></icon>
                    <span v-for="(nodeItem, nodeIndex) in msgItem.notifyNodes" :key="nodeIndex">{{nodeItem.name}}<i v-if="nodeIndex !== msgItem.notifyNodes.length - 1">、</i></span>
                </div>
            </div>
            <div class="about_man_right">
                <div>
                    <icon  v-if="msgItem.notifyUsers.length>0" type="icon-xiaoxi-guanlianrenyuan" style="margin-top:-2px;width:14px;height:14px;"></icon>
                    <span v-for="(userItem, userIndex) in msgItem.notifyUsers" :key="userIndex">{{userItem.userName}}<i v-if="userIndex !== msgItem.notifyUsers.length - 1">、</i></span>
                </div>
            </div>
        </div>
    </div>
    <!-- 自己发的 -->
    <div v-if="msgItem.senderName==login" :class="[msgItem.alertStatus && msgItem.flag?'msg-content-alarm':'msg-content-self']">
        <div class='triangle'></div>
        <div class="user-msg is-info" v-if="!msgItem.alertStatus && msgItem.senderId === 'SYSTEM'">
            <!-- <icon type="icon-gongdan-xitongtixing" w="24" h="22"></icon> -->
            <p>{{msgItem.message}}</p>
        </div>
        <div class="user-msg" v-if="!msgItem.specialType && msgItem.senderId !== 'SYSTEM'"  :class="{'is-warning': msgItem.alertStatus}">
            <!-- <icon type="icon-gongdan-dongtaijingbao" w="24" h="22"></icon> -->
            <p v-if="msgItem.senderId === 'SYSTEM'">{{msgItem.message}}</p>
            <p v-if="msgItem.senderId !== 'SYSTEM'">
                <span><icon type="icon-gongdan-dongtaijingbao" w="16" h="16" style="margin-right:6px;" v-if="!(msgItem.alertStatus && msgItem.flag)"></icon>{{msgItem.nodeName}}<i v-if="msgItem.nodeName">：</i></span>
                <span  v-if="msgItem.alertStatus">| 警报：</span>
                <span v-html="msgItem.message"></span>
            </p>
        </div>
        <div class="user-msg" v-if="msgItem.specialType!=2 && msgItem.senderId !== 'SYSTEM'" :class="{'is-rm-warning': msgItem.specialType}">           
            <p><icon type="icon-gongdan-jiechujingbao" w="16" h="16" style="margin-right:6px;"></icon>解除了  {{msgItem.replyUserName}}  添加的警报：{{msgItem.message}}</p>
        </div>
        <div class="user-msg" v-if="msgItem.specialType==2 && msgItem.senderId !== 'SYSTEM'" :class="{'is-rm-warning': msgItem.specialType}">           
            <p> {{msgItem.message}}</p>
        </div>
        <p v-if="msgItem.specialType!=2 && msgItem.senderId !== 'SYSTEM'" class="warn-content">警报内容：{{msgItem.replyMessage}}</p>
        <p v-if="msgItem.specialType==2 && msgItem.senderId !== 'SYSTEM'" class="warn-content">{{msgItem.replyMessage}}</p>        
        <div class="img-list" v-if="msgItem.pictures.length">
            <div class="item" v-for="(imgItem, imgIndex) in msgItem.pictures" :key="imgIndex">
                <img :src="imgItem.path" />
                <div class="preview" @click.stop="handlePreview(msgItem.pictures, imgIndex)"><i class="el-icon-view"></i></div>
            </div>
        </div>
        <div class="upload-file" v-if="msgItem.attachments.length">
            <div class="file-item" v-for="(fileItem, fileIndex) in msgItem.attachments" :key="fileIndex">
                <div class="file">
                    <a :href="fileItem.path + '?attname=' + fileItem.name" download><i class="fa fa-file-o"></i><span>{{fileItem.name}}</span></a>
                </div>
            </div>
        </div>
        <div class="about_man">
            <div class="about_man_left">
                <div>
                    <icon v-if="msgItem.notifyNodes.length>0" type="icon-xiaoxi-guanlianjiedian" style="margin-top:-2px;width:14px;height:14px;"></icon>
                    <span v-for="(nodeItem, nodeIndex) in msgItem.notifyNodes" :key="nodeIndex">{{nodeItem.name}}<i v-if="nodeIndex !== msgItem.notifyNodes.length - 1">、</i></span>
                </div>
            </div>
            <div class="about_man_right">
                <div>
                    <icon  v-if="msgItem.notifyUsers.length>0" type="icon-xiaoxi-guanlianrenyuan" style="margin-top:-2px;width:14px;height:14px;"></icon>
                    <span v-for="(userItem, userIndex) in msgItem.notifyUsers" :key="userIndex">{{userItem.userName}}<i v-if="userIndex !== msgItem.notifyUsers.length - 1">、</i></span>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
    props: {
        msgItem: {
            type: Object,
            // default: () => {
            //     //console.log(msgItem,'ddd');
            // }
        },
        isMission: {
            type: Boolean,
            default: false
        },
        isMissionManage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        visble: false,
        previewImgVisble: false,
        percentage: 50,
        previewImgPath: '',
        fileList: [
            {
                name: "zzy",
                url: "12"
            }
        ],
        // login:JSON.parse(sessionStorage.getItem('loginman_info')).userName,
        // loginName:(JSON.parse(sessionStorage.getItem('loginman_info')).loginName).substr(-2,2),
        login: '-',
        loginName: '-'
        };
    },
    mounted() {
        this.login = this.userInfo.userName;
        this.loginName = this.userInfo.loginName.substr(-2,2);
    },
    computed: {
        ...mapGetters(['userInfo']),
        userId() {
            return this.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
        },
        imgLists() {
            return this.msgItem.pictures
        }
    },
    filters:{
        filterTime(val) {
            return  val && val.substr(0,16);
        },
        filterName(val) {
            console.warn(val);
            if (val && val.length > 2) {
                return val.substr(-2);
            }
            return val || '头像';
        }
    },
    methods: {
        // showData() {
        //     console.log(this.msgItem);
        // },
        handlePreview(imgList, index) {
            this.previewImgVisble = true;
            // this.previewImgPath = path;
            this.$emit('preview', imgList, index)
        },
        viewNodeDetail(item) {
            this.$emit('viewDetail', item);
            // //console.log(item)
            // const missionId = this.$route.query.id;
            // const path = item.targetType === '数据型' ? `/DataNodeDetail?id=${item.nodeId}&missionId=${this.missionId}`: `/LogicNodeDetail?id=${item.nodeId}&missionId=${this.missionId}`;
            // this.$router.push(`/LogicNodeDetail?id=${item.nodeId}&missionId=${missionId}`);
            // this.$router.push('')
        }
    },
    // created(){
    //     this.showData();
    // }
};
</script>

<style scoped lang="scss">
.blue {
    font-size: 12px;
    color: #1f96ff;
}
.default-color {
    color: #2c2c2c
}
.item-wrap {
    padding-bottom: 10px;
    // border-bottom: 1px solid #eeeeee;
    cursor: pointer;
    &.is-active {
        background: #faf6f0;
    }
    &:hover {
        background: #fff;
        .time {
            display: none;
        }
        .handle-msg {
            display: block !important;
        }
    }
}
.msg-item {
    // align-items: center;
    padding: 20px 8px 0 16px;
    cursor: pointer;
    &.item-header {
        display: flex;
    }
    &.item-header-self{
        display: flex;
        flex-direction: row-reverse;
        // justify-content: flex-end;
    }
    .msg-handle {
        flex: 1;
    }
    button {
        padding: 0;
    }
    .time {
        line-height: 14px;
        color: #a2abb8;
    }
    .handle-msg {
        display: none;
    }
    .msg-info,
    .msg-main {
        display: flex;
    }
    .msg-info {
        font-size: 12px;
        justify-content: space-between;
        padding: 0 6px;
    }
    .msg-info-self {
        font-size: 12px;
        display: flex;        
        justify-content: space-between;
        flex-direction: row-reverse;
        padding: 0 6px;
    }
    .msg-main {
        margin-top: 5px;
        font-size: 14px;
    }
    .about {
        font-size: 12px;
        color: #878e99;
    }
    .good-img {
        position: relative;
        width: 32px;
        height: 32px;
        margin-right: 8px;
        text-align: center;
        line-height: 32px;
        overflow: hidden;
        font-size: 12px;
        overflow: hidden;
        border: solid 1px rgba(0, 0, 0, 0.06);
        border-radius: 50%;
        img,
        span {
            width: 100%;
            height: 100%;
        }
        span {
            display: inline-block;
            color: #ffffff;
            background: #8ca0ae;
        }
    }
    .good-img-self{
        position: relative;
        width: 32px;
        height: 32px;
        margin-left: 8px;
        text-align: center;
        line-height: 32px;
        overflow: hidden;
        font-size: 12px;
        overflow: hidden;
        border: solid 1px rgba(0, 0, 0, 0.06);
        border-radius: 50%;
        img,
        span {
            width: 100%;
            height: 100%;
        }
        span {
            display: inline-block;
            color: #ffffff;
            background: #8ca0ae;
        }        
    }
}
.msg-content {
    flex: 1;
    margin-left: 58px;
    margin-right: 16px;
    padding: 12px;
    padding-right: 8px;
    padding-bottom: 8px;    
    margin-top: -16px;
    border-radius: 4px;
    position: relative;
    right: -8px;
    color: #fff;
    background-color: #eb5757;
    box-shadow: 0 4px 4px 0 rgba(235, 89, 89, 0.24);
    .triangle {
        width: 0;
        height: 0;
        border-radius: 3px  0 0 0 ;
        border-top: 15px solid #eb5757;
        border-left: 11px solid transparent; 
        position: absolute;
        top: 0;
        left: -6px;
    }
    .user-msg {
        display: flex;
        // margin: 8px 0 16px;
        line-height: 18px;
        font-size: 14px;
        letter-spacing: 0.4px;
        svg {
            display: none;
        }
        &.is-warning {
            color: #fff;
            border-radius: 2px;;
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        &.is-rm-warning {
            border-radius: 2px;;
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        &.is-info {
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        p {
            flex: 1;
            line-height: 18px;
            word-break: break-all;
            // margin-bottom: 12px;
        }
    }
            .warn-content {
                margin: 16px 0;
                color: #aaaaaa;
                border-left: 4px solid #d9d9d9;
                text-indent: 12px;
            }
    .img-list {
        display: flex;
        justify-content:flex-start;
        flex-wrap: wrap;
        .item {
            position: relative;
            width: 74px;
            height: 74px;
            margin-right: 8px;
            margin-bottom: 8px;
            &:hover {
                .preview {
                    display: flex;
                }
            }
        }
        img {
            width: 74px;
            height: 74px;
            border: solid 1px rgba(0, 0, 0, 0.06);
        }
        .preview {
            position: absolute;
            top: 0;
            left: 0;
            display: none;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: 16px;
            color: #ffffff;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.5);
        }
    }
    .view-detail {
        margin: 10px 0;
        font-size: 12px;
        color: #929aa6;
        cursor: pointer;
        svg {
            width: 12px;
            height: 12px;
            vertical-align: -2px;
            transition: transform .3s;
            // margin-left: 5px;
            color: #D3DCE6;
            &.rotate {
                transform: rotate(180deg)
            }
        }
    }
    .relation {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 8px;
        font-size: 12px;
        &.principal-name {
            margin-bottom: 0
        }
        svg {
           margin-top: 3px;
        }
        div {
            flex: 1;
        }
        span {
            display: inline-block;
            padding: 6px 10px;
            margin-right: 8px;
            margin-bottom: 8px;
            vertical-align: middle;
            color: #5c6d81;
            background: #f1f3f5;
        }
        svg {
            margin-right: 8px;
        }
    }
    .about_man {
        justify-content: space-between;
        margin-top: 10px;
        display: flex;
        font-size: 12px;
        line-height: 1.5;
        margin-top: 12px;
        color: #fff;
        opacity: 0.6;
        .about_man_left{
            width:45%;
        }
        .about_man_right{
            width: 45%;
            display: flex;
            justify-content: flex-end;
            // line-height: 1.5;
        }
    }
}
.msg-content-alarm {
    flex: 1;
    margin-left: 58px;
    margin-right: 16px;
    padding: 12px;
    padding-right: 8px;
    padding-bottom: 8px;    
    margin-top: -16px;
    // border: 1px solid #d0d2d6;
    border-radius: 4px;
    position: relative;
    right: 42px;
    color: #fff;
    background-color: #eb5757;
    box-shadow: 0 4px 4px 0 rgba(235, 89, 89, 0.24);
    .triangle {
        position: absolute;
        width: 12px;
        height: 5px;
        // border-top: 1px solid #d0d2d6;
        // border-right: 1px solid #d0d2d6;
        background-color: #eb5757;
        -webkit-transform: skew(27deg);
        transform: skew(-54deg);
        right: -4px;
        top: 0;
    }
    .user-msg {
        display: flex;
        // margin: 8px 0 16px;
        line-height: 18px;
        font-size: 14px;
        letter-spacing: 0.4px;
        svg {
            display: none;
        }
        &.is-warning {
            color: #fa3c3c;
            border-radius: 2px;;
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        &.is-rm-warning {
            border-radius: 2px;;
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        &.is-info {
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        p {
            flex: 1;
            line-height: 18px;
            word-break: break-all;
            color: #fff;   
            // margin-bottom: 12px;                     
        }
    }
            .warn-content {
                margin: 16px 0;
                color: #aaaaaa;
                border-left: 4px solid #d9d9d9;
                text-indent: 12px;
            }
    .img-list {
        display: flex;
        justify-content:flex-start;
        flex-wrap: wrap;
        .item {
            position: relative;
            width: 74px;
            height: 74px;
            margin-right: 8px;
            margin-bottom: 8px;
            &:hover {
                .preview {
                    display: flex;
                }
            }
        }
        img {
            width: 74px;
            height: 74px;
            border: solid 1px rgba(0, 0, 0, 0.06);
        }
        .preview {
            position: absolute;
            top: 0;
            left: 0;
            display: none;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: 16px;
            color: #ffffff;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.5);
        }
    }
    .view-detail {
        margin: 10px 0;
        font-size: 12px;
        color: #929aa6;
        cursor: pointer;
        svg {
            width: 12px;
            height: 12px;
            vertical-align: -2px;
            transition: transform .3s;
            // margin-left: 5px;
            color: #D3DCE6;
            &.rotate {
                transform: rotate(180deg)
            }
        }
    }
    .relation {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 8px;
        font-size: 12px;
        &.principal-name {
            margin-bottom: 0
        }
        svg {
           margin-top: 3px;
        }
        div {
            flex: 1;
        }
        span {
            display: inline-block;
            padding: 6px 10px;
            margin-right: 8px;
            margin-bottom: 8px;
            vertical-align: middle;
            color: #5c6d81;
            background: #f1f3f5;
        }
        svg {
            margin-right: 8px;
        }
    }
    .about_man {
        justify-content: space-between;
        margin-top: 10px;
        display: flex;
        font-size: 12px;
        line-height: 1.5;
        color: #fff;
        opacity: 0.6;
        .about_man_left{
            width:45%;
        }
        .about_man_right{
            width: 45%;
            display: flex;
            justify-content: flex-end;
        }
    }
}
.msg-content-no {
    flex: 1;
    margin-left: 58px;
    margin-right: 16px;
    padding: 12px;
    padding-right: 8px;
    padding-bottom: 8px;    
    margin-top: -16px;
    border: 1px solid #d0d2d6;
    border-radius:0 4px 4px 4px;
    position: relative;
    color: #636363;
    right: -7px;
    background-color: #fff;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.04);
    .triangle {
        width: 15px;
        height: 11px;
        border-radius: 3px  0 0 0 ;
        border-top: 1px solid #d0d2d6;
        border-left: 1px solid #d0d2d6; 
        transform: skew(50deg);
        background-color: #ffffff;
        position: absolute;
        top: -1px;
        left: -6px;
    }
    .user-msg {
        display: flex;
        // margin: 8px 0 16px;
        line-height: 18px;
        font-size: 14px;
        letter-spacing: 0.4px;
        svg {
            display: none;
        }
        &.is-warning {
            color: #fa3c3c;
            border-radius: 2px;;
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        &.is-rm-warning {
            border-radius: 2px;;
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        &.is-info {
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        p {
            flex: 1;
            line-height: 22px;
            word-break: break-all;
            color: #2c2c2c;   
            margin-bottom: 12px;         
        }
    }
            .warn-content {
                margin: 16px 0;
                color: #aaaaaa;
                border-left: 4px solid #d9d9d9;
                text-indent: 12px;
            }
    .img-list {
        display: flex;
        justify-content:flex-start;
        flex-wrap: wrap;
        .item {
            position: relative;
            width: 74px;
            height: 74px;
            margin-right: 8px;
            margin-bottom: 8px;
            &:hover {
                .preview {
                    display: flex;
                }
            }
        }
        img {
            width: 74px;
            height: 74px;
            border: solid 1px rgba(0, 0, 0, 0.06);
        }
        .preview {
            position: absolute;
            top: 0;
            left: 0;
            display: none;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: 16px;
            color: #ffffff;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.5);
        }
    }
    .view-detail {
        margin: 10px 0;
        font-size: 12px;
        color: #929aa6;
        cursor: pointer;
        svg {
            width: 12px;
            height: 12px;
            vertical-align: -2px;
            transition: transform .3s;
            // margin-left: 5px;
            color: #D3DCE6;
            &.rotate {
                transform: rotate(180deg)
            }
        }
    }
    .relation {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 8px;
        font-size: 12px;
        &.principal-name {
            margin-bottom: 0
        }
        svg {
           margin-top: 3px;
        }
        div {
            flex: 1;
        }
        span {
            display: inline-block;
            padding: 6px 10px;
            margin-right: 8px;
            margin-bottom: 8px;
            vertical-align: middle;
            color: #5c6d81;
            background: #f1f3f5;
        }
        svg {
            margin-right: 8px;
        }
    }
    .about_man {
        justify-content: space-between;
        display: flex;
        font-size: 12px;
        line-height: 1.5;
        margin-top: 12px;
        color: #636363;
        .about_man_left{
            width:45%;
        }
        .about_man_right{
            width: 45%;
            display: flex;
            justify-content: flex-end;
            // line-height: 1.5;
        }
    }
}
.msg-content-self {
    flex: 1;
    margin-left: 58px;
    margin-right: 16px;
    padding: 12px;
    padding-right: 8px;
    padding-bottom: 8px;    
    margin-top: -16px;
    border: 1px solid #d0d2d6;
    border-radius: 4px;
    position: relative;
    right: 42px;
    color: #636363;
    background-color: #fff;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.04);
    .triangle {
        position: absolute;
        width: 12px;
        height: 5px;
        border-top: 1px solid #d0d2d6;
        border-right: 1px solid #d0d2d6;
        background-color: #fff;
        -webkit-transform: skew(27deg);
        transform: skew(-54deg);
        right: -5px;
        top: -1px;
    }
    .user-msg {
        display: flex;
        // margin: 8px 0 16px;
        line-height: 18px;
        font-size: 14px;
        letter-spacing: 0.4px;
        svg {
            display: none;
        }
        &.is-warning {
            color: #fa3c3c;
            border-radius: 2px;;
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        &.is-rm-warning {
            border-radius: 2px;;
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        &.is-info {
            svg {
                display: inline-block;
                margin-right: 12px;
            }
        }
        p {
            flex: 1;
            line-height: 18px;
            word-break: break-all;
            color: #2c2c2c;   
            // margin-bottom: 12px;                     
        }
    }
            .warn-content {
                margin: 16px 0;
                color: #aaaaaa;
                border-left: 4px solid #d9d9d9;
                text-indent: 12px;
            }
    .img-list {
        display: flex;
        justify-content:flex-start;
        flex-wrap: wrap;
        margin-top: 10px;
        .item {
            position: relative;
            width: 74px;
            height: 74px;
            margin-right: 8px;
            margin-bottom: 8px;
            &:hover {
                .preview {
                    display: flex;
                }
            }
        }
        img {
            width: 74px;
            height: 74px;
            border: solid 1px rgba(0, 0, 0, 0.06);
        }
        .preview {
            position: absolute;
            top: 0;
            left: 0;
            display: none;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: 16px;
            color: #ffffff;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.5);
        }
    }
    .view-detail {
        margin: 10px 0;
        font-size: 12px;
        color: #929aa6;
        cursor: pointer;
        svg {
            width: 12px;
            height: 12px;
            vertical-align: -2px;
            transition: transform .3s;
            // margin-left: 5px;
            color: #D3DCE6;
            &.rotate {
                transform: rotate(180deg)
            }
        }
    }
    .relation {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 8px;
        font-size: 12px;
        &.principal-name {
            margin-bottom: 0
        }
        svg {
           margin-top: 3px;
        }
        div {
            flex: 1;
        }
        span {
            display: inline-block;
            padding: 6px 10px;
            margin-right: 8px;
            margin-bottom: 8px;
            vertical-align: middle;
            color: #5c6d81;
            background: #f1f3f5;
        }
        svg {
            margin-right: 8px;
        }
    }
    .about_man {
        justify-content: space-between;
        display: flex;
        font-size: 12px;
        line-height: 1.5;
        margin-top: 10px;
        color: #babdc2;
        .about_man_left{
            width:45%;
        }
        .about_man_right{
            width: 45%;
            display: flex;
            justify-content: flex-end;
            // line-height: 1.5;
        }
    }
}
.upload-file {
    margin-bottom: 16px;
    .file-item {
        position: relative;
        margin-top: 8px;
        padding: 8px;
        background: #f0f1f2;
    }
    .file-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background-color: #1f96ff;
    }
    i {
        margin-right: 8px;
    }
    a {
        color: #2c2c2c;
        font-size: 12px;
    }
    span {
        text-decoration: underline;
    }
    .icon-close {
        float: right;
        color: #bcbec2;
        cursor: pointer;
    }
}
</style>
