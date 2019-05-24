<template>
  <div>
    <el-dropdown>
      <nf-button style="font-size:12px;">打印标签</nf-button>
      <el-dropdown-menu slot="dropdown" class="fs12" v-loading="listLoading">
        <el-dropdown-item class="fs12" disabled>选择打印的标签</el-dropdown-item>
        <el-dropdown-item divided  @click.native="go(item.type)" v-for="(item,index) in list" :key="index">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 标签打印 -->
    <label-print-bar-code :dataArr="tableData" :type="curType" :orderNo="orderNo"></label-print-bar-code>
  </div>
</template>
<script>
import labelPrintBarCode from './labelPrintBarCode'
export default {
  props: ['materialList', 'orderNo'],
    /*
    materialList; 到料单详情数据
    orderNo：到料单号
    * */
  data () {
    return {
      list: [{name: '到料单号标签', type:'purchase'},{name: '物料信息标签',type:'materialInfo'}],
      curType: 'purchase'
    }
  },
  computed: {
    tableData () {
      console.log(this.materialList, 'this.materialList')
      return this.materialList
    }
  },
  components:{labelPrintBarCode},
  methods: {
    go (type) {
      this.curType = type
      // 1.设置要打印的区域 div的className
      this.$nextTick(()=>{
        var newstr = document.getElementById('purchase').innerHTML
        // 2. 复制给body，并执行window.print打印功能
        document.body.innerHTML = newstr
        // 3. 还原：将旧的页面储存起来，当打印完成后返给给页面。
        var oldstr = document.body.innerHTML
        window.print()
        window.location.reload()
        document.body.innerHTML = oldstr
      })
      return false
    }
  }
}
</script>

