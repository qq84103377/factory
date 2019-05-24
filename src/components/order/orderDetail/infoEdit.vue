<template>
    <el-dialog class="custom-dialog edit-order-node-info-dialog" size="tiny" title="修改节点信息" :visible.sync="editInfoVisible" @close="cancel">
        <el-form ref="form" :model="updateForm" label-width="80px">
            <el-form-item class="form-item-wrap" label="负责人" label-width="100px">
                <div class="form-item">
                    <el-select
                            v-model="updateForm.leaderIds"
                            multiple placeholder="请选择负责人">
                        <el-option v-for="(leaderItem, leaderIndex) in options.personOptions"
                                   :key="leaderIndex" :label="leaderItem.userName"
                                   :value="leaderItem.id"></el-option>
                    </el-select>
                </div>
            </el-form-item>
            <template v-if="costShow">
                <el-form-item class="form-item-wrap" label="工人工价" label-width="100px" v-if="nodeCode != -1">
                    <div class="form-item">
                        <el-input v-model="updateForm.labourCost" placeholder="未填写"></el-input>
                    </div>
                </el-form-item>
            </template>
            <template v-if="costShow&&updateForm.outSideFlag">
                <el-form-item class="form-item-wrap" label="加工厂工价" label-width="100px" v-if="nodeCode != -1">
                    <div class="form-item">
                        <!-- 加工厂信息 -->
                        <div class="isTable">
                            <el-table
                                :data="tableData"
                                class="processing"
                                border
                                stripe
                                :maxHeight="700"
                                style="width: 100%"
                                :row-class-name="tableRowClassName">
                                <!--加工厂商 prop="processingName"-->
                                <el-table-column
                                        label="加工厂商">                                        >
                                    <template slot-scope="scope">
                                        <el-select
                                                :disabled="outSideFlags"
                                                v-model="scope.row.outsideFactoryId"                                                    
                                                filterable
                                                placeholder="请选择外发厂">
                                            <el-option
                                                v-for="item in outsideFactoryList"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <div slot="append" style="text-align: left;padding-left:20px;color:#ff9c38;cursor: pointer;" >
                                    <span @click="appendOutsideFactory">+ 添加外发厂</span>
                                </div>
                                <!--加工单价-->
                                <el-table-column
                                    label="加工单价"
                                    >
                                    <template slot-scope="scope">
                                        <el-input :disabled="outSideFlags" v-model="scope.row.machiningUnitPrice" ></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <!-- <el-input v-model="updateForm.labourCost" placeholder="未填写"></el-input> -->
                    </div>
                </el-form-item>
            </template>
            <el-form-item class="form-item-wrap" label-width="100px" label="预计完成日期">
                <div class="form-item">
                    <nf-picker :beginTime='updateForm' :timeSelect="'end'" @endAt='nodeEnTime'></nf-picker>
                </div>
            </el-form-item>
            <el-form-item label="添加附件" label-width="100px">
                <attachEdit
                        class="file-upload"
                        :isShowClose="true"
                        @fileProgress="fileProgress"
                        @attachD='attachList'
                        :attachData="updateForm.nodeAttachments"></attachEdit>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button :disabled="isSaving" type="primary" @click="confirm">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import nfPicker from '../nf-picker'
    import attachEdit from "@/components/goods/child/attachEdit";
    import numNodeOutside from "./num-node-outside";
    import { outsideFactoryListForSelect,getSubmatrixOutside } from "@/api/api";
    export default {
        props: {
            updateForm: {},
            options: {},
            nodeCode: '',
            visible: false
        },
        data() {
            return {
                pickerBeginDateAfter: {
                    disabledDate: (time) => {
                        let beginDateVal = this.updateForm.dateStart;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                costShow: false,             //是否显示查看工价
                editInfoVisible: this.visible,
                outsideFactoryList:[],
                outsideFactoryTable: [],
                fileUploading: false,
                outSideFactoryId:'',
                tableData:[],//加工厂信息
                // outSideFlags:this.$store.state.outSideFlag,//整单外发的标志位
            }
        },
        components: {
            nfPicker,
            attachEdit,
            numNodeOutside
        },
        watch: {
            'updateForm.endAt'(val) {
                this.updateForm.endAt = val;
            },
            'updateForm.beginAt'(val) {
                this.updateForm.beginAt = val;
            },
            'visible'(val) {
                this.editInfoVisible = val;
            },
            'updateForm.facMissionOutsideFlag'(val) {
                console.log(val,'778')
                if (val) {
                    this.outsideFactoryTable = [{facMissionOutsideFactoryName: this.updateForm.facMissionOutsideFactoryName,machiningUnitPrice: this.updateForm.machinigPrice,outsideFactoryId:this.updateForm.facMissionOutsideFactoryId}]
                } else {
                    this.outsideFactoryTable = this.updateForm.facMissionPrcdNodeOutsideFactoryList
                }
            }
        },
        computed: {
            //整单外发的标志位
            outSideFlags(){
                return this.$store.state.outSideFlag;
            }
        },
        methods: {
            //上传附件成功后的返回值
            attachList(list) {
                this.updateForm.nodeAttachments = list;
                this.fileUploading = false;
            },
            //附件上传中
            fileProgress(){
                this.fileUploading = true;
            },
            //nf-picker 接受值
            nodeBeTime(item, val) {
                this.updateForm.dateStart = val;
                this.updateForm.beginAt = val;
                this.$emit('update:updateForm', this.updateForm)
            },
            nodeEnTime(item, val) {
                this.updateForm.dateEnd = val;
                this.updateForm.endAt = val;
                this.$emit('update:updateForm', this.updateForm)
            },
            // 判断查看工价权限
            checkCost() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
                if (datalist.indexOf("fac.mission.labour.cost.view") == -1) {
                    this.costShow = false;
                } else {
                    this.costShow = true;
                }

            },
            cancel(){
                this.$emit('cancelEdit')
            },
            confirm(){
                //附件上传完毕
                if(!this.fileUploading){
                    this.$emit('confirmEdit',this.tableData);
                }
                //附件上传中
                else{
                    this.$message.error("附件加载中，请稍等");
                }
            },
            // 获取外发厂列表
            getOutsideFactoryList(){
                let params= {
                    factoryId:JSON.parse(sessionStorage.getItem("last_login")).id,
                    userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId
                }
                outsideFactoryListForSelect(params).then(res=>{
                    console.log(res,'外发工厂列表')
                    if(res.data.code ===0){
                        this.outsideFactoryList=res.data.data
                    }
                })
            },
            // 添加外发厂
            appendOutsideFactory(){
                let item = {
                    processingName:"",
                    processingPrice:'',
                }
                this.tableData.push(item);
            },
            //获取子矩阵数据外发厂数据信息
            getSubmatrixData() {
                let params = {
                    missionPrcdNodeId: this.updateForm.header.missionNodeId,
                };
                getSubmatrixOutside(params).then(res => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.data.facMissionPrcdNodeOutsideFactoryDTOS;
                    }
                })
            },

        },
        created() {
            // console.log('这边拿的到数据吗：',this.$store.state.outSideFlag);
            // console.log(this.updateForm,1111)
            this.updateForm.endAt = this.updateForm.dateEnd
            this.updateForm.beginAt = this.updateForm.dateStart
            this.$nextTick(() =>{
                if (this.updateForm.facMissionOutsideFlag) {
                    this.outsideFactoryTable = [{facMissionOutsideFactoryName: this.updateForm.facMissionOutsideFactoryName,machiningUnitPrice: this.updateForm.machinigPrice}]
                } else {
                    this.outsideFactoryTable = this.updateForm.facMissionPrcdNodeOutsideFactoryList
                }
            })
            
            this.updateForm.outSideFactoryId =  !this.updateForm.outSideFactoryId||this.updateForm.outSideFactoryId=='null'?'':this.updateForm.outSideFactoryId

            this.checkCost()
            this.getOutsideFactoryList();
            this.getSubmatrixData();
        }
    }
</script>
<style lang="scss">
.isTable{
    .processing{
        .el-table__row{
            &:hover > td{
                background-color:#fff;
            }
            input{
                border:none;
            }

        }
    }
}
    .edit-order-node-info-dialog{
        .el-dialog--tiny{
            width: 645px !important;
        }
    }
</style>
<style lang="scss" scoped>
.edit-order-node-info-dialog{
    .form-item{
        .el-select,el-input{
            width: 100%;
        }
    }
}
</style>

