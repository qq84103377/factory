<template>
  <el-dropdown>
    <nf-button style="font-size:12px;">打印{{name}}</nf-button>
    <el-dropdown-menu slot="dropdown" class="fs12" v-loading="listLoading">
      <el-dropdown-item class=" fs12" disabled>选择{{name}}打印模板</el-dropdown-item>
      <el-dropdown-item :divided="index==0" :class="{active: item.defaultStatus ==1 ? true : false}" v-for="(item, index) in list" :key="index" @click.native="go(item)">{{item.name}}</el-dropdown-item>
      <!--<el-dropdown-item divided v-if="isShow"><nf-button style="font-size:12px;" @click.native="$router.push({path:'/home/setting/selfFacTemplate',query:{type: type}})">设置启用模板</nf-button></el-dropdown-item>-->
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import {facTemplates} from '../../api/api'
export default {
  props:['name','type','id','special'], // name:按钮的显示名称， type：单据的类型， id：单据的id  special: 生产订单专用
  data() {
    return {
      listLoading: false,
      list: [],
      isShow: true, // 是否有权限
    }
  },
  computed: {
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    }
  },
  methods: {
    // 获取组织层列表
    getFacTemplates (id) {
      let params = {
        userId: this.userId,
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
        type: this.type,
        pageNo: 1,
        pageSize: 9999,
        using:true,
        typeId:''
      }
      this.listLoading = true
      facTemplates(params).then(res => {
        this.list = res.data.data.list
        this.listLoading = false
      })
    },
    // 打印跳转
    go(item) {
        // 权限
        if (!this.powerJudgement.permissions("fac.prcmission.print")&&this.type!='stock') {
            return
        }
            window.open(`/#/printShow?templateId=${item.id}&businessId=${this.id}&printType=print&billType=${this.type}&special=${this.special}`)
    }
  },
  created(){
    this.getFacTemplates()
      let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
      if (powerlist.indexOf('fac.print.getPrintTypes') == -1) {
          this.isShow = false
      }
  }
}
</script>
<style lang="scss">
.active{
  color:#FFA914;
  &:hover{
    color:#FFA914 !important;
  }
}
</style>
