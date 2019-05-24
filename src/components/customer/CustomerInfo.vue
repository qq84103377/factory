<template>
    <div class="customer-detaile">
        <div class="customer-header">
            <div class="customer-title">
                <p>客户管理</p>
                <nf-button @click="back()">< 返回列表</nf-button>
            </div>
        </div>
        <div class="customer-content">
            <div class="title-btns">
                <p class="base-info"><span class="line"></span>基本信息</p>
                <div>
                    <nf-button type="warningsimple" v-show="isEdit" @click="addCustomer('remove')">删除客户</nf-button>
                    <nf-button v-show="isEdit" @click="addCustomer()">取消</nf-button>
                    <nf-button type="warning" v-show="isEdit" @click="addCustomer('update')">完成</nf-button>
                    <nf-button :plain="true" type="warning" v-show="!isEdit"
                               @click="clickshow">编辑
                    </nf-button>
                </div>

            </div>
            <div class="customer-info">
                <div class="input-info">
                    <span v-if="isEdit" class="start" style="margin-right:3px;">*</span><span style="color:#636363;">客户姓名：</span>
                    <div class="nf-input w180">
                        <el-input v-if="isEdit"
                        :class="{'only-read':isEdit}"
                        type="text" v-model="customer.name"></el-input>
                        <span v-if="!isEdit">{{customer.name}}</span>
                    </div>
                </div>

                <div class="input-info">
                    <span style="color:#636363;">手机号码：</span>
                    <div class="nf-input w180">
                        <el-input  v-if="isEdit"
                        :class="{'only-read':isEdit}"
                        type="text"
                        v-model="customer.phone"></el-input>
                        <span  v-if="!isEdit"><span>{{customer.phone}}</span><span v-if='!customer.phone' class="colorGray">未填写</span></span>
                    </div>
                </div>
                <div class="input-info">
                    <span style="color:#636363;">客户分组：</span>
                    <div class="nf-input w180">
                        <el-select v-if="isEdit" style="width: 180px;" clearable popper-class="popperClass"  v-model="customer.groupId" placeholder="请选择">
                            <el-option value="dfd" style="display: none"></el-option>
                            <p @click="addGroupVisibleGo" style="color: #eb8d2f;padding-left: 16px;cursor: pointer">+新建</p>
                            <el-option
                                    v-for="item in groupLists"
                                    :key="item.groupId"
                                    :label="item.groupName"
                                    :value="item.groupId">
                            </el-option>
                        </el-select>
                        <span  v-if="!isEdit"><span v-if="customer.groupName!=='未分组'">{{customer.groupName}}</span><span v-if="customer.groupName==='未分组'" class="colorGray">未分组</span></span>
                    </div>
                </div>

                <div class="customerAddr">
                    <span v-if="isEdit">&nbsp;</span>
                    <span style="color:#636363;">客户地址：</span>
                    <div class="nf-input w480">
                        <el-input
                        v-if="isEdit"
                        :class="{'only-read':isEdit}"
                        type="text"
                        v-model="customer.address"
                                    placeholder="暂无"></el-input>
                    <span  v-if="!isEdit"><span>{{customer.address}}</span><span  v-if='!customer.address' class="colorGray">未填写</span></span>
                    </div>
                </div>

                <div class="remark">
                    <span v-if="isEdit">&nbsp;</span>
                    <span style="color:#636363;">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</span>
                    <div class="nf-input w480">
                        <el-input
                        v-if="isEdit"
                        :class="{'only-read':isEdit}"
                        v-model="customer.remark"
                        type="textarea"
                        :rows="4"
                        placeholder="暂无">
                        </el-input>
                        <span  v-if="!isEdit"><span>{{customer.remark}}</span><span v-if='!customer.remark' class="colorGray">未填写</span></span>
                    </div>
                </div>
            </div>
        </div>
        <!--新建分组-->
        <el-dialog  class="custom-dialog" title="新建客户分组"
                    :visible.sync="addGroupVisible" size="tiny">
            <div style="text-align: center;">
                <el-input v-model.trim="groupName" style="width: 260px;" auto-complete="off"
                          placeholder="请输入分类号"></el-input>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="addGroupVisible = false">取 消</el-button>
                <el-button  type="primary" @click="addCustomerGroup">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { deleteFacCustomer, updateFacCustomer ,getCustomerGroupLists,addCustomerGroup} from "../../api/api";

