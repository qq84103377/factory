<template>
    <div>
        <div style="display: flex;width: 200px;">
            <div  class="clearfix" v-if="fromType!=='goodsSample'">
                <el-popover
                        ref="popover2"
                        placement="bottom"
                        width="200"
                        trigger="click">
                    <div @click="chachCanNewBom" class="popover-item"
                         style="color: #FFA914;border-bottom: 1px solid #DCE0E6;">+新建BOM表
                    </div>
                    <div v-for="(item,index) in bomList" :key="index" @click="confirm=true;bomItem=item" class="popover-item">
                        {{item.name}}
                    </div>
                </el-popover>
                <nf-button v-if="!endBoomData.id" v-popover:popover2 type="warning" svg="icon-btn-add"
                           style="float: right;width: 94px;font-size: 12px;padding: 7px 0;">添加BOM表
                </nf-button>
                <nf-button v-if="endBoomData.id" v-popover:popover2
                           style="float: right;width: 100px;font-size: 12px;height: 36px;margin-right: 14px;">更换BOM表
                </nf-button>
            </div>
            <auto-bom
                    from="clothesFileBom"
                    v-if="endBoomData.id"
                    :boomAllData="endBoomData"
                    @onSample="onSample"
                    @theEditor="theEditor"
                    @editor="$emit('addSuccess')">
            </auto-bom>
        </div>

        <!--<div v-if="!endBoomData.id" style="font-size: 12px;color: #C4C6CC;text-align: center;">暂无BOM表数据</div>-->



        <!--确定添加BOM弹窗-->
        <el-dialog
                title="提示"
                :visible.sync="confirm"
                size="tiny"
                :before-close="handleClose">
            <span>是否确认导入{{bomItem.name}}?</span>
            <span slot="footer" class="dialog-footer">
    <el-button @click="confirm = false">取 消</el-button>
    <el-button type="primary" @click="addBom(bomItem.id);confirm=false">确 定</el-button>
  </span>
        </el-dialog>


        <!-- 新建BOM组件 -->
        <transition name="right-move">
            <create-bom-table
                    from="clothesFile"
                    @success="onSample"
                    @onSample="onSample"
                    v-if="createBomTableVisible"
                    title="新建BOM表"
                    :styleId="this.$route.query.styleId || '1'"
                    @cancel="cancel">
            </create-bom-table>
        </transition>
    </div>
</template>

<script>
    import autoBom from '../../goods/goodsBom/autoBom'
    import CreateBomTable from "../../goods/goodsBom/CreateBomTable.vue";
    import {
        sampleDetailMaterialSkuBom,
        sampleAddBom,
        bomMaterialsList,
        costRelationEdit,
        goodsCostRelationEdit,
        goodManageBoomAllData,
        goodsCostRelationDelete,
        costRelationDelete
    } from "../../../api/api";

    export default {
        name: "bom",
        components: {
            autoBom, CreateBomTable
        },
        props:['fromType'],
        data() {
            return {
                bomItem: {},
                confirm: false,
                createBomTableVisible: false,
                boomAllData: [],
                endBoomData: {},
                bomList: []
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            }
        },
        created() {
            // if (this.$route.query.bomId && this.$route.query.bomId != 'null') {
            //     this.getBomDetail(this.$route.query.bomId)
            // }
            this.getBomList()
        },
        methods: {
            onSample(id) {
                //查询添加成功以后返回的ID详情
                this.resetQuery(id)
                this.addBom(id)
                this.$emit('addSuccess')
                this.getBomList()
            },
            resetQuery(str) {
                //改变路由上BOMID
                let query = {...this.$route.query}
                query.bomId = str
                this.$router.replace({
                    path: this.$route.path,
                    query
                })
            },
            addBom(id){
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.style.bom.add")){
                    return
                }
                if(this.fromType==='designFile'){
                    costRelationEdit({id:this.$route.query.id,bomId:id}).then(res=>{
                        this.resetQuery(id)
                        this.endBoomData = this.bomList.find(item=>item.id===id)||{}
                        this.$emit('addSuccess')
                    })
                    return
                }else if(this.fromType==='goods'){
                    goodsCostRelationEdit({id:this.$route.query.id,bomId:id}).then(res=>{
                        this.resetQuery(id)
                        this.endBoomData = this.bomList.find(item=>item.id===id)||{}
                        this.$emit('addSuccess')
                    })
                    return
                }


                sampleAddBom({sampleId:this.$route.query.id,bomId:id}).then(res => {
                    if(res.data.code==0){
                        this.resetQuery(id)
                        // this.getBomDetail(id)
                        this.endBoomData = this.bomList.find(item=>item.id===id)||{}
                        this.$emit('addSuccess')
                    }
                })
            },
            getBomList() {
                //商品档案
                if(this.fromType==='goods'){
                    let params = {
                        userId: this.userId,
                        styleId: this.$route.query.styleId
                    };
                    goodManageBoomAllData(params).then(ret => {
                        if (ret.data && ret.data.code === 0) {
                            this.bomList = ret.data.commonBomList;
                            this.endBoomData = this.bomList.find(item=>item.id===this.$route.query.bomId)||{}
                        } else {
                            this.$message.error(ret.data.msg);
                        }
                    });
                }else {
                    // 获取bom表格数据 设计档案
                    bomMaterialsList({userId:this.userId,designStyleId:this.$route.query.designStyleId}).then(res => {
                        this.bomList = res.data.data;
                        if(this.fromType==='designFile'){
                            this.endBoomData = this.bomList.find(item=>item.id===this.$route.query.bomId)||{}

                        }else {
                            sampleDetailMaterialSkuBom({sampleId: this.$route.query.id, bomId: this.$route.query.bomId}).then(res => {
                                console.log(res.data, 'BOM详情');
                                this.endBoomData = res.data.data || {}
                            })
                        }
                    });
                }


            },

            // 取消弹窗
            cancel(res) {
                this.createBomTableVisible = res;
                // this.
                // (this.$route.query.bomId)
            },
            // 当编辑删除BOM表成功后调用重新渲染数据
            theEditor(zhi) {

                let costRelationDeleteApi;
                if(this.fromType==='goods'){
                    costRelationDeleteApi = goodsCostRelationDelete
                }else {
                    costRelationDeleteApi =costRelationDelete
                }
                costRelationDeleteApi({bomId:this.$route.query.bomId,id:this.$route.query.id}).then(res=>{
                    if(res.data.code===0){
                        this.$emit('addSuccess')
                        this.endBoomData = {}
                    }
                })

            },
            // 新建BOM表
            chachCanNewBom() {
                // 权限
                if(!this.powerJudgement.permissions("fac.goods.bom.add") || !this.powerJudgement.permissions("fac.spl.design.style.bom.add")){
                    return
                }
                if (this.bomList.length > 8) {
                    this.$message({
                        showClose: true,
                        message: "最多只能创建8个BOM表",
                        type: "error"
                    });
                } else {
                    this.createBomTableVisible = true;
                }
            },
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
</style>
