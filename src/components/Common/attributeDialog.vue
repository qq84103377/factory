<template>
  <el-dialog class="custom-dialog add-attr-dialog" :title="'新建'+title" :visible.sync="show" width="30%" :before-close="handleClose" :modal-append-to-body="false">
      <!--<h3 style="text-align: center;margin-bottom: 16px;">新建{{title}}</h3>-->
      <el-form  label-width="200px">
          <el-form-item
              prop=""
              :required="true"
              :label="`${title}编码`"
          >
              <el-input v-model.trim="attrValue" placeholder="不填则自动生成"></el-input>
          </el-form-item>
          <el-form-item
              :label="title"
              :required="true"
          >
              <el-input v-model.trim="attrName" :placeholder="`请输入${title}`"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer">
          <!--<nf-button @click="cancel()" class="cancel is-plain">取消</nf-button>-->
          <!--<nf-button :loading="loading" @click="addAttr()" type="warning">确定</nf-button>-->
          <el-button @click="cancel">取 消</el-button>
          <el-button :loading="loading" type="primary" @click="addAttr">确 定</el-button>
      </div>
  </el-dialog>
</template>
<script>
import {addFacUnitSettings,addCommonSkuAttr} from "../../api/api";
export default {
  name: 'attributeDialog',
   props: {
      show: {
        type: Boolean,
        default () {
          return false
        }
      },
      title: {
        type: String,
        default () {
          return ''
        }
      },
      type: {
        type: Number,
        default () {
          return 0
        }
      },
      parentId: { // 品类
        type: String,
        default () {
          return ''
        }
      },
   },
  data () {
    return {
      attrValue: '',
      attrName: '',
      loading: false,
      // colorName: ''
    }
  },
  computed: {
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    }
  },
  methods: {
    cancel () {
      this.$emit('update:show', false)
      this.attrValue = ''
      this.attrName = ''
    },
    handleClose () {
      this.$emit('update:show', false)
    },
     //新建属性
    addAttr() {
      if (this.attrName == '') {
          this.$message.error('请输入' + (this.title));
          return
      }
      let type = ''
      if (this.title == '颜色') {
        type = 1
        // console.log(this.attrName)
        // if ((/^[A-Za-z0-9]{1,12}$/).test(this.attrName)) {
        // } else {
        //     this.$message.error('请输入英文字母或数字');
        //     return
        // }
      } else if (this.title == '内长') {
        type = 3
        if (this.attrName.length > 5) {
            this.$message.error("输入不得超过五位！");
            return;
        }
      } else if (this.title == '设计师') {
        type = 2
      } else if (this.title == '波段') {
        type = 3
      } else if (this.title == '分类') {
        type = 4
      } else if (this.title == '季节') {
        type = 5
      } else if (this.title == '年份') {
        type = 6
      } else if (this.title == '标签') {
        type = 7
      } else if (this.title == '品牌') {
        type = 8
      } else if (this.title == '风格') {
        type = 9
      } else if (this.title == '月份') {
        type = 10
      } else {
        type = this.type
      }
      this.loading = true
      console.log(this.parentId)
      let params = {
          userId: this.userId,
          type: type,
          value: this.attrValue,
          name: this.attrName,
          colorName: this.colorName || undefined,
          parentId: this.parentId? this.parentId : undefined
      }
      if (this.title == '颜色' || this.title == '内长') {
        addCommonSkuAttr(params).then(res => {
          this.loading = false
          if (res.data.code == 4 || res.data.code == 1) {
              this.isshow = true;
              this.$message({
                  showClose: true,
                  message: "该色号已存在",
                  type: "error",
                  duration: this.$globalConfig.elementUI.duration
              });
          } else {
              this.$message({
                  showClose: true,
                  message: "新建成功",
                  type: "success",
                  duration: this.$globalConfig.elementUI.duration
              });
              this.$emit('success',res.data.data.id,res.data.data.attributeValue)
              this.$emit('update:show', false)
              this.attrValue = ''
              this.attrName = ''
              this.colorName = ''
            }
        })
      } else {
        addFacUnitSettings(params).then(res => {
          this.loading = false
          console.log(res);
          if (res.data.code == 4 || res.data.code == 1) {
              this.isshow = true;
              this.$message({
                  showClose: true,
                  message: "该" + this.title + "已存在",
                  type: "error",
                  duration: this.$globalConfig.elementUI.duration
              });
          } else {
              this.$message({
                  showClose: true,
                  message: "新建成功",
                  type: "success",
                  duration: this.$globalConfig.elementUI.duration
              });
              this.$emit('success', res.data.data.id,res.data.data.attributeValue)
              this.$emit('update:show', false)
              this.attrValue = ''
              this.attrName = ''
              this.colorName = ''
            }
          })
        }
      },
    }
  }
</script>
<style lang="scss">
    .add-attr-dialog{
        .el-dialog--small{
            width: 600px;
            .el-form-item{
                margin-bottom: 22px;
            }
            .el-form-item:last-child{
                margin: 10px 0 !important;
            }
        }
        .el-input{
            width: auto;
        }
        .el-icon {
            width: auto !important;
        }
    }
</style>

