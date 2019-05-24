<template>
  <div class="edit-art">
    <header class="header">
      <span>{{artData.id?'编辑':'新建'}}工艺单</span>
      <span class="header_right">
                <nf-button style="width: 98px;" @click="$emit('toggle')">取消</nf-button>
                <nf-button :loading="visible.btnLoading" style="width: 98px;" @click="updateCommonProcessForm"
                           type="warning">完成</nf-button>
            </span>
    </header>
    <section>
      <div class="artorders">
        <p style="font-size:20px;margin-bottom:20px;display:flex;align-items:center;">
          <span class="line"></span>工艺信息</p>
        <div class="arr-artorder">
          <div class="header-artorder">
            <div class="header-artorder-right">
              <el-form
                :label-position="labelPosition"
                label-width="100px"
                :model="processForm"
                :rules="rules"
                ref='ruleFrom'>
                <el-form-item label="工艺单名称" prop="name">
                  <el-input
                    :maxlength="12"
                    placeholder="请输入工艺单名称"
                    style="width:250px !important;"
                    @blur="checkRepeat"
                    v-model.trim="processForm.name"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="header-artorder-right">
              <nf-button @click="checkPdf" class="btn-artadd">
                <span v-show='isWrite'>预览工艺单</span>
                <span v-show='!isWrite'>正在读取文件...</span>
              </nf-button>
            </div>
          </div>
          <div class="ue-editor">
            <UE
              :defaultMsg='defaultMsg'
              :config=config
              id="uedd"
              ref="ue22"></UE>
          </div>
          <div>
            <attachEdit @attachD='attachList' :attachData='processForm.attachments'></attachEdit>
          </div>
          <nf-button
            v-if="artData.id"
            style="font-size:14px;border:1px solid #dce0e6;color:#fa4150;"
            @click="handleDeleteClick"
            type="warningsimple">删除工艺单</nf-button>
        </div>

        <el-dialog
          :modal=false
          class="repertory_dialog repertory_dialog--dele"
          :visible.sync="visible.delShow">
          <div class="body">
            <icon
              w="80"
              h="80"
              type="icon-gongdan-jiedianjingbao-da"></icon>
            <p style="color:#3b3b3b;font-size:16px;">是否确定删除当前工艺单？</p>
            <p style="color:#a2abb8;font-size:14px;">删除后数据不可恢复</p>
          </div>
          <div class="footer">
            <nf-button @click="visible.delShow = false">取消</nf-button>
            <nf-button
              :loading="delLoading"
              type="warning"
              @click="delArt">确定</nf-button>
          </div>
        </el-dialog>
      </div>
    </section>
  </div>
</template>

<script>
import UE from "../../../components/ue/ue";
import attachEdit from "@/components/goods/child/attachEdit";
import {
  mapState
} from "vuex";
import {
  processQueryRepeatName,
  processPreview,
  processCreate,
  processUpdate,
  processDelete,
  sampleDeleteProcessForm,
  processDetails
} from "../../../api/api";

