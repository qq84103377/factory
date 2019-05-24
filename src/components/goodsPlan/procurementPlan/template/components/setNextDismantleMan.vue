<!--"设置标签项默认下级拆解负责人"组件-->
<template>
    <div class="set-next-dismantle-man">
        <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" class="custom-dialog " title="设置标签项默认下级拆解负责人"
                   :visible.sync="visible" size="small" @close="cancel">
            <div class="header">
                <el-input @change="searchChange" v-model.trim="searchText" style="width: 240px;" placeholder="搜索" icon="search"></el-input>
                <div>
                    <nf-button fsize='12'  @click="showBatchMan('principal')">批量设置负责人</nf-button>
                    <nf-button fsize='12'  @click="showBatchMan('auditor')">批量设置审核人</nf-button>
                </div>
            </div>
            <div class="mgt16">
                <el-table
                        ref="multipleTable"
                        max-height="400"
                        @select="select"
                        @selection-change="selectionChange"
                        @select-all="selectAll"
                        class="custom-table no-hover-highlight"
                        border
                        :data="filterList">
                    <el-table-column
                            type="selection"
                            width="55"></el-table-column>
                    <el-table-column
                            prop="attrVal"
                            label="标签项">
                    </el-table-column>
                    <el-table-column
                            class-name="no-padding"
                            prop="chargerIds"
                            width="220"
                            label="默认下级拆解负责人">
                        <template slot-scope="scope">
                            <v-user-select v-model="scope.row.chargerIds" :options="groupOptions" placeholder="请选择下级拆解负责人" @remote="fetchUnitUser"></v-user-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                            class-name="no-padding"
                            prop="auditorIds"
                            width="220"
                            label="默认下级拆解审核人">
                        <template slot-scope="scope">
                            <v-user-select v-model="scope.row.auditorIds" :options="groupOptions" placeholder="请选择下级拆解审核人" @remote="fetchUnitUser"></v-user-select>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" class="custom-dialog " :title="batchMan.type==='principal'?'批量设置负责人':'批量设置审核人'"
                   :visible.sync="batchMan.visible" size="tiny" @close="batchMan.visible = false">
            <div class="text-center">
                <span>{{batchMan.type==='principal'?'负责人':'审核人'}}</span>
                <worker-leader v-model="batchMan.value" style="width: 220px;margin-left:10px" :placeholder="batchMan.type==='principal'?'请选择负责人':'请选择审核人'" ></worker-leader>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="batchMan.visible = false">取 消</el-button>
                <el-button type="primary" @click="confirmBatchMan">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getUnitUser } from '@/api';

    export default {
        props: ['visible','list'],
        components: {
        },
        data() {
            return {
                searchText:'',
                batchMan:{
                    visible:false,
                    type:'principal',//principal负责人 auditor审核人
                    value:[],
                },
                selection:[],
                selectRows:[],
                groupOptions:[], //负责人、审核人下拉数据
                filterList:[],
                // backupList:[],//备份设置前的列表，点击取消的时候还原回去
            }
        },
        created() {
            this.fetchUnitUser()

        },
        watch: {
            visible(val){
                if(val){
                    this.filterList = this.list
                    // this.backupList = JSON.parse(JSON.stringify(this.list))
                }
            }
        },
        computed: {
            unitId() {
                return  JSON.parse(sessionStorage.getItem('user_login')).unitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
        },
        methods: {
            cancel(){
                this.$emit('update:visible',false)
            },
            confirm(){
                this.$emit('confirm',this.list)
                this.$emit('update:visible',false)
            },
            // 显示批量设置负责人、审核人
            showBatchMan(type){
                if(!this.selection.length){
                    this.$message.error('请选择标签项')
                    return
                }
                this.batchMan.value = []
                this.batchMan.type = type
                this.batchMan.visible = true
            },
            confirmBatchMan(){
                // 修改负责人
                    this.selection.forEach(selectItem =>{
                         this.filterList.forEach((item,index) =>{
                            if(item.attrId ==selectItem.attrId){
                                if(this.batchMan.type === 'principal'){
                                    this.$set(this.filterList[index],'chargerIds',this.batchMan.value)
                                }
                                if(this.batchMan.type === 'auditor'){
                                    this.$set(this.filterList[index],'auditorIds',this.batchMan.value)
                                }
                            }
                        })
                    })
                this.batchMan.visible = false
            },
            // 获取负责人下拉数据
            fetchUnitUser(keyword = '') {
                getUnitUser({
                    unitId: this.unitId,
                    keyword
                }).then(res => {
                    this.groupOptions = res.data.data.facGroupDTOS;
                });
            },
            // 表格选择行改变时
            selectionChange(selection){
                this.selection = selection
            },
            // 选中行
            select(selection,row){
                if(selection.includes(row)){
                    this.selectRows.push(row)
                } else {
                    this.selectRows.splice(this.selectRows.indexOf(row),1)
                }
            },
            // 全选、反选
            selectAll(selection){
                if(selection.length){
                    this.selectRows=this.selectRows.concat(selection)
                    this.selectRows = Array.from(new Set(this.selectRows))
                } else {
                    this.filterList.forEach(item =>{
                        let index = this.selectRows.indexOf(item)
                        if(index>-1){
                            this.selectRows.splice(index,1)
                        }
                    })
                }
            },
            // 筛选数据
            searchChange(val){
                this.filterList = this.list.filter((item)=>{
                    return val === '' || item.attrVal.indexOf(val) >-1
                })
                this.$nextTick(function () {
                    this.selectRows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                })
            },
        }
    }
</script>

<style lang="scss">
    .set-next-dismantle-man {
        .el-dialog--small {
            width: 360px;
        }
        .el-dialog--small {
            width: 742px;
        }
        .el-select{
            width: 100%;
        }
        .no-padding .v-select .el-input__inner{
            background-color: #FFF9ED;
            border: none;
        }
        td.no-padding,
        td.no-padding:hover{
            background-color: #FFF9ED !important;
        }
    }

</style>


<style lang="scss" scoped>
    .set-next-dismantle-man {
        .header{
            display: flex;
            justify-content: space-between;
        }
    }

</style>
