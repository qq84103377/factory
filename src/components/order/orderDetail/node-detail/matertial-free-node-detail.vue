<!--自由送料节点-->
<template>
    <div class="matertial-free">
        <div class="free-head mgb8">
            <nf-button style="margin-right:24px;" class="report-btn" type="success" @click="reprot">上报物料/数量</nf-button>
            <div class="material__view-btn">
                <icon-button @click="newFeedBackDialog = true" class="btn" style="line-height:20px;" type="icon-material-returned">余料退回</icon-button>
                <view-record-btn type="freedom_material" :componentData="componentData"></view-record-btn>
            </div>
        </div>

        <!-- 表格 -->
        <material-free-table
                :materialTableData="materialTableData"
                @imgList="imgList">
        </material-free-table>

        <!--图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

        <!--上报弹窗-->
        <material-free-dialog
                :dialogVisible.sync="dialogVisible"
                :missionData="missionData"
                :selectPersonList="selectPersonList"
                @addMaterial="addMaterial"
                @reportSubmit="reportSubmit">
        </material-free-dialog>

        <!-- 遮罩层 -->
        <transition name="opcity">
            <div class="cover" @click='cancel' v-if='isshow'>
            </div>
        </transition>
        <!-- 左侧的测弹窗 -->
        <transition name="right-move">
                <add-material
                        v-if='isshow'
                        title="新建物料"
                        @cancel='isshow= false'
                        @confirm='isshow= false'
                        @updateBoMTable = 'getDatalist'
                ></add-material>
        </transition>
        <!-- 遮罩层 -->
        <transition name="right-move">
            <newFeedBack v-if="newFeedBackDialog" @addSucsess="addSucsess" ref="newPayOffGet" source="returnMatertial" @cancel="cancelRefund" :mission="instanceWorkflow.mission"></newFeedBack>
        </transition>
        <transition name="opcity">
            <div class="cover1" v-if="newFeedBackDialog"></div>
        </transition>
    </div>
</template>

<script>
    import {checkReportPermission} from '@/api'
    import materialFreeTable from "./material-free-table";
    import viewRecordBtn from "../../common/view-record-btn";
    import  materialFreeDialog  from "./material-free-dialog";
    import addMaterial from "@/components/material/materialArchives/addMaterial.vue"; //悬浮添加组件
    import newFeedBack from '@/components/material/materielFeed-back/new-feed-back/new-feed-back'
    export default {
        inject: ['homeRouterReload'],     //注入全局刷新方法
        props: {
            instanceWorkflow: {},
            selectPersonList: [],
        },
        data(){
            return {
                imgIndex: 0,
                imgLists: [],
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                dialogVisible:false,     //是否显示弹窗
                isshow: false,           //新建物料侧窗
                newFeedBackDialog: false, // 余料弹窗
                materialTableData: [],
                missionData:{},
            }
        },
        components:{
            viewRecordBtn,
            materialFreeTable,
            materialFreeDialog,
            addMaterial,
            newFeedBack
        },
        computed:{
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
        },
        methods:{
            // 新建回料单取消
            cancelRefund(val) {
                this.newFeedBackDialog = val
            },
            // 新建回料单成功
            addSucsess() {
                this.homeRouterReload()
                this.newFeedBackDialog = false
            },
            //新建物料
            addMaterial(){
                this.isshow = true;
            },
            getDatalist(val){
                console.log(val);
                // this.form.supplier = val;
            },
            // 图片预览
            imgList(row) {
                if (row.length) {
                    this.imgIndex = 0;
                    this.imgLists = row;
                }
                this.centerDialogVisible = true;
            },
            // 上报弹窗
           async reprot() {
                let obj={
                    facMissionPrcdNodeId:this.$route.query.instanceWorkflowId,
                    userId: this.userId
                };
                let flag = await checkReportPermission(obj).then(res=>{
                    if(res.data.code!==0){
                        this.$message.error(res.data.msg)
                        return false
                    }else {
                        return true
                    }
                });
                if(!flag) return
                this.dialogVisible = true
            },
            //上报弹窗提交内容
            reportSubmit(){
                //上报成功刷新工单详情，解决上报弹窗操作错位的bug
                this.homeRouterReload();
            },

        },
        created(){
            this.materialTableData = this.instanceWorkflow.components.freedom_material.materials;
            this.missionData = this.instanceWorkflow.mission;
        }
    }
</script>

<style lang="scss" lange="scss" scoped>
.matertial-free{
    .free-head{
        overflow: hidden;
        .material__view-btn{
            float: right;
        }
    }
}
</style>
