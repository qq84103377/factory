<template>
  <div style="min-height: 100px;margin-top: 8px" v-loading="loading">
    <div v-for="(item,index) in tableData" :key="index" class="mgb8">
      <el-table
         class="custom-table"
        :data="[item]"
        border
        :row-class-name="tableRowClassName"
        style="width: 100%">
        <el-table-column
          prop="styleStatus"
          label="状态">
          <template slot-scope="scope">
            {{styleStatusMap[scope.row.styleStatus]}}
          </template>
        </el-table-column>
        <el-table-column prop="designStyleNo" label="设计款号" min-width="110"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="110"></el-table-column>
        <!-- 设计档案属性 -->
        <el-table-column label="品牌">
          <template slot-scope="scope">
            <div v-for="(el,key) in scope.row.attrs" :key="key">
              <span v-if="el.type === 8">{{el.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="设计师">
          <template slot-scope="scope">
            <div v-for="(el,key) in scope.row.attrs" :key="key">
              <span v-if="el.type === 2">{{el.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类">
          <template slot-scope="scope">
            <div v-for="(el,key) in scope.row.attrs" :key="key">
              <span v-if="el.type === 4">{{el.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="风格">
          <template slot-scope="scope">
            <div v-for="(el,key) in scope.row.attrs" :key="key">
              <span v-if="el.type === 9">{{el.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标签">
          <template slot-scope="scope">
            <div v-for="(el,key) in scope.row.attrs" :key="key">
              <span v-if="el.type === 7">{{el.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="年份">
          <template slot-scope="scope">
            <div v-for="(el,key) in scope.row.attrs" :key="key">
              <span v-if="el.type === 6">{{el.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="季节">
          <template slot-scope="scope">
            <div v-for="(el,key) in scope.row.attrs" :key="key">
              <span v-if="el.type === 5">{{el.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="月份">
          <template slot-scope="scope">
            <div v-for="(el,key) in scope.row.attrs" :key="key">
              <span v-if="el.type === 10">{{el.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="波段">
          <template slot-scope="scope">
            <div v-for="(el,key) in scope.row.attrs" :key="key">
              <span v-if="el.type === 3">{{el.name}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 节点审批 -->
        <template v-for="(el,index1) in item.nodes">
          <el-table-column
            :key="index1"
            :label="el.nodeName"
            min-width="140"
            >
            <template slot-scope="scoped">
              <span :class="[scoped.row.styleStatus ===1 ? 'txt-color' : '']">{{nodeStatusMap[el.status]}}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editNodeGo(scope.row.missionId,scope.row.status)">编辑节点</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: ['tableData', 'loading'],
  data () {
    return {
      styleStatusMap: {
        0: '设计中',
        1: '已作废',
        2: '已完成',
        3: '未提报'
      },
      nodeStatusMap: {
        0: '未开始',
        1: '已结束',
        2: '已回退'
      }
    }
  },
  methods: {
    tableRowClassName(row, index) {
      if (row.styleStatus == 1) {
        return 'cancel-row'
      }else {
        return '';
      }
    },
      editNodeGo(missionId,status){
          console.log(missionId);
          this.$emit('editNodeGo',missionId,status)
      },
  }
}
</script>
<style lang="scss" scoped>
    .txt-color{
      color: #C4C6CC
    }
    .txt-green{
      color: #23C811
    }
    .txt-red{
      color: #FA4150
    }
    .txt-blue{
      color: #1CA1FF
    }
</style>


