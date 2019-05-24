<!--关键标签、辅助标签、横向标签 的编辑-->
<template>
    <div class="multiple-tags">
        <!--关键拆解标签-->
        <div class="tags-title">关键拆解标签</div>
        <div class="key-dismantle-tags">
            <el-table
                    class="custom-table no-hover-highlight"
                    border
                    :data="levelData.keyTags">
                <el-table-column
                        class-name="no-padding"
                        prop="attrType"
                        width="170"
                        label="关键标签">
                    <template slot-scope="scope">
                        <select-tag v-model="scope.row.attrType" :share="true" :from="from" :parentLevel="parentLevel"  :level="level" :selectTagOptions.sync="selectTagOptions"></select-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        class-name="no-padding"
                        prop="keyData"
                        width="275"
                        label="关键数据">
                    <template slot-scope="scope">
                        <el-select v-if="scope.$index==(levelData.keyTags&&levelData.keyTags.length-1)" @change="changeKeyData(scope.$index)" v-model="scope.row.keyData" multiple placeholder="请选择">
                            <el-option
                                    v-for="item in keyDataOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <div v-else class="pdl15">-</div>
                    </template>
                </el-table-column>
                <el-table-column
                        class-name="no-padding"
                        prop="needAddUp"
                        width="50"
                        align="center"
                        label="统计">
                    <template slot-scope="scope">
                        <el-checkbox v-if="scope.$index == 0" v-model="scope.row.needAddUp"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column
                        class-name="no-padding"
                        align="center"
                        width="50"
                        label="操作">
                    <template slot-scope="scope">
                        <div @click="deleteRow('KEY',scope.$index)" class="item dark-gray pointer">删除</div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="levelData.keyTags&&levelData.keyTags.length<5" class="add-row"><span @click="addRow('KEY')" class="orange add-btn">+添加</span></div>
        </div>
        <div class="tags-title">辅助标签</div>
        <div class="support-tags">
            <el-table
                    class="custom-table no-hover-highlight"
                    border
                    :data="levelData.supportTags"
                    style="width: 420px">
                <el-table-column
                        class-name="no-padding"
                        prop="attrType"
                        min-width="220"
                        label="辅助标签">
                    <template slot-scope="scope">
                        <select-tag v-model="scope.row.attrType" :share="true" :from="from" :parentLevel="parentLevel"  :level="level" :selectTagOptions.sync="selectTagOptions"></select-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        class-name="no-padding"
                        align="center"
                        width="200"
                        label="操作">
                    <template slot-scope="scope">
                        <div class="action-list">
                            <div @click="deleteRow('SUPPORT',scope.$index)" class="item dark-gray">删除</div>
                            <div @click="moveUp(levelData.supportTags,scope.$index)" :class="['item', {'blue':scope.$index!=0},{'gray':scope.$index==0}]">上移</div>
                            <div @click="moveDown(levelData.supportTags,scope.$index)" :class="['item', {'blue':scope.$index!=levelData.supportTags.length-1},{'gray':scope.$index==levelData.supportTags.length-1}]">下移</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="levelData.supportTags.length<3" class="add-row"><span @click="addRow('SUPPORT')" class="orange add-btn">+添加</span></div>
        </div>
        <div class="tags-title">横向标签</div>
        <div class="across-tags">
            <el-table
                    class="custom-table no-hover-highlight"
                    border
                    :data="levelData.acrossTags">
                <el-table-column
                        class-name="no-padding"
                        prop="attrType"
                        width="170"
                        label="横向标签">
                    <template slot-scope="scope">
                        <select-tag @change="changeHorizontalTag" :share="false"  v-model="scope.row.attrType" :parentLevel="parentLevel"  :from="from" :index="scope.$index" :level="level" :selectTagOptions.sync="selectTagOptions"></select-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        class-name="no-padding"
                        prop="keyData"
                        width="275"
                        label="填写关键数据">
                    <template slot-scope="scope">
                        <el-select   @change="changeInputKeyData(scope.$index)" v-model="scope.row.keyData" multiple placeholder="请选择">
                            <el-option
                                    v-for="item in keyDataOptionsForAcrossTags"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                        class-name="no-padding"
                        prop="acrossTagAttrs"
                        width="275"
                        label="使用标签项">
                    <template slot-scope="scope">
                        <el-select value-key="attrId" v-model="scope.row.acrossTagAttrs" multiple placeholder="请选择">
                            <el-option
                                    v-for="item in scope.row.acrossTagAttrsList"
                                    :key="item.attrId"
                                    :label="item.attrVal"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                        class-name="no-padding"
                        align="center"
                        width="200"
                        label="操作">
                    <template slot-scope="scope">
                        <div class="action-list">
                            <div @click="deleteRow('ACROSS',scope.$index)" class="item dark-gray">删除</div>
                            <div @click="moveUp(levelData.acrossTags,scope.$index)" :class="['item', {'blue':scope.$index!=0},{'gray':scope.$index==0}]">上移</div>
                            <div @click="moveDown(levelData.acrossTags,scope.$index)" :class="['item', {'blue':scope.$index!=levelData.acrossTags.length-1},{'gray':scope.$index==levelData.acrossTags.length-1}]">下移</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="levelData.acrossTags.length<3" class="add-row"><span @click="addRow('ACROSS')" class="orange add-btn">+添加</span></div>
        </div>
    </div>
