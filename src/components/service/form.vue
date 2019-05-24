<template>
    <div class="send-form">
        <div class="reply-content" v-if="resplyMsg.message && !resplyMsg.isEdit">
            <p>回复  {{resplyMsg.senderName}}</p>
             <p class="reply-msg">> {{resplyMsg.message}}</p>
        </div>
        <div class="textarea">
            <textarea row="3" 
            v-model="message"
            ref="textarea"
            placeholder="请输入内容..."
            ></textarea>
        </div>
        <div class="upload-img" v-if="imgList.length">
            <div class="img-wrap" v-for="(imgItem, imgIndex) in imgList" :key="imgIndex">
                <img :src="imgItem.path" />
                <div class="delete-btn" @click="handleDeteleImg(imgIndex)"><i class="el-icon-close"></i></div>
                <div class="img-progress" v-show="!imgItem.path && imgItem.percent !== 100" :style="{'height': imgItem.percent + '%'}"></div>
            </div>
            <el-upload
                class="upload-demo"
                :action="upLoadUrl"
                :before-upload="handleBeforeUpLoad"
                :on-success="handleSuccess"
                :on-progress="handleProgress"
                :data="imgData"
                :show-file-list="false">
                    <div class="upload-btn">
                    <i class="el-icon-plus"></i>
                </div>
                </el-upload>
        </div>
        <div class="upload-file" v-if="fileList.length">
            <div class="file-item" v-for="(fileItem, fileIndex) in fileList" :key="fileIndex">
                <div class="file">
                    <a :href="fileItem.url"><i class="fa fa-file-o"></i><span>{{fileItem.name}}</span></a>
                    <i class="icon-close el-icon-circle-close" v-show="fileItem.url && fileItem.percent === 100" @click="handleDeleteFile(fileIndex)"></i>
                </div>
                <div class="file-progress" v-show="!fileItem.url && fileItem.percent !== 100" :style="{'width': fileItem.percent + '%'}">
                </div>
            </div>
        </div>
        <div class="handle-bar">
            <div class="upload" id="upload-con">
                <el-upload
                class="upload-demo"
                :action="upLoadUrl"
                :before-upload="handleBeforeUpLoad"
                :on-success="handleSuccess"
                :on-progress="handleProgress"
                :data="imgData"
                multiple
                :show-file-list="false">
                <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                    <icon type="icon-xiaoxi-tupian" w="26"></icon>
                </el-upload>
                <el-upload
                class="upload-demo"
                :action="upLoadUrl"
                :data="fileData"
                multiple
                :before-upload="handleFileBeforeUpLoad"
                :on-success="handleFileSuccess"
                :on-progress="handleFileProgress"
                :show-file-list="false">
                <icon type="icon-xiaoxi-fujian" w="26"></icon>
                </el-upload>
            </div>
            <nf-button type="primary" style="line-height:0.5;height:24px;width:58px;" @click="handleSubmit">发送</nf-button>
            <!-- <button @click="submit">发送</button> -->
        </div>
        <div class="select-wrap">
            <new-select
                    title="关联节点"
                    icon="icon-guanlianjiedian"
                    :options="nodeOptions" 
                    selectKey="id" 
                    label="name"
                    @change="handleSelect"
                    v-model="selectNodeVal"></new-select>
            <new-select
                    :options="personOptions" 
                    selectKey="id" 
                    label="userName"
                    v-model="selectPersonVal"></new-select>
        </div>
    </div>
</template>

