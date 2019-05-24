<template>
<div class="print-template-list ">
    <page-title :title="title">
        <el-input  placeholder="输入模板名字搜索" icon="search" v-model="searchPrint" @change="searchPrintName">
        </el-input>
        <!--<nf-button v-if="isPrinTemplateBoot" style="margin-left:32px;" type="warning" @click="$router.push('/printList')">-->
          <!--打印模板设置-->
        <!--</nf-button>-->
    </page-title>
    <div class="print-tab box-shadow">
        <div class="print-tab-left">
            <ul>
                <li :class="{'active':currentIndex==index}"  v-for="(item,index) in types" :key="index" @click="selectTemplate(index)">
                    <p>{{item.name}}</p>
                    <p class="desc">{{item.instructions}}</p>
                    <div :class="{'line':index==currentIndex}"></div>
                </li>
            </ul>
        </div>
        <div class="print-tab-right" v-loading="listLoading">
            <ul v-if="templateItem.length > 0">
                <!-- <el-radio-group v-model="checked" @change="updateStatus(templateItem.template.list[checked])"> -->
                    <li v-for='(item,index) in templateItem' :key="index">
                        <div>{{item.name}}</div>
                        <div class="order_alert" v-if="isPrinTemplateBoot">
                        <el-checkbox v-model="item.defaultStatus"
                                        @change="updateStatus(item,'defaultStatus')" :disabled="item.defaultStatus">默认模板
                        </el-checkbox>

                        <!-- <el-radio :label="index">默认模板</el-radio> -->
                        <el-checkbox v-model="item.status"
                                        @change="updateStatus(item,'status')">启用
                        </el-checkbox>
                        </div>
                        <div class="action-btn" v-else>
                            <span v-if="types[currentIndex]&&types[currentIndex].type != 'stock'" @click="$router.push({path:'/editPrintTemplate',query:{type:type,tempId:item.id}})"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-edit"></icon>编辑</span>
                            <span v-if="types[currentIndex]&&types[currentIndex].type != 'stock'" @click="deleteShow(index,item)" ><icon style="width:12px;height:12px;margin-right:4px;" type="icon-delete"></icon>删除</span>
                        </div>
                    </li>
                <!-- </el-radio-group> -->
            </ul>
            <div class="page text-right pdtb15 pdlr15">
                <div v-if="!isPrinTemplateBoot && types[currentIndex]&&types[currentIndex].type != 'stock'" class="new-template-btn" @click="$router.push({path:'/editPrintTemplate',query:{type:type}})">+新建{{name}}</div>
                <el-pagination @current-change="handleCurrentChange"
                                :page-size="pageSize"
                               layout="total, prev, pager, next" :total="totalCount">
                </el-pagination>
            </div>
        </div>
        <el-dialog
          :modal-append-to-body="false"
          :show-close="false"
          :visible.sync="visible.deleteTemplate"
          top="25%"
          size="tiny">
          <div class="dialog-content-wrap">
            <div>
              <p style="font-size:20px;margin-bottom:16px;" class="delete-tip">是否要删除{{templateName}} ？</p>
              <p>删除后无法恢复</P>
            </div>
            <div style="margin-top:24px;" class="handle-delete">
              <nf-button style="margin-right:12px;" @click="visible.deleteTemplate = false">取 消</nf-button>
              <nf-button type="warning" @click="handleDelete">确 定</nf-button>
            </div>
          </div>
        </el-dialog>
    </div>
