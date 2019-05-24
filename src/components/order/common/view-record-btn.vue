<template>
    <icon-button @click="viewRecord" class="btn" type="icon-reported-record">查看上报记录</icon-button>
</template>

<script>
export default {
  data() {
    return {
        sign:'0'
    };
  },
  props: {
    type: "",
    componentData: {}
  },
  methods: {
    viewRecord() {
        // 权限
        if(!this.powerJudgement.permissions("fac.mission.report.view")){
            return
        }
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.mission.node.report.record") {
            this.sign = "1";
          }
        }
      }if (this.sign == "0" || !datalist) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      console.log(this.componentData);
      // return\
      let type = this.type;
      // if (this.type !== 'actual_cutting_ligation' && this.componentData.associateLigation) {
      //   type = 'actual_cutting_ligation_correlation';
      // }
      // const type = this.componentData.associateLigation
      this.$router.push({
        path: "/nodeReportRecord",
        query: {
          ...this.$route.query,
          type
        }
      });
    }
  }
};
</script>

<style scoped>
.btn {
  margin-left: 10px;
  color: #808080;
  font-size: 14px;
}
</style>
