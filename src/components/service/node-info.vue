<template>
    <div class="node-info">
        <div class="edit-wrap">
            <el-button type="text" class="done" @click="handleEdit">
                <icon type="icon-edit1" w="12"></icon>
                修改节点信息
            </el-button>
        </div>
        <el-row
            type="flex"
            justify="space-between">
            <div class="info-wrap">
                <span class="info-label">负责人：</span>
                <p>
                    <span class="leader-item" v-for="item in nodeInfo.chargers" :key="item.id">{{item.name}}</span>
                    <span class="grey" v-if="!(nodeInfo.chargers && nodeInfo.chargers.length)">未设置</span>
                </p>
            </div>
            <template v-if="costShow">
                <div class="info-wrap" v-if="nodeInfo.labourCost !== -1">
                    <span class="info-label">工人工价：</span>
                    <p :class="{'grey': !nodeInfo.labourCost}">
                        <span v-if="nodeInfo.labourCost">{{ nodeInfo.labourCost }}元/件</span>
                         <span v-if="!nodeInfo.labourCost">未设置</span>
                    </p>
                </div>
            </template>
            <div class="info-wrap">
                <span class="info-label" style="width:100px;">计划结束日期：</span>
                <p>
                    {{endAt}}
                    <span class="grey" v-if="!endAt">未设置</span>
                </p>
            </div>
        </el-row>
        <el-row v-if="nodeInfo.associateOutside"
            type="flex"
            justify="space-between">
            <div class="info-wrap">
                <span class="info-label">外发厂：</span>
                <p>
                    <!-- <span class="grey" v-if="!(nodeInfo.outSideFactoryName && nodeInfo.outSideFactoryName.length)">未设置</span>
                    <span v-else class="leader-item">{{nodeInfo.outSideFactoryName}}</span> -->
                    <span class="grey" 
                    v-if="!(outsideFactoryLists&&outsideFactoryLists.length) && (nodeInfo.facMissionOutsideFlag&&!nodeInfo.facMissionOutsideFactoryName)">
                        未设置
                    </span>
                    <span 
                    v-else-if="!nodeInfo.facMissionOutsideFlag&&outsideFactoryLists.length > 0" 
                    v-for="(item,index) in outsideFactoryLists" 
                    :key="index">
                        {{item.outsideFactoryName}} {{item.outsideFactoryPrice+'元/件' }}{{index < outsideFactoryLists.length - 1 ? '、': ''}}
                    </span>
                    <span v-else-if="nodeInfo.facMissionOutsideFlag&&nodeInfo.facMissionOutsideFactoryName">{{nodeInfo.facMissionOutsideFactoryName}}</span>
                </p>
            </div>
            <!-- <div class="info-wrap">
                <span class="info-label">加工价格：</span>
                <p>
                    <span class="leader-item">{{nodeInfo.machinigUnitPrice}}元/件</span>
                </p>
            </div> -->
        </el-row>
        <el-row
                type="flex"
                justify="space-between">
            <div class="info-wrap files-wrap" v-if="nodeInfo.nodeAttachments.length">
                <span class="files-text">附件：</span>
                <div class="files-main">
                    <attachEdit :isShowClose="false" :attachData='nodeInfo.nodeAttachments'></attachEdit>
                </div>
            </div>
        </el-row>



    </div>
</template>

<script>
import Util from '@/utils/format'
import attachEdit from "@/components/goods/child/attachEdit";
export default {
    props: {
        nodeInfo: {
            type: Object,
            default: {},
        }
    },
    data(){
        return{
            costShow: false             //是否显示查看工价
        }
    },
    components:{
        attachEdit
    },
    computed: {
        beginAt() {
            return this.nodeInfo && this.nodeInfo['dateStart'] && Util.formatDate(new Date(this.nodeInfo['dateStart']), 'yyyy-MM-dd')
        },
        endAt() {
            return this.nodeInfo && this.nodeInfo['dateEnd'] && Util.formatDate(new Date(this.nodeInfo['dateEnd']), 'yyyy-MM-dd')
        },
        //外发厂节点的信息
        outsideFactoryLists(){
            return this.$store.state.outsideFactoryList.filter( item =>{
                return item.outsideFactoryId!=''
            });
        }
    },
    methods:{
        // 判断查看工价权限
        checkCost() {
            var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (datalist.indexOf("fac.mission.labour.cost.view") == -1) {
                this.costShow = false;
            }else{
                this.costShow = true;
            }

        },
        handleEdit(){
            this.$emit('handleEdit');
        }
    },
    mounted () {
        this.checkCost();
    }
}
</script>

<style lang="scss" scoped>
    .node-info {
        border-bottom:1px solid #e6eaf0;
        margin:6px 0 20px 0;
        .edit-wrap {
            text-align: right;
            .cancel {
                color: #929aa6;
            }
            .done {
                color: #808080;
                &:hover {
                    color: #3b3b3b;
                    text-decoration: underline;
                }
            }
            .finish {
                color: #1ca1ff;
            }
        }
        .info-wrap {
            flex: 1;
            display: flex;
            margin-bottom: 12px;
            font-size: 14px;
            &__remark {
                width: 100%;
            }
            .leader-item:not(:last-child) {
                &::after {
                    content: '、'
                }
            }
            .info-label {
                display: inline-block;
                /*width: 80px;*/
                /*text-align: right;*/
                color: #636363
            }
            p {
                word-break: break-all;
                flex: 1;
                padding-left: 6px;
            }
            .grey {
                color: #929aa6
            }
            .files-text{
                color: #636363;
                line-height: 28px;
                margin-right: 10px;
            }
            files-main{

            }
        }
    }
</style>

