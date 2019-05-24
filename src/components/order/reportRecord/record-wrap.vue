<template>
    <div class="collapse" :class="{'is-cancel': logItem.status}">
        <el-row
            class="record-item__head"
            type="flex"
            justify="space-between">
            <div class="record-item__head-right">
                <icon w="24" h="24" type="icon-report1" />
                <p style="margin-left: 8px;">{{ logItem.operatorName }}：{{ logItem.message }}
                    <!--<span v-if="logItem.storehouseName" style="color: #1CA1FF;margin-left: 15px;">查看入库单</span>-->
                </p>
                <span class="record-item__icon-cancel mgl8" v-show="logItem.status"></span>
                <span class="mgl8 red-text" v-show="logItem.status&&showRevocation">撤销人：{{logItem.operatorName}}</span>
            </div>
            <div class="record-item__head-left">
                <div class="is-hover">
                    <span class="record-item__head-time">{{ logItem.dateCreated }}</span>
                    <div class="record-item__head-handle">
                        <span v-if="logItem.status">已撤销</span>
                        <icon-button v-if="!logItem.status" class="btn-cancel" @click="deleteRecord">撤销</icon-button>
                    </div>
                </div>
                <i
                v-show="showArrow"
                class="record-item__icon-arrow el-icon-arrow-down"
                :class="{'is-rotate': !isCollapse}"
                @click="isCollapse = !isCollapse"></i>
            </div>
        </el-row>
        <div class="collapse__wrap" v-show="!isCollapse">
            <slot></slot>
            <slot name="table"></slot>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    showArrow: {
      type: Boolean,
      default: true
    },
    showRevocation: {
      type: Boolean,
      default: false
    },
    logItem: {}
  },
  filters: {
      filterEndTime(val) {
          return val.slice(0, 11);
      }
  },
  created() {
  },
  data() {
    return {
      isCollapse: true,
      sign: '0'
    };
  },
  methods: {
    deleteRecord() {
       var datalist = JSON.parse(sessionStorage.getItem("user_login"))
      .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.mission.node.report.record.cancel") {
            this.sign = "1";
          }
        }
      }
      if (this.sign == "0" || !datalist) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      this.$emit("on-cancel", this.logItem);
    }
  }
};
</script>

<style lang="scss" scoped>
.gray{
  color: #a2abb8;
  }
$color-desc: #a2abb8;
.collapse {
  padding: 20px 16px;
  margin-bottom: 8px;
  background: #fcfcfc;
  border: solid 1px #f2f2f2;
  -webkit-user-select: none;
  &.is-cancel {
    position: relative;
    opacity: 0.6;
  }
}
.mgl8{
  margin-left:8px;
}
.red-text{
  color:#FA4150;
}
.record-item {
  &__icon-arrow {
    cursor: pointer;
    color: $color-desc;
    transition: transform 0.3s;
    &.is-rotate {
      transform: rotate(-180deg);
    }
  }
  &__icon-cancel {
    display: inline-block;
    width: 56px;
    height: 20px;
    vertical-align: middle;
    background: url(../../../assets/images/pic_revoked.png) no-repeat;
    background-size: 100% 100%;
  }
  &__head {
    line-height: 24px;
    &-con {
      display: inline-block;
      margin-left: 4px;
    }
    &-little {
      display: inline-block;
      margin-left: 8px;
    }
    &-marginright {
      margin-right:24px;
    }
    &-time {
      color: $color-desc;
      margin-right: 5px;
    }
    &-handle {
      display: none;
      margin-right: 5px;
    }
    &-right {
      display: flex;
      justify-content: flex-start;
    }
    &-left {
      flex-shrink: 1;
      .is-hover {
        display: inline-block;
        min-width: 140px;
        text-align: right;
        &:hover {
          .record-item__head-handle {
            display: inline-block;
          }
          .record-item__head-time {
            display: none;
          }
        }
      }
      .btn-cancel {
        color: #1ca1ff;
      }
    }
  }
}
</style>
