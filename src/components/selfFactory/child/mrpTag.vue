<template>
    <div class="sizeTypeCategory">
        <div class="sizeTypeCategory-header">
            <content-wrap title="编辑MRP标签" type="big" style="margin-top: 24px;margin-left: -30px;"></content-wrap>
            <span class="header_right">
                <nf-button style="width: 98px;" @click="$emit('hiddenWindow')">
                    收起<icon style="width:12px;height:8px;position:relative;top:-1px;left:4px;" type="icon-packup"></icon>
                </nf-button>
            </span>
        </div>
        <div class="color-table">
            <el-table
                    :row-class-name="cellStyle"
                    border
                    :data="info"
                    max-height="800"
                    style="width: 100%;overflow-x: hidden">
                <el-table-column
                        label="标签名称"
                        align="center"
                >
                    <template slot-scope="scope">
                        <p v-if="!scope.row.edit" class="nodeDialog-nodesizeTypeCategory">{{scope.row.name}}</p>
                        <el-input v-model.trim="scope.row.name" v-if="scope.row.edit" v-focus="scope.row.edit"
                                  class="createNodeInput"></el-input>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="createNodeTableSlot mgr8 cursor" v-if="!scope.row.edit">
                            <span v-if="scope.$index!==0 && !canMove" @click="dataSort(scope.row.id,'UP',scope.$index)" >上移</span>
                            <span v-if="scope.$index!==0 && canMove" style="cursor: not-allowed">上移</span>
                        </span>
                        <span class="createNodeTableSlot mgr8 cursor"  v-if="!scope.row.edit">
                            <span v-if="scope.$index!==info.length-1 && !canMove" @click="dataSort(scope.row.id,'DOWN',scope.$index)">下移</span>
                            <span v-if="scope.$index!==info.length-1 && canMove" style="cursor: not-allowed">下移</span>
                        </span>
                        <span class="mgr8 cursor" @click="handleEdit(scope.$index, scope.row.name)"
                              v-if="!scope.row.edit">编辑</span>
                        <span class="mgr8 cursor gray" @click="handleEditCancel(scope.$index, scope.row)"
                              v-if="scope.row.edit">取消</span>
                        <span class="mgr8 cursor orange" @click="handleEditSure(scope.$index, scope.row.name,scope.row.id)"
                              v-if="scope.row.edit">确定</span>
                        <span class="mgr8 cursor" @click="handleDelete(scope.row.id,scope.$index)"
                              v-if="!scope.row.edit">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <p class="createNodeTableAdd" @click="tagTableAdd">+ 添加</p>
        </div>
        <!--<el-dialog-->
        <!--:show-close="false"-->
        <!--:modal="false"-->
        <!--:visible.sync="visible.deleVisible"-->
        <!--size="tiny">-->
        <!--<div class="dialog-content-wrap">-->
        <!--<div>-->
        <!--<icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>-->
        <!--<p class="delete-tip">是否确定删除当前物料规格？</p>-->
        <!--</div>-->
        <!--<div class="handle-delete">-->
        <!--<nf-button @click="visible.deleVisible = false">取 消</nf-button>-->
        <!--<nf-button type="warning" @click="delMaterialSpec(delItem,delIndex)">确 定</nf-button>-->
        <!--</div>-->
        <!--</div>-->
        <!--</el-dialog>-->
    </div>
