/*
 * @Author: kuhn 
 * @Description: 本厂设置 - 规格属性库 - 物料属性库
 * @Date: 2019-05-07 14:37:36 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-09 13:29:28
 */

<template>
  <div>
    <attributePage :isTitle="false" />
  </div>
</template>

<script>

import attributePage from '../configuration/attribute/index.vue'
export default {
name: 'materialWare',

components: {
  attributePage
},

props: {},

data() { return {} },

created() {
  console.log(23333)
},

mounted() {},

activited() {},

update() {},

beforeRouteUpdate() {},

methods: {},

filters: {},

computed: {},

watch: {}

}
</script>

<style lang='scss' scoped>
</style>
