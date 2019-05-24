<template>
    <div class="upload-excel">
        <el-upload class="upload-demo" :action="upLoadUrl" :data="fileData" multiple
            :before-upload="handleFileBeforeUpLoad"
            :on-success="handleFileSuccess"
            :on-progress="handleProgress"
            :show-file-list="false"
            >
            <span v-if="tipsWord" style="text-decoration: underline;">{{tipsWord}}</span>
            <span v-else class="upload-pm-file">+上传新的打版文件</span>
        </el-upload>
        <!-- <el-dialog
                :visible.sync="dialogVisiblePMFile"
                custom-class="excel-dialog"
                @close="dialogClose"
                :modal-append-to-body="false"
        >
            <div element-loading-text="拼命导入中">
                <el-upload class="upload-demo" :action="upLoadUrl" :data="fileData" multiple
                    :before-upload="handleFileBeforeUpLoad"
                    :on-success="handleFileSuccess"
                    :on-progress="handleProgress"
                    :show-file-list="false"
                    v-show="fileList.length === 0"
                    >
                    <span class="upload-btn">添加打版文件</span>
                </el-upload>
                <p v-if="fileList.length > 0" class="del-wrap" >{{fileList.length > 0 ? fileList[0].fileFullName : ''}} <i @click="delFile" class="el-icon-circle-cross"></i></p>
                <span  class="dialog-footer">
                    <el-button @click="cancel()">取 消</el-button>
                    <el-button type="primary" @click="handleSureUpload">确认导入</el-button>
                </span>
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
import QiNiu from "@/config/qiniu";
import {getUploadToken} from '@/api'
export default {
    props: ['dialogVisiblePMFile','tipsWord'],
    data() {
        return {
            fileData: {},
            upLoadUrl: QiNiu.upUrl,
            fileList: []
        }
    },
    computed: {
        isWorkBench() {
            return this.$route.path == '/designWorkbench'
        }
    },
    methods: {
        dialogClose(){
            // 清空已经选中的文件
            this.fileList = [];
            if(this.$refs.upload){
                this.$refs.upload.value = '';
            }
            // this.excelData = true;
            this.$emit('update:dialogVisiblePMFile', false)
        },
        
        //点击导入
        handleSureUpload(){
            console.log('导入',this.fileList)
            if (this.fileList.length === 0) {
                this.$message.error('请上传文件');
                return
            }
            this.$emit("commit", this.fileList);
            this.fileList = []
        },
        delFile(){
            this.fileList = []
        },
        cancel () {
            this.$emit('update:dialogVisiblePMFile', false)
        },

        async handleFileBeforeUpLoad(file) {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.style.templete.upload")&&!this.isWorkBench){
                return
            }
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.mission.workspace.templete.upload")&&this.isWorkBench){
                return
            }
            if (this.checkFile(file.name, this.fileList)) {
                this.$message.error("上传的文件已存在！");
                return false;
            }
            const type = file.name.split(".").pop()
            const params = {}
            params.token = await this.getToken()
            this.fileData = params
            this.fileList.push({
                fileFullName: file.name,
                path: '',
                fileName: file.name.split(".")[0],
                url: '',
                fileType: type,
                suffix: file.name.split(".")[1],
                filePath: '',
            })
        },
        checkFile(fileName, fileArr) {
            if (!fileArr) {
                return false
            }
            const hasFile = fileArr.some(item => {
                return item.fileFullName === fileName
            }) || false
            return hasFile
        },
        handleFileSuccess(response, file, fileList) {
            const index = this.fileList.findIndex(item => {
                return item.fileFullName === file.name
            })
            if (index !== -1) {
                const url =
                QiNiu.baseUrl + response.key + "?attname=" + file.name
                this.fileList[index].url = url
                this.fileList[index].filePath = url
            }
            this.handleSureUpload()
        },
        handleProgress (event, file, fileList) {
            const percent = event.percent;
            const index = this.fileList.findIndex(item => {
                return item.fileFullName === file.name;
            });
            if (index !== -1) {
                this.fileList[index].percent = percent;
            }
        },
        getToken() {
            const params = {
                appId: this.$globalConfig.appId.appId
            };
            return getUploadToken(params).then(res => {
                return res.data.uptoken;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .upload-excel{
        #excel-upload-input{
            display: none;
            z-index: -9999;
        }
        #drop{
            border: 2px dashed #bbb;
            width: 600px;
            height: 160px;
            line-height: 160px;
            margin: 0 auto;
            font-size: 24px;
            border-radius: 5px;
            text-align: center;
            color: #bbb;
            position: relative;
        }
        .upload-mini-btn{
            width: 40px;
            height: 26px;
            font-size: 13px;
            padding: 0;
            position: relative;
            top: -3px;
        }
        .del-wrap{
            text-align: center;
            .el-icon-circle-cross{
                position: relative;
                top: -3px;
                cursor: pointer
            }
        }
    }

</style>
<style lang="scss">
    .excel-dialog {
        width: 700px !important;
        .el-dialog__header {
            text-align: center;
            padding-bottom: 20px;
        }
        .excel-dialog-div {
            height: 200px;
            text-align: center;
            .p1{
                margin-top: 80px;
                cursor: pointer;
            }
            p:last-child:hover{
                color: #00a0e9;
            }
        }
        .el-dialog__footer {
            padding-top: 20px;
            margin-top: 20px;
        }
        .dialog-footer{
            display: block;
            text-align: right;
            margin-top: 30px;
        }
        .importResult{
            border-bottom: 1px solid #000;
            padding-bottom: 20px;
            margin-bottom: 20px;
            p{
                font-size: 16px;
                text-align: center;
                margin-bottom: 4px;
            }
            button{
                float: right;
                margin: 10px;
                margin-top: 30px;
            }
        }
        .downP{
            display: inline-block;
            text-align: center;
            margin: 15px 0 0 26px;
            color: #666;
            text-decoration: underline;
            cursor: pointer;
            &:hover{
                color: #ff8d37;
            }
        }
    }
    .upload-pm-file {
        color: #FFA914;
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        cursor: pointer;
    }
</style>
