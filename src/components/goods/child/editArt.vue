<template>
  <div class="edit-artorder">
    <header class="header">
      <span>编辑工艺单</span>
      <span class="header_right">
                <nf-button style="width: 98px;" @click="cancelEdit">取消</nf-button>
                <nf-button style="width: 98px;" @click="updateCommonProcessForm" type="warning">完成</nf-button>
            </span>
    </header>
    <section>
      <div class="artorders">
        <p style="font-size:20px;margin-bottom:20px;display:flex;align-items:center;"><span class="line"></span>工艺信息</p>
        <div class="arr-artorder">
          <div class="header-artorder">
            <div class="header-artorder-right">
              <el-form :label-position="labelPosition" label-width="100px" :model="artData" :rules="rules"
                       ref='ruleFrom'>
                <el-form-item label="工艺单名称" prop="name">
                  <el-input :maxlength="12" placeholder="请输入工艺单名称" style="width:250px !important;"
                            v-model.trim="artData.name"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="header-artorder-right">
              <nf-button @click="checkPdf" class="btn-artadd">
                <span v-show='!artDatas.write'>预览工艺单</span>
                <span v-show='artDatas.write'>正在读取文件...</span>
              </nf-button>
            </div>
          </div>
          <div class="ue-editor">
            <UE :defaultMsg='defaultMsg' :config=config id="ued" ref="ue2y"></UE>
          </div>
          <div>
            <attachEdit @attachD='attachList' :attachData='artData.attachments'></attachEdit>
          </div>
        </div>
        <nf-button style="font-size:14px;border:1px solid #dce0e6;color:#fa4150;" @click="deleteFac = true"
                   type="warningsimple">删除工艺单
        </nf-button>
      </div>
      <el-dialog :modal=false class="repertory_dialog repertory_dialog--dele" :visible.sync="deleteFac">
        <div class="body">
          <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
          <p style="color:#3b3b3b;font-size:16px;">是否确定删除当前工艺单？</p>
          <p style="color:#a2abb8;font-size:14px;">删除后数据不可恢复</p>
        </div>
        <div class="footer">
          <nf-button @click="deleteFac = false">取消</nf-button>
          <nf-button v-if="isSampleArt" type="warning" @click="deleteGoodsClothesArt">确定</nf-button>
          <nf-button v-else type="warning" @click="deleteCommonProcessForm">确定</nf-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>
<script>
  import UE from '../../../components/ue/ue'
  import attachEdit from './attachEdit'
  import {mapState} from 'vuex'
  import {previewCommonProcessForm} from '../../../api/api'
  import {updateCommonProcessForm, deleteCommonProcessForm,deleteGoodsClothesArt} from '../../../api/api'

  export default {
    props: ['artData','sampleId'],
    data() {
      return {
        labelPosition: 'right',
        rules: {
          name: [
            {required: true, message: '工艺单名称不能为空', trigger: 'blur'},
            {min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur'}
          ],
        },
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 300,
          zIndex: 1,
        },
        defaultMsg: '',
        attachments: this.artData.attachments,
        deleteFac: false,
        userId: '',
        isSampleArt: false
      }
    },
    components: {
      UE,
      attachEdit
    },
    computed: {
      ...mapState({
        updataPwdVisible: (state) => state.updataPwdVisible
      }),
      artDatas() {
        this.$set(this.artData, "write", false);
        return this.artData;
      }
    },
    watch: {
      updataPwdVisible: {
        handler() {
          if (this.artData) {
            this.setUE();
          }
        },
        deel: true
      },
    },
    created() {
      this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
      if (this.sampleId) {
        this.isSampleArt = true
      }
    },
    methods: {
      setUE() {
        if (this.artData.content) {
          this.$refs.ue2y.setUEContent(this.artData.content);
        }
      },
      cancelEdit() {
        this.$emit("cancelEdit");
      },
      attachList(list) {
        console.warn(list);
        this.attachments = list;
      },
      deleteCommonProcessForm() {
        let params = {
          useId: this.userId,
          formId: this.artData.id,
        };
        deleteCommonProcessForm(params).then(
          res => {
            console.log(res);
            if (res.data.code == 0) {
              this.deleteFac = false;
              this.$emit("delete");
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }

          }
        )
      },
      // 删除商品详情下样衣详情中的工艺信息
      deleteGoodsClothesArt() {
        let params = {
          sampleId: this.sampleId,
          processForm: this.artData.id,
        };
        deleteGoodsClothesArt(params).then(
          res => {
            console.log(params)
            if (res.data.code == 0) {
              this.deleteFac = false;
              this.$emit("delete");
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }

          }
        )
      },
      updateCommonProcessForm() {
        let content = this.$refs.ue2y.getUEContent();
        let params = {
          id: this.artData.id,
          name: this.artData.name,
          content: content,
          userId: this.userId,
          attachments: this.attachments,
        };
        updateCommonProcessForm(params).then(
          res => {
            console.log(res);
            if (res.data.code == 0) {
              this.$emit("toggle");
            }
          }
        )
        console.log(params);
      },
      checkPdf() {
        this.artData.write = true;
        let content = this.$refs.ue2y.getUEContent();
        let params = {
          id: this.artData.id,
          name: this.artData.name,
          content: content,
          userId: this.userId,
          attachments: this.attachments || this.artData.attachments,
        };
        console.log(params);
        previewCommonProcessForm(params).then(
          res => {
            console.log(res);
            if (res.data.code == 0) {
              console.log(res.data.previewURL.slice(27));
              // window.open('/#/showPDF?key='+res.data.previewURL.slice(27));
              window.open(res.data.previewURL);
            }
            this.artData.write = false;
          }
        )
      },
    },
  }
</script>
<style lang="scss" scoped>
  @import "~scss_vars";

  .nf-input {
    display: inline-block;
    width: auto;
  }

  .w100 {
    width: 80px;
  }

  .w140 {
    width: 156px;
  }

  .edit-artorder {
    position: fixed;
    top: 0;
    right: 0;
    // padding-top: 24px;
    padding-bottom: 200px;
    width: 850px !important;
    height: 100%;
    overflow-y: scroll;
    background-color: #fff;
    z-index: 101;
    .header {
      position: fixed;
      // top: 64px;
      width: 850px;
      height: 88px;
      color: #3b3b3b;
      font-size: 24px;
      padding: 16px 32px 20px 32px;
      box-sizing: border-box;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e0e6ed;
      z-index: 20;
    }
    .artorders {
      font-size: 14px;
      padding: 32px 16px 32px 16px;
      .btn-artadd {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 18px;
        font-size: 14px;
      }
      .arr-artorder {
        margin: 60px 0 24px 0;
        padding-bottom: 20px;
        // border-bottom:1px solid #e6eaf0;
      }
      .header-artorder {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        .header-artorder-right {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
        }
      }
    }
    .repertory_dialog {
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
      }
      .title {
        width: 100%;
        height: 52px;
        text-align: center;
        line-height: 52px;
        font-size: 20px;
        color: #3b3b3b;
        border-bottom: 1px solid #e0e6ed;
      }
      .body {
        // padding: 32px;
      }
      .footer {
        padding: 0 32px 32px 36px;
        button {
          margin: 0 6px;
        }
      }
    }
    .repertory_dialog--dele {
      .el-dialog {
        width: 766px;
      }
      .body {
        text-align: center;
        P {
          margin: 32px 0;
          font-size: 14px;
          color: #3b3b3b;
        }
      }
      .footer {
        display: flex;
        justify-content: center;
        padding-top: 28px;
        border-top: 1px solid #e0e6ed;
      }
    }
  }
</style>





