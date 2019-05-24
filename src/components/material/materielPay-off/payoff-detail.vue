<template>
<div class="pay-off-detail scroll-content">
    <page-title style="background: #fff;padding: 7px 24px;margin:0 -24px;" :title="title">
        <nf-button fsize="12"  @click="routerGoBack">返回上级</nf-button>
    </page-title>
      <!-- 详情信息 -->
    <div class="base-info ">
        <el-row>
            <el-col :span="21">
                <el-form class="custom-filter-form" :model="form"  ref="form" label-width="100px">
                    <el-row>
                        <el-col :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="单号:" class="form-item" >
                                <span>{{form.billDeliveryNo}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="送料仓库:">
                                <span>{{form.deliveryStorehouseName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="送料日期:" prop="goodsNo"  class="form-item">
                                <span>{{form.deliveryDate}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="送料员:">
                                <span>{{form.deliveryerName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="isSampleMaterial" :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="设计款号:">
                                <span>{{form.designStyleNo}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="加工厂:">
                                <span>{{form.outsideFactoryName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="belongModule==0" :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="关联通知单:">
                                <span @click="goDetail(form.billNotifyId,2)" class="blue pointer">{{form.billNotifyNo}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="belongModule==2"  :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="关联送料单:">
                                <span @click="goDetail(form.deliveryIdForNotify,0)" class="blue pointer">{{form.deliveryNoForNotify}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="belongModule==2"  :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="单据状态">
                                <span :class="[form.deliveryStatus==='FINISH'?'green':'red']" >
                                    {{form.deliveryStatus=='WAIT_START'?'未送料':form.deliveryStatus==='ONGOING'?'未送齐':'已送齐'}}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="form.billMaterialArriveId"   :xs="12" :sm="12" :md="8" :lg="6">
                            <el-form-item label="关联直发到料:">
                                <span @click="goArriveDetail" class="blue pointer">{{form.billMaterialArriveNo}}</span>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </el-form>
            </el-col>
            <el-col :span="3">
                <!-- 打印按钮 -->
                <div  style="float: right;margin:16px 24px 0  0">
                    <print-template-btn v-if="belongModule==0" name="送料单" type="delivery" :id="$route.query.id"></print-template-btn>
                    <nf-button @click="goPayOff" v-if="belongModule==2&&!form.deliveryIdForNotify" class="mgt8" fsize="12" type="warning">开送料单</nf-button>

                    <img v-if="cancel" class="img" src="../../../../static/images/pic-cancel.png"/>
                </div>
            </el-col>
        </el-row>

    </div>
    <div ref="payOffDetailContent" class="main-content">
        <el-table
            v-if="canShow"
            :data="tableData"
            border
            class="custom-table tiny-row"
            key="mission"
            :height="tableHeight"
            style="width: 100%">
            <el-table-column prop="kindName" label="分类" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="kindName" label="图片" min-width="80" align="center">
                <template slot-scope="scope">
                <img v-errorLogo
                    style="display: inline-block;vertical-align: middle;width: 24px;height: 24px;"
                    @click="imgList(scope.row)"
                    :src="scope.row.commonMaterialsSkuPicture"
                    alt="">
                </template>
            </el-table-column>
            <el-table-column prop="materialsNo" label="物料款号" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="supplierName" label="供应商" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="kindName" label="供应商款号/色号" min-width="160" align="center">
                <template slot-scope="scope">
                <div>
                    {{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}
                </div>
                </template>
            </el-table-column>
            <el-table-column prop="materialsName" label="物料名称" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="colorName" label="颜色" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="specificationsNo" label="规格" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="stockUnitName" label="库存单位" min-width="70" align="center">
            </el-table-column>
            <el-table-column v-if="belongModule!=1" prop="notifyTotal" label="合计通知" min-width="70" align="center">
            </el-table-column>
            <el-table-column prop="totalPayOff" label="合计送料" min-width="70" align="center">
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="70" align="center">
                <template slot-scope="scope">
                    <div @click="detail(scope.row,scope.$index)" class="blue pointer">查看详情</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="pdtb16">
        <nf-button fsize="12" v-if="(belongModule!=2&&!cancel) ||(belongModule==2&&!form.deliveryIdForNotify)" @click="isDeleteVisible = true">撤销</nf-button>
        <nf-button class="mgl8" fsize="12"  v-if="!cancel&&addType || belongModule==2" @click="repeatEditPayOff">重编辑</nf-button>

    </div>
    <!--//图片预览-->
    <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
    <el-dialog class="custom-dialog tip-dialog" :visible.sync="isDeleteVisible" :show-close="false"
                :close-on-click-modal="false" size="tiny">
        <div class="text-center">
            <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
            <p class="tip-text">是否确定撤销当前送料单？</p>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isDeleteVisible = false">取 消</el-button>
            <el-button :disabled="isSaving" type="primary" :loading="btnLoading" @click="comfirm()">确认</el-button>
        </div>
    </el-dialog>
    <!--&lt;!&ndash;重编辑&ndash;&gt;-->
    <!--<transition name="right-move">-->
        <!--&lt;!&ndash;<newPayOff v-if="newPayOffDialog" @editAgainSucc="editAgainSucc" ref="newPayOffGet" :skus="tableDataBack" :detailPayOffdata="form" source="detailNewPayOff"></newPayOff>&ndash;&gt;-->
    <!--</transition>-->
    <!--<transition name="opcity">-->
        <!--<div class="cover1" v-if="newPayOffDialog" @click="hiddenNewPayOffDialog">-->
        <!--</div>-->
    <!--</transition>-->
    <!--新建、编辑送料单-->
    <transition name="opcity">
        <div style="z-index: 999" class="cover" v-show='newPayOff.visible'>
        </div>
    </transition>
    <!--新建、编辑采购单-->
    <transition name="right-move">
        <new-pay-off
                v-if="newPayOff.visible"
                :isEdit="newPayOff.isEdit"
                :detailInfo="newPayOff.detailInfo"
                :visible.sync="newPayOff.visible"
                :belongModule="newPayOff.belongModule"
                :billDeliveryNotify="newPayOff.billDeliveryNotify"
                @success="successNewPayOff"
        ></new-pay-off>
    </transition>
    <!--//查看详情-->
    <el-dialog title="查看详情" class="custom-dialog detail-dialog" :visible.sync="showDetail.visible" @close="showDetail.visible=false">
        <div class="fs12">物料：
            {{showDetail.materialsSku.kindName}}-
            {{showDetail.materialsSku.materialsNo}}-
            {{showDetail.materialsSku.materialsName}}-
            {{showDetail.materialsSku.colorName}}-
            {{showDetail.materialsSku.specificationsNo}}-
            {{showDetail.materialsSku.supplierName}}
        </div>
        <el-table
                :data="showDetail.materialsSku.sourceBills"
                border
                class="custom-table tiny-row mgt8"
                key="mission"
                height="400"
                style="width: 100%">
            <el-table-column prop="styleNo" label="成衣款号" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="sourceBillNo" label=" 生产单号" min-width="120" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.sourceBillNo?scope.row.sourceBillNo :' 计划外送料'}}</div>

                </template>
            </el-table-column>
            <el-table-column prop="totalDemand" label="物料需求" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="stockActivePreuse" label="主动占用" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="selfPreuseTotal" label="本单总占用" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="waitDeliveryQuantity" label="待送料" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="notifyQuantity" label="本次通知" min-width="120" align="center">
            </el-table-column>
            <el-table-column prop="deliveryQuantity" label="本次送料" min-width="120" align="center">
            </el-table-column>
        </el-table>
        <div slot="footer" class="text-right">
            <el-button  type="primary"@click="showDetail.visible=false">关闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {payOffDetail,undopayOff} from '@/api'
import printTemplateBtn from '../printTemplateBtn'
import newPayOff from './new-pay-off/new-pay-off'
import {
    MPRFieldConfigList
} from '@/api/material.js'
export default {
    components:{
        newPayOff,
        printTemplateBtn
    },
    data() {
        return {
            btnLoading:false,
            centerDialogVisible: false, //判断显示图片预览显示与隐藏
            imgLists: [],
            imgIndex: 0,
            form:{
            },
            tableData:[],
            isDeleteVisible:false,
            cancel:false,
            addType:false,
            configArr:[],       //配置表头数组
            canShow: false,      //控制是否显示表格
            tableHeight:300,
            showDetail:{
                visible:false,
                materialsSku:{}
            },
            newPayOff:{
                isEdit:false,
                visible:false,
                detailInfo:{},
                belongModule:'',
                billDeliveryNotify:{}, //选中的通知单
            }

        }
    },
    watch:{
        '$route.query.id':function (val) {
            console.log(val);
            this.payOffDetail();
        }
    },
    computed:{

        userId() {
            return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
        },
        unitId() {
            return JSON.parse(sessionStorage.getItem("last_login")).id
        },
        isSampleMaterial() {
            return this.$route.path === '/samplePayoffDetail'
        },
        belongModule(){
            return this.isSampleMaterial?1:this.$route.query.belongModule
        },
        title(){
            let title = ''
            switch (Number(this.belongModule)){
                case 0:title ='送料单详情';break;
                case 1:title ='样料送料单详情';break;
                case 2:title ='送料通知单详情';break;
            }
            return title
        }
    },
    mounted () {
        this.$nextTick(() => {
            let self = this;
            this.tableHeight = this.$refs.payOffDetailContent.offsetHeight-24
            // 通过捕获系统的onresize事件触发去改变原有的高度
            window.onresize = function() {
                self.tableHeight = self.$refs.payOffDetailContent.offsetHeight-24
            }
        })
    },
    methods:{
        goArriveDetail(){
            console.log(this.form)
            this.$router.push({
                path:'/materialDetail',
                query:{
                    id:this.form.billMaterialArriveId,
                    supplierId:this.tableData[0].supplierId,
                    supplierName:this.tableData[0].supplierName
                }
            })


        },
        // 新建送料单成功
        successNewPayOff(isEdit,query){
            let pathInfo = {
                path: this.isSampleMaterial ? '/samplePayoffDetail' : '/payoffDetail',
                query:query
            }
            this.$router.push(pathInfo)
        },
        // 开送料单
        goPayOff(){
            this.newPayOff.belongModule = 0
            this.newPayOff.detailInfo ={}
            this.newPayOff.billDeliveryNotify ={
                billDeliveryNotifyId:this.form.billDeliveryId, //样料单id和样料通知单id公用，所以取样料单id
                billDeliveryNotifyNo:this.form.billDeliveryNo,
            }
            this.newPayOff.isEdit  = false
            this.newPayOff.visible  = true
        },
        // 重编辑
        repeatEditPayOff(){
            this.newPayOff.detailInfo = {
                form: this.form,
                materialsSkus: this.tableData
            }
            this.newPayOff.belongModule = this.belongModule
            this.newPayOff.billDeliveryNotify ={}
            this.newPayOff.isEdit  = true
            this.newPayOff.visible  = true

        },
        goDetail(id,belongModule){
            this.$router.push({path:'/payoffDetail',query:{id:id,belongModule:belongModule}})
        },
        // 查看详情
        detail(row,index){
            this.showDetail.materialsSku = row
            this.showDetail.visible = true
        },
        //获取动态配置数组
        getConfigArr(code) {
            let params = {
                unitId: this.unitId,
                moduleCode: code
            };
            MPRFieldConfigList(params).then(res => {
                this.configArr = res.data.data.fieldConfigList;
                //解决直接渲染表格错乱的问题
                this.$nextTick(function(){
                    this.canShow = true;
                })
            })
        },
        routerGoBack(){
            this.$store.dispatch('deleteVisitedView', this.$route); // 关闭tab标签
            let path = this.belongModule == 0?'/marterielPayoffList':this.belongModule == 1?'/sampleMarterielPayoffList':'/marterielNotifyPayoffList'
            this.$router.replace({path:path,query:{belongModule:this.belongModule}})
        },
        // 图片预览
        imgList(row) {
            if(!row.commonMaterialsPictureList)
                return
            console.log(row.commonMaterialsPictureList);
            this.imgIndex = 0;
            this.imgLists=row.commonMaterialsPictureList
            // this.imgLists = row.commonMaterialsPictureList;
            this.centerDialogVisible = true;
        },
        payOffDetail() {
            let params ={
                id:this.$route.query.id,
                belongModule: this.belongModule
            }
            payOffDetail(params).then(res =>{
                console.log(res,'detail');
                this.form = res.data.data
                this.form.deliveryDate = this.form.deliveryDate?this.form.deliveryDate.slice(0, 11):'';
                this.cancel = res.data.data.cancel;
                this.addType = res.data.data.addType;
                this.tableData = res.data.data.mainListV2;

            })
        },
        comfirm() {
            let params ={
                id:this.$route.query.id,
                userId:this.userId
            }
            this.btnLoading = true
            undopayOff(params).then(res => {
                console.log(res);
                this.btnLoading = false
                if(res.data.code == 0 ) {
                    this.isDeleteVisible = false;
                    this.$message.success('撤销成功');
                    this.payOffDetail();
                }else {
                    this.$message.error(res.data.msg);
                }
            })
        },
    },
    created() {
        // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
        this.getConfigArr('DELIVER');
        this.payOffDetail();
    }
}
</script>

<style lang='scss' scoped>
    .pay-off-detail{
        &.scroll-content{
            margin: -24px 0;
        }
        .main-content{
            padding: 0 24px;
            background: #fff;
        }
    }

.detail{
    background-color: #fff;
    padding:24px;
    min-height:250px;
    .form-item{
      margin-left:-30px;
    }
    .cell__row {
        height: 24px;
        line-height: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        word-break: break-all;
        border-bottom: 1px solid #E6EAF0;
        box-sizing: border-box;
        &:last-child{
            border:none;
        }
    }
    .img {
        height:98px;
        width:98px;
        transform: rotate(15deg);
        position: absolute;
        right:0;
        top: 32px;
        z-index: 1;
    }
}
</style>
<style lang='scss'>
.pay-off-detail{
    .detail-dialog .el-dialog--small{
        width: 1000px;
    }
    .base-info{
        background: #fff;
        margin: 16px 0 0;
        .el-form-item{
            margin-bottom:0px;
        }
    }
}
</style>