<script>
import { getUploadToken, getLeadersOfNode } from "../../api/api";
// import JnSelect from './select-multiple'
import NewSelect from "./new-select";
const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
import md5 from "js-md5";
export default {
  props: {
    personList: {
      type: Array,
      default: () => []
    },
    nodeList: {
      type: Array,
      default: () => []
    },
    textFocus: {
      type: Boolean,
      default: false
    },
    isSubmit: {
      type: Boolean,
      default: false
    },
    resplyMsg: {
      type: Object,
      default: () => {}
    },
    staticPersonIds: {
      type: Array,
      default: () => []
    },
    staticNodeIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      imgData: {
        token: "",
        key: ""
      },
      message: "",
      nodeVisible: false,
      personVisible: false,
      fileData: {},
      fileProgress: 0,
      // 上传文件类型
      fileList: [],
      imgList: [],
      nodeOptions: [],
      personOptions: [],
      selectNodeVal: [],
      selectPersonVal: [],
      upLoadUrl: this.$globalConfig.qiniu.upUrl,
      sign:''
      // selectPersonName: [],
      // selectNodeName: []
    };
  },
  mounted() {
    // this.$refs['textarea'].focus();
  },
  watch: {
    nodeList(val) {
      const arr = JSON.parse(JSON.stringify(val));
      this.nodeOptions = arr;
    },
    personList(val) {
      const arr = JSON.parse(JSON.stringify(val));
      this.personOptions = arr;
    },
    textFocus(val) {
      this.$refs["textarea"].focus();
    },
    resplyMsg(val) {
      if (!val.notifyUsers) {
        return;
      }
      this.selectPersonVal = [];
      this.selectNodeVal = [];
      this.taskInstanceWorkFlowId = val.nodeId || "";
      for (let item of val.notifyUsers) {
        this.selectPersonVal.push(item.id);
      }
      for (let item of val.notifyNodes) {
        this.selectNodeVal.push(item.id);
      }
      if (val.isEdit) {
        this.message = val.message;
        console.log(val);
        this.imgList = this.filterEditFileAndImgList(
          JSON.parse(JSON.stringify(val.pictures)),
          "img"
        );
        this.fileList = this.filterEditFileAndImgList(
          JSON.parse(JSON.stringify(val.attachments))
        );
      }
      if (!val.message) {
        this.message = "";
      }
    },
    isSubmit(val) {
      if (val) {
        this.selectPersonVal = [];
        this.selectNodeVal = [];
        this.message = "";
        this.fileList = [];
        this.imgList = [];
      }
    },
    staticPersonIds(val) {
      if (val.length) {
        this.selectPersonVal = val;
      }
    },
    staticNodeIds(val) {
      if (val.length) {
        this.selectNodeVal = val;
      }
    }
  },
  methods: {
    handleSubmit() {

      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.message.add") {
            this.sign = "1";
          }
        }
      }
      if (this.sign == "0" || !datalist) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      if (!this.message) {
        this.$message.error("请输入消息内容！");
        return;
      }
      if (!this.checkUpload(this.imgList) || !this.checkUpload(this.fileList)) {
        this.$confirm(
          "如果此时点“继续”，未完成上传的附件将丢失，是否继续？",
          "您有附件正在上传中！",
          {
            confirmButtonText: "继续",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.submitForm();
          })
          .catch(() => {});
      } else {
        this.submitForm();
      }
    },
    submitForm() {
      const pictures = [];
      const fileList = [];
      const notifyTaskInstanceWorkFlowIdIds = [];
      for (let item of this.imgList) {
        if (item.percent === 100) {
          pictures.push(item.key);
        }
      }
      for (let item of this.fileList) {
        if (item.percent === 100) {
          fileList.push(item);
        }
      }
      // return;
      for (let idItem of this.selectNodeVal) {
        for (let item of this.nodeOptions) {
          if (idItem === item.id || idItem === item.instanceWorkflowId) {
            notifyTaskInstanceWorkFlowIdIds.push(item.instanceWorkflowId);
          }
        }
      }
      const options = {
        id: this.resplyMsg.id,
        taskInstanceWorkFlowId: this.taskInstanceWorkFlowId,
        notifyTaskInstanceWorkFlowIdIds: notifyTaskInstanceWorkFlowIdIds,
        notifyUserIds: [...this.selectPersonVal],
        message: this.message,
        pictures: pictures,
        messageSpecialType: "SEND",
        attachments: fileList
      };
      this.$emit("handleReplyMessage", options);
      // //console.log(this.fileList, this.imgList);
    },
    //当编辑时处理返回的值
    filterEditFileAndImgList(arr, type) {
      if (!arr || !arr.length) return [];
      let newArr = [];
      arr = JSON.parse(JSON.stringify(arr));
      if (type === "img") {
        arr.map(item => {
          const pathArr = item.path.split("/");
          // item.url = item.path;
          newArr.push({
            ...item,
            percent: 100,
            key: pathArr[pathArr.length - 1]
          });
        });
      } else {
        arr.map(item => {
          const pathArr = item.path.split("/");
          item.url = item.path;
          // item.path = pathArr[pathArr.length - 1];
          newArr.push({
            ...item,
            percent: 100,
            path: pathArr[pathArr.length - 1]
          });
        });
      }
      console.log(newArr);
      return newArr;
    },
    handleSelect(item) {
      this.$emit("changeNode", item);
    },
    isImage(type) {
      return /(png|jpg|jpeg|gif|bmp)$/i.test(type);
    },
    // 设置上传图片key
    setImgKey(type) {
      const storeId =
        this.$store.state.userInfo.id ||
        JSON.parse(sessionStorage.getItem("user_login")).userId;
      const date = +new Date() + "";
      // if (type === 'file') {
      //     return date;
      // }
      return storeId + "_" + _env + "_" + md5(storeId + date);
    },
    getToken() {
      const params = {
        appId: this.$globalConfig.appId.appId
      };
      return getUploadToken(params).then(res => {
        return res.data.uptoken;
      });
    },
    // 上传前函数
    async handleBeforeUpLoad(file) {
      if (this.checkFile(file.name, this.imgList)) {
        this.$message.error("上传的图片已存在");
        return false;
      }
      if (this.isImage(file.type)) {
        const imgSplitArr = file.name.split(".");
        const params = {};
        params.token = await this.getToken();
        params.key =
          this.setImgKey() + "." + imgSplitArr[imgSplitArr.length - 1];
        this.imgData = params;
        this.imgList.push({
          name: file.name,
          path: "",
          percent: 0,
          key: params.key
          // url: ""
        });
      } else {
        this.$message.error("请选择图片上传！");
        return false;
      }
    },
    async handleFileBeforeUpLoad(file) {
      if (this.checkFile(file.name, this.fileList)) {
        this.$message.error("上传的文件已存在！");
        return false;
      }
      if (this.isImage(file.type)) {
        this.$message.error("请选择文件上传！");
        return false;
      } else {
        const fileSplitArr = file.name.split(".");
        const params = {};
        params.token = await this.getToken();
        params.key =
          this.setImgKey("file") + "." + fileSplitArr[fileSplitArr.length - 1];
        this.fileData = params;
        this.fileList.push({
          name: file.name,
          path: params.key,
          percent: 0,
          url: ""
        });
      }
    },
    handleFileSuccess(response, file, fileList) {
      const index = this.fileList.findIndex(item => {
        return item.name === file.name;
      });
      if (index !== -1) {
        const url =
          this.$globalConfig.qiniu.baseUrl + response.key + "?attname=" + file.name;
        this.fileList[index]["url"] = url;
      }
    },
    handleSuccess(response, file, fileList) {
      const index = this.imgList.findIndex(item => {
        return item.name === file.name;
      });
      if (index !== -1) {
        const url = this.$globalConfig.qiniu.baseUrl + response.key;
        this.imgList[index]["path"] = url;
      }
    },
    handleProgress(event, file, fileList) {
      console.log(event);
      const index = this.imgList.findIndex(item => {
        return item.name === file.name;
      });
      if (index !== -1) {
        const percent = event.percent;
        this.imgList[index]["percent"] = percent;
      }
    },
    handleFileProgress(event, file, fileList) {
      const index = this.fileList.findIndex(item => {
        return item.name === file.name;
      });
      if (index !== -1) {
        const percent = event.percent;
        this.fileList[index]["percent"] = percent;
      }
    },
    checkFile(fileName, fileArr) {
      const hasFile = fileArr.some(item => {
        return item.name === fileName;
      });
      return hasFile;
    },
    checkUpload(fileArr) {
      if (!fileArr.length) return true;
      for (let item of fileArr) {
        if (item.percent !== 100) {
          return false;
          break;
        }
      }
      return true;
    },
    handleDeleteFile(index) {
      this.fileList.splice(index, 1);
    },
    handleDeteleImg(index) {
      this.imgList.splice(index, 1);
    },
    handleGetNodeVal() {
      this.nodeVisible = false;
    },
    handleGetPersonVal() {
      this.personVisible = false;
    }
  },
  components: {
    NewSelect
  }
};
</script>

