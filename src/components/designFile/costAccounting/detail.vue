<template>
    <div class="cost-detail">
        <page-title v-if="$route.path=='/designFile/costDetail'" :title="info.sampleNo">
            <nf-button style="width: 72px;font-size: 12px;padding: 7px 0;" class="btn" @click="$router.back()">
                返回上级
            </nf-button>
        </page-title>
        <base-box v-loading="loading">
            <content-wrap title="总信息">
                <!--<div>核算单名称:12397123</div>-->
                <div>样衣号:{{info.sampleNo}}</div>
                <el-table
                        border
                        :data="info.baseTable"
                        style="margin-top: 8px;display: inline-block;width: auto;">
                    <el-table-column
                            align="center"
                            prop="materialsCountPrice"
                            label="物料总成本(元/件)"
                            width="240">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="nodesCountPrice"
                            label="加工总成本(元/件)"
                            width="240">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="countPrice"
                            label="总成本(元/件)"
                            width="240">
                    </el-table-column>
                </el-table>
            </content-wrap>
            <content-wrap title="物料信息">
               <div style="display: flex;align-items: center;">
                   <i style="width: 6px;height: 6px;border-radius: 50%;background: #1CA1FF;display: inline-block;margin-right: 4px;"></i><span style="font-weight: bold;">物料总成本: {{info.materialsCountPrice}}元/件</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    BOM表:{{info.bomName?info.bomName:'无'}}</span>
               </div>
                <div style="display: flex">
                    <el-table
                            border
                            :data="info.materials"
                            style="width: 100%;margin-top: 8px;">
                        <el-table-column
                                prop="kindName"
                                label="物料分类"
                                min-width="96">
                        </el-table-column>
                        <el-table-column
                                prop="materialNo"
                                label="物料款号"
                                min-width="96">
                        </el-table-column>
                        <el-table-column
                                prop="materialName"
                                label="物料名称"
                                min-width="96">
                        </el-table-column>
                        <el-table-column
                                prop="supplierName"
                                label="供应商">
                        </el-table-column>
                        <el-table-column
                                prop="supplierStyleNo"
                                label="供应商款号"
                                min-width="108">
                        </el-table-column>
                        <el-table-column
                                prop="supplierColorNo"
                                label="供应商色号"
                                min-width="108">
                        </el-table-column>
                        <el-table-column
                                prop="materialColorName"
                                label="颜色">
                            <template slot-scope="scope">
                                <div>{{scope.row.materialColorName}}-{{scope.row.materialColorValue}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="specificationNo"
                                label="规格">
                        </el-table-column>
                        <el-table-column
                                prop="planCost"
                                label="参考单价"
                                min-width="96">
                            <template slot-scope="scope">
                                <div>¥{{scope.row.planCost}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="stockUnitName"
                                label="库存单位"
                                min-width="96">
                        </el-table-column>
                        <el-table-column
                                prop="lossRate"
                                label="损耗率">
                            <template slot-scope="scope">
                                <div>{{scope.row.lossRate}}%</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="singleDosage"
                                label="单件用量"
                                min-width="96">
                        </el-table-column>
                        <el-table-column
                                prop="cotsPrice"
                                label="成本价(元/件)"
                                min-width="126">
                            <template slot-scope="scope">
                                <div>¥{{scope.row.cotsPrice}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <bomChange @addSuccess="getDetail" :fromType="$route.query.type" style="width: 100px;position: relative;top: -50px;right: 100px;"></bomChange>
                </div>

            </content-wrap>
            <content-wrap title="加工信息">
                <div style="margin-top: 24px;display: flex;align-items: center;justify-content: space-between">
                    <div>
                        <i style="width: 6px;height: 6px;border-radius: 50%;background: #1CA1FF;display: inline-block;margin-right: 4px;"></i><span style="font-weight: bold;">加工总成本: {{info.nodesCountPrice}}元/件</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    工序模板:{{info.templateName?info.templateName:'无'}}</span>
                    </div>

                    <div  class="clearfix" >
                        <el-popover
                                v-model="visible3"
                                ref="popover3"
                                placement="bottom"
                                width="200"
                                trigger="click">
                            <div  class="popover-item" @click="isShow=true;editId='';visible3=false"
                                 style="color: #FFA914;border-bottom: 1px solid #DCE0E6;">+新建工序模板
                            </div>
                            <div v-for="(item,index) in sampleTemplateList" :key="index" @click="confirmTemplate=true;templateItem=item" class="popover-item">
                                {{item.name}}
                            </div>
                        </el-popover>
                        <el-popover
                                v-model="visible4"
                                ref="popover4"
                                placement="bottom"
                                width="200"
                                trigger="click">
                            <div  class="popover-item" @click="isShow=true;editId='';visible4=false"
                                 style="color: #FFA914;border-bottom: 1px solid #DCE0E6;">+新建工序模板
                            </div>
                            <div v-for="(item,index) in sampleTemplateList" :key="index" @click="confirmTemplate=true;templateItem=item" class="popover-item">
                                {{item.name}}
                            </div>
                        </el-popover>
                        <nf-button :key="1" v-if="$route.query.type!=='goodsSample'"  v-show="!info.templateName"  v-popover:popover3 type="warning" svg="icon-btn-add"
                                   style="float: right;width: 110px;font-size: 12px;padding: 7px 0;">添加工序模板
                        </nf-button>
                        <nf-button :key="2" v-show="info.templateName"
                                   style="float: right;width: 100px;font-size: 12px;height: 36px;margin-right: 14px;"><span @click="isShow=true;editId=info.templateId">编辑工序</span>
                        </nf-button>
                        <nf-button v-if="$route.query.type!=='goodsSample'"  v-show="info.templateName"  v-popover:popover4
                                   style="float: right;width: 100px;font-size: 12px;height: 36px;margin-right: 14px;">更换工序
                        </nf-button>

                    </div>
                </div>
                <el-table
                        border
                        :data="info.nodes"
                        style="width: auto;margin-top: 8px;display: inline-block;">
                    <el-table-column
                            prop="name"
                            label="节点名称"
                            width="240">
                        <template slot-scope="scope">
                            <div>{{scope.row.name}}({{scope.row.typeName}})</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="nodePrice"
                            label="节点工价(元/件)"
                            width="240">
                        <template slot-scope="scope">
                            <div>¥{{scope.row.labourCost}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </content-wrap>
        </base-box>

        <!--确定添加模板弹窗-->
        <el-dialog
                title="提示"
                :visible.sync="confirmTemplate"
                size="tiny"
                :before-close="handleClose">
            <span>是否确认导入{{templateItem.name}}?</span>
            <span slot="footer" class="dialog-footer">
    <el-button @click="confirmTemplate = false">取 消</el-button>
    <el-button type="primary" @click="addTemplate(templateItem.id)">确 定</el-button>
  </span>
        </el-dialog>
        <!--新建模板弹窗-->
        <transition name="right-move">
            <procedure-create :detailFrom="$route.query.type==='goods'?'goods':''" :show="isShow" :editId="editId" form="costAccountingDetail" @toggle="templateTurn" v-if="isShow"></procedure-create>
        </transition>
        <transition name="opcity">
            <div class="cover" v-show="isShow" @click="isShow = false">
            </div>
        </transition>
    </div>
</template>

<script>
    import {goodsCostDetail,sampleCostAccounting,sampleTemplate,sampleTemplateAdd,templateSimpleList,findTemplateSimpleList,costAccounting,costRelationEdit,goodsCostRelationEdit} from '@/api'
    import bomChange from '../clothesFile/bom'
    import procedureCreate from '../procedure/create'
    export default {
        name: "detail",
        data() {
            return {
                editId:'',
                visible4:false,
                visible3:false,
                isShow:false,
                confirmTemplate:false,
                sampleTemplateList: [],
                templateItem: {},
                bomTable: [],
                info: {},
                loading: false
            }
        },
        components:{bomChange,procedureCreate},
        created(){
            this.getSampleTemplate()
            this.getDetail()
        },
        computed: {
          userId() {
            return JSON.parse(sessionStorage.getItem("user_login")).userId;
          },
        },
        methods:{
            getDetail(){
                this.loading = true
                let detailApi;
                if(this.$route.query.type==='designFile'){
                    detailApi = costAccounting
                }else if(this.$route.query.type==='goods'){
                    detailApi = goodsCostDetail
                }else {
                    //样衣
                    detailApi = sampleCostAccounting
                }
                detailApi({id:this.$route.query.id}).then(res => {
                    this.loading = false
                    console.log(res.data,'成本核算');
                    this.info = res.data.data
                    this.info.baseTable = []
                    this.info.baseTable.push({
                        materialsCountPrice:this.info.materialsCountPrice,
                        nodesCountPrice: this.info.nodesCountPrice,
                        countPrice: this.info.countPrice
                    })

                })
            },
            getSampleTemplate(){
                //新建
                //商品档案
                if(this.$route.query.type==='goods'){
                    findTemplateSimpleList({styleId:this.$route.query.styleId}).then(res=>{
                        this.sampleTemplateList = res.data.data || []

                    })
                }else {
                    templateSimpleList({designStyleId:this.$route.query.designStyleId,userId:this.userId}).then(res=>{
                        this.sampleTemplateList = res.data.data || []

                    });
                }


                if(this.editId){
                    //编辑工序
                    this.getDetail()
                }

            },
            templateTurn(id){
                if(id){
                    //新建
                    this.addTemplate(id)
                }
                this.isShow=false;
                this.getSampleTemplate()
            },
            addTemplate(id){

                if(this.$route.query.type==='designFile'){
                    costRelationEdit({id:this.$route.query.id,templateId:id}).then(res=>{
                        this.templateId = id;
                        this.getDetail()
                        this.confirmTemplate=false
                    });
                    return
                }else if(this.$route.query.type==='goods'){
                    goodsCostRelationEdit({id:this.$route.query.id,templateId:id}).then(res=>{
                        this.templateId = id;
                        this.getDetail()
                        this.confirmTemplate=false
                    });
                    return
                }

                sampleTemplateAdd({templateId:id,sampleId:this.$route.query.id}).then(res=>{
                    if(res.data.code===0){
                        this.getDetail()
                        this.confirmTemplate=false
                    }else {
                        this.$message.error(res.data.msg)
                    }


                })
            },

        }
    }
</script>

<style lang="scss" scoped>
    .cost-detail {
        .content_wrap{
            border-bottom: 1px solid #e0e6ed;
            margin-bottom: 20px;
            padding-bottom: 6px;
        }


    }
    .el-popover{
        .popover-item {
            cursor: pointer;
            color: #3B3B3B;
            font-size: 12px;
            line-height: 32px;
        }
    }
</style>
