<template>
  <div class="artorders">
        <p style="font-size:20px;margin-bottom:20px;display:flex;align-items:center;"><span class="line"></span>工艺信息</p>
        <div v-for="(item,index) in processForms" :key="index" class="arr-artorder">
            <div class="header-artorder">
                <div>
                    <el-form :label-position="labelPosition" label-width="100px"  :model='item' :rules="rules" ref='ruleFrom'>
                        <el-form-item label="工艺单名称" prop="name">
                            <el-input :minlength="2" :maxlength="12" style="width:250px !important;" placeholder="请输入工艺单名称" v-model.trim="item.name"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="header-artorder-right">
                    <nf-button style="font-size:14px;width:72px;border:1px solid #dce0e6;color:#fa4150;" @click="deleteArt(index)" type="warningsimple">删除</nf-button>
                    <nf-button @click="checkPdf(index)" class="btn-artadd">{{item.write}}</nf-button>
                </div>
            </div>
            <div class="ue-editor">
                <UE :defaultMsg='item.content' :item='item' :index='index' @htmlData='htmlData' :config=config :id="item.ids" :ref="item.ids"></UE>
            </div>
            <div>
                <attachMent :item='item' @attachList = 'attachList'></attachMent>
            </div>
        </div>
        <nf-button @click="addArtOrder" style="width:98px;margin:0;" class="btn-artadd" type="warning"><icon style="width:8px;height:8px;top:0px;margin-right:4px;" type="icon-btn-add"></icon>添加工艺单</nf-button>
  </div>
</template>

<script>
import UE from "../../../components/ue/ue";
import attachMent from "./attachment";
import { previewCommonProcessForm } from "../../../api/api";
export default {
  data() {
    return {
      labelPosition: "right",
      rules: {
        name: [
          { required: true, message: "工艺单名称不能为空", trigger: "blur" },
          { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" }
        ]
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 300,
        zIndex: 3
      },
      defaultMsg: "",
      processForms: [],
      write: "预览工艺单"
    };
  },
  components: {
    UE,
    attachMent
  },
  watch: {
    processForms(val) {
      console.log(val);
      this.getData();
    }
  },
  methods: {
    attachList(val, item) {
      console.warn(val, item);
      item.attachments = val;
    },
    async htmlData(val, item) {
      var _this = this;
      await setTimeout( function(){
        const ref = item.ids;
        console.log(_this.$refs[ref], "22");
        console.log(_this.$refs, "11");
        item.content = _this.$refs[ref][0].getUEContent();
      }, 1000 );
    },
    getData() {
      this.$emit("getArtData", this.processForms);
    },
    addArtOrder() {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.goods.process.add") {
            this.sign = "1";
          }
        }
      }

      if (this.sign == "0" || !datalist) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      this.processForms.push({
        name: "",
        content: "",
        attachments: [],
        ids: "ue" + (Math.random(0, 10) + "").substring(2, 8),
        write: "预览工艺单"
      });
    },
    deleteArt(index) {
      this.processForms.splice(index, 1);
    },
    checkPdf(i) {
      this.processForms[i].write = "正在读取文件...";
      let params = this.processForms[i];
      params.userId = this.userId =
        this.$store.state.userInfo.id ||
        JSON.parse(sessionStorage.getItem("user_login")).userId;
      console.log(params);
      previewCommonProcessForm(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          console.log(res.data.previewURL.slice(27));
          // // window.open('/#/showPDF?key='+res.data.previewURL.slice(27));
          window.open(res.data.previewURL);
        }
        this.processForms[i].write = "预览工艺单";
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.artorders {
  font-size: 14px;
  padding: 32px;
  .btn-artadd {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 18px;
    font-size: 14px;
  }
  .arr-artorder {
    margin: 20px 0 24px 0;
    padding-bottom: 20px;
    border-bottom: 1px solid #e6eaf0;
  }
  .header-artorder {
    display: flex;
    justify-content: space-between;
    .header-artorder-right {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
}
.line {
  display: inline-block;
  width: 6px;
  height: 20px;
  background-color: #ff9c38;
  margin-right: 10px;
}
</style>

