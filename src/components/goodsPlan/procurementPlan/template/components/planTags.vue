<!--"企划标签"组件-->
<template>
    <div class="auxiliary-tags">
        <el-table
                class="custom-table no-hover-highlight"
                border
                :data="list"
                style="width: 420px">
            <el-table-column
                    class-name="no-padding"
                    prop="attrType"
                    min-width="220"
                    label="企划标签">
                <template slot-scope="scope">
                    <select-tag v-model="scope.row.attrType" :share="true" :level="level" :selectTagOptions.sync="selectTagOptions"></select-tag>
                </template>
            </el-table-column>
            <el-table-column
                    class-name="no-padding"
                    align="center"
                    width="200"
                    label="操作">
                <template slot-scope="scope">
                    <div class="action-list">
                        <div @click="deleteTag(scope.$index)" class="item dark-gray">删除</div>
                        <div @click="moveUp(scope.$index)" :class="['item', {'blue':scope.$index!=0},{'gray':scope.$index==0}]">上移</div>
                        <div @click="moveDown(scope.$index)" :class="['item', {'blue':scope.$index!=list.length-1},{'gray':scope.$index==list.length-1}]">下移</div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div  class="add-row"><span @click="addRow" class="orange add-btn">+添加</span></div>
    </div>
</template>

<script>
    import SelectTag from "./select-tag";

    export default {
        props:['selectTagOptions','list','level' ],
        components: {
            SelectTag

        },
        data(){
            return {

            }
        },
        computed: {
        },
        methods: {
            addRow(){
                this.list.push({
                    tagType:'SUPPORT',
                    attrType:'',
                })
            },
            deleteTag(index){
                this.setTagDisabled(this.list[index].attrType,false)
                this.list.splice(index,1)
            },
            // 上移
            moveUp(index){
                if(index>0){
                    let selectTagOptions = JSON.parse(JSON.stringify(this.selectTagOptions))
                    let moveItem = this.list[index-1]
                    this.list.splice(index-1,1)
                    this.list.splice(index,0,moveItem)
                    // 上面在移动前先备份selectTagOptions，移动完成，页面dom元素更新后，再把备份的selectTagOptions重置回去
                    // 因为上下移动也会触发select-tag里面对selectedTag的监听而使被移动的tag的disabled值改变，这不是我们想要的
                    this.$nextTick(() => {
                        this.$emit('update:selectTagOptions', selectTagOptions)
                    });
                }
            },
            // 下移
            moveDown(index){
                if(index<this.list.length-1){
                    let selectTagOptions = JSON.parse(JSON.stringify(this.selectTagOptions))
                    let moveItem = this.list[index+1]
                    this.list.splice(index+1,1)
                    this.list.splice(index,0,moveItem)
                    this.$nextTick(() => {
                        this.$emit('update:selectTagOptions', selectTagOptions)
                    });
                }
            },
            // 禁用或者启用选项标签里的某个二级选项（商品字段、订单字段为一级选项，不禁用）
            setTagDisabled(tagType,isDisabled){
                for(let i=0;i<this.selectTagOptions.length;i++){
                    for(let j=0;j<this.selectTagOptions[i].children.length;j++){
                        if(this.selectTagOptions[i].children[j].type == tagType){
                            this.$set(this.selectTagOptions[i].children[j],'disabled',isDisabled)
                            this.$set(this.selectTagOptions[i].children[j],'from',isDisabled?'main':'')
                            this.$set(this.selectTagOptions[i].children[j],'level',isDisabled?this.level:'')
                            this.$set(this.selectTagOptions[i].children[j],'branchLevel','')
                            return
                        }
                    }
                }
            }
        },
        created(){
        }
    }
</script>
<style lang="scss">
    .auxiliary-tags {
        .el-table__empty-block{
            display: none !important;
        }
        .el-table__footer-wrapper thead div,
        .el-table__header-wrapper thead div,
        .el-table th{
            background-color:#F5F7FA ;
        }
    }
</style>
<style lang="scss" scoped>
    .auxiliary-tags{
        .add-row{
            width: 420px;
            line-height: 32px;
            padding-left: 10px;
            font-size: 12px;
            border: 1px solid #dfe4ec;
            border-top: none;
            box-sizing: border-box;
            .add-btn{
                display: inline-block;
                padding: 0 15px;
                line-height: 32px;
                cursor: pointer;
            }
        }

    }
</style>
