<template>
    <div class="cost-accounting">
        <el-table
                class="cost-accounting-table"
                v-loading="loading"
                border
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    align="center"
                    prop="name"
                    label="核算单名称"
                    width="180">
                <template slot-scope="scope">
                    <p v-if="!scope.row.edit">{{scope.row.name}} <span v-if="scope.row.isDefault">(默认)</span></p>
                    <el-input :class="{'nameRepact':scope.row.nameRepact}" class="cost-accounting-table-name" v-else v-model="scope.row.name"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="bomName"
                    label="BOM表"
                    width="180">
                <template slot-scope="scope">
                    <el-select class="cost-accounting-table-name" popper-class="bigSel" :disabled="!scope.row.edit" v-model="scope.row.bomId" :placeholder="scope.row.edit?'请选择BOM模板':''">
                        <el-option
                                style="display: none"
                                label=""
                                value="">
                        </el-option>
                        <p @click="chachCanNewBom(scope.$index)" style="height: 30px;line-height: 30px;padding-left: 10px;color: #ffa914;cursor: pointer">新建BOM</p>
                        <el-option
                                v-for="item in boomAllData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                    width="180"
                    align="center"
                    prop="templateName"
                    label="工序模板">
                <template slot-scope="scope">
                    <el-select class="cost-accounting-table-name" popper-class="bigSel" :disabled="!scope.row.edit" v-model="scope.row.templateId" :placeholder="scope.row.edit?'请选择工序模板':''">
                        <el-option
                                style="display: none"
                                label=""
                                value="">
                        </el-option>
                        <p @click="chachCanNewTemplate(scope.$index)" style="height: 30px;line-height: 30px;padding-left: 10px;color: #ffa914;cursor: pointer">新建工序模板</p>
                        <el-option
                                v-for="item in sampleTemplateList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="sampleNo"
                    label="关联样衣号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="materialCost"
                    label="物料成本(元/件)">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="machiningCost"
                    label="加工成本(元/件)">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="totalCost"
                    label="总成本(元/件)">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作"
                    width="280">
                <template slot-scope="scope">
                    <div class="table-operation">
                        <div >
                            <span  v-if="!scope.row.edit" @click="$router.push(`/designFile/costDetail?id=${scope.row.id}&bomId=${scope.row.bomId}&styleId=${$route.query.id}&type=goods`)">查看详情</span>
                            <span style="color: #999" v-if="scope.row.edit" @click.stop="rowEditCancel(scope.row,scope.$index)">取消</span>
                        </div>
                        <div>
                            <p v-if="!scope.row.edit && scope.row.isDefault" style="color: #999">设为默认</p>
                            <span v-if="!scope.row.edit && !scope.row.isDefault" @click="sampleSetDefault(scope.row.id,scope.row.name)">设为默认</span>
                            <span style="color: #ffa914" @click="sampleCostSure(scope.row)" v-if="scope.row.edit">确定</span>
                        </div>
                        <div>
                            <span v-if="!scope.row.edit" @click="rowEdit(scope.row)">编辑</span>
                        </div>
                        <div>
                            <span v-if="!scope.row.edit&&!scope.row.sampleNo" @click="rowDelete(scope.row,scope.$index)">删除</span>
                        </div>
                    </div>

                </template>
            </el-table-column>
        </el-table>
        <p @click="tableDataAdd" style="cursor:pointer;color: #ffa914;border: 1px solid #e0e6ed;height: 30px;line-height: 30px;border-top: none;padding-left: 20px;">+新建核算单</p>
        <!-- 新建BOM组件 -->
        <transition name="right-move">
            <create-bom-table
                    from="goodsFile"
                    v-if="createBomTableVisible"
                    title="新建BOM表"
                    :styleId="$route.query.id"
                    @success="addSuccess"
                    @cancel="createBomTableVisible = false">
            </create-bom-table>
        </transition>
        <transition name="opcity">
            <div class="cover1" v-if="createBomTableVisible" @click="createBomTableVisible = false">
            </div>
        </transition>
        <!--新建弹窗-->
        <transition name="right-move">
            <procedure-create  detailFrom="goods" :show="isShow" :editId="editId" @toggle="addSampleTemplate" v-if="isShow"></procedure-create>
        </transition>
        <transition name="opcity">
            <div class="cover" v-show="isShow" @click="isShow = false">
            </div>
        </transition>
        <!-- 设为默认窗口 -->
        <el-dialog class="custom-dialog" :title="dialogTitle" :visible.sync="isUpdateDefaultVisible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text" style="margin-top: 10px;">{{dialogText}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <div v-if="dialogType !== 'updatePrice'">
                    <el-button  @click="isUpdateDefaultVisible = false">取 消</el-button>
                    <el-button  type="primary" @click="dialogSureGo">确认</el-button>
                </div>
                <div v-if="dialogType === 'updatePrice'">
                    <el-button  @click="isUpdateDefaultVisible = false;getList()">不更新</el-button>
                    <el-button  type="primary" @click="dialogSureUpdateGo">更新</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {goodManageBoomAllData,goodsUpdateCostDefault,goodsCostList,bomMaterialsList,goodsCostCreate,goodsCostUpdate,findTemplateSimpleList,goodsCostDefault,templateFindTemplate,sampleCostUpdate,goodsCostDelete} from '@/api'
    import CreateBomTable from "./goodsBom/CreateBomTable.vue";
    import procedureCreate from '../designFile/procedure/create'
    export default {
        props:['detailFrom'],
        name: "index",
        components:{CreateBomTable,procedureCreate},

        created(){
            this.onloadeBoomListData()
            this.getSampleTemplate()
          this.getList()
        },
        data() {
            return {
                deleteIndex:0,
                dialogType:'',
                dialogTitle:'',
                dialogText:'',
                isUpdateDefaultVisible:false,
                sampleSetDefaultId:'',
                sampleSetDefaultName:'',
                createBomTableIndex:0,
                createBomTableVisible:false,
                isShow:false,
                createTemplateIndex:0,
                tableData: [],
                tableDataBf:{},
                boomAllData: [],
                sampleTemplateList: [],
                loading: false
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        methods:{
            // 获取bom表格数据
            onloadeBoomListData() {
                let params = {
                    userId: this.userId,
                    styleId: this.$route.query.id
                };
                 goodManageBoomAllData(params).then(ret => {
                    if (ret.data && ret.data.code === 0) {
                        this.boomAllData = ret.data.commonBomList;
                    } else {
                        this.$message.error(ret.data.msg);
                    }
                });
            },

            // 新建工序模板数据
            chachCanNewTemplate(index){
                //制造点击事件去除下拉框
                $(".bigSel").css('display','none')
                this.createTemplateIndex = index;
                this.isShow = true
            },
           async addSampleTemplate(id){
                this.isShow=false;
               await this.getSampleTemplate();
               this.$set(this.tableData[this.createTemplateIndex],'templateId',id)

            },
            // 获取工序模板数据
            getSampleTemplate(){
                //新建
                findTemplateSimpleList({styleId:this.$route.query.id}).then(res=>{
                    this.sampleTemplateList = res.data.data || []

                })
            },
            getList(){
                this.loading = true
                goodsCostList({styleId:this.$route.query.id}).then(res => {
                    this.loading = false
                    console.log(res.data,'成本核算列表');
                    this.tableData = res.data.data
                })
            },

            rowEdit(row){
                this.tableDataBf[row.id] = {...row};
                this.$set(row,'edit',true);
                this.$set(row,'materialCost','');
                this.$set(row,'machiningCost','');
                this.$set(row,'totalCost','');

            },
            rowEditCancel(row,index){
                this.$set(row,'edit',false);
                if(!row.id){
                    //添加的
                    this.tableData.splice(index,1)
                }else {
                    //编辑的
                    this.tableData[index] = this.tableDataBf[row.id];
                    this.tableData=[...this.tableData]
                }


            },
            rowDelete(row,index){
                this.deleteIndex = index;
                this.isUpdateDefaultVisible = true;
                this.dialogType = 'delete';
                this.dialogTitle = '删除核算单';
                this.dialogText = '是否确认删除该核算单'+row.name;
            },
            sampleCostSure(row){
                let obj = {
                    name:row.name,
                    bomId:row.bomId,
                    templateId:row.templateId,
                    userId:this.userId,
                    styleId:this.$route.query.id,
                }
                if(!row.id){
                   // 新建
                    goodsCostCreate(obj).then(res=>{
                        if(res.data.code===0){
                            this.tableData[this.tableData.length-1] = res.data.data;
                            this.tableData = [...this.tableData];
                            this.$message.success(res.data.msg)
                        }else {
                            this.$message.error(res.data.msg)
                            if(res.data.code===2){
                                this.$set(row,'nameRepact',true)
                            }
                        }

                    })
                }else {
                    //编辑
                    obj.id = row.id;
                    goodsCostUpdate(obj).then(res=>{
                        if(res.data.code===0){
                            this.tableData = this.tableData.map(item=>item.id===row.id?res.data.data:item);
                            this.$message.success(res.data.msg)
                        }else {
                            this.$message.error(res.data.msg)
                            if(res.data.code===2){
                                this.$set(row,'nameRepact',true)
                            }
                        }
                    })
                }

            },
            sampleSetDefault(id,name){
                this.sampleSetDefaultId = id;
                this.sampleSetDefaultName = name;
                this.isUpdateDefaultVisible = true;
                this.dialogType = 'default';
                this.dialogTitle = '设为默认';
                this.dialogText = '是否将'+name+'设置为默认核算单？';

            },
            dialogSureGo(){
                if (this.dialogType==='default') {
                    return new Promise(resolve=>{
                        goodsCostDefault({id:this.sampleSetDefaultId}).then(res=>{
                            if(res.data.code===0){
                                resolve()
                            }else {
                                this.$message.error(res.data.msg)
                            }

                        })
                    }).then(res=>{
                        this.dialogType = 'updatePrice';
                        this.dialogTitle = '更新成本信息';
                        this.dialogText = '是否将'+this.sampleSetDefaultName+'成本信息更新到商品档案的物料成本、加工成本、计划成本价';
                    })

                }else if(this.dialogType==='delete'){
                    goodsCostDelete({id:this.tableData[this.deleteIndex].id}).then(res=>{
                        if(res.data.code===0){
                            this.$message.success('删除成功');
                            this.isUpdateDefaultVisible = false;
                            this.tableData.splice(this.deleteIndex,1)
                        }else {
                            this.$message.error(res.data.msg)
                        }

                    })
                }

            },
            //默认核算单更新价格
            dialogSureUpdateGo(){
                goodsUpdateCostDefault({id:this.sampleSetDefaultId}).then(res=>{
                    if(res.data.code===0){
                        this.isUpdateDefaultVisible = false;
                        this.getList();
                        this.$message.success(res.data.msg)
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 新建BOM表
            chachCanNewBom(index) {
                // 权限
                if(!this.powerJudgement.permissions("fac.goods.bom.add") || !this.powerJudgement.permissions("fac.spl.design.style.bom.add")){
                    return
                }
                if (this.boomAllData.length > 8) {
                    this.$message({
                        showClose: true,
                        message: "最多只能创建8个BOM表",
                        type: "error"
                    });
                } else {
                    //制造点击事件去除下拉框
                    $(".bigSel").css('display','none')
                    this.createBomTableIndex = index;
                    this.createBomTableVisible = true;
                }
            },
            //新建成功
           async addSuccess(id){
               await this.onloadeBoomListData()
               this.$set(this.tableData[this.createBomTableIndex],'bomId',id)
            },
            //添加核算单
            tableDataAdd(){
                this.tableData.push({edit:true,name:'', bomId:'', templateId:'',})
            },


        },
    }
</script>

<style lang="scss" scoped>
    .nameRepact{
        width:calc(100% - 2px);
        border: 1px solid red;
    }
    .table-operation{
        display: flex;
        div{
            width: 70px;
            text-align: center;
            border-right: 1px solid #e0e6ed;
            height: 40px;
            line-height: 40px;
            span{
                cursor: pointer;font-size: 14px;color: #1CA1FF;text-decoration: underline;
            }
        }
    }

</style>
<style lang="scss" >
    .cost-accounting-table{
        .cell{padding: 0;}
        .cost-accounting-table-name{
            .el-input__inner{
                border: none;
                height: 40px;
                line-height: 40px;
                background: #FFF9ED;
            }
        }
        .el-input.is-disabled .el-input__inner{
            background: transparent;
        }
    }

</style>
