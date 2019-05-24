/*
 * @Author: kuhn 
 * @Description: 选择适用属性
 *    @props  selectAttrDialog 控制弹框
 *    @props  attrOptions 适用属性列表数据
 *    @props  selectValue 选中的适用属性值
 * @Date: 2019-05-13 13:18:05 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-16 11:25:32
 */

<template>
  <div>
    <el-dialog
      size="tiny"
      class="select-attr"
      title="选择适用属性"
      :visible.sync="selectAttrDialog">
      <div class="select-attr-content">
        <span>适用属性：</span>
        <el-select v-model="beseemType" placeholder="请选择">
          <el-option
            v-for="item in optionsList"
            :key="item.attrType"
            :label="item.attrName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('handBeseemClose')">取 消</el-button>
        <el-button type="primary" @click="changeAttrs">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'select-beseem-type',

  components: {},

  props: {
    selectAttrDialog: {
      type: Boolean,
      require: true
    },
    attrOptions: {
      type: Array,
      default: []
    },
    selectInfo: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      beseemType: '',
      optionsList: []
    }
  },

  created() {
    this.init()
  },

  mounted() {},

  activited() {},

  update() {},

  beforeRouteUpdate() {},

  methods: {
    /**
     * 选中适用属性
     */
    changeAttrs(value) {
      if (this.beseemType === '') {
        return this.$message.error('请先选择适用属性')
      }
      if (this.beseemType === this.selectValue) {
        return this.$emit('handBeseemClose')
      }
      const info = this.attrOptions.filter(item => {
        return item.id === this.beseemType
      })[0]
      this.$emit('selectBeseemTypeChange', info)
    },
    init() {
      this.beseemType = this.selectInfo.id
      const selectList = this.attrOptions.filter(item => {
        return !(item.attrType === 0 || item.attrType === 1)
      })
      this.optionsList = selectList
    }
  },

  filters: {},

  computed: {},

  watch: {
    selectInfo: {
      handler: function (value) {
        this.init()
      },
      deep: true
    },
    attrOptions: {
      handler: function (value) {
        this.init()
      },
      deep: true
    }
  }

}
</script>

<style lang="scss" scoped>
.select-attr {
  .el-dialog--tiny {
    width: 500px;

    .el-dialog__header {
      text-align: center;
    }

    .select-attr-content {
      padding: 30px 0;
      text-align: center;
      border-top: 1px solid #DFE6EC;
      border-bottom: 1px solid #DFE6EC;
    }
  }
}
</style>