</div>
</template>
<script>
import {getPrintTypes,updateStatus,deletePrintTemplate,facTemplates,templates} from '../../api/api'
export default {
    props: ['isPrinTemplateBoot','title'],
    data() {
        return {
            pageNo: 1,
            totalCount: 0,
            pageSize: 7,
            searchPrint:'',
            lineShow:true,
            checked:true,
            template:{},
            templateItem:[],
            typeId:'',
            visible:{
                deleteTemplate:false,
            },
            showI:'',
            templateName:'',
            templateId:'',
            userId: '',
            name:'',
            type: '', //类型
            loading:false,
            listLoading:false,
            defaultStatus: null,
            types: [], // 左边打印分类列表
            currentIndex: 0
        }
    },
    methods: {
        //更新状态
        updateStatus(item,type) {
            let status = ''
            if(type == 'defaultStatus') {
                status = 4
            } else {
                status = item.status ? 2 : 3
            }
            let params = {
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                userId: this.userId,
                tempId:item.id,
                type:status,
            };
            updateStatus(params).then(
                res =>{
                    this.isPrinTemplateBoot ? this.getFacTemplates(this.typeId) : this.getTemplates(this.typeId)
                }
            )
        },
        // 获取左侧打印列表
        async getPrintTypes() {
            await getPrintTypes().then(
                res => {
                    this.types = res.data.data.types
                }
            )
        },
        // 获取组织层列表
        getFacTemplates (id) {
            let params = {
               userId: this.userId,
               unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
               typeId: id,
               keyword: this.searchPrint,
               pageNo: this.pageNo,
               pageSize: 7,
               using:false
            }
            this.listLoading = true
            facTemplates(params).then(res => {
                this.templateItem = res.data.data.list
                this.templateItem.forEach(i => {
                    i.defaultStatus = i.defaultStatus === 0 ? false : true
                    i.status = i.status === 0 ? true : false
                })
                this.listLoading = false
                this.totalCount = res.data.data.totalCount
            })
        },
        // 获取组织层列表
        getTemplates (id) {
            let params = {
               userId: this.userId,
               unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
               typeId: id,
               keyword: this.searchPrint,
               pageNo: this.pageNo,
               pageSize: 7
            }
            this.listLoading = true
            templates(params).then(res => {
                this.templateItem = res.data.data.list
                this.templateItem.forEach(i => {
                    i.defaultStatus === 0 ? false : true
                    i.status === 0 ? false : true
                })
                this.totalCount = res.data.data.totalCount
                this.listLoading = false
            })
        },
        // 删除模板
        handleDelete() {
            let params = {
                tempId:this.templateId,
                token:'',
                userId: this.userId,
            }
            deletePrintTemplate(params).then(
                res => {
                    if(res.data.code === 0) {
                        this.isPrinTemplateBoot ? this.getFacTemplates(this.typeId) : this.getTemplates(this.typeId)
                        this.$message.success('删除成功')
                    } else {
                        this.$message.error('默认模板不允许删除')
                    }

                    this.visible.deleteTemplate = false
                }
            )
        },
        // 删除弹窗
        deleteShow(index,item) {
            this.showI= index
            this.templateName = item.name
            this.templateId = item.id
            this.visible.deleteTemplate = true
        },
        // 选择模板类型
        async selectTemplate(index) {
            let curIndex = index
            this.currentIndex = curIndex
            this.typeId = this.types[curIndex].id
            this.type = this.types[curIndex].type
            this.name = this.types[curIndex].name
            this.isPrinTemplateBoot ? await this.getFacTemplates(this.typeId) : await this.getTemplates(this.typeId)
        },
        // 查询
        async searchPrintName() {
            this.isPrinTemplateBoot ? await this.getFacTemplates(this.typeId) : await this.getTemplates(this.typeId)
        },
        //分页切换
        async handleCurrentChange(val) {
            this.pageNo = val
            this.isPrinTemplateBoot ? await this.getFacTemplates(this.typeId) : await this.getTemplates(this.typeId)
        }
    },
    async created(){
        this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
        await this.getPrintTypes()
        if(this.$route.query.type) {
            let curIndex = 0
            let curType = this.$route.query.type
            this.types.forEach((i,index) => {
                if(curType == i.type) {
                    curIndex = index
                }
            })
            await this.selectTemplate(curIndex)
        } else {
            await this.selectTemplate(this.currentIndex)
        }
    }

}
</script>
<style lang="scss" scoped>
    @import "~scss_vars";
    .print-tab {
        display: flex;
        align-items: stretch;
        min-height: 623px;
        width: 100%;
        flex: 1;
        background-color: #fff;
        .print-tab-left {
            max-width: 329px;
            min-width: 314px;
            height: 623px;
            overflow-y: auto;
            ul {
                li {
                    width: 100%;
                    padding:16px 24px;
                    font-size: 14px;
                    position: relative;
                    border-bottom: 1px solid #DFE6EC;
                    cursor: pointer;
                    &.active{
                        background-color:#F5F7FA;
                        &:before{
                            content: '';
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 6px;
                            height: 100%;
                            background-color: $color-btn;
                        }
                    }
                    .desc{
                        font-size: 12px;
                        margin-top: 6px;
                        color: #A2ABB8;
                    }

                }
            }
        }
        .print-tab-right {
            border-left: 1px solid #DFE6EC;
            flex: 1;
            ul {
                .el-radio-group{
                    display: block;
                }
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    line-height: 40px;
                    font-size: 14px;
                    padding:0 24px ;
                    border-bottom: 1px solid #DFE6EC;
                    &:hover{
                        background-color:#F5F7FA;
                    }
                    .action-btn{
                        color: #808080;
                        &>span{
                            cursor: pointer;
                            &:first-child{
                                border-right: 1px solid #DFE6EC;
                                padding-right: 10px;
                                margin-right: 6px;
                            }
                        }
                    }
                }
            }
            .page{
                position: relative;
                .new-template-btn{
                    position: absolute;
                    cursor: pointer;
                    line-height: 32px;
                    color: #FFA914;
                }
            }

        }
    }
</style>
<style lang="scss">
    .print-template-list {
        .el-input, .el-input__inner {
            width: 240px;
        }

        .el-checkbox__inner {
            width: 16px;
            height: 16px;
            border-radius: 2px;
            border: solid 1px #dce0e6;
            &::after {
                top: 0;
                left: 4px;
            }
        }
        .dialog-content-wrap{
          text-align:center;
        }
    }
</style>



