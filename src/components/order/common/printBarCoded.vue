<template>
    <div :id="targetId" style="display: none;padding-left: 10px;">
        <div v-for="$item in numbersPrint" :key="$item">
            <div v-for="item in dataArr.length?dataArr:[1]"  :key="item" style="padding-top: 4px;padding-left: 6px;">
                 <div v-for="cutGroupItem in cutGroup" :key="index">

                    <p style="font-size: 12px;"><span>{{item.styleNoName}}</span></p>
                    <p style="font-size: 10px;margin: 5px 0;">工单: {{item.orderNo}} </p>
                    <p style="font-size: 12px;display: flex;">
                        <span style="width: 100px;display: inline-block;flex: 1"> 床次:{{item.lathe}}</span>
                        <span style="display: inline-block;flex: 1"> 数量:{{item.num}}</span>
                    </p>
                    <p style="font-size: 12px;display: flex;margin: 5px 0;">
                        <span style="width: 100px;display: inline-block;flex: 1"> 颜色:{{item.colorName}}</span>
                        <span style="display: inline-block;flex: 1"> 尺码:{{item.sizeName}}</span>
                    </p>
                    <p style="font-size: 12px;" v-if="item.remark">备注:{{item.remark}}</p>
                    <p style="font-size: 12px;margin: 5px 0;" >裁片组:{{cutGroupItem.name?cutGroupItem.name:''}}</p>
                    <p style="font-size: 12px;">裁床日期:{{item.finishDate}}</p>
                    <div style="margin: 0px;margin-left: -10px;">
                        <barcode style="display:flex;justify-content:flex-start;margin: 0 10px" :font-size='26' :height='40' :margin="0" :color="'black'" :font-weight="'bold'" :value="item.barcode">
                        </barcode>
                    </div>
                    <p style="font-size: 12px;margin: 0;text-align: center;">{{item.latheSerialNo}} </p>
                </div>
            </div>

        </div>

    </div>
</template>
<script>
import VueBarcode from 'vue-barcode';
export default {
    props :['dataArr','targetId','numbers','cutGroup'],
    components: { 'barcode': VueBarcode },
    data(){
        return {
            // numbersPrint :[1]
        }
    },
    methods: {
        barHtml() {
            let a = document.querySelector("#barcode");
            let b = document.querySelector("#barcodeParent");
            b.appendChild(a);
            this.$emit('barHtml', b.innerHTML);
        },
    },
    computed:{
        numbersPrint(){
            let numArr = []
            for(let i =0;i<this.numbers;i++){
                numArr.push(1)
            }
            console.log(this.numbers);
            return this.numbers?numArr:[1]
        }
    },
    created(){
        // console.log(this.dataArr);
        // if(this.numbers){
        //     console.log(this.numbers);
        //     var numArr = []
        //     for(let i =0;i<this.numbers;i++){
        //         numArr.push(1)
        //     }
        //     this.numbersPrint = numArr
        // }

    }

}
</script>
<style>

</style>


