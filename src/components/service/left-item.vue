<template>
    <div class="msg-item" :class="{'gray': messageItem.cancel === 1}">
        <div class="charge-icon" v-if="messageItem.leaderFlag">
          <icon type="icon-xiaoxi_jiaobiao" w="36" h="36"></icon>
        </div>
        <div class="good-img">
            <img @click.stop="imgShow" :src="messageItem.pictures[0] ? messageItem.pictures[0].path : defaultImg" />
            <!-- <span class="msg-num red-dot"></span> -->
            <span class="msg-num" v-if="messageItem.noticeMeUnReadCount > 0 && messageItem.unReadCount>0 && messageItem.cancel !== 1">{{messageItem.unReadCount}}</span>
            <span class="msg-num red-dot"
            v-if="messageItem.noticeMeUnReadCount === 0 && messageItem.unReadCount && messageItem.cancel !== 1"></span>
            <!-- <span class="msg-num red-dot" v-if="messageItem.noticeMeUnReadCount === 0 && messageItem.unReadCount>0"></span>
            <span class="msg-num" v-if="messageItem.noticeMeUnReadCount > 0 && messageItem.unReadCount>0">{{messageItem.noticeMeUnReadCount}}</span> -->
        </div>
        <div class="msg-content">
            <div class="msg-info">
                <p class="good-info">{{messageItem.orderNo}} <i v-if="messageItem.custName">-</i> {{messageItem.custName}} <i v-if="messageItem.styleNo">-</i> {{messageItem.styleNo}}</p>
                <p class="time">{{messageItem.sendAt|filterTime}}</p>
            </div>
            <div class="msg-main">
                <span class="about" v-if="messageItem.noticeMeUnReadCount>0">
                    [<span>{{messageItem.noticeMeUnReadCount > 0 ? '与我有关' : ''}}</span>
                    <i class="num">{{messageItem.noticeMeUnReadCount}}</i>]
                </span>
                <span v-if="messageItem.noticeMeUnReadCount === 0 && messageItem.unReadCount">
                    [<i>{{messageItem.unReadCount}}</i>]
                </span>
                <!-- <span class="about" v-if="messageItem.noticeMeUnReadCount>0">[<span>与我有关</span> <i class="num">{{messageItem.noticeMeUnReadCount}}</i>]</span> -->
                <span class="desc">{{messageItem.sendBy === 'SYSTEM' ? '系统' : messageItem.sendBy}}:
                    <i class="type" 
                    v-for="(item, index) in messageItem.taskInstanceWorkflows" :key="index"><span v-if="item.name">#{{item.name}}#</span></i>{{messageItem.message}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Utils from '../../utils/format'
export default {
  props: {
    messageItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      defaultImg: this.$globalConfig.qiniu.baseDefaultUrl
    };
  },
  filters: {
      filterTime(val) {
          if (val) {
              const sendAt = new Date(val.replace(/-/g, '/'));
              return Utils.formatDate(sendAt, 'MM.dd') + ' ' + Utils.formatDate(sendAt, 'hh:mm')
          }
          return ''
      }
  },
  methods: {
    imgShow() {
      this.$emit('imgShow', this.messageItem.pictures);
    }
  }
};
</script>

<style scoped lang="scss">

.msg-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #e6e8eb;
  cursor: pointer;
  &:hover {
    background: #fcfbfa;
  }
  .charge-icon {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9
  }
  .good-img {
    position: relative;
    img {
      width: 48px;
      height: 48px;
      border: solid 1px #cccccc;
    }
    .msg-num {
      position: absolute;
      right: -9px;
      top: -9px;
      width: 18px;
      height: 18px;
      text-align: center;
      line-height: 18px;
      font-size: 12px;
      color: #ffffff;
      background-color: #fa3c3c;
      border-radius: 50%;
    }
    .red-dot {
      right: -3px;
      top: -3px;
      width: 10px;
      height: 10px
    }
  }
  .msg-content {
    flex: 1;
    margin-left: 8px;
    //  line-height: 25px;
    .msg-info {
      font-size: 12px;
      justify-content: space-between;
    }
    .good-info {
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      line-height: 15px;
      // white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .time {
      color: #a2abb8;
    }
    .msg-info,
    .msg-main {
      display: flex;
    }
    .msg-main {
      margin-top: 10px;
      font-size: 14px;
    }
    .desc {
      flex: 1;
      display: -webkit-box;
      // height: 15px;
      line-height: 18px;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .about {
      color: #878e99;
    }
    i.num {
      color: #fa3c3c;
    }
    i.type {
      color: #1ca1ff;
    }
  }
}
.gray {
  position: relative;
  &::after {
    position: absolute;
    right: 50px;
    top: 50%;
    display: block;
    width: 56px;
    height: 30px;
    content: '\5DF2\64A4\9500';
    border: 1px solid #cccccc ;
    line-height: 30px;
    color: #cccccc;
    text-align: center;
    transform: translateY(-50%) rotate(35deg);
  }
}
.gray * {
  color: #cccccc!important;
}
</style>