</template>

<script>
    import {getCommonGoodsAttr,getGoodsAttrForUpdate} from '@/api/goodsPlan.js'
    import SelectTag from "./select-tag";

    export default {
        // level:层级
        // selectTagOptions:选择标签数据源
        //levelData 层级相关数据
        // 当前层级总负责人 auditorId
        // from: 当前组件是用于主线（main）还是支线（branch）的
        props:['parentLevel','level','selectTagOptions','levelData','auditorId','from'],
        components: {
            SelectTag,
        },
        data(){
            return {
                keyDataOptions:[
                    {
                        label:'SKU数',
                        value:'skuQuantityFlag'
                    },
                    {
                        label:'采购数量',
                        value:'purchaseQuantityFlag'
                    },
                    {
                        label:'采购金额',
                        value:'purchaseAmountFlag'
                    }
                ],
                keyDataOptionsForAcrossTags:[]

            }
        },
        computed: {
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            isEdit() {
                return this.$route.query.templateId?true:false
            }
        },
        methods: {
            addRow(tagType){
                if(tagType === 'KEY'){
                    this.levelData.keyTags.push({
                        tagType:tagType,
                        attrType:'',
                        keyData:[],
                        skuQuantityFlag:false,
                        purchaseQuantityFlag:false,
                        purchaseAmountFlag:false,
                        needAddUp:false,
                    })
                }

                if(tagType === 'SUPPORT'){
                    this.levelData.supportTags.push({
                        tagType:tagType,
                        attrType:'',
                    })
                }

                if(tagType === 'ACROSS'){
                    this.levelData.acrossTags.push({
                        tagType:tagType,
                        attrType:'',
                        keyData:[],
                        skuQuantityFlag:false,
                        purchaseQuantityFlag:false,
                        purchaseAmountFlag:false,
                        needAddUp:false,
                        acrossTagAttrs:[],
                        acrossTagAttrsList:[]
                    })
                }
            },
            deleteRow(tagType,index){
                if(tagType === 'KEY'){
                    this.setTagDisabled(this.levelData.keyTags[index].attrType,false)
                    this.levelData.keyTags.splice(index,1)
                }
                if(tagType === 'SUPPORT'){
                    this.setTagDisabled(this.levelData.supportTags[index].attrType,false)
                    this.levelData.supportTags.splice(index,1)
                }
                if(tagType === 'ACROSS'){
                    this.levelData.acrossTags.splice(index,1)

                }
            },
            // 上移
            moveUp(list,index){
                if(index>0){
                    let selectTagOptions = JSON.parse(JSON.stringify(this.selectTagOptions))
                    let moveItem = list[index-1]
                    list.splice(index-1,1)
                    list.splice(index,0,moveItem)
                    // 上面在移动前先备份selectTagOptions，移动完成，页面dom元素更新后，再把备份的selectTagOptions重置回去
                    // 因为上下移动也会触发select-tag里面对selectedTag的监听而使被移动的tag的disabled值改变，这不是我们想要的
                    this.$nextTick(() => {
                        this.$emit('update:selectTagOptions', selectTagOptions)
                    });
                }
            },
            // 下移
            moveDown(list,index){
                if(index<list.length-1){
                    let selectTagOptions = JSON.parse(JSON.stringify(this.selectTagOptions))
                    let moveItem = list[index+1]
                    list.splice(index+1,1)
                    list.splice(index,0,moveItem)
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
                            this.$set(this.selectTagOptions[i].children[j],'from',isDisabled?this.from:'')
                            this.$set(this.selectTagOptions[i].children[j],'level',isDisabled?(this.from ==='main'?this.level:this.parentLevel):'')
                            this.$set(this.selectTagOptions[i].children[j],'branchLevel',isDisabled?(this.from ==='main'?'':this.level):'')
                            return
                        }
                    }
                }
            },
            // 关键拆解标签的数据改变时，计算除横向标签能用的下拉选项
            changeKeyData(index){
                let list = this.levelData.keyTags
                list[index].skuQuantityFlag = list[index].keyData.indexOf('skuQuantityFlag')>-1?true:false
                list[index].purchaseQuantityFlag = list[index].keyData.indexOf('purchaseQuantityFlag')>-1?true:false
                list[index].purchaseAmountFlag = list[index].keyData.indexOf('purchaseAmountFlag')>-1?true:false
                let keyDataOptions = []
                if(list[index].skuQuantityFlag){
                    keyDataOptions.push({
                        label:'SKU数',
                        value:'skuQuantityFlag'
                    })
                }
                if(list[index].purchaseQuantityFlag){
                    keyDataOptions.push({
                        label:'采购数量',
                        value:'purchaseQuantityFlag'
                    })
                }
                if(list[index].purchaseAmountFlag){
                    keyDataOptions.push({
                        label:'采购金额',
                        value:'purchaseAmountFlag'
                    })
                }
                this.keyDataOptionsForAcrossTags = keyDataOptions
                let keyDataList = this.keyDataOptionsForAcrossTags.map(item => {return item.value})
                // 将原本 '横向标签'的'填写关键数据' 里面选中的，但是在'关键拆解标签'的'关键数据'里删除的标签删除
                this.levelData.acrossTags.forEach(row =>{
                    if(row.keyData.length){
                        let newKeyData = []
                        row.keyData.forEach(item =>{
                            if(keyDataList.includes(item)){
                                newKeyData.push(item)
                            }
                        })
                        row.keyData = newKeyData
                    }
                })

            },
            // 横向标签发生改变
            changeHorizontalTag(val,index){
                this.levelData.acrossTags[index].acrossTagAttrs = []
                this.getAcrossTagAttrsList(val,index)
            },
            // 横向标签的填写关键数据改变时
            changeInputKeyData(index){
                let list = this.levelData.acrossTags
                list[index].skuQuantityFlag = list[index].keyData.indexOf('skuQuantityFlag')>-1?true:false
                list[index].purchaseQuantityFlag = list[index].keyData.indexOf('purchaseQuantityFlag')>-1?true:false
                list[index].purchaseAmountFlag = list[index].keyData.indexOf('purchaseAmountFlag')>-1?true:false
            },
            // 根据横向标签获取使用标签项的下拉数据
            getAcrossTagAttrsList(type,index){
                let params = {
                    bossUnitId:this.bossUnitId,
                    type:type

                }
                getCommonGoodsAttr(params).then(res =>{
                    if(res.data.code ===0){
                        this.$set(this.levelData.acrossTags[index],'acrossTagAttrsList',res.data.commonGoodsAttrs)
                    }
                })
            },
        },
        watch:{

            'levelData.keyTags.length'(val){
                this.changeKeyData(this.levelData.keyTags.length-1)
            }
        },
        created(){
            if(this.levelData.keyTags.length){
                this.changeKeyData(this.levelData.keyTags.length-1)
            }
        }
    }
</script>

<style lang="scss">
    .multiple-tags{
        .el-table__empty-block{
            display: none !important;
        }
        .no-padding .el-select{
            width: 100%;
            .el-input__inner{
                border: none;
                background-color: #FFF9ED;
            }
        }
        .el-table__footer-wrapper thead div,
        .el-table__header-wrapper thead div,
        .el-table th{
            background-color:#F5F7FA ;
        }
    }
</style>

<style lang="scss" scoped>
    .multiple-tags{
        .tags-title{
            margin: 8px 0;
        }
        .add-row{
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
        .across-tags,
        .key-dismantle-tags,
        .support-tags{
            display: inline-block;
            background-color: #fff;
            .add-row{
                width: 100%;
            }
        }
    }

</style>
