<template>
  <div>
    <base-box>
      <content-wrap style="position: relative;" :title="info.name">
        <nf-button
          svg="icon-edit1"
          @click="handleEditClick"
          style="width: 64px;height: 32px;padding: 0;position: absolute;right: 0;top: 0;">编辑</nf-button>
        <div class="tech-detail" v-if="info.content">
          <div class="tech-desc" v-html="info.content"></div>
        </div>
        <div class="clearfix" style="margin-top: 8px;">
          <attachEdit :isShowClose="false" :attachData='info.attachments'></attachEdit>
        </div>
      </content-wrap>
    </base-box>
  </div>
</template>

<script>
import attachEdit from '../../goods/child/attachEdit'
export default {
  props: {
    info: {
      type: Object,
      default: {
        name: '',
        attachments: []
      }
    }
  },
  created() {
    // console.log(this.info);
  },
  components: {
    attachEdit
  },
  data() {
    return {}
  },
  methods: {
    //编辑
    handleEditClick() {
      // 权限
      if (!this.powerJudgement.permissions("fac.spl.design.style.process.edit")) {
        return
      }
      this.$emit('show');
    }
  }
}
</script>

<style lang="scss">
.tech-detail {
  .tech-desc {
    img {
      max-width: 750px;
    }
  }
}
</style><style lang="scss" scoped>
.tech-detail {
  border: 1px solid #E6EAF0;
  padding: 10px;

  .tech-desc {
    font-size: 12px;
    color: #3B3B3B;
    margin-bottom: 10px;
  }
}
</style>
