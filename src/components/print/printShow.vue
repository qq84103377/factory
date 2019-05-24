<template>
    <div id="show-print" v-loading="loading">
        <nf-button class="print-btn" type="warning" @click="print">打印</nf-button>
        <div id="htmlPrint" v-html='html'></div>
        <div id="parent">
        </div>
        <!--条形码-->
        <bar-coded v-if="dataObj.barcodeValue" class="hide" @barHtml="barHtml" :bar="dataObj.barcodeValue"></bar-coded>
        <!--货品规格-->
        <goods-standard v-if="dataObj.goodsStandardValue" class="hide" @goodsStandardHtml="goodsStandardHtmlMth"
                        :data="dataObj.goodsStandardValue"></goods-standard>
        <!--货品首图-->
        <remark-pic v-if="dataObj.remarkPicValue" class="hide" @remarkPicHtml="remarkPicHtmlMth"
                    :data="dataObj.remarkPicValue"></remark-pic>
        <!--货品属性-->
        <goods-attribute v-if="dataObj.goodsAttributeValue" class="hide" @goodsAttributeHtml="goodsAttributeHtmlMth"
                         :data="dataObj.goodsAttributeValue"></goods-attribute>
        <!--工序详情-->
        <process-detail v-if="dataObj.processDetailValue" class="hide" @processDetailHtml="processDetailHtmlMth"
                        :data="dataObj.processDetailValue"></process-detail>
        <!--货品明细-->
        <goods-sku v-if="dataObj.goodsSkuValue" class="hide" @goodsSkuHtml="goodsSkuHtmlMth"
                   :data="dataObj.goodsSkuValue"></goods-sku>
        <!--工单bom表-->
        <order-bom v-if="dataObj.repairBom" :data="dataObj.repairBom" class="hide"
                   @orderBomHtml="orderBomHtml"></order-bom>
    </div>
