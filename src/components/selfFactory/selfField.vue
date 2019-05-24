<template>
  <div>
    <el-table
      :data="tableData"
      border
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="字段名称">
      </el-table-column>
      <el-table-column
        prop="belongModules"
        label="所属档案"
        min-width="300">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.belongModules" :key="index">{{item}}{{ index === scope.row.belongModules.length-1 ? '' : '、'}} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="total"
        label="选项总数">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.total.split(',')" :key="index">{{item}} </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="editPopup(scope.row)" type="text" size="small" style="color:#409eff;text-decoration: underline;">管理</el-button>
          <el-button v-if="scope.row.type===11" @click="$router.push('/sizeConfig')" type="text" size="small" style="color:#409eff;text-decoration: underline;">码比配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 右侧弹窗 -->
    <transition name="right-move">
      <!-- 属性右侧滑窗 -->
      <component :is="currentTabComponent" @cancel="getCancel" :info="infoTable" v-if="attrShow"></component>
    </transition>
    <transition name="opcity">
      <div class="cover"  @click="attrShow = false" v-if="attrShow"></div>
    </transition>
  </div>
</template>

<script>
import {getFields} from '@/api'
import attrDialog from './components/attrDialog'
import categoryTree from './components/categoryTree'
export default {
  data () {
    return  {
      tableData: [],
      infoTable: [],
      attrShow: false,
      currentTabComponent: 'attrDialog',
      curType: null,
      curName: null,
      loading: false
    }
  },
  components:{attrDialog,categoryTree},
  computed: {
    unitId() {
      return JSON.parse(sessionStorage.getItem("user_login")).unitId;
    },
  },
  methods: {
    getCancel(v) {
      this.attrShow = v
      this.getFields()
    },
    // 弹窗编辑
    editPopup(row) {
      this.infoTable = row
      this.currentTabComponent = row.type == 11 ? 'categoryTree': 'attrDialog'
      this.attrShow = true
    },
    getFields() {
      this.loading = true
      getFields({unitId: this.unitId}).then(res => {
        this.loading = false
        this.tableData = res.data.data
      })
    }
  },
  created () {
    this.getFields()
  }
}
</script>

