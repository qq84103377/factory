<template>
    <div>
        <print-template-list title="打印模板启用" :isPrinTemplateBoot="true"></print-template-list>
    </div>
</template>
<script>
import printTemplateList from '../print/printTemplateList'
export default {
    components:{
        printTemplateList
    }
}
</script>