</template>
<script>
    import {
        templateAddOrUpdate,
        templatePrinttig,
        billPrint,
        getPrintCount,
        getMaterialPrint,
        getPrintSj,
    } from '../../api/api';
    import VueBarcode from 'vue-barcode';
    import barCoded from './childForPrint/bar-coded';
    import goodsStandard from './childForPrint/goods-standard';
    import remarkPic from './childForPrint/remarkPicList';
    import goodsAttribute from './childForPrint/goods-attribute';
    import processDetail from './childForPrint/processDetail';
    import goodsSku from './childForPrint/goodsSku';
    import orderBom from './childForPrint/orderBom';

    export default {
        data() {
            return {
                html: '',
                templateData: [],
                praent: '',
                codeHtml: '',
                dataObj: {
                    barcodeValue: '', // 条形码
                    goodsStandardValue: {}, // 货品规格
                    remarkPicValue: {}, // 货品首图
                    goodsAttributeValue: {}, // 货品属性
                    processDetailValue: '', // 工序详情
                    goodsSkuValue: '', // 货品明细
                    repairBom: '',//工单BOM表数据
                },
                loading: false
            };
        },
        components: {
            barcode: VueBarcode,
            barCoded: barCoded,
            goodsStandard: goodsStandard,
            remarkPic: remarkPic,
            goodsAttribute: goodsAttribute,
            processDetail: processDetail,
            goodsSku: goodsSku,
            orderBom: orderBom,
        },
        computed: {
            getHtml() {
                return this.html;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            printType() {
                return this.$route.query.printType
            },
            billType() {
                return this.$route.query.billType
            }
        },
        watch: {
            html(val) {
                this.html = val;
            }
        },
        methods: {
            //获取死数据
            templateAddOrUpdate() {
                let params = {
                    token: "",
                    userId: this.userId,
                    tempId: this.$route.query.tempId,
                    typeId: this.$route.query.showId,
                    keyword: ""
                };
                this.loading = true
                templateAddOrUpdate(params).then(res => {
                    this.loading = false
                    this.html = JSON.parse(localStorage.getItem("printHtml"));
                    this.templateData = res.data.data.wildcards;
                    for (let i = 0; i < this.templateData.length; i++) {
                        if (this.html.includes(this.templateData[i].wildcard)) {
                            if (this.templateData[i].wildcard == '【工单条码】') {
                                this.dataObj.barcodeValue = this.templateData[i].example;
                            }
                            if (this.templateData[i].wildcard == '【货品规格】') {
                                this.dataObj.goodsStandardValue = this.templateData[i].specialdata;
                            }
                            if (this.templateData[i].wildcard == '【货品首图】') {
                                this.dataObj.remarkPicValue = this.templateData[i].specialdata;
                            }
                            if (this.templateData[i].wildcard == '【货品属性】') {
                                this.dataObj.goodsAttributeValue = this.templateData[i].specialdata;
                            }
                            if (this.templateData[i].wildcard == '【工序详情】') {
                                this.dataObj.processDetailValue = this.templateData[i].specialdata;
                            }
                            if (this.templateData[i].wildcard == '【货品明细】') {
                                this.dataObj.goodsSkuValue = this.templateData[i].specialdata;
                            }
                            if (this.templateData[i].wildcard == '【工单BOM表】') {
                                this.dataObj.repairBom = this.templateData[i].specialdata;
                            }
                            // 处理非复杂数据
                            if (this.templateData[i].type != 1) {
                                this.html = this.html.replace(new RegExp(this.templateData[i].wildcard, 'g'), this.templateData[i].example);
                            }
                        }
                    }
                });
            },
            /**@augments Alan
             * @description 选择模板打印
             */
            printSelect(item1, item) {
                let params = {
                    token: '',
                    tempId: this.$route.query.tempId,
                    missionId: this.$route.query.missionId,
                    userId: this.userId
                };
                this.loading = true
                templatePrinttig(params).then(
                    res => {
                        this.loading = false
                        console.log(res, '真的模板');
                        this.html = res.data.templateContent;
                        this.templateData = res.data.wildcards;
                        // console.log(this.templateData);
                        for (let i = 0; i < this.templateData.length; i++) {
                            if (this.html.includes(this.templateData[i].wildcard)) {
                                if (this.templateData[i].wildcard == '【工单条码】') {
                                    this.dataObj.barcodeValue = this.templateData[i].example;
                                }
                                if (this.templateData[i].wildcard == '【货品规格】') {
                                    this.dataObj.goodsStandardValue = this.templateData[i].specialdata;
                                }
                                if (this.templateData[i].wildcard == '【货品首图】') {
                                    this.dataObj.remarkPicValue = this.templateData[i].specialdata;
                                    console.log(this.dataObj.remarkPicValue, 99999);
                                }
                                if (this.templateData[i].wildcard == '【货品属性】') {
                                    this.dataObj.goodsAttributeValue = this.templateData[i].specialdata;
                                }
                                if (this.templateData[i].wildcard == '【工序详情】') {
                                    this.dataObj.processDetailValue = this.templateData[i].specialdata;
                                }
                                if (this.templateData[i].wildcard == '【货品明细】') {
                                    this.dataObj.goodsSkuValue = this.templateData[i].specialdata;
                                }

                                if (this.templateData[i].wildcard == '【工单BOM表】') {
                                    this.dataObj.repairBom = this.templateData[i].specialdata;
                                }
                                // 处理非复杂数据
                                if (this.templateData[i].type != 1) {
                                    this.html = this.html.replace(new RegExp(this.templateData[i].wildcard, 'g'), this.templateData[i].example);
                                }
                            }
                        }
                    }
                )
            },
            // 条码赋值
            barHtml(val) {
                for (let i = 0; i < this.templateData.length; i++) {
                    if (this.html.includes(this.templateData[i].wildcard)) {
                        if (this.templateData[i].wildcard == '【工单条码】') {
                            this.html = this.html.replace(new RegExp(this.templateData[i].wildcard, 'g'), val);
                        }
                    }
                }
            },
            // 替换货品规格数据
            goodsStandardHtmlMth(val) {
                for (let i = 0; i < this.templateData.length; i++) {
                    if (this.html.includes(this.templateData[i].wildcard)) {
                        if (this.templateData[i].wildcard == '【货品规格】') {
                            this.html = this.html.replace(new RegExp(this.templateData[i].wildcard, 'g'), val);
                        }
                    }
                }
            },
            // 替换备注图片数据
            remarkPicHtmlMth(val) {
                for (let i = 0; i < this.templateData.length; i++) {
                    if (this.html.includes(this.templateData[i].wildcard)) {
                        if (this.templateData[i].wildcard == '【货品首图】') {
                            this.html = this.html.replace(new RegExp(this.templateData[i].wildcard, 'g'), val);
                        }
                    }
                }
            },
            // 替换货品属性数据
            goodsAttributeHtmlMth(val) {
                for (let i = 0; i < this.templateData.length; i++) {
                    if (this.html.includes(this.templateData[i].wildcard)) {
                        if (this.templateData[i].wildcard == '【货品属性】') {
                            this.html = this.html.replace(new RegExp(this.templateData[i].wildcard, 'g'), val);
                        }
                    }
                }
            },
            // 替换工序详情数据
            processDetailHtmlMth(val) {
                for (let i = 0; i < this.templateData.length; i++) {
                    if (this.html.includes(this.templateData[i].wildcard)) {
                        if (this.templateData[i].wildcard == '【工序详情】') {
                            this.html = this.html.replace(new RegExp(this.templateData[i].wildcard, 'g'), val);
                        }
                    }
                }
            },
            // 替换工单BOM表
            orderBomHtml(val) {
                for (let i = 0; i < this.templateData.length; i++) {
                    if (this.html.includes(this.templateData[i].wildcard)) {
                        if (this.templateData[i].wildcard == '【工单BOM表】') {
                            this.html = this.html.replace(new RegExp(this.templateData[i].wildcard, 'g'), val);
                        }
                    }
                }
            },
            goodsSkuHtmlMth(val) {
                for (let i = 0; i < this.templateData.length; i++) {
                    if (this.html.includes(this.templateData[i].wildcard)) {
                        if (this.templateData[i].wildcard == '【货品明细】') {
                            this.html = this.html.replace(new RegExp(this.templateData[i].wildcard, 'g'), val);
                        }
                    }
                }
            },
            print() {
                // 单据打印获取打印次数
                if (this.billType) {
                    let params = {
                        billType: this.billType,
                        // businessId: this.$route.query.businessId
                    }
                    if (this.billType == 'designStyle') {
                        params.businessIds = this.$route.query.businessId.split(',')
                    } else {
                        params.businessId = this.$route.query.businessId
                    }
                    getPrintCount(params).then(res => {
                        console.log(res.data)
                    })
                }else
                // 库存单据打印次数
                if(this.$route.query.businessId){
                    let params ={
                        'businessId':this.$route.query.businessId,
                        'billType':this.billType
                    }
                    getPrintCount(params).then(res => {
                        if (res.data.code !=0) {
                            this.$message({
                                showClose: true,
                                message: '出错了',
                                type: 'error'
                            });
                        }
                    });
                }
                window.print();
            },
            // 单据打印
            getBillPrint() {
                // /v1/api/print?templateId=模板ID&businessId=单据ID&userId=当前登录用户ID&unitId=当前组织ID
                let query = this.$route.query
                console.log(query, 'query')
                let params = {
                    templateId: query.templateId,
                    userId: this.userId,
                    unitId: this.unitId
                }
                // 设计单设计批量打印，所以传参用businessIds
                if (this.billType == 'designStyle') {
                    params.businessIds = query.businessId.split(',')
                } else {
                    params.businessId = query.businessId
                }
                if(this.billType == 'order'&&query.special=='true') {
                    params.special = true
                }
                this.loading = true
                billPrint(params).then(res => {
                    this.loading = false
                    console.log(res.data)
                    this.html = res.data.data
                })
            },
            // 样料到料单打印
            getMaterialPrint() {
                let params = {
                    printType: this.$route.query.billType,
                    businessId: this.$route.query.businessId,
                    userId: this.userId,
                    unitId: this.unitId
                }
                this.loading = true
                getMaterialPrint(params).then(res => {
                    this.loading = false
                    this.html = res.data.data
                })
            },
            // 样料到料单送检打印
            getInspectionPrint() {
                let ids = JSON.parse(window.localStorage.getItem('actionMaterialArriveIds'))
                let params = {
                    actionMaterialArriveIds: ids,
                    userId: this.userId
                }
                this.loading = true
                getPrintSj(params).then(res => {
                    this.loading = false
                    this.html = res.data.data
                })
            },

        },
        mounted() {
            // 前端拼接html(工单打印、工单预览)
            // 工单打印 printType=missionPrint
            if (this.printType === 'missionPrint') {
                this.printSelect();
            }
            // 工单预览  printType=missionPreview
            if (this.printType === 'missionPreview') {
                this.templateAddOrUpdate();
            }
            // 后端拼接html(采购单、送料单、到料单、退料单的打印和预览)
            // 采购单、送料单、到料单、退料单、设计单的打印 printType=preview
            if (this.printType === 'preview') {
                this.html = JSON.parse(localStorage.getItem("printHtml"));
            }
            // 采购单、送料单、到料单、退料单、设计单的打印 printType=print
            if (this.printType === 'print') {
                this.getBillPrint()
            }
            // 到料单打印
            if (this.printType === 'materialPrint') {
                this.getMaterialPrint()
            }
            // 样料到料单送检打印
            if (this.printType === 'inspection') {
                this.getInspectionPrint()
            }
        },
        created() {
        }
    };
</script>
<style lang="scss" scoped>
    /* pt等于px乘以四分之三,以下打印部分采用SimHei以及字体的单位采用pt，再加上css3的抗锯齿的属性smoothing，才能很好的打印出来不会造成字体的问题 */
    #show-print {
        margin: 40px auto;
        width: auto;
        /*height: 100%;*/
        //加了这个，打印的时候会多出一页空白页
        padding: 0 40px;
        #htmlPrint {
            width: 100%;
        }
        .print-btn {
            display: block;
            margin: 0 auto;
        }
    }

    .hide {
        display: none;
    }
</style>
<style lang="scss">
    .vue-barcode-element {
        width: 400px;
    }

    @media print {
        html {
            height: 100%;
            width: 100%;
        }
        #app {
            overflow: visible;
        }
        #show-print {
            margin: 40px auto;
            width: auto;
            padding: 0 40px;
            #htmlPrint {
                width: 100%;
            }
            .print-btn {
                display: none !important;
            }
        }
    }

    #show-print {
        table {
            width: 100%;
            border: 1px solid #000;
            td {
                border: 1px solid #000;
            }
            tr {
                border: 1px solid #000;
            }
        }
    }
</style>
