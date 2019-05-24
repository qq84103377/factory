<!-->
padding:24px 32px;
background: #fff;
border-radius: 2px;
box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
<-->

<template>
  <div class="base_box">
      <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scpoed>

.base_box {
    padding: 24px ;
    background-color: #ffffff;
    border-radius: 2px;
    box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
}
</style>
