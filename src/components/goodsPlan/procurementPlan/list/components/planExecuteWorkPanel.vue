<!--"企划执行工作看板"组件-->
<template>
    <div >
        <div class="plan-execute-work-panel box-shadow mgb16" v-if="currentBackConfig.isConfig">
            <div class="yellow-border-title">
                <div class="title">企划执行工作看板</div>
                <div>
                    <nf-button v-show="!isEditing"  fsize='12' @click="edit">编辑</nf-button>
                    <nf-button v-show="isEditing"  fsize='12' @click="cancel">取消</nf-button>
                    <nf-button v-show="isEditing" :loading="isSubmitting"  fsize='12' @click="save" type="warning">保存</nf-button>
                </div>
            </div>
            <div v-show="isEditing" style="display: inline-block;max-width: 100%;">
                <el-table :data="planData"
                        class="custom-table no-hover-highlight mgt8"
                        border>
                    <el-table-column
                            class-name="no-padding"
                            width="160"
                            label="采购规划">
                        <template slot-scope="scope">
                            <el-select @change="changeOtbActual" v-model="otbActualId" placeholder="请选择">
                                <el-option
                                        v-for="item in otbSimpleList"
                                        :key="item.otbActualId"
                                        :label="item.otbActualName"
                                        :value="item.otbActualId">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="isEditing"
                            class-name="no-padding"
                            prop="chargerIds"
                            width="160"
                            label="拆解层级">
                        <template slot-scope="scope">
                            <el-select @change="changeOtbLevel" :disabled="!otbActualId" v-model="otbActualLevelId" placeholder="请选择">
                                <el-option
                                        v-for="item in levelList"
                                        :key="item.otbLevelId"
                                        :label="item.otbLevelName"
                                        :value="item.otbLevelId">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column  v-if="isEditing" v-for="(levelItem,levelIndex) in levels" :key="levelIndex" :label="levelItem.LevelName">
                        <el-table-column  v-for="(tagItem,tagIndex) in levelItem.tags"
                                width="100"
                                class-name="no-padding"
                                prop="auditorIds"
                                :key="tagIndex"
                                :label="tagItem.tagName">
                            <template slot-scope="scope">
                                <el-select :disabled="levelIndex==0&&tagIndex==0?false:
                                (tagIndex!=0?levelItem.tags[tagIndex-1].selectIds.length<1:
                                levels[levelIndex-1].tags[levels[levelIndex-1].tags.length-1].selectIds.length<1)" @change="changeTag($event,tagIndex,tagItem,levelIndex,levelItem)"
                                           v-model="tagItem.selectIds"  multiple placeholder="请选择">
                                    <el-option
                                            v-for="item in tagItem.dataList"
                                            :key="item.attrId"
                                            :label="item.attrVal"
                                            :value="item.attrId">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
            <div v-if="!isEditing"  >
                <el-table :data="[otbBackConfigDetai]"
                class="custom-table no-hover-highlight mgt8"
                border>
                    <el-table-column
                    min-width="160"
                    label="采购规划">
                        <template slot-scope="scope">
                        <div>{{otbBackConfigDetai.otbActualName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="160"
                        label="拆解层级">
                        <template slot-scope="scope">
                        <div>{{otbBackConfigDetai.otbActualLevelName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(levelItem,levelIndex) in otbBackConfigDetai.levels" :key="levelIndex" :label="levelItem.LevelName">
                        <el-table-column v-for="(tagItem,tagIndex) in levelItem.tags"
                             :key="tagIndex"
                             width="100"
                            :label="tagItem.tagName">
                            <template slot-scope="scope">
                            <div><span v-for="(selectedItem,selectedIndex) in tagItem.selectList">{{selectedItem.attrVal}}{{selectedIndex<(tagItem.selectList.length-1)?'、':''}}</span></div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column v-for="(listItem,listIndex) in otbBackConfigDetai.noFixedList" :key="listIndex"  :label="listItem.name">
                        <el-table-column  v-if="listItem.quantityList&&listItem.quantityList.length>0"  v-for="(quantityItem,quantityIndex) in listItem.quantityList"
                                          width="100"
                                          prop="quantity"
                                          :key="quantityIndex"
                                          :label="quantityItem.name">
                            <template slot-scope="scope">
                                <div>{{quantityItem.quantity}}</div>
                            </template>
                        </el-table-column>
                        <template  v-else  slot-scope="scope">
                            <div >{{listItem.quantity}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column    :class-name="listItem.quantityList&&listItem.quantityList.length>0?'nested-column':''"
                                        :width="listItem.quantityList&&listItem.quantityList.length>0?listItem.quantityList&&listItem.quantityList.length*100:100"
                                        v-for="(listItem,listIndex) in otbBackConfigDetai.FixedList"  :key="listIndex"  fixed="right"  :label="listItem.name">
                        <el-table-column width="100"
                                         class-name="nested-column"
                                         v-show="listItem.quantityList&&listItem.quantityList.length>0"  v-for="(quantityItem,quantityIndex) in listItem.quantityList"
                                          prop="quantity"
                                          :key="quantityIndex"
                                          :label="quantityItem.name">
                            <template slot-scope="scope">
                                <div :class="{'red':quantityItem.quantity>0,'green':quantityItem.quantity==0,'orange':quantityItem.quantity<0,}">{{quantityItem.quantity}}</div>
                            </template>
                        </el-table-column>
                        <template  v-show="!(listItem.quantityList&&listItem.quantityList.length>0)"  slot-scope="scope">
                            <div v-if="listItem.name==='待完成SKU数'" :class="{'red':listItem.quantity>0,'green':listItem.quantity==0,'orange':listItem.quantity<0,}">{{listItem.quantity}}</div>
                            <div v-else>{{listItem.quantity}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getOtbSimpleList,
        getOtbLevels,
        getNextTagAttrList,
        getOtbBackConfigList,
        getOtbBackConfigDetail,
        updateOtbBackPanel
    } from '@/api/goodsPlan.js'

    export default {
        // configCode:
        // 商品档案:goods_style
        // 生产订单:prd_order
        // 设计档案:design_style

        props: ['configCode','designPrcdNodeId'],
        components: {
        },
        data() {
            return {
                otbBackConfigDetai:{
                    levels:[],
                    list:[],
                    FixedList:[],
                    noFixedList:[],
                    colorTextList:[]
                },
                currentBackConfig:{},//当前企划回流具体配置信息
                otbBackConfigList:[],//企划回流具体配置信息
                otbActualId:'',//选择的采购规划id
                otbSimpleList:[],//采购规划下拉列表
                otbActualLevelId:'',//选择的拆解层级id
                levelList:[], //拆解层级下拉列表
                levels:[], //当前拆解详情
                planData:[{
                   lable:'企划执行工作看板'
                }],
                isEditing:false,
                isSubmitting:false,
            }
        },
        created() {
            this.getOtbBackConfigList()
            this.getOtbSimpleList()
        },
        watch: {
            designPrcdNodeId(val){
                this.getOtbBackConfigDetail()
            },
            $route(to,from){
                if(['/goodsMangement','/orderProduction','/designWorkbench'].includes(to.path))
                this.getOtbBackConfigList()
                this.getOtbSimpleList()
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
            // 获取简单的下拉企划
            getOtbSimpleList(){
                let params = {
                    unitId:this.unitId
                }
                getOtbSimpleList(params).then(res =>{
                    if (res.data.code == 0){
                        this.otbSimpleList = res.data.data
                    }
                })
            },
            //采购规划改变时
            changeOtbActual(val){
                if(this.otbBackConfigDetai.otbActualId!=val){
                    this.otbActualLevelId = ''
                    this.levels = []
                } else {
                    this.otbActualLevelId = this.otbBackConfigDetai.otbActualLevelId
                    this.levels = JSON.parse(JSON.stringify(this.otbBackConfigDetai.levels))
                }
                if(val){
                    let currentOtbActual = this.otbSimpleList.find(item => item.otbActualId == val)
                    if(currentOtbActual){
                        this.levelList = currentOtbActual.levels
                    }
                }
            },
            // 拆解层级改变时
            changeOtbLevel(val){
                // 根据层级id获取层级的数据
                let params = {
                    unitId:this.unitId,
                    levelId:val,
                    otbActualId:this.otbActualId
                }
                this.levels = []
                getOtbLevels(params).then(res => {
                    if(res.data.code == 0){
                        this.levels = res.data.data
                    }
                })
            },
            // 拆解标签改变时
            changeTag(selectAttrList,tagIndex,tagItem,levelIndex,levelItem){
                // 标签改变时，清除后面的标签的选中值以及其下拉选项
                // 清除当前层级剩下的标签的选中值以及其下拉选项
                // 判断his.otbBackConfigDetai.levels和this.levels是不是一样，是的话，不要清除
                if(JSON.parse(JSON.stringify(this.otbBackConfigDetai.levels))!==JSON.parse(JSON.stringify(this.levels))){
                    levelItem.tags.forEach((item,index)=>{
                        if(index>tagIndex){
                            this.$set(levelItem.tags[index],'selectIds',[])
                            item.dataList = []
                        }
                    })
                    // 清除下面所有层级的所有标签的选中值以及其下拉选项
                    if(levelIndex+1<=this.levels.length){
                        for(let i= levelIndex+1;i<this.levels.length;i++){
                            let levelItem = this.levels[i]
                            levelItem.tags.forEach((item,index)=>{
                                this.$set(levelItem.tags[index],'selectIds',[])
                                item.dataList = []
                            })
                        }
                    }
                }

                if(selectAttrList.length){
                    let params = {
                        levelId:levelItem.levelId,
                        tagId:tagItem.tagId,
                        unitId:this.unitId,
                        selectLevelId:this.otbActualLevelId,
                        selectAttrList:selectAttrList
                    }
                    // 获取下一个标签的下拉数据
                    getNextTagAttrList(params).then(res =>{
                        if(res.data.code == 0){
                            let nextTagAttrList = []
                            // 如果不是当前层级的最后一个标签
                            if(tagIndex+1< levelItem.tags.length){
                                this.$set(levelItem.tags[tagIndex+1],'dataList',res.data.data)
                            } else {
                                // 如果有下一层级
                                if(levelIndex< this.levels.length-1){
                                    this.$set(this.levels[levelIndex+1].tags[0],'dataList',res.data.data)
                                }
                            }
                        }
                    })
                }


            },
            // 获取组织企划回流配置列表
            getOtbBackConfigList(){
                let params ={
                    unitId:this.unitId,
                    userId:this.userId
                }
                getOtbBackConfigList(params).then(res =>{
                    if(res.data.code == 0){

                        this.currentBackConfig = res.data.data.find(item => item.configCode == this.configCode)
                        if(this.currentBackConfig.selectConfigId&&this.currentBackConfig.isConfig){
                            this.getOtbBackConfigDetail()
                        }
                        // console.log(this.currentBackConfig,777777)

                        this.$nextTick(() => {
                            this.$emit('finishLoading')
                        }) }
                })
            },
            // 获取组织企划回流详情
            getOtbBackConfigDetail(){
                let params = {
                    selectConfigId:this.currentBackConfig.selectConfigId,
                    designPrcdNodeId:this.designPrcdNodeId
                }
                getOtbBackConfigDetail(params).then(res =>{
                    if(res.data.code == 0){
                        this.otbActualId = res.data.data.otbActualId
                        this.otbActualLevelId = res.data.data.otbActualLevelId

                        this.otbBackConfigDetai = JSON.parse(JSON.stringify(res.data.data))
                        this.otbBackConfigDetai.noFixedList = []
                        this.otbBackConfigDetai.FixedList = []
                        // this.otbBackConfigDetai.colorTextList = this.configCode==='prd_order'?['企划SKU数','已完成SKU数','待完成SKU数']:['待完成SKU数']

                        let fixedColumn = ['待下单','企划SKU数','已完成SKU数','待完成SKU数']
                        this.otbBackConfigDetai.list.forEach((item,index)=>{
                            if(fixedColumn.includes(item.name)){
                                this.otbBackConfigDetai.FixedList.push(item)
                            } else {
                                this.otbBackConfigDetai.noFixedList.push(item)
                            }
                        })
                    }
                })
            },
            // 点击取消
            cancel(){
                this.isEditing = false
            },
            edit(){
                this.levels = JSON.parse(JSON.stringify(this.otbBackConfigDetai.levels))
                this.otbActualId = this.otbBackConfigDetai.otbActualId
                this.otbActualLevelId = this.otbBackConfigDetai.otbActualLevelId
                this.isEditing = true
            },
            // 点击保存
            save(){
                if(!this.otbActualId){
                    this.$message.error('请选择采购规划')
                    return
                }
                if(!this.otbActualLevelId){
                    this.$message.error('请选择拆解层级')
                    return
                }
                let params = {
                    userId:this.userId,
                    configId:this.currentBackConfig.configId,
                    selectConfigId:this.currentBackConfig.selectConfigId,
                    otbActualId:this.otbActualId,
                    otbActualLevelId:this.otbActualLevelId,
                    levels:this.levels
                }
                this.isSubmitting = true
                updateOtbBackPanel(params).then(res =>{
                    // 编辑成功后，把原来的值清除掉再赋值，不然有时候表格会错位
                    this.otbActualId = []
                    this.otbActualLevelId = []
                    this.otbBackConfigDetai = {}

                    this.isSubmitting = false
                    if(res.data.code == 0){
                        this.isEditing = false
                        this.$message.success('编辑成功')
                        this.getOtbBackConfigList()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .plan-execute-work-panel {
        .el-table td.nested-column.is-hidden > *, .el-table th.nested-column.is-hidden > *{
            visibility: visible;
        }
        .el-dialog--small {
            width: 360px;
        }
        .no-padding .el-select{
            width: 100%;
            .el-input__inner{
                background-color: #FFF9ED;
                border: none;
            }
            .el-input.is-disabled .el-input__inner{
                background-color: #fff;
                border: none;
            }
        }
        td.no-padding,
        td.no-padding:hover{
            background-color: #FFF9ED !important;
        }
    }

</style>


<style lang="scss" scoped>
    .plan-execute-work-panel {
        padding: 12px;
    }

</style>
