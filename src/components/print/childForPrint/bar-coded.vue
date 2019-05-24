<template>
    <div>
        <barcode id="barcode" style="display:flex;justify-content:flex-start;" :font-size='16' :height='60' v-bind:value="bar">
        </barcode>
        <div id="barcodeParent"></div>
    </div>
</template>
<script>
import VueBarcode from 'vue-barcode';
export default {
    props :{
        bar: {
            type:String||Number,
        }
    },
    components: { 'barcode': VueBarcode },             
    methods: {
        barHtml() {
            let a = document.querySelector("#barcode");
            let b = document.querySelector("#barcodeParent");
            b.appendChild(a);
            this.$emit('barHtml', b.innerHTML);
        },
    },
    watch: {
        bar(val) {
            this.barHtml();
        }
    }, 
    mounted() {
        this.barHtml();   
    }
}
</script>
<style>

</style>


