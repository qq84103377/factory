<template>
    <div class="import-dialog">
        <el-dialog
                :title="title"
                :visible.sync="visible"
                custom-class="custom-dialog"
                @close="cancel">
            <div  v-loading="loading" element-loading-text="拼命导入中" class="text-center">
                <input  id="excel-upload-input" ref="upload" type="file" accept=".xlsx, .xls" @change="handleClick">
                <div v-if="fileLength ===0" id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
                    将excel文件拖拽到这里，或者
                    <el-button  class="upload-mini-btn" size="mini" type="primary" @click="handleUpload">点击上传文件</el-button>
                </div>
                <a @click="downloadExcel()" v-if="fileLength ===0" class="download-tempalte">{{templateText}}</a>
                <p class="del-wrap" v-if="fileLength ===1">{{fileName}} <i @click="delFile" class="el-icon-circle-cross"></i></p>
            </div>
            <div slot="footer" class="text-right">
                <el-button @click="cancel">取 消</el-button>
                <el-button :disabled="loading" type="primary" @click="confirm">确认导入</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        // *****props***** //
        // title：弹出框标题
        // visible：可见性
        // loading：显示"拼命导入中"
        // templateText：模板文件的名称

        // ****自定义事件***** //
        // confirm：确定导入
        // downloadTemplate：下载模板
        props: ['title','visible','loading','templateText'],
        data() {
            return {
                filesList:[],
                fileLength:0,
                fileName:'',
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
            }
        },
        watch:{
        },
        methods: {
            cancel(){
                // 清空已经选中的文件
                this.fileLength = 0;
                if(this.$refs.upload){
                    this.$refs.upload.value = '';
                }
                this.$emit('update:visible',false)
            },
            //拖文件触发input
            handleDrop(e) {
                e.stopPropagation();
                e.preventDefault();
                if (this.loading) return;
                const files = e.dataTransfer.files;
                if (files.length !== 1) {
                    this.$message.error('不能上传多个excel表！');
                    return
                }
                const rawFile = files[0];
                this.fileLength = files.length;
                this.fileName = rawFile.name;
                this.filesList = rawFile;
                e.stopPropagation();
                e.preventDefault();
            },
            handleDragover(e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            },
            handleUpload() {
                document.getElementById('excel-upload-input').click()
            },
            handleClick(e) {
                const files = e.target.files;
                const rawFile = files[0];
                this.fileLength = files.length;
                this.fileName = rawFile.name;
                if (!rawFile) return
            },
            //点击导入
            confirm(){
                if (this.fileLength === 0) {
                    this.$message.error('请上传文件');
                    return
                }
                this.$emit('confirm',this.$refs.upload.files[0]?this.$refs.upload.files[0]:this.filesList)
            },
            delFile(){
                // 清空已经选中的文件
                this.fileLength = 0;
                this.$refs.upload.value = '';
            },
            //下载excel模板
            downloadExcel(){
                this.$emit('downloadTemplate')
            },

        }
    }
</script>

<style lang="scss" scoped>
    .import-dialog{
        .el-dialog{
            background: #fff !important;
        }
        #excel-upload-input{
            display: none;
            z-index: -9999;
        }
        #drop{
            border: 2px dashed #bbb;
            width: 95%;
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
            height: 26px;
            font-size: 13px;
            padding: 0 5px;
            position: relative;
            top: -3px;
        }
        .del-wrap{
            text-align: center;
            padding: 60px 0;
            .el-icon-circle-cross{
                position: relative;
                top: -3px;
                cursor: pointer
            }
        }
        .download-tempalte{
            display: block;
            text-align: center;
            margin-top: 15px;
            color: #666;
            text-decoration: underline;
            cursor: pointer;
            &:hover{
                color: #ff8d37;
            }
        }
    }

</style>
<style lang="scss">
    .import-dialog{
        .el-dialog--small{
            width: 500px;
        }
    }

</style>
