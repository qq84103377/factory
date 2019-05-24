<template>
    <div class="store-files-detail">
        <page-title title="店铺详情">
            <div class="btns">
                <nf-button fsize="12" @click="$router.go(-1)">返回上级</nf-button>
            </div>
        </page-title>
        <div class="detail-content mgt8" v-loading="loading">
            <div class="yellow-border-title">
                <div class="title">基本信息</div>
                <div>
                    <div v-if="detailInfo.status==0" class="stopuse-img">
                        <img class="cancel-img" src="../../../static/images/pic-stop-use.png"/>
                    </div>
                    <!--2.2.2版本不做新建/编辑 功能 -->
                    <!--<nf-button fsize="12" @click="$router.go(-1)">编辑信息</nf-button>-->
                </div>
            </div>
            <div class="detail-item mgt16">
                <el-row>
                    <el-col :span="8"><div><span>店铺名称：</span><span>{{detailInfo.name}}</span></div></el-col>
                    <el-col :span="8"><div><span>店铺编号：</span><span>{{detailInfo.code}}</span></div></el-col>
                    <el-col :span="8"><div><span>店铺区分：</span><span>{{detailInfo.sectionName}}</span></div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div><span>店铺评级：</span><span>{{detailInfo.levelName}}</span></div></el-col>
                    <el-col :span="8">
                        <div><span>品牌：</span>
                            <span v-for="(item,index) in detailInfo.brands">
                                {{item.attrVal}}{{index!==detailInfo.brands.length-1?'、':''}}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="8"><div><span>销售计划负责人：</span><span>{{detailInfo.leaderName}}</span></div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div><span>大区：</span><span>{{detailInfo.largeAreaName}}</span></div></el-col>
                    <el-col :span="8">
                        <div><span>所在地区：</span>
                            <span v-if="detailInfo.provinceName">
                                {{detailInfo.provinceName+(detailInfo.cityName?'/'+detailInfo.cityName:'')+(detailInfo.areaName?'/'+detailInfo.areaName:'')}}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="8"><div><span>地址：</span><span>{{detailInfo.address}}</span></div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div><span>计划开业时间：</span><span>{{detailInfo.planStart?detailInfo.planStart.slice(0,10):''}}</span></div></el-col>
                    <el-col :span="8"><div><span>实际营业时间：</span><span>{{detailInfo.actualStart?detailInfo.actualStart.slice(0,10):''}}</span></div></el-col>
                    <el-col :span="8"><div><span>计划关店时间：</span><span>{{detailInfo.planEnd?detailInfo.planEnd.slice(0,10):''}}</span></div></el-col>
                </el-row>
            </div>
            <div class="yellow-border-title mgt16">
                <div class="title">店铺属性</div>
            </div>
            <div class="detail-item mgt16">
                <el-row v-if="customStoreAttr.length">
                    <el-col :span="8">
                        <div><span>{{customStoreAttr[0]}}：</span>
                            <span v-for="(item,index) in detailInfo.attr1s">
                                {{item.attrVal}}{{index!==detailInfo.attr1s.length-1?'、':''}}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div><span>{{customStoreAttr[1]}}：</span>
                            <span v-for="(item,index) in detailInfo.attr2s">
                                {{item.attrVal}}{{index!==detailInfo.attr2s.length-1?'、':''}}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div><span>{{customStoreAttr[2]}}：</span>
                            <span v-for="(item,index) in detailInfo.attr3s">
                                {{item.attrVal}}{{index!==detailInfo.attr3s.length-1?'、':''}}
                            </span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div v-show="!loading" class="mgt8">
            <nf-button @click="isDeleteVisible = true"  style="background-color: #fff" class="mgr8" fsize="12">删除店铺</nf-button>
            <nf-button  @click="setStoreStatus(detailInfo.status==0?1:0)" :loading="isSubmitting"
                        style="background-color: #fff" fsize="12">
                {{detailInfo.status==0?"启用":"停用"}}店铺
            </nf-button>
        </div>
        <!--删除确认框-->
        <el-dialog :modal-append-to-body="false"  class="custom-dialog tip-dialog"
                   :visible.sync="isDeleteVisible" :show-close="false" :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确认删除该店铺？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDeleteVisible = false">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="deleteStore">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getStoreDetail,getStoreAttrs,setStoreStatus,deleteStore} from '@/api/goodsPlan.js'
    import PageTitle from "@/components/Common/page-title.vue";

    export default {
        name:'storeFilesDetail',
        data() {
            return {
                loading :false,
                isSubmitting:false,
                isDeleteVisible:false,
                detailInfo:{},
                customStoreAttr:[],
                isNeedRefresh:false, //是不是进行了删除操作
            }
        },
        components: {
            PageTitle,
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            storeId(){
                return this.$route.query.storeId
            }
        },

        methods: {
            // 删除店铺
            deleteStore(){
                let params = {
                    storeId:this.storeId
                }
                this.isSubmitting = true
                deleteStore(params).then(res => {
                    this.isSubmitting = false
                    this.isDeleteVisible = false
                    if(res.data.code ===0){
                        this.$message.success('删除成功')
                        this.isNeedRefresh = true
                        this.$router.go(-1)
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 停用店铺、启用店铺（0：停用 1：启用）
            setStoreStatus(type){
                let params = {
                    storeId:this.storeId,
                    type:type
                }
                this.isSubmitting = true
                setStoreStatus(params).then(res =>{
                    this.isSubmitting = false
                    if(res.data.code ===0){
                        this.isNeedRefresh = !this.isNeedRefresh
                        this.$message.success(type==0?"停用成功":"启用成功")
                        this.getStoreDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 获取店铺详情
            getStoreDetail(){
                let params = {
                    id:this.storeId
                }
                this.loading = true
                getStoreDetail(params).then(res =>{
                    this.loading = false
                    if(res.data.code ===0){
                       this.detailInfo = res.data.data
                    }
                })
            },
            getStoreAttrs(){
                let params ={
                    bossUnitId:this.bossUnitId
                }
                getStoreAttrs(params).then(res =>{
                    if(res.data.code ===0){
                        let storeAttrs = res.data.data
                        console.log(storeAttrs,4445)
                        this.customStoreAttr = [storeAttrs.attr1.typeName,storeAttrs.attr2.typeName,storeAttrs.attr3.typeName]
                    }
                })
            },
        },
        beforeRouteLeave(to,from,next) {
            // 删除店铺后从详情回到列表的时候不要缓存页面
            if (from.path == '/storeFiles/detail'&&this.isNeedRefresh) {
                to.meta.keepAlive = false
            } else{
                to.meta.keepAlive = true
            }
            next()
        },
        created() {
            this.getStoreAttrs()
            this.getStoreDetail()
        },
    }
</script>

<style lang="scss" scoped>
    .store-files-detail{
        .detail-content{
            position: relative;
            padding:18px 24px 24px;
            min-height: 100px;
            background-color: #fff;
            .stopuse-img{
                position: absolute;
                top: 20px;
                right: 50px;
            }
            .detail-item{
                font-size:12px ;
                line-height: 24px;
                max-width: 1070px;
            }
        }
    }


</style>
<style lang="scss">
    .store-files-detail{
        .el-dialog--tiny{
            width: 365px;
        }
    }
</style>