export default {
  data() {
    return {
        groupLists:[],
        isShow:false,
        addGroupVisible:false,
        groupName:'',
      // 数据
      customer: {
          groupId:'dd'
      },
      isEdit: false,
      isLoading: false,
      sign: "0"
    };
  },
  computed: {
    // 计算属性
      unitId(){
          return JSON.parse(sessionStorage.getItem("user_login")).unitId;
      },
  },
  methods: {
      getCustomerGroupLists(){
          getCustomerGroupLists({unitId:this.unitId}).then(res=>{
              if(res.data.code===0){
                  this.groupLists = res.data.data
              }else {
                  this.$message.error(res.data.msg)
              }

          })
      },
      addGroupVisibleGo(){
          this.addGroupVisible=true;
          this.groupName = '';
          $('.popperClass').css('display','none')
      },
      addCustomerGroup(){
          addCustomerGroup({groupName:this.groupName,unitId:this.unitId}).then(res=>{
              if(res.data.code===0){
                  this.getCustomerGroupLists()
                  this.customer.groupId = res.data.data
                  this.addGroupVisible = false
              }else {
                  this.$message.error(res.data.msg)
              }
          })
      },
    // 方法
    back() {
      this.$router.go(-1);
    },
    clickshow() {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.customer.update") {
            this.sign = "1";
          }
        }
      }

      if (this.sign == "0" || !datalist) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      this.isEdit = true;
      // this.isShow = true;
    },
    addCustomer(type) {
      if (type == "remove") {
        var datalist = JSON.parse(sessionStorage.getItem("user_login"))
          .permissionList;
        if (datalist) {
          for (let i = 0; i < datalist.length; i++) {
            if (datalist[i] == "fac.customer.delete") {
              this.sign = "1";
            }
          }
        }
        if (this.sign == "0" || !datalist) {
          this.centerDialogVisible = false;
          this.$message.error("抱歉，您没有操作权限");
          return;
        }
      }

      let _this = this;
      if (_this.isLoading) {
        return;
      }
      if (type == "update") {
        _this.isLoading = true;

        if (_this.customer.name) {
          let reg = /^[1][0-9]{10}$/;
          if (_this.customer.phone && !reg.test(_this.customer.phone)) {
            _this.customer.phone = "";
            this.$message({
              type: "error",
              message: "手机号码格式不正确,此项可以不填",
              showClose: true,
              duration: this.$globalConfig.elementUI.duration
            });
            _this.isLoading = false;
            return;
          }
          //                        var reg = /^1(3|4|5|8)[0-9]{9}$/
          //                        if (_this.customer.phone) {
          //                            if (!reg.test(_this.customer.phone)) {
          //                                return _this.$message({
          //                                    showClose: true,
          //                                    message: '请填写正确的手机号',
          //                                    type: "error",
          //                                });
          //                            }
          //                        }
          //添加客户 , 先查重
          let params = {
            token: "",
            customerId: JSON.parse(sessionStorage.getItem("customerInfo")).id,
            name: _this.customer.name || "",
            address: _this.customer.address || "",
            phone: _this.customer.phone || "",
            remark: _this.customer.remark,
              groupId: _this.customer.groupId,
            facId: JSON.parse(sessionStorage.getItem("last_login")).id
          };
          //console.log(params, '客户信息更新参数');
          updateFacCustomer(params).then(res => {
            console.log(res, "更新状态");
            if (res.data.code == 0) {
              _this.$message({
                showClose: true,
                message: res.data.msg,
                type: "success",
              });
              this.$router.push("/customer");
            } else {
              _this.$message({
                showClose: true,
                message: res.data.msg,
                type: "error",
              });
            }
            this.isLoading = false;
          });
        } else {
          this.isLoading = false;
          _this.$message({
            showClose: true,
            message: "必须输入姓名",
            type: "error",
          });
        }
      } else if (type == "remove") {
        _this.isLoading = true;

        this.$confirm("确认删除此客户吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error"
        })
          .then(() => {
            let params = {
              facId: JSON.parse(sessionStorage.getItem("last_login")).id,
              customerId: JSON.parse(sessionStorage.getItem("customerInfo")).id,
              token: ""
            };
            deleteFacCustomer(params).then(res => {
              if (res.data.code == 0) {
                _this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "success",
                });
                this.$router.push("/customer");
              } else {
                _this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error",
                });
              }
              _this.isLoading = false;
            });
          })
          .catch(() => {
            _this.isLoading = false;
            _this.$message({
              showClose: true,
              message: "已取消",
              type: "warning",
            });
          });
      } else {
        _this.$message({
          showClose: true,
          message: "已取消",
          type: "warning",
        });
        _this.isLoading = false;
        this.$router.push("/customer");
      }
    },
    getCustomerInfo() {
      this.customer = JSON.parse(sessionStorage.getItem("customerInfo"));
    }
  },
  created: function() {
    // 生命周期实例化钩子函数
    this.getCustomerInfo();
    this.getCustomerGroupLists();
  },
  mounted: function() {
    // 生命周期渲染后钩子函数
  },
  watch: {
    // 监听属性变化
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";
.colorGray {
  color: #babdc2;
}
.customer-detaile {
  height: 100%;
  // background-color: #fff;

  .customer-header {
    line-height: 60px;
    margin-bottom: 16px;
    background-color: #fff;
    padding: 0 32px;
    .customer-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: MicrosoftYaHei;
      font-size: 24px;
      color: #2c2c2c;
      p {
        // border-bottom: 2px solid #2c2c2c;
        position: relative;
        top: 2px;
      }
      .back {
        cursor: pointer;
        display: inline-block;
        text-align: center;
        width: 94px;
        height: 30px;
        line-height: 30px;
        border-radius: 2px;
        border: solid 1px $color-btn;
        font-size: 12px;
        color: $color-btn;
      }
    }
  }
  .customer-content {
    padding: 32px;
    background-color: #fff;
    .title-btns {
      display: flex;
      justify-content: space-between;
      .base-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-family: MicrosoftYaHei;
        font-size: 20px;
        color: #2c2c2c;
        .line {
          display: inline-block;
          width: 6px;
          height: 20px;
          background-color: $color-btn;
          margin-right: 10px;
        }
      }
    }
    .customer-info {
      margin-top: 30px;
      .w180 {
        width: 180px;
      }
      .w480 {
        width: 480px;
      }
      .nf-input {
        display: inline-block;
      }
      .only-read {
        // border: 1px solid #d5d5d5 !important;
        // border-radius: 4px;
      }
      .input-info {
        display: inline-block;
        margin-right: 50px;
        position: relative;
        .pos {
          position: absolute;
          left: -8px;
          top: 14px;
        }
        input {
          padding-left: 5px;
          margin-left: 5px;
          width: 180px;
          border-bottom: 1px solid #979797;
          height: 36px;
          border: none;
        }
      }
      .customerAddr,
      .remark {
        margin-top: 28px;
        input,
        textarea {
          padding-left: 5px;
          margin-left: 5px;
          width: 483px;
          height: 36px;
          border-radius: 4px;
        }
        textarea {
          height: 66px;
          width: 483px;
          resize: none;
          outline: none;
          border: none;
        }
      }
      .remark {
        display: flex;
        align-items: baseline;
        span {
          margin-right: 5px;
          align-self: flex-start;
        }
      }
    }
  }
}
</style>
