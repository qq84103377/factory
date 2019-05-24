<template>
    <div class="upload-excel">
        <el-dialog
                :visible.sync="dialogVisibleExcel"
                custom-class="excel-dialog"
                @close="dialogClose"
        >
            <div v-if="excelData" v-loading="loading" element-loading-text="拼命导入中" class="center-text">
                <input  id="excel-upload-input" ref="upload" type="file" accept=".xlsx, .xls" @change="handleClick">
                <div v-if="fileLength ===0" id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
                    将excel文件拖拽到这里，或者
                    <el-button :loading="loading" class="upload-mini-btn" size="mini" type="primary" @click="handleUpload">打开</el-button>
                </div>
                <a @click="downloadExcel()" v-if="fileLength ===0" class="downP">下载excel模板</a>
                <p class="del-wrap" v-if="fileLength ===1">{{fileName}} <i @click="delFile" class="el-icon-circle-cross"></i></p>
                <span  class="dialog-footer">
                    <el-button @click="dialogVisibleExcel = false">取 消</el-button>
                    <el-button type="primary" @click="getData">确认导入</el-button>
                 </span>
            </div>
            <div v-if="!excelData" class="importResult">
                <p>成功导入 {{excelDataSucc}} 条记录</p>
                <p>导入失败 {{excelDataErr}} 条记录</p>
                <div style="margin: 15px 0;text-align: center;">可能失败原因：编号、颜色、内长、尺码没填、编号已存在等，请仔细核对导入表格。</div>
                <div v-if="failureId" @click="exportErrorExcel"
                     style="color: #1CA1FF;text-decoration: underline;cursor: pointer;text-align: center;">下载导入失败列表
                </div>
                <el-button type="primary" @click="dialogClose">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {exportErrorExcel,exportExcelTemplate} from '@/api'
    import {designstyleImportExcelTemplete} from '@/api/sample-centre'

    export default {
        props: ['excelStatic','excelDemoUrl','dialogVisibleExcel'],
        data() {
            return {
                filesList:[],
                fileLength:0,
                fileName:'',
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                loading: false,
                excelData:true,
                excelDataSucc:0,
                excelDataErr:0,
                failureId: ''
            }
        },
        computed:{
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
        },
        watch:{
            'excelStatic':{
                handler(val){
                    console.log(val,'excelDataexcelDataexcelData');
                    this.loading = val.loading;
                    this.excelData = val.excelData;
                    this.excelDataSucc = val.excelDataSucc;
                    this.excelDataErr = val.excelDataErr;
                    this.failureId = val.failureId
                },
                deep: true
            }
        },
        methods: {
            exportErrorExcel() {
                //导出 导入失败的列表
                let params = {
                    importId: this.failureId
                }
                exportErrorExcel(params).then(res => {
                    let blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', '导入失败列表' + '.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
                this.dialogVisibleExcel = false
            },
            dialogClose(){
                // 清空已经选中的文件
                this.fileLength = 0;
                if(this.$refs.upload){
                    this.$refs.upload.value = '';
                }
                this.excelData = true;
                this.$emit('reset')
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
            getData(){
                if (this.fileLength === 0) {
                    this.$message.error('请上传文件');
                    return
                }
                var form = new FormData();
                // 文件对象
                form.append("uploadfile", this.$refs.upload.files[0]?this.$refs.upload.files[0]:this.filesList);
                // 其他参数
                form.append("userId", this.userId);
                form.append("unitId", this.unitId);
                this.$emit("commit", form);
            },
            delFile(){
                // 清空已经选中的文件
                this.fileLength = 0;
                this.$refs.upload.value = '';
            },

            //下载excel模板
            downloadExcel(){
                if(this.excelDemoUrl==='goodsTemplate'){
                    exportExcelTemplate({bossUnitId:this.bossUnitId}).then(res=>{

                        this.fileData =res.data;
                        var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                        let url = window.URL.createObjectURL(res.data);
                        let a = window.document.createElement('a');
                        a.setAttribute('href',url);
                        a.setAttribute('download','商品档案导入模板.xls');
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    })
                    return
                }
                if(this.excelDemoUrl==='designFileTemplate'){
                    designstyleImportExcelTemplete({
                        userId:this.userId,
                        unitId:this.unitId
                    }).then(res=>{

                        this.fileData =res.data;
                        var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                        let url = window.URL.createObjectURL(res.data);
                        let a = window.document.createElement('a');
                        a.setAttribute('href',url);
                        a.setAttribute('download','设计档案导入模板.xls');
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    })
                    return
                }
                window.open(this.excelDemoUrl);
            },

        }
    }
</script>

<style lang="scss" scoped>
    .upload-excel{
        .el-dialog{
            background: #fff !important;
        }
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
        background: #fff !important;
        .el-dialog__header {
            text-align: center;
            padding-bottom: 20px;
        }
        .center-text{
            width: 100%;
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
            border-bottom: 1px solid #e6eaf0 !important;
            flex: 1;
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
        .el-dialog__headerbtn{
            .el-dialog__close{
                font-size: 0px;
            }
        }
    }

</style>