<style scoped lang="scss">
.send-form {
  background: #fafafa;
  border-top: 1px solid #e6e8eb;
  .reply-content {
    padding: 8px;
    line-height: 20px;
    font-size: 14px;
    color: #aaaaaa;
    .reply-msg {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .textarea {
    height: 90px;
    outline: none;
    padding: 8px;
    box-sizing: border-box;
    textarea {
      display: block;
      width: 100%;
      height: 100%;
      outline: none;
      resize: none;
      background: transparent;
      border: none;
    }
  }
  .upload-demo {
    display: inline-block;
  }
  .upload-img {
    display: flex;
    flex-wrap: wrap;
    margin: 0 16px;
    padding: 8px 8px 0;
    max-height: 130px;
    overflow-y: auto;
    background: #f0f1f2;
    .upload-btn {
      width: 50px;
      height: 50px;
      margin-left: 8px;
      text-align: center;
      padding: 3px;
      color: #c8cacc;
      // box-sizing: border-box;
      border: solid 1px #dbdbdb;
      cursor: pointer;
      i {
        display: block;
        line-height: 48px;
        border: dashed 1px #dbdbdb;
      }
    }
    .img-wrap {
      position: relative;
      width: 56px;
      height: 56px;
      margin-bottom: 8px;
      margin-left: 8px;
      border: solid 1px #dbdbdb;
      img {
        width: 100%;
        height: 100%;
      }
      .img-progress,
      .delete-btn {
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
      }
      .img-progress {
        width: 100%;
        overflow: hidden;
      }
      .delete-btn {
        display: none;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 12px;
        color: #ffffff;
      }
      &:hover {
        .delete-btn {
          display: flex;
        }
      }
      // .is-
    }
  }
  .upload-file {
    margin: 0 16px;
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
  .handle-bar {
    display: flex;
    align-items: center;
    padding: 0 16px;
    padding-bottom: 14px;
    margin-top: 16px;
    border-bottom: 1px solid #e6e8eb;
    overflow: hidden;
    .upload {
      flex: 1;
    }
    i {
      display: inline-block;
      width: 26px;
      height: 20px;
      border-radius: 1px;
      background-color: #dbdbdb;
    }
    // button {
    //     width: 56px;
    //     height: 26px;
    //     float: right;
    //     color: #ffffff;
    //     border-radius: 2px;
    //     background-color: #1fadff;
    // }
  }
}

.select-list {
  .handle {
    .handle-type {
      color: #a2abb8;
    }
    .handle-sure {
      color: #1f96ff;
      cursor: pointer;
    }
    // line-height: 30px;
  }
  .handle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
  }
}
.select-wrap {
  padding: 0 10px 10px;
  border-bottom: 1px solid #e6e8eb;
}
</style>
