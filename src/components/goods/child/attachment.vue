<template>
    <div class="upload-item">
        <el-upload class="upload-demo" :action="upLoadUrl" :data="fileData" multiple
                    :before-upload="handleFileBeforeUpLoad"
                    :on-success="handleFileSuccess"
                    :on-progress="handleProgress"
                    :show-file-list="false">
            <span class="attach-btn" >
                <icon type="icon-annex" w="14" h="14"></icon>
                <span class="upoad-desc">添加附件</span>
            </span>
        </el-upload>
        <el-col :span="24" class="info-list4" v-if="fileList.length">
            <div class="upload-file">
                <div class="file-item" v-for="(fileItem, fileIndex) in fileList" :key="fileIndex">
                    <!-- <div class="file"> -->
                        <a :href="fileItem.url" download>
                            <icon v-if="fileItem.fileType=='pdf'"  type="icon-pdf"></icon>
                            <icon v-if="fileItem.fileType=='docx'"  type="icon-word"></icon>  
                            <icon v-if="fileItem.fileType=='doc'"  type="icon-word"></icon>  
                            <icon v-if="fileItem.fileType=='excel'"  type="icon-Excel"></icon>                              
                            <icon v-if="fileItem.fileType=='pptx'"  type="icon-ppt"></icon>   
                            <icon v-if="fileItem.fileType =='txt'"  type="icon-otherfile"></icon>  
                            <icon v-if="fileItem.fileType =='zip'"  type="icon-otherfile"></icon>                                                                                                                                              
                            <span>{{fileItem.fileFullName}}</span></a>
                        <i class="icon-close el-icon-circle-close"
                            v-show="fileItem.fileFullName && fileItem.percent === 100"
                            @click="handleDeleteFile(fileIndex)"></i>
                    <!-- </div> -->
                    <div class="file-progress" v-show="!fileItem.url && fileItem.percent !== 100"
                            :style="{'width': fileItem.percent + '%'}">
                    </div>
                </div>
            </div>
        </el-col>
    </div>
</template>

<script>
import {getUploadToken} from '../../../api/api'
const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
import md5 from "js-md5";
export default {
    props:['item'],
    data() {
        return {
            upLoadUrl: this.$globalConfig.qiniu.upUrl,
            fileData: {},
            fileList: [],
        }
    },
    computed: {
    },
    methods: {
        async handleFileBeforeUpLoad(file) {
            if (this.checkFile(file.name, this.fileList)) {
                this.$message.error("上传的文件已存在！");
                return false;
            }
            // if (this.isImage(file.type)) {
            //     this.$message.error("请选择文件上传！");
            //     return false;
            // } else {
                const type = file.name.split(".").pop();
                const params = {};
                params.token = await this.getToken();
                params.key = this.setImgKey("file") + "." + type;
                console.log(params);
                this.fileData = params;
                this.fileList.push({
                fileFullName: file.name,
                path: params.key,
                url: "",
                percent: 0,
                fileType:type
                });
            // }
        },
        handleFileSuccess(response, file, fileList) {
            const index = this.fileList.findIndex(item => {
                return item.fileFullName === file.name;
            });
            if (index !== -1) {
                const url = this.$globalConfig.qiniu.baseUrl + response.key + "?attname=" + file.name;
                this.fileList[index].url = url;
            }
            this.$emit('attachList',this.fileList,this.item);  
        },
        handleProgress(event, file, fileList) {
            console.log(event)
            const percent = event.percent;
            const index = this.fileList.findIndex(item => {
                return item.fileFullName === file.name;
            });
            if (index !== -1) {
                this.fileList[index].percent = percent;
            }
        },
        checkFile(fileName, fileArr) {
            const hasFile = fileArr.some(item => {
                return item.fileFullName === fileName;
            });
            return hasFile;
        },
        isImage(type) {
            return /(png|jpg|jpeg|gif|bmp)$/i.test(type);
        },
        setImgKey(type) {
            const storeId = this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;;
            const date = + new Date() + "";
            return storeId + "_" + _env + "_" + md5(storeId + date) ;
        },
        getToken() {
            const params = {
                appId: this.$globalConfig.appId.appId
            };
            return getUploadToken(params).then(res => {
                console.log(res.data);
                return res.data.uptoken;
            });
        },
        handleDeleteFile(index) {
            this.fileList.splice(index, 1);
         },
    }
}
</script>

<style lang='scss' scoped>
    .upload-item {
      display: inline-block;
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
      .file-item {
        width: 305px;
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
</style>
