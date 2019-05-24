<template>
    <section class="stock-record" v-loading="loading">
        <record-filter @selectobj='filterParams'></record-filter>
        <page-wrap>
            <el-row
            class="total-bar"
            type="flex">
                <div class="total-bar__item total-bar__green">
                    <span class="total-bar__label">入库</span>
                    <p><strong>{{numData.inStorageSum}} 件</strong></p>
                </div>
                <div class="total-bar__item total-bar__yellow">
                    <span class="total-bar__label">出库</span>
                    <p><strong>{{numData.outStorageSum}} 件</strong></p>
                </div>
                <div class="total-bar__item total-bar__red">
                    <span class="total-bar__label">调整</span>
                    <p><strong><span v-if="numData.adjustSum!=0">+</span>{{numData.adjustSum}}/{{numData.adjustSubSum}} 件</strong></p>
                </div>
            </el-row>
            <el-row
            class="combine-bar"
            type="flex"
            justify="space-between"
            align="middle">
                <div class="tab">
                    <div class="tab-pane active"
                    v-for="(item, index) in tabOptions"
                    :key="index"
                    :class="{'active': activeIndex === index}"
                    @click="handleTabClick(index)">
                        <span>{{item}}</span>
                    </div>
                </div>
                <!--<div class="search-input">-->
                    <!--<el-input-->
                        <!--class="search-input"-->
                        <!--placeholder="输入货品款号搜索"-->
                        <!--icon="search"-->
                        <!--v-model="searchData"-->
                        <!--@change='handleIconClick'>-->
                    <!--</el-input>-->
                <!--</div>-->
            </el-row>
            <el-row class="record-list">
                <el-table
                        @row-click="viewItem"
                        class="no-expanded-cell-padding"
                    :data="inventoryData"
                    style="width: 100%">
                    <!--<el-table-column-->
                    <!--width="30"-->
                    <!--type="expand">-->
                        <!--<template slot-scope="scope">-->
                            <!--<div class="column-table">-->
                                <!--<el-table-->
                                <!--stripe-->
                                <!--class="is-fixed-header no-cell-padding is-column-cell-block"-->
                                <!--:data="scope.row.colors">-->
                                    <!--<el-table-column-->
                                    <!--align="center"-->
                                    <!--width="120"-->
                                    <!--fixed-->
                                    <!--label="规格">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<div class="column-cell-con">-->
                                                <!--<div class="standard">-->
                                                    <!--<div class="standard-left">-->
                                                        <!--<p class="standard-color">{{scope.row.colorName}}</p>-->
                                                    <!--</div>-->
                                                    <!--<div class="standard-right" v-if="scope.row.lengths && scope.row.lengths.length">-->
                                                        <!--<p class="standard-length"-->
                                                        <!--v-for="(lengthItem,index) in scope.row.lengths"-->
                                                        <!--:key="index">{{ lengthItem.standardValue }}</p>-->
                                                    <!--</div>-->
                                                <!--</div>-->
                                                <!--&lt;!&ndash; {{scope.row.colorName}} &ndash;&gt;-->
                                            <!--</div>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column-->
                                    <!--width="80"-->
                                    <!--align="center"-->
                                    <!--v-for="(size, index) in scope.row.sizes"-->
                                    <!--:key="index"-->
                                    <!--:label="'' + size.sizeValue">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<div class="column-cell-con">-->
                                                <!--<table-column-->
                                                    <!--v-if="scope.row.lengths && scope.row.lengths.length"-->
                                                    <!--v-for="(lengthItem, lengthIndex) in scope.row.lengths"-->
                                                    <!--:key="lengthIndex"-->
                                                    <!--:lengthItem="lengthItem"-->
                                                    <!--:scope="scope"-->
                                                    <!--:sizeItem="size"-->
                                                    <!--:skuVal="scope.row.skuValue"-->
                                                <!--&gt;</table-column>-->
                                                <!--<table-column-->
                                                    <!--v-if="scope.row.lengths && !scope.row.lengths.length"-->
                                                    <!--:scope="scope"-->
                                                    <!--:sizeItem="size"-->
                                                    <!--:skuVal="scope.row.skuValue"-->
                                                <!--&gt;</table-column>-->
                                                <!--&lt;!&ndash; <span>-->
                                                    <!--<span-->
                                                    <!--:class="{'grey': scope.row.skuValue[`${scope.row.styleId}/${scope.row.colorId}/${size.sizeId}/${size.standardId || ''}`].num == 0}"-->
                                                    <!--v-if="scope.row.skuValue[`${scope.row.styleId}/${scope.row.colorId}/${size.sizeId}/${size.standardId || ''}`]">-->
                                                        <!--{{ scope.row.skuValue[`${scope.row.styleId}/${scope.row.colorId}/${size.sizeId}/${size.standardId || ''}`].num }}-->
                                                    <!--</span>-->
                                                <!--</span> &ndash;&gt;-->
                                            <!--</div>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column></el-table-column>-->
                                <!--</el-table>-->
                            <!--</div>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                        label="货品款号"
                        min-width="140"
                        prop="id">
                        <template slot-scope="scope">
                            <div class="cell-con">
                                <img :src="scope.row.pictureUrl" v-errorLogo alt="">
                                <span>{{scope.row.styleNo}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="变动数量"
                        min-width="80"
                        prop="id">
                        <template slot-scope="scope">
                            <div class="cell-con">
                                <span>
                                    <i v-if="scope.row.chageType=='OUT_STORAGE'">-</i>
                                    <i v-if="scope.row.chageType=='IN_STORAGE' || scope.row.chageType=='ADJUST'">+</i>
                                    {{scope.row.num || 0}}</span>
                                <span v-if="scope.row.chageType=='ADJUST'">/{{scope.row.subtractNum}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="变动类型"
                        prop="id">
                        <template slot-scope="scope">
                            <div class="cell-con">
                                <p
                                :class="{
                                'yellow':scope.row.chageType=='OUT_STORAGE',
                                'green':scope.row.chageType == 'IN_STORAGE',
                                'red':scope.row.chageType == 'ADJUST'}">
                                    <span v-if="scope.row.inventoryType==2">出库</span>
                                    <span v-else-if="scope.row.inventoryType==1">入库</span>
                                    <span v-else-if="scope.row.inventoryType==3">调整</span>
                                </p>
                                <template v-if="scope.row.opType === 'HAND'">
                                    <p class="desc" v-if="scope.row.chageType=='OUT_STORAGE'">手动出库</p>
                                    <p class="desc" v-if="scope.row.chageType=='IN_STORAGE'">手动入库</p>
                                    <p class="desc" v-if="scope.row.chageType=='ADJUST'">手动调整</p>
                                </template>
                                <template v-if="scope.row.opType === 'FAC_MISSION_NODE_TAIL'">
                                    <p class="desc" v-if="scope.row.chageType=='OUT_STORAGE'">尾部出库</p>
                                    <p class="desc" v-if="scope.row.chageType=='IN_STORAGE'">尾部入库</p>
                                </template>
                                <template v-if="scope.row.opType === 'FAC_MISSION_NOED_MATERIAL'">
                                    <p class="desc" v-if="scope.row.chageType=='OUT_STORAGE'">送料节点出库</p>
                                    <p class="desc" v-if="scope.row.chageType=='IN_STORAGE'">送料节点入库</p>
                                </template>
                                <template v-if="scope.row.opType === 'FAC_MISSION_NODE_CHECK'">
                                    <p v-if="scope.row.inventoryType==1" class="desc">质检入库</p>
                                    <p v-if="scope.row.inventoryType==2" class="desc">质检出库</p>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作人"
                        prop="id">
                        <template slot-scope="scope">
                            <div class="cell-con">
                                <p>{{scope.row.userName}}</p>
                                <p class="desc">{{scope.row.unitName}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="备注"
                        width="260"
                        prop="id">
                        <template slot-scope="scope">
                            <div class="cell-con">
                                <p class="remark">{{scope.row.remark}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作时间"
                        width="200"
                        prop="id">
                        <template slot-scope="scope">
                            <div class="cell-con">
                                <p>{{scope.row.opDate}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <!--<el-table-column-->
                        <!--label="操作"-->
                        <!--width="80"-->
                    <!--&gt;-->
                        <!--<template slot-scope="scope" v-if="cancelShow(scope.row)">-->
                            <!--<div class="change-msg-cancel" @click="cancelRow(scope.row.id)">撤销</div>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                </el-table>
            </el-row>
            <el-row
                class="pagination"
                type="flex"
                justify="end">
                <el-pagination
                    :current-page.sync="currentPage"
                    :page-size="20"
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :total="numData.pageCount">
                </el-pagination>
            </el-row>
        </page-wrap>
        <!--撤销弹窗-->
        <el-dialog class="repertory_dialog repertory_dialog--dele" :visible.sync="cancelDialog" modal="false">
            <div class="body">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p style="color:#3b3b3b;font-size:16px;">是否确定撤销此库存变动记录？</p>
            </div>
            <div class="footer">
                <nf-button @click="handleCancel">取消</nf-button>
                <nf-button type="warning" @click="handleCommit" :loading="isloading">确定</nf-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import RecordFilter from './record-filter'
    import {queryInventoryItemDetailList} from '../../api/api'
    import {
        cancelChangeStock
    } from "@/api";
    import tableColumn from './table-column'
    export default {
        data() {
            return {
                activeIndex: 1,
                currentPage: 0,
                tabOptions: [
                    // '按操作合并',
                    '每次操作-每款货',
                ],
                columnData: [
                    {
                        colorName: '白色'
                    },
                    {
                        colorName: '黑色'
                    }
                ],
                loading: false,
                inventoryData:[],
                typeSelect:0,
                numData:{},
                searchData:'',
                filterData:{},
                cancelDialog: false,    //撤销弹窗
                cancelId: '',        //撤销记录id
                currentPage: 1      //当前页
            }
        },
        filters: {
            filterTime(val) {
                if(val!=undefined) {
                    let date = val.slice(0,10);
                    date.replace('-','.');
                    return date.replace(/-/g,'.');
                }else{
                    return val;
                }
            }
        },
        components: {
            RecordFilter,
            tableColumn
        },
        computed: {
            storehouseId() {
                return this.$route.query.storehouseId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            }
        },
        created() {
            this.searchData = this.$route.query.styleNo || '';
            this.queryInventoryItemDetailList();
        },
        methods: {
            handleType(type) {
                switch(type) {
                    case 'STOCK_OUT':
                        return 0
                    case 'STOCK_IN':
                        return 1
                    case 'STOCK_ADJUST':
                        return 2
                    case 'STOCK_DELIVERY':
                        return 3
                    case 'STOCK_SALE_RETURN':
                        return 4
                }
            },
            viewItem(row) {
                if(row.billStockId){
                    this.$router.push(`/stockDetail?id=${row.billStockId}&type=${this.handleType(row.operateType)}&storehouseId=${this.storehouseId}`)
                }
            },
            //是否显示撤销按钮
            cancelShow(row){
                if(row.opType === 'HAND' && (row.inventoryType === 1 || row.inventoryType === 2 || row.inventoryType === 3)){
                    return true
                }else{
                    return false
                }
            },
            //点击撤销
            cancelRow(id){
                this.cancelDialog = true;
                this.cancelId = id;
            },
            //取消撤销弹窗
            handleCancel(){
                this.cancelDialog = false;
            },
            //确认撤销库存记录
            handleCommit(){
                let params ={
                    id : this.cancelId      //库存变动记录Id
                };
                cancelChangeStock(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg);
                        this.handleCurrentChange(this.currentPage);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                    this.cancelDialog = false;
                });
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                if(this.filterData.changeType==undefined) {
                    this.queryInventoryItemDetailList('','ALL',this.searchData,'','','',[],'',val);
                }else{
                    // console.log(111);
                    let goodsFilter=[
                        { keyType: 2, valueType: this.filterData.typeArr.designerArr }, //设计师
                        { keyType: 3, valueType: this.filterData.typeArr.waveArr }, //波段
                        { keyType: 4, valueType: this.filterData.typeArr.kindArr }, //分类
                        { keyType: 5, valueType: this.filterData.typeArr.seasonArr }, //季节
                        { keyType: 6, valueType: this.filterData.typeArr.yearArr }, //年份
                        { keyType: 7, valueType: this.filterData.typeArr.tagArr }, //标签
                        { keyType: 8, valueType: this.filterData.typeArr.brandArr } //品牌
                        ];
                    let changeType;
                    this.filterData.changeType.length==0?changeType='ALL':changeType=this.filterData.changeType;
                    this.queryInventoryItemDetailList(this.filterData.unitId,changeType,this.searchData,this.filterData.opBy,this.filterData.opDateStart,this.filterData.opDateEnd,goodsFilter,'','',this.currentPage);
                }
            },
            filterParams(val) {
                this.filterData =val;
                // console.log(val,'val');
               // let goodsFilter=[
               //  { keyType: 2, valueType: val.typeArr.designerArr }, //设计师
               //  { keyType: 3, valueType: val.typeArr.waveArr }, //波段
               //  { keyType: 4, valueType: val.typeArr.kindArr }, //分类
               //  { keyType: 5, valueType: val.typeArr.seasonArr }, //季节
               //  { keyType: 6, valueType: val.typeArr.yearArr }, //年份
               //  { keyType: 7, valueType: val.typeArr.tagArr }, //标签
               //  { keyType: 8, valueType: val.typeArr.brandArr } //品牌
               //  ];
                let changeType;
                val.changeType.length==0?changeType='ALL':changeType=val.changeType;
                this.queryInventoryItemDetailList(val.unitId,changeType,'',val.opBy,val.opDateStart,val.opDateEnd,'','',this.currentPage);
            },
            handleIconClick(val) {
                this.currentPage = 1;
                // console.log(this.filterData.changeType);
                if(this.filterData.changeType==undefined) {
                    // console.log(222);
                    this.queryInventoryItemDetailList(this.filterData.unitId||'','ALL',val);
                }else{
                    // console.log(111);
                    // let goodsFilter=[
                    //     { keyType: 2, valueType: this.filterData.typeArr.designerArr }, //设计师
                    //     { keyType: 3, valueType: this.filterData.typeArr.waveArr }, //波段
                    //     { keyType: 4, valueType: this.filterData.typeArr.kindArr }, //分类
                    //     { keyType: 5, valueType: this.filterData.typeArr.seasonArr }, //季节
                    //     { keyType: 6, valueType: this.filterData.typeArr.yearArr }, //年份
                    //     { keyType: 7, valueType: this.filterData.typeArr.tagArr }, //标签
                    //     { keyType: 8, valueType: this.filterData.typeArr.brandArr } //品牌
                    //     ];
                    let changeType;
                    this.filterData.changeType.length==0?changeType='ALL':changeType=this.filterData.changeType;
                    this.queryInventoryItemDetailList(this.filterData.unitId,changeType,val,this.filterData.opBy,this.filterData.opDateStart,this.filterData.opDateEnd,'','',this.currentPage);
                }
            },
            handleTabClick(index) {
                this.activeIndex = index
            },
            //获取
            queryInventoryItemDetailList(unitId='',changeType='ALL',styleNo='',opBy='',opDateStart='',opDateEnd='',sortBy='',sortNo=0,pageNo=0){
                let params = {
                    "ids":this.filterData.ids,
                    "searchParam":this.filterData.searchParam,
                    "searchType":this.filterData.searchType,
                    "facId":JSON.parse(sessionStorage.getItem("last_login")).id,
                    "userId": this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    "storehouseId":this.$route.query.storehouseId,
                    "changeType":changeType,
                    "styleNo": this.searchData ,
                    "opBy":opBy,
                    "opDateStart":opDateStart,
                    "opDateEnd":opDateEnd,
                    "sortBy":sortBy,
                    "sortNo":sortNo,
                    "pageNo":pageNo,
                    'unitId':unitId,
                    // "attrIds": this.filterData.attrIds,
                    // "categorys": this.filterData.categorys,
                    // 'inventoryItemId':this.$route.query.inventoryItemId || '',
                    'inventoryItemId':'',
                }
                this.loading = true;
                // console.log(params);
                queryInventoryItemDetailList(params).then(
                    res =>{
                        // console.log(res, '列表');
                        this.numData = res.data;
                        res.data.inventoryItemDetailList = this.mapItemCommonStyleSkuList(res.data.inventoryItemDetailList);
                        this.inventoryData = res.data.inventoryItemDetailList;
                        this.loading = false;
                    }
                )
            },
            mapItemCommonStyleSkuList(inventoryItemDetailList = []) {
                return inventoryItemDetailList = inventoryItemDetailList.map(inventoryItem => {
                    const data = this.setTableData(inventoryItem.commonStyleSkuList, inventoryItem.inventoryItemDetailCyskuList);
                    inventoryItem.colors = data['colors'];
                    inventoryItem.sizes = data['sizes'];
                    return inventoryItem;
                });
            },
            setTableData(commonStyleSkuList = [], inventoryItemDetailCyskuList = []) {
                let colors = [],
                    sizes = [],
                    lengths = [],
                    skuValue = {},
                    skuList = [],
                    json = {};
                const lengthData = this.getLengths(commonStyleSkuList); // 用来半段是否显示‘无’内长
                const isHideLength = (lengthData.length === 1 && lengthData[0].value === '无');
                for (let item of commonStyleSkuList) {
                    const skuIdStr = `${item.styleId}/${item.colorId}/${item.sizeId}/${(!isHideLength && item.standardId) ? item.standardId : ''}`
                    skuValue[skuIdStr] = this.getSkuValue(item, {}, inventoryItemDetailCyskuList);
                    if (!json[item.colorId]) {
                        colors.push({
                            styleId: item.styleId,
                            colorId: item.colorId,
                            colorName: item.colorNoName || item.colorName,
                        });
                        json[item.colorId] = item.colorId;
                    }
                    if (item.standardId && !json[item.standardId]) {
                        lengths.push({
                            standardValue: item.standardValue || '无',
                            standardId: item.standardId,
                            id: item.styleId
                        });
                        json[item.standardId] = item.standardId;
                    }
                    if (!json[item.sizeId]) {
                        sizes.push({
                            ...item,
                            sizeNum: '',
                            sizeValue: item.sizeValue,
                            sizeId: item.sizeId
                        });
                        json[item.sizeId] = item.sizeId;
                    }
                }
                if (isHideLength) lengths = [];
                colors = colors.map(colorItem => {
                    colorItem.lengths = lengths;
                    colorItem.skuValue = skuValue;
                    return colorItem
                });
                return {
                    sizes,
                    skuValue,
                    colors
                }
            },
            getLengths(skuList) {
                let arr = [];
                for (let skuItem of skuList) {
                    const had = arr.some(item => item.id === skuItem.standardId);
                    !had && arr.push({ value: skuItem.standardValue || '无', id: skuItem.standardId});
                }
                return arr;
            },
            getSkuValue(item, skuValue = {}, inventoryItemDetailCyskuList) {
                skuValue = {
                    num: this.setSkuValue(inventoryItemDetailCyskuList, item.id),
                    skuId: item.id,
                    styleId: item.styleId,
                    colorName: item.colorName,
                    sizeValue: item.sizeValue,
                    standardValue: item.standardValue || ''
                };
                return skuValue
            },
            setSkuValue(inventoryItemDetailCyskuList = [], skuId) {
                const inventoryItem = inventoryItemDetailCyskuList.find(item => item.styleSkuId === skuId);
                if (inventoryItem) {
                    return inventoryItem.num
                }
                return 0;
            }
        }
    }
</script>

<style lang="scss" scoped>
.stock-record{
    $greenColor: #23c811;
    $yellowColor: #ffa914;
    $redColor: #fa4150;
    .green {
        color: $greenColor
    }
    .yellow {
        color:$yellowColor
    }
    .red {
        color: $redColor
    }
    .grey {
        color: #c4c6cc
    }
    .total-bar {
        padding-bottom: 24px;
        border-bottom: 1px solid #e0e6ed;
        &__item {
            width: 33.3333%;
            text-align: center;
            strong {
                font-weight: normal
            }
        }
        &__label {
            display: inline-block;
            margin-bottom: 12px;
            padding: 7px 22px;
            border-radius: 2px;
        }
        $colorClass: (green #e4f8e2 $greenColor) (yellow #fff4e2 $yellowColor) (red #fee8ea $redColor);
        @each $itemClass in $colorClass {
            $type: nth($itemClass, 1);
            $bgColor: nth($itemClass, 2);
            $color: nth($itemClass, 3);
            &__#{$type} {
                .total-bar__label {
                    background: $bgColor;
                }
                color: $color
             }
        }
        strong {
            font-size: 26px;
        }
    }
    .combine-bar {
        margin: 20px 0;
        .tab {
            display: flex;
            .tab-pane {
                box-sizing: border-box;
                width: 132px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                color: #a2abb8;
                cursor: pointer;
                border: solid 1px #a2abb8;
                border-left: 0;
                &:first-child {
                    border-left: solid 1px #a2abb8;
                    border-radius: 2px 0 0 2px
                }
                &:last-child {
                    border-radius: 0 2px 2px 0
                }
                &.active {
                    color: #ffffff;
                    background: #a2abb8;
                }
            }
        }
    }
    .record-list {
        .cell-con {
            padding: 18px 0;
            font-size: 16px;
            img {
                width: 40px;
                height: 40px;
                vertical-align: middle
            }
            .remark,
            .desc {
                font-size: 14px;
            }
            .remark {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .desc {
                color: #a2abb8;
            }
        }
        .column-table {
            margin-bottom: 1px
        }
    }
    .standard {
        display: flex;
        &-left {
            flex: 1;
            .standard-color {
                position: relative;
                top: 50%;
                transform: translateY(-50%);
            }
        }
        &-right {
            width: 50%;
            border-left: 1px solid rgb(223, 228, 236);
            .standard-length {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 38px;
                &:not(:last-child) {
                    border-bottom: 1px solid rgb(223, 228, 236)
                }
            }
        }
    }
    .pagination {
        margin-top: 25px;
    }
    .change-msg-cancel{
        text-decoration: underline;
        color: #808080;
        cursor: pointer;
        &:hover{
            color: #3B3B3B;
        }
    }
    .repertory_dialog {
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body {
            padding: 20px 20px 0 20px;
        }
        .title {
            width: 100%;
            height: 52px;
            text-align: center;
            line-height: 52px;
            font-size: 20px;
            color: #3b3b3b;
            border-bottom: 1px solid #e0e6ed;
        }
        .footer {
            padding: 0 32px 32px 36px;
            button {
                margin: 0 6px;
            }
        }
    }
    .repertory_dialog--dele {
        .el-dialog {
            width: 766px;
        }
        .body {
            text-align: center;
            P {
                margin: 32px 0;
                font-size: 14px;
                color: #3b3b3b;
            }
        }
        .footer {
            display: flex;
            justify-content: center;
            padding-top: 28px;
            border-top: 1px solid #e0e6ed;
        }
    }
}
</style>
<style lang="scss">
.stock-record{
    .el-dialog{
        width: auto;
    }
    .el-dialog__body{
        padding: 20px 20px 0 20px;
    }
}
</style>

