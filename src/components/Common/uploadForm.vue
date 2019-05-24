<template>
  <div class="upload-form">
    <el-table
            class="custom-table"
            v-show="!designList ||　designList&&(designList.attachmentLists1 || designList.attachmentLists2 || designList.attachmentLists3 || designList.attachmentLists4 || designList.attachmentLists5)"
            :data="defaultTable"
            border
            style="min-width: 800px">
      <el-table-column
              v-if="from == 'order'&&defaultTable.length != 1"
              align="center"
              width="55">
        <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked" @change="change(scope.row.checked,scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
              v-if="from == 'order'"
              align="center"
              prop="outsideFactoryName"
              label="加工厂商"
              min-width="120">
      </el-table-column>
      <el-table-column
              prop="fileName"
              label="附件名称"
              align="center"
              min-width="180" class-name="input-item">
        <template slot-scope="scope">
          <span :class="{'fileCheckActive':checkCodeListDataProp.indexOf('attachmentLists'+(scope.$index+1))>-1}" v-if="!scope.row.isShow">{{handlePowerVisible('attachment'+(scope.$index+1))?scope.row.fileName:'***'}}</span>
          <div v-else  class="bg-yellow">
            <el-input :class="{'fileCheckActive':checkCodeListDataProp.indexOf('attachmentLists'+(scope.$index+1))>-1}" v-model="scope.row.fileName"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column
              prop="tag"
              label="附件标签"
              align="center"
              min-width="120" class-name="input-item">
        <template slot-scope="scope">
          <span v-if="!scope.row.isShow">{{handlePowerVisible('attachment'+(scope.$index+1))?scope.row.tag:'***'}}</span>
          <el-input v-else v-model.trim="scope.row.tag" placeholder="选填"></el-input>
        </template>
      </el-table-column>
      <el-table-column
              min-width="150"
              align="center"
              label="附件">
        <template slot-scope="scope">
          <span v-if="!scope.row.isShow">{{scope.row.fileFullName?scope.row.fileFullName: '无'}}</span>
          <div v-else>
            <el-upload class="upload-demo" :action="upLoadUrl" :data="fileData" multiple
                       :before-upload="handleFileBeforeUpLoad.bind(null,scope.row)"
                       :on-success="handleFileSuccess.bind(null,scope.row)"
                       :on-progress="handleProgress"
                       :show-file-list="false"
            >
              <el-tag
                      v-if="scope.row.fileFullName"
                      class="tags"
                      :closable="true"
                      type="primary"
                      @close="rowMove(scope.row)"
              >
                {{scope.row.fileFullName}}</el-tag>
              <span v-else class="upload-pm-file">点击上传</span>
            </el-upload>
          </div>
        </template>
      </el-table-column>
      <el-table-column
              v-if="from == 'outside' || from == 'order'"
              width="150"
              align="center"
              label="附件编号" class-name="input-item">
        <template slot-scope="scope">
          <div v-if="scope.row.isShow">
            <el-input
                    maxlength="32"
                    type="textarea"
                    autosize
                    placeholder="选填"
                    resize="none"
                    v-model.trim="scope.row.attachmentNumber">
            </el-input>
          </div>
          <div v-else style="white-space:normal;padding:7px 10px;width:110px;">{{scope.row.attachmentNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column
              v-if="from == 'outside' || from == 'order'"
              width="150"
              align="center"
              label="签订日期">
        <template slot-scope="scope">
          <div v-if="scope.row.isShow">
            <el-date-picker
                    v-model="scope.row.dateCompleted"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
            </el-date-picker>
          </div>
          <div v-else>{{ scope.row.dateCompleted | filterTime}}</div>
        </template>
      </el-table-column>
      <el-table-column
              prop="address"
              label="操作"
              align="center"
              width="200px">
        <template slot-scope="scope">
          <div v-if="!scope.row.isShow" class="btn-box">
            <el-button @click="editClick(scope.row)" type="text" class="btn" v-if="!isEdit&&designList&&scope.row.designListShow">编辑</el-button>
            <el-button :disabled="!handlePowerEdit('attachment'+(scope.$index+1))" @click="editClick(scope.row)" type="text" class="btn" v-if="!isEdit&&!designList">编辑</el-button>
            <el-button type="text" class="btn" :disabled="!handlePowerVisible('attachment'+(scope.$index+1))" @click="down(scope.row)" v-if="scope.row.fileFullName">下载附件</el-button>
          </div>
          <div v-else class="btn-box">
            <el-button @click="cancelClick(scope.row,scope.$index)" type="text" class="btn cancel-color">取消</el-button>
            <el-button type="text" @click="save(scope.row,scope.$index)" class="btn save-color">确定</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 其他附件 -->
    <div v-show="!designList ||　designList&&designList.attachments" v-if="from !== 'order'">
      <div class="other-title" :class="{'fileCheckActive':checkCodeListDataProp.indexOf('attachments')>-1}">其他附件：</div>
      <div style="line-height:32px;" class="mgb8">
        <!-- <input type="file" style="display: none;" id="file-input" @change="imgUpload($event)">
        <label class="other-file" for="file-input" v-if="!isEdit">点击上传</label> -->
        <el-upload v-if="!isEdit" class="upload-demo" :action="upLoadUrl" :data="fileData" multiple
                   :before-upload="handleFileBeforeUpLoad.bind(null,'other')"
                   :on-success="handleFileSuccess.bind(null,'other')"
                   :on-progress="handleProgress"
                   :show-file-list="false"
                   :disabled="!handlePowerEdit('attachments')"
        >
          <span class="other-file" :class="{'disabled-bg':!handlePowerEdit('attachments')}">点击上传</span>
        </el-upload>
      </div>
      <div class="tag-list">
        <el-tag
                class="tags"
                v-for="(item,index) in fileList"
                :key="index"
                :closable="!isEdit && handlePowerEdit('attachments')"
                type="primary"
                @close="closeMove(index)"
        >
          <el-button :disabled="!handlePowerVisible('attachments')" @click="down(item)" style="padding: 0;border: none;background: inherit;">{{item.fileFullName}}</el-button>
        </el-tag></div>
    </div>
  </div>
</template>

<script>
const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
import md5 from "js-md5";
const fun = require('@/components/Common/commonFun.js')
import {upDetailImgs,getUploadToken,attachmentListNames, getAttachmentList} from '@/api'
export default {
    filters: {
        filterTime: function (val){
            if (val) {
                return fun.dateFormatter(val,false);
            }
            return  ''
        }
    },
  props:{
    tableData: { // 表格附件
      type: Array
    },
    isEdit: { // 是否详情
      type:Boolean,
      default: function () {
        return false
      }
    },
    fileList: { // 其他附件
      type:Array,
      default: function () {
        return []
      }
    },
      checkCodeListDataProp: { // 检查必填项
      type:Array,
      default: function () {
        return []
      }
    },
    from: {     //引用位置  outside:代表加工厂商档案标识
        type:String,
    },
      designList: {
          type:Array, // 设计工作台引用
      },
      outsideFactoryId: {
          type: String, // 生产订单引用
      },
      editData: {
          type:Array, // 生产订单详情使用
      },
      orderCode: {
          type:String, // 生产订单编辑的时候使用
      },
      isMaterialEdit: {
        type:Boolean // 物料档案使用
      },
      fieldRoles: {
        type: Array,
          default: []
      }
  }, // tableData:表格数据，
  data () {
    return {
      curRow: {},
      defaultTable: [
          {fileName: '附件1',tag:'',fileFullName: '',attachmentNumber: '',dateCompleted: '',sort: 1, designListShow: true},
          {fileName: '附件2',tag:'',fileFullName: '',attachmentNumber: '',dateCompleted: '',sort: 2, designListShow: true},
          {fileName: '附件3',tag:'',fileFullName: '',attachmentNumber: '',dateCompleted: '',sort: 3, designListShow: true},
          {fileName: '附件4',tag:'',fileFullName: '',attachmentNumber: '',dateCompleted: '',sort: 4, designListShow: true},
          {fileName: '附件5',tag:'',fileFullName: '',attachmentNumber: '',dateCompleted: '',sort: 5, designListShow: true}
          ],
        upLoadUrl: this.$globalConfig.qiniu.upUrl,
        fileData: {},
      }
  },
  watch: {
    tableData : {
        handler :function (v) {
            if (v.length > 0) {
                this.defaultTable = v
                console.log(this.designList,'designList')
                if (this.designList) {
                    this.defaultTable.forEach((i, k) => {
                        i.designListShow = this.designList.hasOwnProperty(`attachmentLists${k * 1+1}`)
                    })
                }
        }
      },
        deep: true
    },
      outsideFactoryId(v) {
          console.log(v,'outsideFactoryId');
          if (v) {
              this.getAttachmentList(v)
              this.orderCode = ''
          } else {
              this.defaultTable = []
          }
      },
      editData(v) {
          if (v) {
              this.defaultTable =[v]
              this.defaultTable.forEach(i => {
                  i.fileName = v.attachmentName
                  i.tag = v.attachmentTag
              })
        }
      },
      orderCode(v) {

      }
  },
  computed: {
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    }
  },
  methods: {
      handlePowerVisible(key) {
          if(this.fieldRoles.length){
              return this.fieldRoles.find(v => v.code === key).visible
          }else {
              return true
          }
      },
      handlePowerEdit(key) {
          if(this.fieldRoles.length){
              return this.fieldRoles.find(v => v.code === key).editable
          }else {
              return true
          }
      },
      // 订单引用的选择
      change(val,row) {
          this.defaultTable.forEach(i => {
              this.$set(i, 'checked',false)
          })
          this.$set(row, 'checked',val)
          this.$emit('selectRow',row)
      },
      //订单获取的加工厂数据
      async getAttachmentList(id) {
          await getAttachmentList({commonOutSideFactoryId: id}).then(res => {
              if (res.data.code == 0) {
                  this.defaultTable = res.data.data
                  this.defaultTable.forEach((i,k) => {
                      i.fileName = res.data.data[k].attachmentName
                      i.tag = res.data.data[k].attachmentTag
                      if (this.orderCode&&i.attachmentCode == this.orderCode) {
                          this.$set(i, 'checked',true)
                      } else {
                        this.$set(i, 'checked',false)
                      }
                  })
              }
          })
      },
    // 判断是否有重复文件
    checkFile(fileName, fileArr) {
      if (!fileArr) {
          return false;
      }
      const hasFile = fileArr.some(item => {
          return item.fileFullName === fileName;
      }) || false;
        return hasFile;
    },
    // 上传前的操作
    async handleFileBeforeUpLoad(row,file) {
      const type = file.name.split(".").pop();
      const params = {};
      params.token = await this.getToken();
      params.key = this.setImgKey("file") + "." + type;
      this.fileData = params;
      if(row !== 'other') {
        row.fileFullName = file.name
        row.suffix = type
      } else {
        if (this.checkFile(file.name, this.fileList)) {
          this.$message.error("上传的文件已存在！");
          return false;
        }
        this.fileList.push({
            fileFullName: file.name,
            fileName: file.name.split(".")[0],
            tag: "",
            path: '',
            suffix: type
        });
      }
    },
    // 上传成功的操作
    handleFileSuccess(row, response, file) {
      if (row !==  'other') {
        row.path = this.$globalConfig.qiniu.baseUrl + response.key + "?attname=" + file.name;
      } else {
        const index = this.fileList.findIndex(item => {
            return item.fileFullName === file.name;
        });
        if (index !== -1) {
            const url = this.$globalConfig.qiniu.baseUrl + response.key + "?attname=" + file.name;
            this.fileList[index].path = url;
            console.log(url)    //打印上传文件的url,不要删
        }
        this.$emit('getAttachments',this.fileList);
      }
    },
    // 上传时的操作
    handleProgress (event, file, fileList) {
      const percent = event.percent;
      const index = this.fileList.findIndex(item => {
          return item.fileFullName === file.name;
      });
      if (index !== -1) {
          this.fileList[index].percent = percent;
      }
    },
    // 获取token
    getToken() {
      const params = {
          appId: this.$globalConfig.appId.appId
      };
      return getUploadToken(params).then(res => {
          return res.data.uptoken;
      });
    },
      // 获取默认的附件名称
    getAttachmentListNames (type) {
        let params = {
            userId: this.userId,
            type
        }
        attachmentListNames(params).then(res => {
            if(res.data.code == 0) {
                this.defaultTable.forEach((i,k) => {
                    i.fileName = res.data.data[k].name
                    i.code = res.data.data[k].code
                    i.tag = res.data.data[k].tag
                })
            }
        })
    },
    // 编辑
    editClick(row) {
      this.$set(row, 'isShow', true)
      this.curRow = {
          fileName: row.fileName,
          tag: row.tag,
          fileFullName: row.fileFullName,
          attachmentNumber: row.attachmentNumber,
          dateCompleted: row.dateCompleted,
          userId: this.userId
      }
    },
    // 下载附件
    down(row) {
      window.open(row.path)
    },
    // 取消
    cancelClick(row,index) {
      this.$set(row, 'isShow', false)
      row.fileName = this.curRow.fileName
      row.tag = this.curRow.tag
      row.fileFullName = this.curRow.fileFullName
      row.attachmentNumber = this.curRow.attachmentNumber
      row.dateCompleted = this.curRow.dateCompleted
    },
    // 表格附件删除
    rowMove(row) {
      row.fileFullName = '';
      row.path = '';
    },
    // 确定
    save(row,index) {
      if(!row.fileName) return this.$message.error('附件名称不能为空')
      this.$set(row, 'isShow', false)
      this.defaultTable[index] = row
      row.dateCompleted = row.dateCompleted ? fun.dateFormatter(row.dateCompleted,false) : ''
      this.$emit('getFileList',this.defaultTable)
    },
    // 删除其他附件
    closeMove(index) {
      this.fileList.splice(index,1)
      this.$emit('getAttachments',this.fileList)
    },
    //md5图片上传Key的拼接
    setImgKey() {
      const storeId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
      const date = +new Date() + "";
      return storeId + "_" + _env + "_" + md5(storeId + date);
    },
      renderHeaderCheck(createElement, { column, $index }) {
          return <div class="materiel-header"></div>;
      }
  },
    updated() {
        if(this.from !== 'outside'){
            this.$emit('getFileList',this.defaultTable)
        }
    },
  async created() {
      //加工厂商档案不需要通过接口获取附件表格信息
      if(this.from == 'order'){
          console.log(this.orderCode,'v orderCode');
          if (!this.outsideFactoryId) {
              this.defaultTable = []
          } else if (!this.editData){
            await this.getAttachmentList(this.outsideFactoryId)
          }
      } else if (this.from == 'outside') {
          this.getAttachmentListNames(1)
      } else if (this.from == 'material') {
          if(!this.isMaterialEdit) {
              this.getAttachmentListNames(2)
          }
      } else {
          this.getAttachmentListNames(0)
      }
  }
}
</script>
<style lang="scss" scoped>
  .other-title{
    padding: 16px 0 8px 0;
  }
  .other-file{
    padding:8px;
    color:#fff;
    background-color: #1CA1FF;
    border:1px solid #1CA1FF;
    border-radius: 3px;
    font-size:12px;
    cursor: pointer;
    &.disabled-bg{
      background-color: #ccc;
      border-color: #bbb;
      &:hover{
        cursor: not-allowed;
      }
    }
  }
  .tag-list{
    display:flex;
    justify-content: flex-start;
    .tags{
      // width:30%;
      margin-right:10px;
    }
  }
  .fileCheckActive{
    color: #ff9c38 !important;
  }
</style>

<style lang="scss">
  .upload-form{
    margin-bottom:24px;
    .el-date-editor.el-input{
      width: 130px !important;
    }
    .input-item{
      .cell {
        padding:0 !important;
      }
      .el-input__inner,.el-textarea__inner{
        background-color: #FFF9ED;
        border:none;
      }
    }
    .bg-yellow{
      background-color: #FFF9ED;
    }
    .btn-box {
      display:flex;
      justify-content: space-between;
      font-size:12px;
      .btn{
        width: 50%;
        color:#409eff;
        text-decoration: underline;
        border-right:1px solid rgb(223, 228, 236);
        font-size:12px;
        &:last-child{
          border-right:none;
        }
      }
      .cancel-color{
        color:#808080;
        text-decoration: none;
      }
      .save-color{
        color:#FFA914;
        text-decoration: none;
      }
    }
  }
</style>


