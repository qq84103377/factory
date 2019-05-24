<template>
  <div id="bom">
    <template>
        <el-table class="no-cell-padding" :data="tableData"  border style="width: 100%;overflow-y:scroll !important;">
            <el-table-column label="物料款号"align="center" width="100">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.id" filterable @visible-change="materialChange"  @change="materialsChange(scope.row.id,scope.$index)" placeholder="请选择">
                        <el-option
                        v-for="(item,materindex) in commonMaterialsList"
                        :key="item.id"
                        :label="item.materialsNo"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="kindsName" label="物料分类" align="center"  width="95">
                <template slot-scope="scope">
                    {{scope.row.kindsNo}}-{{scope.row.kindsName}}
                </template>
            </el-table-column>
            <el-table-column prop="materialsName" label="物料名称" align="center"  width="95">
            </el-table-column>
            <el-table-column label="颜色" align="center">
                <template slot-scope="scope">
                    <div class="sku-line" v-for="(itemSku,skuIndex) in scope.row.commonBomMaterialsSkuList" :key="skuIndex">
                        {{itemSku.colorValue}}-{{itemSku.colorName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="规格"  align="center">
                <template slot-scope="scope">
                    <div class="sku-line" v-for="(itemSku,skuIndex) in scope.row.commonBomMaterialsSkuList" :key="skuIndex">
                        {{itemSku.specificationsNo}}-{{itemSku.specificationsName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="用于货品颜色" align="left">
                <template slot-scope="scope">
                    <div style="padding:0;" class="sku-line" v-for="(itemSku,skuIndex) in scope.row.commonBomMaterialsSkuList" :key="skuIndex">
                        <el-select multiple @change="colorM(scope.$index,skuIndex,itemSku.styleColorIdList)" v-model="itemSku.styleColorIdList" :placeholder="请选择">
                            <el-option v-for="(items,indexs) in color" :key="indexs" :label="formatLabel(items.value?items.value:'',items.name)" :value="items.id">
                            </el-option>
                        </el-select>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="用于货品尺码" align="left">
                <template slot-scope="scope">
                    <div style="padding:0;" class="sku-line" v-for="(itemSku,skuIndex) in scope.row.commonBomMaterialsSkuList" :key="skuIndex">
                        <el-select multiple @change='sizeM(scope.$index,skuIndex,itemSku.styleSizeIdList)' v-model="itemSku.styleSizeIdList" :placeholder="请选择">
                            <el-option v-for="(items,indexs) in size" :key="indexs" :label="items.name" :value="items.id" >
                            </el-option>
                        </el-select>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="用于货品内长" align="left"  v-if="lengthShow">
                <template slot-scope="scope">
                    <div style="padding:0;" class="sku-line" v-for="(itemSku,skuIndex) in scope.row.commonBomMaterialsSkuList" :key="skuIndex">
                        <el-select multiple @change='standardM(scope.$index,skuIndex,itemSku.styleStandardIdList)' v-model="itemSku.styleStandardIdList" :placeholder="请选择">
                            <el-option v-for="(items,indexs) in standard" :key="indexs" :label="items.name" :value="items.id" >
                            </el-option>
                        </el-select>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="kindsName" label="单件用量" width="95">
                <template slot-scope="scope">
                    <div  class="sku-line" v-for="(itemSku,skuIndex) in scope.row.commonBomMaterialsSkuList" :key="skuIndex">
                        <span v-if="itemSku.singleDosage">
                            <input style="text-align:center;font-size:14px;" type="number" v-model.number="itemSku.singleDosage"/>
                        </span>
                        <span v-if="!itemSku.singleDosage">
                            <input style="text-align:center;font-size:14px;" type="number" v-model.number="itemSku.singleDosage" placeholder="请填写"/>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="kindsName" label="默认损耗率" width="95">
                <template slot-scope="scope">
                    <div class="sku-line" v-for="(itemSku,skuIndex) in scope.row.commonBomMaterialsSkuList" :key="skuIndex">
                        <span class="span" v-if="itemSku.lossRate">
                            <input style="text-align:center;font-size:14px;width:50px;" type="number" v-model.number="itemSku.lossRate"/>
                            <span>%</span>
                        </span>
                        <span v-if="!itemSku.lossRate">
                            <input style="text-align:center;font-size:14px;width:50px;" type="number" v-model.number="itemSku.lossRate" placeholder="0"/>
                            <span>%</span>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="kindsName" label="单位" width="80"  align="left">
                <template slot-scope="scope">
                    <div class="sku-line" v-for="(itemSku,skuIndex) in scope.row.commonBomMaterialsSkuList" :key="skuIndex">
                        {{itemSku.stockUnitName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="kindsName" label="操作" width="80"  align="left">
                <template slot-scope="scope">
                    <div class="sku-line del" @click="delSku(scope.$index,skuIndex)" v-for="(itemSku,skuIndex) in scope.row.commonBomMaterialsSkuList" :key="skuIndex">
                        删除
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </template>
    <div @click="addBom" class="add-bom">
        + 添加
    </div>
  </div>
</template>

<script>
import { materialOrgList,getFacCommonSettings,searchSkuType } from "../../../api/api";
export default {
  props: {
    bomData: Array,
    lengthShow:Boolean,
    editBom:Boolean,
    styleId:String
  },
  data() {
    return {
      commonMaterialsList: [],
      facInfo:{},
      commonMaterIndex:'',
      color:[],
      size:[],
      standard:[],
      lossRate:100,
    };
  },
  computed: {
    tableData() {

        return this.bomData;
    }
  },
  watch:{
        tableData:  {
            handler(val, oldVal) {
                this.$emit('bomData', val);

            },
            deep: true
        },
  },
  methods: {
        async materialChange(val) {
            console.warn(val);
            if(val) {
                for(let j=0;j<this.commonMaterialsList.length;j++) {
                    for(let i=0;i<this.tableData.length;i++) {
                        if(this.tableData[i].id==this.commonMaterialsList[j].id) {
                            this.commonMaterialsList.splice(j,1);
                        }
                    }
                }
            }
        },
        colorM(index,skuindex,item) {
            let _this = this;
            if(item.length>= 2) {
                if(item[0] == 'ALL') {
                    this.tableData[index].commonBomMaterialsSkuList[skuindex].styleColorIdList.shift();
                }else if(item[item.length-1]=='ALL') {
                    this.tableData[index].commonBomMaterialsSkuList[skuindex].styleColorIdList=['ALL'];
                }
            }
        },
        sizeM(index,skuindex,item) {
          let _this = this;
          if(item.length>= 2) {
              if(item[0] == 'ALL') {
                  this.tableData[index].commonBomMaterialsSkuList[skuindex].styleSizeIdList.shift();
              }else if(item[item.length-1]=='ALL') {
                  this.tableData[index].commonBomMaterialsSkuList[skuindex].styleSizeIdList=['ALL'];
              }
          }
        },
        standardM(index,skuindex,item) {
          let _this = this;
          if(item.length>= 2) {
              if(item[0] == 'ALL') {
                  this.tableData[index].commonBomMaterialsSkuList[skuindex].styleStandardIdList.shift();
              }else if(item[item.length-1]=='ALL') {
                  this.tableData[index].commonBomMaterialsSkuList[skuindex].styleStandardIdList=['ALL'];
              }
          }
        },
        addBom() {
            this.tableData.push({
                id:'',
                ids:0,
                kindsName:'',
                kindsNo:'',
                materialsName:'',
                materialsNo:'',
                commonBomMaterialsSkuList:[
                    {
                        styleStandardIdList:[],
                        styleSizeIdList:[],
                        styleColorIdList:[]
                    }
                ]
            });
        },
        chackNumType(val){
           let reg = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/;
           if(reg.test(val) == true){
               return true;
           }else{
               return false;
           }
        },
        delSku(index,skuIndex) {
            if(this.tableData[index].commonBomMaterialsSkuList.length>1) {
                this.tableData[index].commonBomMaterialsSkuList.splice(skuIndex,1);
            }else {
                this.tableData.splice(index,1);
                this.materialCommonList();
            }
        },
        materialCommonList() {
            let params = {
                userId: this.$store.state.userInfo.id,
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id
            };
            materialOrgList(params).then(res => {
                this.commonMaterialsList = res.data.commonMaterialsList;
            });
        },
        getFacCommonSettings() {
            let params ={
                userId:this.$store.state.userInfo.id,
                styleId:this.styleId,
            };
            searchSkuType(params).then(
                res => {
                    this.color = res.data.commonSkuAttrColorList;
                    this.size = res.data.commonSkuAttrSizeList;
                    this.standard = res.data.commonSkuAttrStandardList;
                    this.color.unshift({name:'全部颜色',id:'ALL'});
                    this.size.unshift({name:'全部尺码',id:'ALL'});
                    this.standard.unshift({name:'全部内长',id:'ALL'});
                }
            )
        },
        materialsChange(id,index) {
            this.materialCommonList();
                this.commonMaterIndex = '';
                for(let i = 0;i<this.commonMaterialsList.length;i++) {
                    if(this.commonMaterialsList[i].id ==id) {
                        this.commonMaterIndex = i;
                    }
                }
                for(let j =0;j<this.commonMaterialsList[this.commonMaterIndex].commonMaterialsSkuList.length;j++) {
                    this.$set(this.commonMaterialsList[this.commonMaterIndex].commonMaterialsSkuList[j], 'styleColorIdList', []);
                    this.$set(this.commonMaterialsList[this.commonMaterIndex].commonMaterialsSkuList[j], 'styleSizeIdList', []);
                    this.$set(this.commonMaterialsList[this.commonMaterIndex].commonMaterialsSkuList[j], 'styleStandardIdList', []);
                    this.$set(this.commonMaterialsList[this.commonMaterIndex].commonMaterialsSkuList[j], 'stockUnitName',
                    this.commonMaterialsList[this.commonMaterIndex].commonMaterialsSkuList[j].stockUnitName);
                    this.$set(this.commonMaterialsList[this.commonMaterIndex].commonMaterialsSkuList[j], 'lossRate', '');
                }
                for(let i = 0;i<this.tableData.length;i++) {
                    if(this.tableData[i].ids !== 1) {
                        this.$nextTick(()=> {
                            this.tableData[index].id = this.commonMaterialsList[this.commonMaterIndex].id;
                            this.tableData[index].kindsName = this.commonMaterialsList[this.commonMaterIndex].kindsName;
                            this.tableData[index].materialsName = this.commonMaterialsList[this.commonMaterIndex].name;
                            this.tableData[index].kindsNo = this.commonMaterialsList[this.commonMaterIndex].kindsNo;
                            this.tableData[index].materialsNo = this.commonMaterialsList[this.commonMaterIndex].materialsNo;
                            this.tableData[index].commonBomMaterialsSkuList = this.commonMaterialsList[this.commonMaterIndex].commonMaterialsSkuList;
                        })
                    }else {
                        //只有在不等于的时候才会触发数据变化，也就是ID不同触发，而id则是根据ids不同来判断的
                        if(id!==this.tableData[i].firstId) {
                            this.$nextTick(()=> {
                                this.tableData[index].id = this.commonMaterialsList[this.commonMaterIndex].id;
                                this.tableData[index].ids = 0;
                                this.tableData[index].kindsName = this.commonMaterialsList[this.commonMaterIndex].kindsName;
                                this.tableData[index].materialsName = this.commonMaterialsList[this.commonMaterIndex].name;
                                this.tableData[index].kindsNo = this.commonMaterialsList[this.commonMaterIndex].kindsNo;
                                this.tableData[index].materialsNo = this.commonMaterialsList[this.commonMaterIndex].materialsNo;
                                this.tableData[index].commonBomMaterialsSkuList = this.commonMaterialsList[this.commonMaterIndex].commonMaterialsSkuList;
                            })
                        }
                    }
                }
        },
      formatLabel(start,end){
          if(start){
              if(!end){
                  return start
              } else {
                  return start +  '-' +end
              }
          } else {
              return end
          }
      }
    },
    created() {
        this.materialCommonList();
        this.getFacCommonSettings();
    },
    updated() {
        // this.$emit('bomData', this.tableData);
    }
};
</script>

<style lang="scss" scoped>
.cell__row {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    word-break: break-all;
    &:not(:last-child) {
        border-bottom: 1px solid #E6EAF0
    }
}
.cell__input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    text-indent: 0;
    padding: 0 10px;
    font-size: 14px;
    border:none;
    &:focus {
        border: 1px solid #FFA914
    }
}
.sku-line {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding:8px 8px;
    border-bottom:1px solid #e6e8eb;
    height: 100%;
    &:last-child{
        border:none;
    }
}
.span {
    display:inline-flex;
    justify-content: center;
    color: #000;
}
.del {
    color:#fa4150;
    cursor: pointer;
}
.gray {
    color:#c4c6cc;
}
.add-bom {
        border: 1px solid #e6e8eb;
        margin-top:-1px;
        padding:12px 8px;
        cursor: pointer;
        color: #ffa914;
}
</style>
<style lang="scss">
#bom .el-table td {
  border-right: 1px solid #e6e8eb;
  border-bottom: 1px solid #e6e8eb;
  background-color: #fff;
  padding: 0 !important;
  box-sizing:border-box;
}

#bom .el-table td .cell {
  line-height: 18px;
  background-color: #fff;
  padding: 0;
  font-weight: 100px;
}
#bom .el-table tbody td {
    padding: 0;
}
#bom .el-table td,
.el-table th.is-leaf {
    padding: 0;
}
#bom .el-input__inner {
  border: none;
    &::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
        color: #c4c6cc;
    }
}
#bom .el-select {
    display: flex;
    flex: 1;
    .el-select__tags {
        width: 100%;
        justify-content: flex-start;
    }
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: #c4c6cc;
}
input:-moz-placeholder, textarea:-moz-placeholder {
    color: #c4c6cc;
}
input::-moz-placeholder, textarea::-moz-placeholder {
    color: #c4c6cc;
}
input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    color: #c4c6cc;
}
</style>

