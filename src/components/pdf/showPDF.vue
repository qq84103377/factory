<template>
    <div>
        <iframe class="pdf-viewer" :src='"../../../static/pdf/web/viewer.html?file="+this.$globalConfig.qiniu.baseUrl+this.$route.query.key' width="100%" height="980px" style="over-flow:hidden;" scrolling="no">
            您的浏览器不支持PDF阅读
        </iframe>
    </div>
</template>

<script>
export default {

}
</script>

<style>
</style>