export default {
  props: ["artData", "styleId", 'designStyleId'],
  data() {
    return {
      visible: {
        btnLoading: false,
        delShow: false,
        delLoading: false
      },
      arr: [],
      labelPosition: "right",
      rules: {
        name: [{
            required: true,
            message: "工艺单名称不能为空",
            trigger: "blur"
          },
          {
            min: 2,
            max: 12,
            message: "长度在 2 到 12 个字符",
            trigger: "blur"
          }
        ]
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 300,
        zIndex: 1
      },
      defaultMsg: "",
      processForm: {
        name: "",
        attachments: [],
        designStyleId: this.styleId,
        version: '',
        content: ''
      },
      userId: '',
      isWrite: true,
      isRepeat: false,
      artName: '',
      artList: []
    };
  },
  components: {
    UE,
    attachEdit
  },
  watch: {
    artData: {
      handler(v) {
        if (v.id) {
          //编辑
          console.log(this.artData, '11111')
          this.processForm = JSON.parse(JSON.stringify(this.artData))
          //记录编辑时的工艺单名称
          this.artName = this.processForm.name
          let that = this;
          setTimeout(function () {
            that.$refs.ue22.setUEContent(that.artData.content || '')
          }, 1000)
        } else {
          //新建
          this.processForm = {
            name: "",
            attachments: [],
            designStyleId: this.styleId,
            version: '',
            content: ''
          }

        }
      },
      deep: true
    },
  },
  created() {
    this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
  },
  mounted() {
    if (this.designStyleId) {
      this.getArtList()
    }
  },
  // computed: {
  //   userId() {
  //     return JSON.parse(sessionStorage.getItem("user_login")).userId;
  //   }
  // },
  methods: {
    //检查数据是否有更改
    checkIsChange() {
      let value = false;
      this.processForm.content = this.$refs.ue22.getUEContent()
      if (!this.artData.id) {
        //新建
        if (this.processForm.name || this.processForm.content || this.processForm.attachments.length) {
          value = true
        }
      } else {
        //编辑
        if ((this.processForm.name !== this.artData.name) || (this.processForm.content !== this.artData.content) || JSON.stringify(this.processForm.attachments) !== JSON.stringify(this.artData.attachments)) {
          value = true
        }
      }
      return value
    },
    // 获取详情
    getArtList() {
      processDetails({
        designStyleId: this.designStyleId,
        userId:this.userId
      }).then(res => {
        this.artList = res.data.data
        let art = {}
        this.artList.forEach(i => {
          if (this.artData.id == i.id) {
            art = i
          }
        })
        this.artData = art
        this.$emit('update:artData', art)
        let that = this;

        setTimeout(function () {
          that.$refs.ue22.setUEContent(that.artData.content || '')
        }, 1000)

      })
    },
    //工艺单查重
    async checkRepeat() {
      if (this.processForm.name == '') {
        this.isRepeat = false
        return
      }
      if (this.artName == this.processForm.name) {
        this.isRepeat = false
        return
      }
      await processQueryRepeatName({
        designStyleId: this.styleId,
        name: this.processForm.name
      }).then(res => {
        if (res.data.code == 1) {
          this.isRepeat = true
          this.$message.error(res.data.msg)
        } else {
          this.isRepeat = false
        }
      })
    },
    //删除工艺单
    handleDeleteClick() {
      // 权限
      if (!this.powerJudgement.permissions("fac.spl.design.style.process.delete")) {
        return
      }
      this.visible.delShow = true;
    },
    delArt() {
      this.visible.delLoading = true
      if (this.$route.query.id) {
        //样衣档案里面
        sampleDeleteProcessForm({
          sampleId: this.$route.query.id,
          processFormId: this.$route.query.processFormId
        }).then(res => {
          this.visible.delLoading = false
          this.visible.delShow = false
          console.log(res);
          if (res.data.code == 0) {
            this.$message.success('删除成功')
            this.$emit("toggle", true);
            this.$emit("del");
          } else {
            this.$message.success('删除失败')
          }
        })
      } else {
        processDelete({
          id: this.artData.id
        }).then(res => {
          this.visible.delLoading = false
          this.visible.delShow = false
          if (res.data.code == 0) {
            this.$message.success('删除成功')
            this.$emit("toggle", true);
            this.$emit("del");
          } else {
            this.$message.success('删除失败')
          }
        })
      }
    },
    attachList(list) {
      console.warn(list);
      this.processForm.attachments = list;
    },
    async updateCommonProcessForm() {
      await this.checkRepeat()
      if (this.isRepeat) {
        this.$message.error('工艺单名称重复')
        return
      }
      let flag = false;
      this.$refs.ruleFrom.validate((valid) => {
        if (valid) {
          flag = true
        } else {
          return false;
        }
      });
      if (!flag) return false;
      this.visible.btnLoading = true
      this.processForm.content = this.$refs.ue22.getUEContent()
      this.processForm.attachments = this.processForm.attachments.map(v => {
        return {
          fileFullName: v.fileFullName,
          path: v.url || v.path, //新建时字段为url 编辑时为path attachEdit组件问题
          suffix: v.suffix,
          fileName: v.fileFullName.split('.' + v.suffix)[0]
        }
      })
      this.processForm.designStyleId = this.styleId ? this.styleId : this.designStyleId;
      console.log(this.processForm);
      console.log(this.artData, '工艺data');
      if (this.artData.id) {
        //编辑
        if (this.$route.query.id) {
          //样衣档案里面
          this.processForm.sampleId = this.$route.query.id
        }
        await processUpdate(this.processForm).then(res => {
          this.visible.btnLoading = false
          console.log(res);
          if (res.data.code == 0) {
            flag = true
            this.$message.success('编辑成功')
            if (this.$route.query.id) {
              this.$emit("onSample", res.data.data);
              this.$emit("toggle", true);
            } else {
              this.$emit("toggle", true);
            }
          } else {
            flag = false
            this.$message.error(res.data.msg)
          }
        });

      } else {
        //新建

        if (this.$route.query.id) {
          //样衣档案里面
          this.processForm.sampleId = this.$route.query.id
        }

        await processCreate({
          ...this.processForm,
          userId: this.userId
        }).then(res => {
          this.visible.btnLoading = false
          console.log(res);
          if (res.data.code == 0) {
            flag = true
            this.$message.success('新建成功')
            if (this.$route.query.id) {
              this.$emit("onSample", res.data.data);
              this.$emit("toggle", true);
            } else {
              this.$emit("toggle", true);
            }

          } else {
            flag = false
            this.$message.error(res.data.msg)
          }
        });
      }
      return flag

    },
    checkPdf() {
      /**
       * name：工艺单名称（必须）
       content：工艺单说明
       attachments：附件s
       attachments.fileFullName：文件全名
       attachments.path：文件地址
       * @type {boolean}
       */

      this.processForm.content = this.$refs.ue22.getUEContent()
      if (this.processForm.content == '' && !this.processForm.attachments.length) {
        this.$message.error('预览工艺单需添加附件或富文本')
        return
      }
      this.isWrite = false
      let params = JSON.parse(JSON.stringify(this.processForm))
      // params.attachments.forEach(v => {
      // console.log(v);
      // v.path = v.path.split('https://image3.myjuniu.com/')[1].split('?')[0];
      // })
      console.log(params);
      processPreview(params).then(res => {
        this.isWrite = true;
        console.log(res);
        if (res.data.code == 0) {
          // window.open('/#/showPDF?key='+res.data.previewURL.slice(27));
          window.open(res.data.previewURL);
        } else {
          this.$message.error(res.data.msg)
        }
      });
    }
  }
};
</script>

<style lang="scss">
.edit-art {
  .repertory_dialog {
    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      /*padding: 0;*/
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

    .footer {
      button {
        margin: 0 6px;
      }
    }
  }

  .repertory_dialog--dele {
    .el-dialog {
      width: 360px;
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
</style><style lang="scss" scoped>
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

.edit-art {
  position: fixed;
  top: 0;
  right: 0;
  // padding-top: 24px;
  padding-bottom: 200px;
  width: 1200px !important;
  height: 100%;
  overflow-y: scroll;
  background-color: #fff;
  z-index: 101;

  .header {
    position: fixed;
    // top: 64px;
    width: 1200px;
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

}
</style>
