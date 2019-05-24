<template>
  <div class="art-info">
    <div class="tab-btns">
      <div  class="tab-btn">
        <button v-if="!isSampleArt" :class="{'active':index == currentArtIndex}" v-for="(item,index) in artInfos"
                @click="changeTab(index)" :key="index">{{item.name}}
        </button>
      </div>
      <div>
        <div v-if="isSampleArt&&artInfos.length===0">
          <el-popover
              ref="popover1"
              placement="bottom"
              width="200"
              trigger="click">
            <div class="popover-content">
            <div @click="isAddVisible = true" class="popover-item"
                 style="color: #FFA914;border-bottom: 1px solid #DCE0E6;">+新建工艺单
            </div>
            <div @click="addGoodsArt(item.id)" v-for="(item,index) in artList" :key="index" class="popover-item">
              {{item.name}}
            </div>
            </div>
            <!--<div class="popover-item" v-if="!artList.length">暂无工艺单</div>-->
          </el-popover>
          <nf-button v-popover:popover1 type="warning" class="new-table" svg="icon-btn-add">新建工艺单
          </nf-button>
        </div>
        <nf-button v-if="!isSampleArt" type="warning" class="new-table" svg="icon-btn-add" @click="addArtOrder">添加工艺单
        </nf-button>
      </div>
    </div>
    <div v-if="artInfos.length>0" class="artorders">
      <div class="arr-artorder">
        <div class="yellow-border-title">
          <div class="title">{{currentArt.name}}</div>
          <div>
            <nf-button @click="checkPdf(currentArt)">
              <span v-show="!currentArt.write">查看工艺单</span>
              <span v-show="currentArt.write">正在读取文件...</span>
            </nf-button>
            <nf-button svg="icon-edit1" class="mgl12" @click="checkArtDetail(currentArt)">编辑</nf-button>
          </div>
        </div>
        <div v-html="currentArt.content" :class="{'ue-editor':currentArt.content&&currentArt.content.length>0}">
        </div>
        <div>
          <div>
            <div class="upload-file">
              <div class="file-item" v-for="(fileItem, fileIndex) in currentArt.attachments"
                   :key="fileIndex">
                <div class="file">
                  <a :href="fileItem.filePath" download>
                    <icon v-if="fileItem.suffix=='pdf'" type="icon-pdf"></icon>
                    <icon v-if="fileItem.suffix=='docx'" type="icon-word"></icon>
                    <icon v-if="fileItem.suffix=='doc'" type="icon-word"></icon>
                    <icon v-if="fileItem.suffix=='excel'" type="icon-Excel"></icon>
                    <icon v-if="fileItem.suffix=='pptx'" type="icon-ppt"></icon>
                    <icon v-if="fileItem.suffix=='txt'" type="icon-otherfile"></icon>
                    <span>{{fileItem.fileFullName}}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center gray mgt15">暂无工艺信息数据</div>
    <transition name="right-move">
      <edit-art :sampleId="sampleId" :artData='artOne' v-show="isEditVisible" @toggle="editFinish" @delete="deleteFinish"
                @cancelEdit="hideAddOrEdit"></edit-art>
    </transition>
    <transition name="opcity">
      <div class="cover" v-show="isEditVisible" @click="isEditVisible = false">
      </div>
    </transition>

    <transition name="right-move">
      <add-art
              :sampleId="sampleId"
              :artData='addData'
              :goodsStyleNo="goodsStyleNo"
              :styleId='styleId'
              v-show="isAddVisible"
              @toggle="addFinish"
              @cancelAdd="hideAddOrEdit">
      </add-art>
    </transition>
    <transition name="opcity">
      <div class="cover" v-show="isAddVisible" @click="isAddVisible = false">
      </div>
    </transition>
    <!--将商品已有工艺单关联到样衣详情里面-->
    <el-dialog class="custom-dialog tip-dialog" :visible.sync="addGoodsArtVisible" :show-close="false"
               :close-on-click-modal="false" size="tiny">
      <div class="text-center">
        <!--<icon w="80" h="80" type="icon-add_new"></icon>-->
        <p class="tip-text">确定添加该工艺信息吗？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGoodsArtVisible = false">取 消</el-button>
        <el-button :disabled="isSaving" type="primary" @click="addGoodsArt()">确认</el-button>
      </div>
    </el-dialog>
    <!--<el-dialog class="custom-dialog"  title="" :visible.sync="addGoodsArtVisible" :show-close="false" size="tiny">-->
      <!--<p>确定添加该工艺信息吗？</p>-->
      <!--<div class="btn">-->
        <!--<el-button @click="addGoodsArtVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="addGoodsArt">确 定</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
  import {
    previewCommonProcessForm,
    getCommonProcessForm,
    getGoodsClothesArtDetail,
    getGoodsArtsForClothes,
    addGoodsArtToClothesDetail
  } from "../../../api/api";
  import editArt from "./editArt.vue";
  import addArt from "./addArt.vue";

  export default {
    props: ['styleId', 'sampleId','goodsStyleNo'],
    data() {
      return {
        isTrue: true,
        isEditVisible: false,
        isAddVisible: false,
        artInfos: [],
        artOne: [],
        addData: [],
        currentArtIndex: 0,
        currentArt: {},
        isSampleArt:false,
        artList:[],
        addGoodsArtVisible:false,
        // currentProcessFormId:''
      };
    },
    computed: {},
    methods: {
      hideAddOrEdit() {
        this.isEditVisible = false
        this.isAddVisible = false
      },
      deleteFinish() {
        this.isEditVisible = false
        this.currentArtIndex = 0
        if(this.isSampleArt){
          this.currentArt ={}
          this.artInfos =[]
          this.getDetail()
        } else {
          this.getCommonProcessForm()
        }

      },
      editFinish() {
        this.isEditVisible = false
        if(this.isSampleArt){
          this.getDetail()
        } else {
          this.getCommonProcessForm()
        }

      },
      addFinish() {
        this.isAddVisible = false
        if(this.isSampleArt){
          this.getDetail()
        } else {
          this.getCommonProcessForm()
        }
      },
      // 获取多个工艺单（商品本身的工艺单）
      getCommonProcessForm() {
        let params = {
          styleId: this.styleId
        };
        getCommonProcessForm(params).then(res => {
          this.artInfos = res.data.data;
          if (this.artInfos.length > 0) {
            for (let i = 0; i < this.artInfos.length; i++) {
              this.$set(this.artInfos[i], "write", false);
            }
            this.changeTab(this.currentArtIndex)
          }
          return this.artInfos;
        });
      },
      // 获取单个工艺单（关联到样衣详情里到工艺单）
      addArtOrder() {
        // 判断添加是否有权限
        var datalist = JSON.parse(sessionStorage.getItem("user_login"))
          .permissionList;
        if (datalist.indexOf("fac.goods.process.add") == -1) {
          this.$message.error("抱歉，您没有操作权限");
          return;
        }
        this.addData = []
        this.isAddVisible = true;
        this.goodsStyleNo = false
      },
      checkArtDetail(item) {
        // 判断编剧是否有权限
        var datalist = JSON.parse(sessionStorage.getItem("user_login"))
          .permissionList;
        if (datalist.indexOf("fac.goods.process.update") === -1) {
          this.$message.error("抱歉，您没有操作权限");
          return;
        }
        this.$store.commit("UPDATAPWD");
        this.artOne = item;
        this.isEditVisible = true
      },
      checkPdf(currentArt) {
        // this.$set(this.artInfos[i], "write", true);
        this.currentArt.write = true
        let params = currentArt
        params.userId = this.userId =
          this.$store.state.userInfo.id ||
          JSON.parse(sessionStorage.getItem("user_login")).userId;
        console.log(params);
        previewCommonProcessForm(params).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            console.log(res.data.previewURL.slice(27));
            window.open(res.data.previewURL);
          }
          this.currentArt.write = false
        });
      },
      changeTab(index) {
        this.currentArtIndex = index
        this.currentArt = this.artInfos[index]
      },
      // 获取工艺单详情
      getDetail() {
        let params = {
          sampleId: this.sampleId
        }
        getGoodsClothesArtDetail(params).then(res => {
          console.log(res, '工艺单详情')
          if (res.data.code === 0) {
            if(res.data.data&&res.data.data.id){
              this.artInfos = [res.data.data]
            }
            if (this.artInfos.length > 0) {
              for (let i = 0; i < this.artInfos.length; i++) {
                this.$set(this.artInfos[i], "write", false);
              }
            }
            this.currentArt =res.data.data
          }
        })
      },
      //获取商品拥有的工艺单
      getGoodsArts() {
        let params = {
          id: this.sampleId
        }
        getGoodsArtsForClothes(params).then(res => {
          console.log(res, 555555)
          if (res.data.code === 0) {
            this.artList = res.data.data
          }
        })
      },
      // 设置当前要加入样衣详情的商品工艺单的id
      // setAddProcessFormId( id){
      //   this.currentProcessFormId = id
      //   this.addGoodsArtVisible = true
      // },
      // 将商品工艺单关联到样衣详情工艺单
      addGoodsArt(id){
        let params ={
          sampleId:this.sampleId,
          processFormId:id
        }
        addGoodsArtToClothesDetail(params).then(res =>{
          if(res.data.code ===0){
            this.getDetail()
            this.addGoodsArtVisible = false
            this.$message.success("添加成功");
          } else{
            this.$message.success(res.data.msg);
          }
        })
      }
    },
    components: {
      editArt,
      addArt
    },
    created() {
      console.log('触发了工艺信息created')
      if(this.sampleId){
        this.isSampleArt = true
      }

      if(this.isSampleArt){
        this.getGoodsArts()
        this.getDetail()
      } else {
        this.getCommonProcessForm()
      }
    }
  };
