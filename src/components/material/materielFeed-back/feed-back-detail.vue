<template>
<div>
    <page-title title="余料单详情">
        <nf-button style="width:98px;" @click="routerGoBack">返回上级</nf-button>
    </page-title>
      <!-- 详情信息 -->
    <div class="detail">
        <el-form :model="form" status-icon ref="form" label-width="100px" class="demo-ruleForm">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="单号:" class="form-item">
                        <span>{{form.orderNo}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="入库仓库:">
                        <span>{{form.storehouseName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="入库日期:" prop="goodsNo"  class="form-item">
                        <span>{{form.dateOperate | filterTime}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="业务员:">
                        <span>{{form.operaterName}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="加工厂:">
                        <span>{{form.commonOutsideFactoryName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="备注:">
                        <span>{{form.remark}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 打印按钮 -->
        <div class="print-btn clearfix fr" style="position:relative;">
            <img v-if="status" class="img" src="../../../../static/images/pic-cancel.png"/>
        </div>
        <div class="table">
            <el-table
                :data="tableData"
                border
                class="mission"
                key="mission"
                style="width: 100%">
                <el-table-column prop="materialsKindName" label="分类" width="120" align="center"></el-table-column>
                <el-table-column label="图片" width="120" align="center">
                    <template slot-scope="scope">
                        <img style="height: 30px;width: 80px;margin-top:2px"
                             @click="imgList(scope.row.commonMaterialsPictureList)"
                             v-if="scope.row.commonMaterialsPictureList"
                             :src="scope.row.commonMaterialsPictureList?scope.row.commonMaterialsPictureList[0]:''">
                    </template>
                </el-table-column>
                <el-table-column prop="materialsNo" label="物料款号" width="180" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
                <el-table-column prop="" label="供应商款号/色号" width="130" align="center">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.supplierStyleNo}}
                            <span v-if="scope.row.supplierStyleNo && scope.row.supplierColorNo">/</span>
                            {{scope.row.supplierColorNo}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="materialsKindName" label="物料名称" width="120" align="center"></el-table-column>
                <el-table-column prop="colorName" label="颜色" width="120" align="center"></el-table-column>
                <el-table-column prop="specificationsNo" label="规格" width="120" align="center"></el-table-column>
                <el-table-column prop="stockUnitName" label="库存单位" width="120" align="center"></el-table-column>
                <el-table-column prop="totalReferenceRemaind" label="总参考余料" width="140" align="center"></el-table-column>
                <el-table-column prop="totalQuantity" label="合计入库" width="120" align="center"></el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <div class="blue cursor" @click="handleDialogShow(scope.row, scope.$index)">查看详情</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <div class="btn-wrap">
        <nf-button class="handle-btn btn-cancel" v-if="!status" @click="comback()">撤销</nf-button>
        <nf-button class="handle-btn btn-edit" @click="repeatEditFeedBack">重编辑</nf-button>
    </div>
    <!--撤销弹窗-->
    <el-dialog class="custom-dialog tip-dialog" :visible.sync="isDeleteVisible" :show-close="false"
                :close-on-click-modal="false" size="tiny">
        <div class="text-center">
            <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
            <p class="tip-text">是否确定撤销当前余料单？</p>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isDeleteVisible = false">取 消</el-button>
            <el-button :disabled="isSaving" type="primary" :loading="btnLoading" @click="comfirm()">确认</el-button>
        </div>
    </el-dialog>

    <!--查看详情弹窗-->
    <edit-by-remaind-dialog
            :visible.sync="dialogShow"
            title="查看详情"
            :materialsSku="dialogData"
            handle="see"
            @confirm="editByOrderConfirm">
    </edit-by-remaind-dialog>

    <!--重编辑-->
    <transition name="right-move">
        <newFeedBack
                v-if="newFeedBackDialog"
                source="detailNewFeedBack"
                @cancel="hiddenNewFeedBackDialog"
                @addSucsess="addSucsess">
        </newFeedBack>
    </transition>
    <transition name="opcity">
        <div
                class="cover1"
                v-if="newFeedBackDialog"
                @click="hiddenNewFeedBackDialog">
        </div>
    </transition>

    <!--//图片预览-->
    <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
</div>
</template>

<script>
import printTemplateBtn from '../printTemplateBtn'
import newFeedBack from './new-feed-back/new-feed-back'
import editByRemaindDialog from './new-feed-back/editByRemaindDialog';
import {
    remaindDetail,
    remaindDetailUndo,
} from '@/api/material.js'

export default {
    components:{
        editByRemaindDialog,
        newFeedBack,
        printTemplateBtn
    },
    data() {
        return {
            btnLoading:false,
            newFeedBackDialog:false,
            centerDialogVisible: false, //判断显示图片预览显示与隐藏
            imgLists: [],
            imgIndex: 0,
            form:{
                orderNo:'',
                storehouseName:'',
                dateOperate:'',
                operaterName:'',
                commonOutsideFactoryName: '',
                remark: '',
            },
            tableData:[],
            tableDataBack:[],
            isDeleteVisible:false,
            dialogShow: false,
            dialogData: [],
            materialsSkuIndex: 0,
        }
    },
    filters:{
        filterTime(val) {
            if(val) {
                return val.slice(0, 11);
            }else {
                return "未设置"
            }
        }
    },
    watch:{
        '$route.query.id':function (val) {
            this.refundDetail();
        }
    },
    computed:{
        userId() {
            return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
        },
        unitId() {
            return JSON.parse(sessionStorage.getItem("last_login")).id
        }
    },
    methods:{
        //按单入库
        handleDialogShow(row, index){
            this.dialogData = row;
            this.materialsSkuIndex = index;
            this.dialogShow = true;
        },
        // 返回
        routerGoBack(){
            this.$store.dispatch('deleteVisitedView', this.$route); // 关闭tab标签
            this.$router.go(-1)
        },
        //重编辑
        repeatEditFeedBack(){
            // 权限
            if(!this.powerJudgement.permissions("fac.backOrder.restart")){
                return
            }
            this.newFeedBackDialog = true
        },
        hiddenNewFeedBackDialog(){
            this.newFeedBackDialog = false
        },
        //重编辑余料入库单
        addSucsess(){
            this.newFeedBackDialog = false
            this.refundDetail()
        },
        // 图片预览
        imgList(imgUrl) {
            this.imgIndex = 0;
            this.imgLists=[{path:imgUrl}]
            this.centerDialogVisible = true;
        },
        // 详情数据
        refundDetail() {
            let params ={
                id:this.$route.query.id
            };
            remaindDetail(params).then(res =>{
                if(res.data.code === 0){
                    let detail = res.data.data;
                    this.form = {
                        orderNo: detail.orderNo,
                        storehouseName: detail.storehouseName,
                        dateOperate: detail.dateOperate,
                        operaterName: detail.operaterName,
                        commonOutsideFactoryName: detail.commonOutsideFactoryName,
                        remark: detail.remark,
                    };
                    this.tableData = detail.skuDetails;
                    this.status = detail.cancel;
                    this.tableDataBack = JSON.parse(JSON.stringify([...res.data.data]));
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
        // 撤销按钮
        comback(){
             // 权限
            if(!this.powerJudgement.permissions("fac.backOrder.repeal")){
                return
            }
            this.isDeleteVisible = true;
        },
        // 撤销
        comfirm() {
            let params ={
                id:this.$route.query.id,
            };
            this.btnLoading = true;
            remaindDetailUndo(params).then(res => {
                this.btnLoading = false;
                if(res.data.code == 0 ) {
                    this.isDeleteVisible = false;
                    this.$message.success('撤销成功');
                    this.refundDetail();
                }else {
                    this.$message.error(res.data.msg);
                }
            })
        },
    },
    created() {
        this.refundDetail();
    }
}
</script>

<style lang='scss' scoped>
    .material-new-remove-right{
        position: fixed;
        top: 0;
        right: 0;
        width: calc(100% - 300px) !important;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 2000;
        .page_title{
            padding: 16px;
        }

    }
.detail{
    background-color: #fff;
    padding:24px;
    .form-item{
      margin-left:-30px;
    }
    .cell__row {
        height: 32px;
        line-height: 32px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        word-break: break-all;
        border-bottom: 1px solid #E6EAF0;
        box-sizing: border-box;
        &:last-child{
            border:none;
        }
        .small-img{
            height: 80%;
            width: 90%;
            margin: 5%;
            box-sizing: border-box;
        }
    }
    .img {
        height:98px;
        width:98px;
        transform: rotate(15deg);
        position: absolute;
        right:0;
        top: -23px;
        z-index: 1;
    }
    .demo-ruleForm{
        margin-bottom: 20px;
    }
    .cursor{
        cursor: pointer;
    }
}
    .btn-wrap{
        .handle-btn{
            margin-top:30px;
            &.btn-cancel{
                margin-right: 10px;
            }
        }
    }
</style>
<style lang='scss'>
@import '../../../assets/style/el-table.scss';
.detail{
    .el-table__body {
        .cell,
        td {
            padding: 0;
        }
    }
    .el-table .cell {
        line-height :12px;
    }
    .demo-ruleForm{
        .el-form-item{
            margin-bottom:0px;
        }
    }
}
</style>