</template>
<script>
    import {editBillLabel,addBillLabel,deleteBillLabel,billLabelSeqencing,queryAllBillLabel} from '@/api'
    export default {
        props:['orderId', ''],
        data() {
            return {
                editName:'',
                type:'',
                info:[],
                canMove:false
            }
        },
        computed:{
            userId(){
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            }
        },
        //自动获取焦点，对input进行DOM操作，实际上；
        directives: {
            focus: {
                inserted: (el, {value}) => {
                    if (value) {
                        //由于是饿了么的el-input，需要拿到父元素下面的input
                        el.firstElementChild.focus();
                    }
                }
            }
        },
        computed: {
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            },
        },
        created() {
            this.getQueryAllBillLabel()
        },
        methods: {
            // mrp标签
            getQueryAllBillLabel() {
                let params = {
                    keyword: "",
                    userId: this.userId
                }
                queryAllBillLabel(params).then(res => {
                    this.info = res.data.data
                })
            },
            // 添加
            tagTableAdd() {
                if(this.info.length>0&&!this.info[this.info.length-1].id) {
                    this.info.splice(this.info.length-1,1);
                } else {
                    this.type='add';
                    this.canMove=true;
                    this.info.forEach((item, index) => {
                        if(item.edit){
                            this.$set(this.info[index], 'name',  this.editName)
                        }
                    });
                    this.editName = '';
                    this.info.forEach((item, index) => {
                        this.$set(this.info[index], 'edit', false)
                    });
                    this.info.push({edit: true})
                }
            },
            // this.$emit('update:visible',false)
            cellStyle(obj) {
                // console.log(obj);
                if (obj.edit) {
                    return 'row-active'
                }
            },
            //标签编辑
            handleEdit(index, editName) {
                let flag = true;
                this.info.forEach((item, index) => {
                    if(item.edit){
                        this.$message.error('还有数据没保存')
                        flag = false
                    }
                });
                if(!flag) return;
                this.canMove=false;
                this.type='edit';
                this.editName = editName;
                this.info = this.info.filter(item => item.id);
                this.$set(this.info[index], 'edit', true)
            },
            // 取消
            handleEditCancel(index) {
                this.canMove=false;
                this.$set(this.info[index], 'name', this.editName);
                this.$set(this.info[index], 'edit', false);
                this.info = this.info.filter(item => item.name);
            },
            // 确定
            handleEditSure(index,name,id) {
                if(!name){
                    this.$message.error('标签名称不能为空')
                    return
                }
                if(name.length>20){
                    this.$message.error('标签名称不能超过20个字符')
                    return
                }
                //查重
                let arrName = [];
                let flag = true;
                this.info.forEach(item=>{
                    arrName.push(item.name)
                });
                let arrNameRepeact = arrName.sort();
                for (let i = 0; i < arrNameRepeact.length-1; i++) {
                    if (arrName[i] === arrName[i + 1]) {
                        flag = false
                    }
                }
                if(!flag){
                    this.$message.error('标签名称重复');
                    return
                }
                //新建
                if(this.type==='add'){
                    let obj = {
                        userId:this.userId,
                        label:name
                    }
                    addBillLabel(obj).then(res=>{
                        if(res.data.code===0){
                            this.$set(this.info[index], 'id', res.data.data.id);
                            this.$message.success('新建成功')

                        }else {
                            this.$message.error('新建失败')
                        }

                    })
                }else {
                    //编辑
                    let params = {
                        userId:this.userId,
                        id,
                        label:name
                    };
                    editBillLabel(params).then(res=>{
                        if(res.data.code===0){
                            this.$message.success('编辑成功')

                        }else {
                            this.$message.error(res.data.msg)
                        }
                    })

                }
                this.canMove=false;
                this.$set(this.info[index], 'edit', false);
            },
            //删除
            handleDelete(id,index){
                let params = {
                    userId:this.userId,
                    id,
                };
                deleteBillLabel(params).then(res=>{
                    if(res.data.code===0){
                        this.$message.success('删除成功')
                        this.getQueryAllBillLabel()
                    }else {
                        this.$message.error('已有单据使用该标签，不可删除')
                    }
                })
            },
            //移动
            dataSort(id,type,index){
                this.canMove = true
                let params = {
                    userId:this.userId,
                    id,
                    type
                };
                billLabelSeqencing(params).then(res=>{
                    this.canMove = false
                    if(type==='DOWN'){
                        [this.info[index],this.info[index+1]] = [this.info[index+1],this.info[index]]
                        console.log(this.info);

                    }else {
                        [this.info[index],this.info[index-1]] = [this.info[index-1],this.info[index]]

                    }
                    this.info=[...this.info]
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .createNodeTableAdd {
        color: #ff8d37;
        border: 1px solid rgb(223, 228, 236);
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-top: none;
        cursor: pointer;
    }
    .sizeTypeCategory {
        position: fixed;
        top: 0;
        right: 0;
        width: 850px !important;
        height: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 101;
        padding: 0 20px;
        box-sizing: border-box;
        .sizeTypeCategory-header {
            width: 850px;
            height: 88px;
            color: #3b3b3b;
            font-size: 24px;
            padding: 16px 32px 20px 32px;
            box-sizing: border-box;
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 2;
        }
        .sizeTypeCategory-table{
            margin:32px;
            box-sizing: border-box;
        }
        .createNodeTableSlot{
            display: inline-block;
            width: 30px;
        }
    }
</style>
<style lang="scss">
    @import "../../../assets/style/reset.css";
    @import "../../../assets/style/element-reset.scss";

    .sizeTypeCategory {
        .el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: transparent;
        }
        .row-active > td:first-child .cell {
            border: 1px solid #ff8d37;
        }
        .createNodeInput .el-input__inner {
            border: none;
            text-align: center;
        }
    }

</style>





