<template>
    <div class="upload-item">
        <el-upload v-show="isShowClose" class="upload-demo" :action="upLoadUrl" :data="fileData" multiple
                    :before-upload="handleFileBeforeUpLoad"
                    :on-success="handleFileSuccess"
                    :on-progress="handleProgress"
                    :show-file-list="false">
            <span v-if="!showDiffBtn" class="attach-btn" v-show="isShowClose">
                <icon type="icon-annex" w="14" h="14"></icon>
                <span class="upoad-desc">添加附件</span>
            </span>
            <span v-if="showDiffBtn" v-show="isShowClose">
                <span class="upload-btn">添加打版文件</span>
            </span>
        </el-upload>
        <el-col :span="24" class="info-list4">
            <div class="upload-file">
                <div class="file-item" v-for="(fileItem, fileIndex) in fileList" :key="fileIndex">
                        <a @click="downLoad(fileItem)" download>
                            <icon v-if="fileItem.suffix=='pdf'"  type="icon-pdf"></icon>
                            <icon v-if="fileItem.suffix=='doc' || fileItem.suffix=='docx'"  type="icon-word"></icon>
                            <icon v-if="fileItem.suffix=='xls' || fileItem.suffix=='xlsx'"  type="icon-Excel"></icon>
                            <icon v-if="fileItem.suffix=='pptx'"  type="icon-ppt"></icon>
                            <icon v-if="fileItem.suffix == 'txt'"  type="icon-otherfile"></icon>
                            <icon v-if="fileItem.suffix == 'zip' || fileItem.suffix == 'rar'"  type="icon-otherfile"></icon>
                            <span>{{fileItem.fileFullName}}</span></a>
                        <i class="icon-close el-icon-circle-close"
                            v-show="fileItem.fileFullName && isShowClose"
                            @click="handleDeleteFile(fileIndex)"></i>
                    <div class="file-progress" v-show="!fileItem.url && fileItem.percent !== 100"
                            :style="{'width': fileItem.percent + '%'}">
                    </div>
                </div>
            </div>
        </el-col>
    </div>
</template>

<script>
import {getUploadToken,updateCommonProcessForm} from '@/api'
const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
import md5 from "js-md5";
export default {
    props:{
        attachData: {
            type: Array,
            default() {return []}
        },
        isShowClose: {
            default: true,
            type: Boolean
        },
        //显示不同的上传按钮
        showDiffBtn: {
            default: false,
            type:Boolean
        }
    },
    data() {
        return {
            upLoadUrl: this.$globalConfig.qiniu.upUrl,
            fileData: {},
        }
    },
    computed:{
        fileList(){
            return this.attachData
        }
    },
    methods: {
        downLoad(fileItem) {
            window.open(fileItem.filePath||fileItem.url||fileItem.path);
        },
        async handleFileBeforeUpLoad(file) {
            if (this.checkFile(file.name, this.fileList)) {
                this.$message.error("上传的文件已存在！");
                return false;
            }
            const type = file.name.split(".").pop();
            const params = {};
            params.token = await this.getToken();
            params.key = this.setImgKey("file") + "." + type;
            this.fileData = params;
            this.fileList.push({
                fileFullName: file.name,
                path: params.key,
                url: "",
                percent: 0,
                fileType:type,
                suffix:type,
                filePath:'',
            });

        },
        handleFileSuccess(response, file) {
            const index = this.fileList.findIndex(item => {
                return item.fileFullName === file.name;
            });
            if (index !== -1) {
                const url = this.$globalConfig.qiniu.baseUrl + response.key + "?attname=" + file.name;
                this.fileList[index].url = url;
                this.fileList[index].filePath = url;
            }
            this.$emit('attachD',this.fileList,this.item);
        },
        handleProgress(event, file, fileList) {
            console.log("进行中")
            console.log(event)
            const percent = event.percent;
            const index = this.fileList.findIndex(item => {
                return item.fileFullName === file.name;
            });
            if (index !== -1) {
                this.fileList[index].percent = percent;
            }
            this.$emit('fileProgress');
        },
        checkFile(fileName, fileArr) {
            if (!fileArr) {
                return false;
            }
            const hasFile = fileArr.some(item => {
                return item.fileFullName === fileName;
            }) || false;
            return hasFile;
        },
        isImage(type) {
            console.log('isImage')
            return /(png|jpg|jpeg|gif|bmp)$/i.test(type);
        },
        setImgKey(type) {
            const storeId = this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            const date = + new Date() + "";
            return storeId + "_" + _env + "_" + md5(storeId + date) + '.';
        },
        getToken() {
            const params = {
                appId: this.$globalConfig.appId.appId
            };
            return getUploadToken(params).then(res => {
                return res.data.uptoken;
            });
        },
        handleDeleteFile(index) {
            this.fileList.splice(index, 1);
        },
    },
    created(){
        // this.fileList = this.attachData;
        // console.log(this.fileList, '12345')
    },

}
</script>

<style lang='scss' scoped>
    .upload-btn{
        padding: 0 7px;
        line-height: 28px;
        background: #1CA1FF;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
        display: inline-block;
        text-align: center;
        margin:12px 0;
    }

    .upload-item {
    //   display: inline-block;W
      margin-right: 24px;
      position: relative;
      cursor: pointer;
      .upoad-desc {
        margin-left: 5px;
        color:#fff;
        font-size: 14px;
      }
    }
    .upload-file {
      display: flex;
      justify-content: flex-start;
      width:100%;
      flex-wrap: wrap;
      .file-item {
        max-width: 305px;
        margin-bottom:10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-right: 8px;
        padding: 8px;
        background: #f7f9fc;
        &:last-child {
          margin-left: 0;
        }
      }
      .file-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background-color: #1f96ff;
      }
      a {
        max-width: 280px;
        overflow: hidden;
        padding-right: 8px;
        color: #2c2c2c;
        font-size: 12px;
      }
      span {
          display: inline-block;
          vertical-align: middle;
          margin-left: 5px;
          max-width: 200px;
          font-size: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
      }
      .icon-close {
        float: right;
        color: #bcbec2;
        cursor: pointer;
      }
    }
    .attach-btn {
        border-radius:2px;
        display:flex;
        background:#d3d9e6;
        width:98px;
        height:36px;
        justify-content:center;
        align-items:center;
        box-sizing: border-box;
        margin:12px 0;
    }
    .upload-item.file-upload {
        margin-right: 0;
        .attach-btn{
            margin-top: 0;
        }
        .file-item{
            max-width: 225px;
            span{
                max-width: 175px;
            }
        }
    }
</style>
