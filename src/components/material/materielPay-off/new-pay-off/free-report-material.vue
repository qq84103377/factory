<template>
    <div class="free-report-material">
        <according-materiel-table :storeId="storeId" :materials="materielData" @deleteRow="deleteRow"  :isSampleMaterial="true" :noSampleMaterial="true" type="outside" ></according-materiel-table>
        <!--<div class="table-search-btns">-->
            <!--<el-button :loading="btnLoading" :class="{'table-search-active':status == 1}" @click="tab(1)">+ 按物料添加</el-button>-->
            <!--<el-button :loading="btnLoading" :class="{'table-search-active':status == 2}" @click="tab(2)">+ 按采购单添加</el-button>-->
        <!--</div>-->
        <!--<div  v-if="status == 1">-->
            <div class="new-return__search" style="overflow: hidden;margin-bottom: 10px;margin-top:8px;">
                <input type="text" v-model="searchMateriel" @input="archivesList"
                       placeholder="输入物料款号/物料名称/供应商款号搜索添加">
                <span class="table-search-span" @click="newMaterial">+ 新建物料</span>
            </div>
            <div class="search-material">
                <search-material-table :deleteRowData="deleteRowData" @searchData="searchDataOutSide" ref="searchMaterialTableRef" :searchTable="searchMaterialTableOutSide" :input="searchMateriel" type="outside"></search-material-table>
            </div>
        <!--</div>-->
        <!-- 新建物料侧窗 -->
    </div>

</template>

<script>
    import accordingMaterielTable from './according-materiel-table.vue'
    import searchMaterialTable from './search-material-table'
    import {archivesList} from '@/api';
    export default {
        name: "free-report-material",
        props: ['storeId'],
        components: {
            searchMaterialTable,
            accordingMaterielTable,
        },
        data(){
            return {
                isshow:false,
                materielData:[],
                deleteRowData:[],
                searchMaterialTableOutSide:[],
                searchMateriel:'',
            }
        },
        watch: {
            storeId(val) {
                this.handleData(val)
            }
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },

        },
        methods:{
            handleData(val) {
                for (let materialItem of this.materielData) {
                    for (let skuItem of materialItem.list) {
                        if(skuItem.stocks) {
                            for (let i = 0; i < skuItem.stocks.length; i++) {
                                if (val === skuItem.stocks[i].storehouseId && skuItem.id === skuItem.stocks[i].skuId) {
                                    skuItem.position = skuItem.stocks[i].storehouseLabel;
                                    skuItem.stock = skuItem.stocks[i].totalStock;
                                    skuItem.availableStock = skuItem.stocks[i].availableStock;
                                } else {
                                    skuItem.position = "-";
                                    skuItem.stock = "0";
                                    skuItem.availableStock = "0";
                                }
                            }
                        }else {
                            skuItem.position = "-";
                            skuItem.stock = "0";
                            skuItem.availableStock = "0";
                        }
                    }
                }
            },
            // 物料删除并取消勾选
            deleteRow(val,type) {
                if (type) { // 计划外
                    let _index = 0
                    this.searchMaterialTableOutSide.forEach((i,index) => {
                        if(val.id == i.id) {
                            _index = index
                        }
                    })
                    this.deleteRowData = [this.searchMaterialTableOutSide[_index]]
                } else {
                    let _index = 0
                    this.searchMaterialTable.forEach((i,index) => {
                        if(val.materialsSkuId == i.materialsSkuId) {
                            _index = index
                        }
                    })
                    this.deleteRowData = [this.searchMaterialTable[_index]]
                }
            },
            // 计划外的搜索物料
            archivesList() {
                let params = {
                    unitId:this.facId,
                    keyword:this.searchMateriel,
                    pageNum:1,
                    pageSize:20
                }
                archivesList(params).then(res => {
                    this.searchMaterialTableOutSide = res.data.commonMaterialsSkuList;
                    this.$nextTick(function () {
                        this.searchMaterialTableOutSide.forEach(item=>{
                            this.materielData.forEach($item=>{
                                $item.list.forEach (i => {
                                    if(i.id===item.id){
                                        this.$refs['searchMaterialTableRef'].$refs['multipleTable'].toggleRowSelection(item,true)
                                    }
                                })
                            })
                        })
                    })
                })
            },
            // 计划外-物料
            async searchDataOutSide(val,row){
                let index = val.findIndex(item => item == row)
                if(index>-1){
                    // 勾选
                    if(this.materielData.length == 0) {
                        this.materielData = [{list: []}]
                    }
                    this.materielData[0].list.push(row)
                    this.handleData(this.storeId)
                }else {
                    //取消勾选
                    this.materielData[0].list.forEach((item,itemIndex)=>{
                        if(item.id===row.id){
                            this.materielData[0].list.splice(itemIndex,1)
                        }
                    })
                }
                this.searchTable = this.materielData;
            },
            // 新建物料显示
            newMaterial() {
                this.$emit('addNewMaterial');
            },
            // 取消侧窗遮罩
            cancel() {
                this.isshow = false;
            },
            getDatalist(val){
                console.log(val);
                // this.form.supplier = val;
            },
        }
    }
</script>

<style scoped lang="scss">
    .new-return__search {
        border: 1px solid #E6EAF0;
        line-height: 32px;
        height: 32px;
        .table-search-span{
            float: right;
            padding:0 10px;
            background-color: #ff9c38;
            position: relative;
            top: -33px;
            right: 0px;
            cursor: pointer;
            color: #fff;
            font-size:12px;
        }
        input {
            width: 100%;
            box-sizing: border-box;
            padding: 0 10px
        }
    }

</style>