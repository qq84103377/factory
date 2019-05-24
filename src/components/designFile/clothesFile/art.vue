<template>
    <div>
        <div v-if="!artInfo.id" class="clearfix">
            <el-popover
                    ref="popover2"
                    placement="bottom"
                    width="200"
                    trigger="click">
                <div @click="isShow = true" class="popover-item"
                     style="color: #FFA914;border-bottom: 1px solid #DCE0E6;">+新建工艺单
                </div>
                <div @click="confirm=true;artItem=item" v-for="(item,index) in artList" :key="index" class="popover-item">
                    {{item.name}}
                </div>
                <!--<div class="popover-item" v-if="!artList.length">暂无工艺单</div>-->
            </el-popover>
            <nf-button v-popover:popover2 type="warning" svg="icon-btn-add"
                       style="float: right;width: 94px;font-size: 12px;padding: 7px 0;">新建工艺单
            </nf-button>
        </div>
        <div v-if="!artInfo.id" style="font-size: 12px;color: #C4C6CC;text-align: center;">暂无工艺信息数据</div>
        <artDetail v-if="artInfo.id" :info="artInfo" @show="isShow=true"></artDetail>


        <!--确定添加工艺单弹窗-->
        <el-dialog
                title="提示"
                :visible.sync="confirm"
                size="tiny"
                :before-close="handleClose">
            <span>是否确认导入{{artItem.name}}?</span>
            <span slot="footer" class="dialog-footer">
    <el-button @click="confirm = false">取 消</el-button>
    <el-button type="primary" @click="addArt(artItem.id);confirm=false">确 定</el-button>
  </span>
        </el-dialog>


        <transition name="right-move">
            <add-art :artData='artInfo' @del="delArt" :styleId='id' @onSample="onSample" @toggle="changeArtList"
                     v-show="isShow"></add-art>
        </transition>
        <transition name="opcity">
            <div class="cover" v-show="isShow" @click="isShow = false">
            </div>
        </transition>
    </div>
</template>

<script>
    import {sampleListProcessForm, sampleAddProcessForm, sampleDetailProcessForm} from '@/api/api'
    import artDetail from '../technicsInfo/artDetail'
    import addArt from '../technicsInfo/addArt'

    export default {
        data() {
            return {
                artItem: {},
                confirm: false,
                isShow: false,
                art: true,
                artList: [],
                artInfo: {}
            }
        },
        created() {
            if (this.$route.query.processFormId && this.$route.query.processFormId != 'null') {
                this.getArtDetail(this.$route.query.processFormId)
            }
            this.getList()
        },
        computed: {
            id() {
                return this.$route.query.designStyleId
            }
        },
        components: {artDetail, addArt},
        methods: {
            getArtDetail(id) {
                sampleDetailProcessForm({sampleId: this.$route.query.id, processFormId: id}).then(res => {
                    console.log(res.data, '工艺单详情');
                    this.artInfo = res.data.data || {}
                    // this.artList = res.data.data
                })
            },
            onSample(id) {
                //查询添加成功以后返回的ID详情
                if(id){
                    this.resetQuery(id)
                }
                this.getArtDetail(id)
                this.getList()
            },
            delArt() {
                this.resetQuery('null')
                this.artInfo = {}
            },
            changeArtList(v) {
                // if(v){
                //     //查询添加成功以后返回的ID详情
                //     this.getArtDetail(id)
                // }
                this.isShow = !this.isShow;
            },
            getList() {
                sampleListProcessForm({id: this.$route.query.id}).then(res => {
                    console.log(res.data, '样衣档案工艺信息');
                    this.artList = res.data.data
                })
            },
            addArt(id) {
                sampleAddProcessForm({sampleId: this.$route.query.id, processFormId: id}).then(res => {
                    if(res.data.code==0){
                        this.resetQuery(id)
                        this.getArtDetail(id)
                    }
                })
            },
            resetQuery(str){
                //改变路由上工艺单ID
                let query = {...this.$route.query}
                query.processFormId = str
                this.$router.replace({
                    path: this.$route.path,
                    query
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .popover-item {
        cursor: pointer;
        color: #3B3B3B;
        font-size: 12px;
        line-height: 32px;
    }

    .right-move-enter-active,
    .right-move-leave-active {
        transition: all 0.3s ease;
        transform: translateX(0);
    }

    .right-move-enter,
    .right-move-leave-to {
        transform: translateX(100%);
    }

    .opcity-enter-active,
    .opcity-leave-active {
        transition: all 0.5s ease;
        opacity: 0.5;
    }

    .opcity-enter,
    .opcity-leave-to {
        opacity: 0;
    }

    .cover {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        top: 0;
        left: 0;
        z-index: 1;
    }
</style>