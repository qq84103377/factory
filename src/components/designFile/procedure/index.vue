<template>
  <div v-loading="loading" class="procedure">
    <div class="clearfix ">
      <div class="procedure-tab" style="float: left;">
        <button :class="{'active':index === changeIndex}" v-for="(it,index) in templateList" :key="it.id" @click="changeChanel(index)">{{it.name}}
        </button>
      </div>
      <nf-button
        @click="handleAddClick"
        style="float: right;padding: 0;line-height: 32px;width: 106px;text-align: center;font-size: 12px;"
        type="warning"
        svg="icon-btn-add">新建工序模板</nf-button>
    </div>
    <div v-if="!template.id" style="font-size: 12px;text-align: center;color: #C4C6CC">暂无工序模板数据</div>
    <section v-if="template.id" class="template-list">
      <base-box>
        <content-wrap style="position: relative;" title="基本信息">
          <nf-button
            svg="icon-edit1"
            @click="readyEdit"
            style="width: 64px;height: 32px;padding: 0;position: absolute;right: 0;top: 0;">编辑</nf-button>
          <el-form
            ref="baseInfo"
            class="detail-form"
            :model="formData"
            label-width="100px">
            <el-row class="detail-form__row" type="flex">
              <el-form-item class="detail-form__item" label="工序名称:">
                <span>{{template.name}}</span>
              </el-form-item>
              <el-form-item class="detail-form__item" label="默认负责人:">
                <!--<span v-for="(item,index) in formData.chargers">{{(index==0?'':'/')+item.name}}</span>-->
                <span>{{template.chargerNames}}</span>
              </el-form-item>
            </el-row>
          </el-form>
        </content-wrap>
        <content-wrap title="工序流程">
          <el-table
            border
            :data="template.prcdNodes"
            style="width: 100%">
            <el-table-column label="节点名称" width="180">
              <template slot-scope="scope">
                <div>{{scope.row.name}}({{scope.row.type}})</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="chargerNames"
              label="默认负责人"
              width="180">
            </el-table-column>
            <el-table-column label="默认工价(元/件)">
              <template slot-scope="scope">
                <div v-if="scope.row.defaultLabourCost<0">----</div>
                <div v-if="scope.row.defaultLabourCost>0">{{scope.row.defaultLabourCost}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="delayWarningNum" label="默认结束时间(天)">
              <template slot-scope="scope">
                <div v-if="scope.row.defaultAdvanceFinishDay || scope.row.defaultAdvanceFinishDay==0">交货前{{scope.row.defaultAdvanceFinishDay}}天</div>
                <div v-if="!(scope.row.defaultAdvanceFinishDay || scope.row.defaultAdvanceFinishDay==0)"></div>
              </template>
            </el-table-column>
            <el-table-column label="预警提醒(天)">
              <template slot-scope="scope">
                <div v-if="scope.row.needDelayWarning">结束前{{scope.row.delayWarningNum}}天</div>
              </template>
            </el-table-column>
            <el-table-column label="差额提醒(数量)">
              <template slot-scope="scope">
                <div>[{{scope.row.differenceWarningMin}}] - [{{scope.row.differenceWarningMax}}]</div>
              </template>
            </el-table-column>
          </el-table>
        </content-wrap>
      </base-box>
    </section>

    <!--新建弹窗-->
    <transition name="right-move">
      <procedure-create
        :detailFrom="detailFrom"
        :show="isShow"
        :editId="editId"
        @toggle="isShow=false;fetchTemplateList()"
        v-if="isShow">
      </procedure-create>
    </transition>
    <transition name="opcity">
      <div
        class="cover"
        v-show="isShow"
        @click="isShow = false">
      </div>
    </transition>
  </div>
</template>

<script>
import {
  getDesignTemplateList
} from '@/api/sample-centre';
import {
  templateFindTemplate,
  findTemplateList
} from '../../../api/api'
import procedureCreate from './create'
export default {
  components: {
    procedureCreate
  },
  props: ['detailFrom'],
  data() {
    return {
      styleId: '',
      changeIndex: 0,
      loading: false,
      editId: '',
      isShow: false,
      templateList: [],
      template: {},
      formData: {},
      tableData: []
    };
  },
  computed: {
    unitId() {
      return JSON.parse(sessionStorage.getItem('user_login')).unitId
    },
    designStyleId() {
      return this.$route.query.designStyleId
    },
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    }
  },
  created() {
    if (this.detailFrom === 'goods') {
      //商品模板
      this.styleId = this.$route.query.id;
    }
    this.fetchTemplateList();

  },
  methods: {
    getFindTemplateList() {
      this.loading = true
      findTemplateList({
        styleId: this.styleId
      }).then(res => {
        this.loading = false;
        this.templateList = res.data.data || [];
        this.editId = this.templateList[0] ? this.templateList[0].id : ''
        this.template = this.templateList[this.changeIndex] || {};
      })
    },
    // 点击选中哪个传值
    changeChanel(index) {
      this.changeIndex = index;
      this.template = this.templateList[this.changeIndex];
      this.editId = this.templateList[this.changeIndex].id
    },
    //新建
    handleAddClick() {
      // 权限
      if (!this.powerJudgement.permissions("fac.spl.design.style.template.add")) {
        return
      }
      this.editId = '';
      this.isShow = true;
    },
    //准备编辑
    readyEdit() {
      // 权限
      if (!this.powerJudgement.permissions("fac.spl.design.style.template.edit")) {
        return
      }
      this.isShow = true;
      this.editId = this.template.id || ''
    },
    /**
     * 获取工序模板列表数据
     */
    fetchTemplateList() {
      if (this.detailFrom === 'goods') {
        //商品模板
        this.getFindTemplateList()
      } else {
        this.loading = true
        templateFindTemplate({
            designStyleId: this.designStyleId,
            userId: this.userId
          })
          .then(res => {
            this.loading = false;
            this.templateList = res.data.data || {};
            console.log('工序模板', res.data.data)
            this.editId = this.templateList[0].id || ''
            this.template = this.templateList[this.changeIndex];
          });
      }
    },
    viewDetail(item) {
      this.$router.push({
        path: '/design/template/detail',
        query: {
          templateId: item.templateId
        }
      })
    },
    renderEmptyText(arr) {
      return arr.length ? '' : '未设置'
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-form__item {
  width: 30%;
  margin-right: 32px;
  margin-bottom: 0 !important;
}

.procedure {
  .procedure-tab {
    button {
      max-width: 150px;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      padding: 0 25px;
      font-size: 16px;
      color: #939fb8;
      border: 1px solid #939fb8;
      border-left: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

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

  .template-list {
    margin-top: 12px;
  }

  .template-item {
    margin-bottom: 12px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, .05);

    &__header {
      padding: 18px;
      border-bottom: 1px solid #E6EAF0;

      &--center {
        flex: 1;
        margin: 0 8px;
      }

      &__info {
        margin-top: 8px;
        font-size: 12px;
        color: #A2ABB8
      }

      &__user {
        margin-left: 16px;

        .user-item:not(:last-child)::after {
          content: '、'
        }
      }
    }

    &__body {
      padding: 18px;
    }
  }

  .steps {
    font-size: 0;

    .step-item {
      display: inline-block;
      font-size: 12px;
      width: 140px;
      text-align: center;
      cursor: pointer;

      &__header {
        position: relative;
        padding: 0 16px;

        &::before,
        &::after {
          position: absolute;
          top: 50%;
          display: block;
          content: '';
          height: 2px;
          opacity: .1;
          background: #1CA1FF;
          transform: translateY(-50%);
        }

        &::before {
          right: 50%;
          left: 0;
        }

        &::after {
          left: 50%;
          right: 0%;
        }
      }

      &:first-child .step-item__header::before {
        display: none;
      }

      &:last-child .step-item__header::after {
        display: none;
      }

      &__text {
        padding: 0 16px;
        margin-top: 4px;
        font-size: 12px;
      }
    }
  }

  .popver-content {
    line-height: 18px;

    h4 {
      font-size: 14px;
    }

    &__detail {
      font-size: 12px;

      &__wrap {
        margin: 8px 0;
      }

      &--label {
        color: #A2ABB8;
      }

      .user-list>.user-list__item:not(:last-child)::after {
        content: '、'
      }
    }
  }
}

.right-move-enter-active,
.right-move-leave-active {
  transition: all 0.3s ease;
  transform: translateX(0);
}

.right-move-enter,
.right-move-leave-to {
  transform: translateX(100%);
}

.opcity-enter-active,
.opcity-leave-active {
  transition: all 0.5s ease;
  opacity: 0.5;
}

.opcity-enter,
.opcity-leave-to {
  opacity: 0;
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
</style>
