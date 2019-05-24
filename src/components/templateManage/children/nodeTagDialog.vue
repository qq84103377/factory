<template>
    <div class="create-node-dialog">
        <!--标签弹窗-->
        <el-dialog class="custom-dialog" :visible.sync="visible" title="预设标签" :modal-append-to-body="false"
                   @close="$emit('update:visible',false);isLoadiing = false;"
                   :close-on-click-modal="false" size="tiny">
            <div class="soltTable">
                <el-table
                        :row-class-name="cellStyle"
                        border
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            label="标签名称"
                    >
                        <template slot-scope="scope">
                            <p v-if="!scope.row.edit" class="nodeDialog-nodeTagName" :data-id="scope.row.id"
                               :data-use="scope.row.use" :data-prcdnodeid="prcdNodeId">{{scope.row.tagName}}</p>
                            <el-input v-model.trim="scope.row.tagName" v-if="scope.row.edit" v-focus="scope.row.edit"
                                      class="createNodeInput"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <span class="createNodeTableSlot mgr8 cursor" v-if="!scope.row.edit">排序</span>
                            <span class="mgr8 cursor" @click="handleEdit(scope.$index, scope.row.tagName)"
                                  v-if="!scope.row.edit">编辑</span>
                            <span class="mgr8 cursor gray" @click="handleEditCancel(scope.$index, scope.row)"
                                  v-if="scope.row.edit">取消</span>
                            <span class="mgr8 cursor orange" @click="handleEditSure(scope.$index, scope.row.tagName)"
                                  v-if="scope.row.edit">确定</span>
                            <span class="mgr8 cursor" @click="handleDelete(scope.$index, scope.row)"
                                  v-if="!scope.row.edit && scope.row.canDelete">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
                <p class="createNodeTableAdd" @click="tagTableAdd">+ 添加</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" :loading="isLoadiing" @click="editSure">确认</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import Sortable from "sortablejs";   //拖拽组件
    export default {
        /*
        source 是edit的时候是编辑标签
         */
        props: ['visible', 'propTableData', 'source', 'prcdNodeId'],
        name: "nodeTagDialog",
        data() {
            return {
                isLoadiing: false,
                tableData: [],

            }
        },
        watch: {
            propTableData: {
                handler(curVal, oldVal) {
                    this.tableData = JSON.parse(JSON.stringify(curVal))
                },
                deep: true
            }
        },
        comments: {
            Sortable
        },
        //自动获取焦点，对input进行DOM操作，实际上；
        directives: {
            focus: {
                inserted: (el, {value}) => {
                    // console.log(el,value);
                    if (value) {
                        //由于是饿了么的el-input，需要拿到父元素下面的input
                        el.firstElementChild.focus();
                    }
                }
            }
        },
        mounted() {
            if(this.propTableData){
                this.tableData = JSON.parse(JSON.stringify(this.propTableData))
            }
            const that = this
            setTimeout(function () {
                const table = document.querySelector('.soltTable .el-table__body-wrapper tbody');
                console.log(table);
                Sortable.create(table, {
                    handle: '.createNodeTableSlot',
                    animation: 150,
                    onEnd({newIndex, oldIndex}) {
                        // [that.tableData4[oldIndex], that.tableData4[newIndex]] = [that.tableData4[newIndex], that.tableData4[oldIndex]];
                        // console.log(that.tableData,'&&&&');
                    }
                })
            }, 10)

        },
        methods: {
            //确认编辑
            editSure() {

                let flag = true;
                this.tableData.forEach(item => {
                    if (item.edit) {
                        flag = false
                    }
                });
                if (!flag) {
                    this.$message.error('还有没编辑完的数据不能确认');
                    return
                };
                let arrName = document.getElementsByClassName('nodeDialog-nodeTagName');
                console.log(arrName);
                let tagNames = [];
                //标签名查重
                let tagNamesIsRepeat = [];
                for (let i = 0; i < arrName.length; i++) {
                    tagNamesIsRepeat.push(arrName[i].innerText);
                }
                let nary = tagNamesIsRepeat.sort();

                for (let i = 0; i < tagNamesIsRepeat.length-1; i++) {

                    if (nary[i] === nary[i + 1]) {
                        flag = false
                        this.$message.error('标签名'+nary[i]+'重复')

                    }
                }
                if (!flag) {
                    return
                };
                //标签名查重结束
                for (let i = 0; i < arrName.length; i++) {
                    tagNames.push({
                        tagName: arrName[i].innerText,
                        id: arrName[i].dataset.id,
                        use: arrName[i].dataset.use,
                        // prcdNodeId: arrName[i].dataset.prcdnodeid,
                        // // facMissionPrcdNodeId: arrName[i].dataset.prcdnodeid,
                    });
                }
                this.isLoadiing = true;
                this.$emit('getTagTableData', tagNames)


            },
            // this.$emit('update:visible',false)
            //标签编辑
            handleEdit(index, editTagName) {
                this.editTagName = editTagName;
                this.tableData = this.tableData.filter(item => item.tagName);
                this.tableData.forEach((item, index) => {
                    this.$set(this.tableData[index], 'edit', false)
                });
                this.$set(this.tableData[index], 'edit', true)
            },
            handleEditCancel(index) {
                this.$set(this.tableData[index], 'tagName', this.editTagName);
                this.$set(this.tableData[index], 'edit', false);
                this.tableData = this.tableData.filter(item => item.tagName);
            },
            handleEditSure(index,tagName) {

                if(!tagName){
                    this.$message.error('标签名不能为空')
                    return
                }

                if(tagName.length>10){
                    this.$message.error('标签名不能超过10个字符')
                    return
                }
                //查重
                let arrName = [];
                this.tableData.forEach(item=>{
                    arrName.push(item.tagName)
                });
                let sortArr = arrName.sort();
                let flag = true;
                for(let i=0;i<arrName.length-1;i++){
                    console.log(i);
                    if(sortArr[i] === sortArr[i+1]){
                        flag = false;
                        this.$message.error('标签名'+sortArr[i]+'重复')
                    }
                }
                if(!flag) return;
                this.$set(this.tableData[index], 'edit', false);
                // this.tableData = this.tableData.filter(item => item.tagName);
            },
            cellStyle(obj) {
                // console.log(obj);
                if (obj.edit) {
                    return 'row-active'
                }
            },
            // 标签添加
            tagTableAdd() {
                this.tableData.forEach((item, index) => {
                    if(item.edit){
                        this.$set(this.tableData[index], 'tagName',  this.editTagName)
                    }
                });
                this.tableData = this.tableData.filter(item => item.tagName);
                this.editTagName = '';
                this.tableData.forEach((item, index) => {
                    this.$set(this.tableData[index], 'edit', false)
                });
                this.tableData.push({edit: true,canDelete:true})
            },
            // 标签删除
            handleDelete(index) {
                this.tableData.splice(index, 1)
            },
        }
    }
</script>

<style scoped>
    .createNodeTableAdd {
        color: #ff8d37;
        border: 1px solid rgb(223, 228, 236);
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-top: none;
        cursor: pointer;
    }
</style>
<style lang="scss">
    @import "../../../assets/style/reset.css";
    @import "../../../assets/style/element-reset.scss";

    .create-node-dialog {
        .el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: transparent;
        }
        .row-active > td:first-child .cell {
            border: 1px solid #ff8d37;
        }
        .createNodeInput .el-input__inner {
            border: none;
        }
    }

</style>
