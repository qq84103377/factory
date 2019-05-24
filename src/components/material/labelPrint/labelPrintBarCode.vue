<template>
    <div id="purchase" style="display:none;padding-left: 10px;">
        <div v-for="$item in numbersPrint" :key="$item">
            <div v-for="el in dataArr"  :key="el">
                <div v-for="(item,index) in el.skus" :key="index" style="padding-top: 10px;padding-left: 6px;">
                    <div style="font-size: 12px; display: flex;min-height: 16px;line-height:16px;">
                        <span style="width: 100px;display: inline-block;flex: 1">{{item.supplierName}}</span>
                    </div>
                    <div style="font-size: 10px;margin: 5px 0;min-height: 16px; line-height:16px" ><span v-if="curType == 'materialInfo'">{{item.supplierPhone}}</span> </div>
                    <div style="font-size: 12px;display: flex; min-height: 16px;line-height:16px" >
                        <!-- 【规格-物料名称-供应商色号】 改为【供应商款号-物料名称-供应商色号】-->
                        <span style="width: 100px;display: inline-block;flex: 1" v-if="curType == 'materialInfo'"> {{item.supplierStyleNo}} {{item.materialName}} {{item.supplierColorNo}}</span>
                        <!-- <span style="display: inline-block;flex: 1"> 数量:{{item.styleNoName}}</span> -->
                        <span v-if="curType == 'purchase'" style="display: inline-block;flex: 1">{{el.purchaserName}}</span>
                    </div>
                    <div style="font-size: 10px;margin: 5px 0; min-height: 16px;line-height:16px" ><span v-if="curType == 'materialInfo'">{{el.purchaserName}}</span> </div>
                    <div style="margin: 0px;margin-left: -10px;">
                        <div v-if="/.*[\u4e00-\u9fa5]+.*$/.test(item.kindNo)" style="margin-top:50px;padding-left:6px;font-size:23px;width:202px;text-align:center;">
                            {{item.kindNo}}
                        </div>
                        <barcode style="display:flex;justify-content:flex-start;margin: 0 10px" :font-size='26' :height='40' :margin="0" :color="'black'" :font-weight="'bold'" :value="curType == 'purchase'?orderNo:item.kindNo" v-else>
                        </barcode>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import VueBarcode from 'vue-barcode';
export default {
    props :['dataArr','type','orderNo'],
    /*
    dataArr: 数据
    type: 打印类型
    orderNo: 到料单单号
    * */
    components: { 'barcode': VueBarcode },
    data(){
        return {
            numbersPrint :[1]
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
            var numArr = []
            for(let i =0;i<this.numbers;i++){
                numArr.push(1)
            }
            console.log(this.numbers);
            return this.numbers?numArr:[1]
        },
        curType() {
            return this.type
        }
    },
    created(){
        console.log("页面数据:",this.dataArr);
        
    }

}
</script>
<style>

</style>