</script>

<style lang='scss' scoped>
  .tab-btns {
    display: flex;
    padding-bottom: 16px;
    /*min-height: 40px;*/
    justify-content: space-between;
    .tab-btn {
      flex: 1;
      button {
        max-width: 150px;
        display: inline-block;
        height: 40px;
        padding: 0 25px;
        border: none;
        font-size: 16px;
        color: #939fb8;
        border: 1px solid #939fb8;
        border-left: none;
        background-color: #f3f6fa;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 5px;
        &:first-child {
          border-left: 1px solid #939fb8;
          border-radius: 2px 0 0 2px;
        }
        &:last-child {
          border-radius: 0 2px 2px 0;
        }
      }
      button.active {
        background-color: #939fb8;
        color: #ffffff;
      }
    }
    .new-table {
      float: right;
    }
  }
  .popover-content{
    max-height: 280px;
    overflow-y: auto;
  }
  .popover-item {
    cursor: pointer;
    color: #3B3B3B;
    font-size: 12px;
    line-height: 32px;
  }
  .cover {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .artorders {
    font-size: 14px;
    padding: 32px;
    background-color: #fff;
    .btn-artadd {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 18px;
    }
    .arr-artorder {
      padding-bottom: 20px;
      // border-bottom:1px solid #e6eaf0;
    }
    .header-artorder {
      display: flex;
      justify-content: space-between;
      .header-artorder-right {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }
    .ue-editor {
      margin-top: 10px;
      border: 1px solid #e6eaf0;
      padding: 10px;
      tbody > tr > td {
        border: 1px solid #e6eaf0 !important;
        padding: 4px;
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

  .upload-file {
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-start;
    border-bottom: 1px solid #f2f5fa;
    .file-item {
      width: 241px;
      display: flex;
      justify-content: flex-start;
      // position: relative;
      margin-left: 12px;
      margin-top: 24px;
      padding: 8px;
      background: #f2f5fa;
      &:first-child {
        margin-left: 0;
      }
    }
    .file {
      flex: 1;
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
</style>
<style lang="scss">
  .artorders .ue-editor {
    margin-top: 10px;
    border: 1px solid #e6eaf0;
    padding: 10px;
    tbody > tr > td {
      border: 1px solid #e6eaf0 !important;
      padding: 4px;
    }
  }
</style>


