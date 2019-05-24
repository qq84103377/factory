<template>
  <div>
    <art-info :sampleId="$route.query.id" :styleId="$route.query.styleId"  @addArt="addArt" @toggle='editArt'></art-info>
  </div>
</template>

<script>
  import { getGoodsClothesArtDetail,getGoodsArtsForClothes,sampleListProcessForm, sampleAddProcessForm, sampleDetailProcessForm} from '@/api/api'
  import artInfo from '@/components/goods/child/artInfo.vue'

  export default {
    data() {
      return {
      }
    },
    created() {
    },
    computed: {
    },
    components: {artInfo},
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .popover-item {
    cursor: pointer;
    color: #3B3B3B;
    font-size: 12px;
    line-height: 32px;
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