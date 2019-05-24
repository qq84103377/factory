/*
 * @Author: kuhn 
 * @Description: 物料款号编码规则
 *    @props  ruleInfo 物料款号编号规则配置信息
 *    @props  index 物料款号编号规则索引
 * @Date: 2019-05-08 09:50:32 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-20 16:40:32
 */

<template>
  <div class="rule-wrap">
    <div class="rule-title">物料款号</div>
    <div class="rule-main">
      <el-radio-group v-model="materialRule" @change="handlerRuleChange">
        <el-radio :label="false" class="rules">手动填写</el-radio>
        <el-radio
          :label="true"
          class="rules custom-rule"
          checked="true">自定义规则生成</el-radio>
      </el-radio-group>
      <div class="rule-diy" v-if="materialRule">
        <div class="rule-item rule-item-all">
          <div class="rule-all-attrs">(未配任何自定义规则将退回手动填写)</div>
          <span>适用全部属性：</span>
          <p class="rule-tag" v-if="allBeseemInfo.ruleName">{{allBeseemInfo.ruleName}}</p>
          <span @click="allBeseemEdit" class="handle-btns edit-btn">编辑</span>
        </div>
        <div class="rule-item rule-item-some">
          <span class="some-f-l">适用属性：</span>
          <div class="some-f-l right-content">
            <div class="some-title">
              <span class="some-title-text">{{typeName}}</span>
              <span @click="handleChangeAtts" class="handle-btns edit-btn">编辑</span>
            </div>
            <ul class="some-list">
              <li v-for="(item,index) in materialBeseemRules" :key="item.id">
                <div class="some-title">{{item.ruleName}}</div>
                <p class="rule-tag some-tag" v-if="item.ruleName_un">
                  <span>{{item.ruleName_un}}</span>
                </p>
                <span @click="editBeseemChild(item)" class="handle-btns edit-btn">编辑</span>
                <span @click="delBeseemChild(index,item)" class="handle-btns del-btn">删除</span>
              </li>
            </ul>
            <div
              v-if="typeName"
              @click="addBeseemChild()"
              class="handle-btns add-btn">+ 添加子选项规则
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'material-regular',

  components: {},

  props: {
    ruleInfo: {
      type: Object,
      require: true
    },
    index: {
      type: Number,
      default: 0
    },
    selectTypeInfo: {
      type: Object
    },
    materialOptions: {}
  },

  data() {
    return {
      materialRule: false,
      allBeseemInfo: {}, // 适用全部属性
      materialBeseemRules: [], //物料款号适用属性已选规则
      attrTypeName: ''
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
     * 物料款号规则更改
     */
    handlerRuleChange(value) {
      // console.log(value)
      this.$emit('materialRuleChange', this.ruleInfo.id, value)
    },
    /**
     * 弹出适用全部属性-编辑
     */
    allBeseemEdit() {
      // console.log('使用全部属性',this.allBeseemInfo)
      this.$emit('materialAllBeseemEdit', this.ruleInfo.modelType, this.allBeseemInfo)
    },
    /**
     * 弹出适用属性弹窗
     */
    handleChangeAtts() {
      this.$emit('materialChangeAtts', this.materialBeseemRules[0], this.index)
    },
    /**
     * 适用属性子项 - 编辑
     */
    editBeseemChild(item) {
      this.$emit('materialBeseemEdit', this.materialBeseemRules[0], item)
    },
    /**
     * 适用属性子项 - 删除
     */
    delBeseemChild(index, item) {
      // this.materialBeseemRules.splice(index, 1)
      this.$emit('materialBeseemDelete', item)
    },
    /**
     * 新增子项规则
     */
    addBeseemChild() {
      if (!this.typeName) {
        return this.$message.error("请先选择一条适用属性")
      }
      this.$emit('materialBeseemAdd', this.materialBeseemRules[0] || {})
    },
    init() {
      // 设置编码规则
      this.materialRule = false
      this.allBeseemInfo = {}
      this.materialBeseemRules = []
      this.attrTypeName = ''
      this.materialRule = this.ruleInfo.openRule
      const ruleList = this.ruleInfo.commonGenerateRuleDTOs
      const otherBeseemList = []
      ruleList.forEach(item => {
        if (Number(item.attrType) === 0) {
          this.allBeseemInfo = item
        } else {
          // console.log('适用属性描述', item)
          let ruleName_un = ''
          item.commonGenerateAttrRuleDTOs.forEach(info => {
            if(info.value){
              ruleName_un += info.value + ' —'
            }else{
              ruleName_un += info.attrFieldName + ' —'
            }
          })
          ruleName_un = ruleName_un.substr(0, ruleName_un.length - 1)
          // 适用属性集合
          this.materialBeseemRules.push({ ...item,
            ruleName_un: ruleName_un
          })
        }
      });
      // 设置适用属性名称
      if (this.materialBeseemRules.length > 0) {
        const attrTypeInfo = this.materialOptions.filter(item => {
          return item.id === String(this.materialBeseemRules[0].attrType) || item.attrType ===  String(this.materialBeseemRules[0].attrType)
        })[0] || {}
        this.attrTypeName = attrTypeInfo.attrName
      }
    }
  },

  filters: {},

  computed: {
    // 适用属性名称
    typeName() {
      let name = ''
      if (this.selectTypeInfo.attrName) {
        name = this.selectTypeInfo.attrName
      } else if (this.attrTypeName) {
        name = this.attrTypeName
      }
      console.log('适用属性名称',name)
      return name
    }
  },

  watch: {
    ruleInfo: {
      handler: function (value) {
        this.init()
      },
      deep: true
    }
  }

}
</script>

<style lang="scss" scoped>
.rule-wrap {
  background: #F7F9FC;
  border: 1px solid #DFE6EC;
  margin-left: 12px;
  padding: 12px;
  margin-bottom: 10px;

  .rule-title {
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 12px;
  }

  .rule-main {
    font-size: 12px;

    .rule-diy {
      margin-left: 120px;

      .rule-item {
        margin: 10px 0;

        .rule-all-attrs {
          margin-bottom: 5px;
          color: #FA4150;
        }

        &.rule-item-some {
          overflow: hidden;

          .some-f-l {
            float: left;

            &.right-content {
              margin-left: 15px;
            }
          }

          .some-title {
            margin-bottom: 10px;
          }

          .some-list {
            li {
              margin-top: 10px;
            }

            .some-tag {
              margin-left: 0;
              margin-right: 10px;
            }
          }
        }
      }

    }

    .rule-tag,
    .order-rule {
      display: inline-block;
      padding: 2px 5px;
      margin: 0 10px;
      border: 1px solid #DFE6EC;
      background-color: #EBEFF5;
    }

    .some-title-text {
      margin-right: 10px;
    }

    .handle-btns {
      margin-right: 10px;
      text-decoration: underline;
      cursor: pointer;

      &.edit-btn {
        color: #1CA1FF;
      }

      &.del-btn {
        color: #FA4150;
      }

      &.add-btn {
        display: inline-block;
        margin-top: 10px;
        color: #FFA914;
      }
    }
  }
}
</style>
