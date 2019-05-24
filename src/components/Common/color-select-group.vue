<template>
    <div class="colorGroupComponent">
        <el-select
                :disabled="disabled"
                popper-class="bigSel"
                v-model="value"
                :multiple="!SingleElection"
                clearable
                filterable
                remote
                :remote-method="remoteMethod"
                :loading="loading"
                placeholder="请选择或搜索"
                @remove-tag="removeTag"
                @change="colorChange">
            <div class="colorSel"
                 v-for="(item,index) in newGroupData"
                 :key="item.categoryId">
                <span :class="{'colorSelGroup':true,'colorSelGroupActive':selCategoryId == item.categoryId}"  @click="selCategoryIdChange(item)">{{item.category}}</span>
                <div class="colorSelGroupUl" ref="refUl" v-show="item.categoryId === selCategoryId" :style="{'margin-top':'-'+(37+index*30)+'px'}">
                    <p class="colorSelGroupLiNew" @click="newColor" v-if="getFacCommonSettings">新建</p>
                    <el-option
                            v-if="item.colorList.length>0"
                            v-for="($item,$index) in item.colorList"
                            :disabled="isColorDisabled($item.id)"
                            :data-removeTag="$item.removeTag"
                            :key="$index"
                            :label="$item.noName"
                            :value="$item.id">
                    </el-option>
                    <el-option value="none" style="height: 0;width: 0;opacity: 0;margin-left: -99999px;"></el-option>
                </div>
            </div>
        </el-select>

        <el-dialog
                class="custom-dialog"
                title="新建颜色"
                :visible.sync="newColorVisible"
                :modal-append-to-body="false"
                size="tiny">
            <el-form ref="form" :model="form" label-width="50px" class="newColorForm">
                <el-form-item label="色组">
                    <el-select v-model="selCategoryId" placeholder="请选择">
                        <el-option
                                v-for="item in newGroupData"
                                :key="item.categoryId"
                                :label="item.category"
                                :value="item.categoryId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="色号">
                    <el-input v-model="colorNum" placeholder="不填则自动生成"></el-input>
                </el-form-item>
                <el-form-item label="色名">
                    <el-input v-model="colorName" @keyup.enter.native="newSure" placeholder="请输入色名"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="newColorVisible = false; colorNum='';colorName=''">取 消</el-button>
              <el-button type="primary" @click="newSure" :loading="loading">保 存</el-button>
             </span>
        </el-dialog>
    </div>

</template>

<script>
    import {
        addCommonSkuAttr,
        getCommonSkuAttrList,
    } from '@/api/api'

    export default {
        name: "color-select-group",
        /***********************
         *
         * SingleElection  是否单选
         * value  model值
         * groupData  列表值
         *
        ***********************/
        props:{
            hideNew:{
                type:String,
                default:true
            },
            groupData:Array,
            value:Array,
            SingleElection:String,
            colorArrItem:{
                type:Array,
                default() {
                    return []
                }
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        computed:{
            newGroupData(){
               if(this.groupData&&this.groupData.length>0){
                   this.selCategoryId = this.groupData[0].categoryId;
                   this.category = this.groupData[0].category;
               }
                return this.groupData
            },
            newColorArrItem(){
                return this.colorArrItem
            },
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
        },
        watch:{
            value:{
                handler(val){
                    this.$emit('input', val);
                },
                deep:true
            }
        },

        data(){
            return {
                getFacCommonSettings:true,
                newColorVisible:false,
                colorNum:'',
                colorName:'',
                newSelCategoryId:'',
                selCategoryId:'',
                category:'',
                commonInfo:{},
                colorValue:[],
                loading: false,
                timer: '',
                searchColorData:[],
            }
        },
        created(){
            //规格属性库权限 新建/编辑商品档案、新建/编辑设计档案中，颜色、规格、内长、十个属性中的下拉框里的“新建按钮”
            let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (powerlist.indexOf('fac.common.settings.getFacCommonSettings') === -1) {
                this.getFacCommonSettings = false
            }
        },

        methods:{
            remoteMethod(query) {
                if(this.timer){
                    clearTimeout(this.timer)
                }
                if (query !== '') {
                    this.search(query)
                } else {
                    this.newGroupData = [];
                }
            },
            search(query){
                this.loading = true;
                this.timer = setTimeout(() => {
                    this.loading = false;
                    let skuArr = [];
                    //多选时，需要将已选颜色数组传给后台，单选不用
                    if(!this.SingleElection){
                        skuArr = this.value;
                    }
                    let params = {
                        facId: this.facId,
                        type: "color",         //all:全部属性（颜色、尺码、内长）  color：颜色  size:尺码  length：内长
                        keyword: query,
                        skuAttrIds: skuArr,     //已选的颜色数组
                    };
                    getCommonSkuAttrList(params).then(res => {
                        if (res.data.code === 0) {
                            this.groupData = res.data.data.color;
                            this.searchColorData = res.data.data.color;
                        }else{
                            this.groupData = [];
                        }
                    });
                }, 500);
            },
            isColorDisabled(id){
                let flag = false;
                if(!this.newColorArrItem || !this.newColorArrItem.length){
                    return false
                }
                flag = this.newColorArrItem.some(item=>{
                    return item.id===id && item.removeTag===0
                });
                return flag
            },
            // 移除触发
            removeTag(val){
                this.newColorArrItem.forEach($item=>{
                    if($item.id===val.currentValue && $item.removeTag===0){
                        this.value.push(val.currentValue)
                        this.$message({
                            showClose: true,
                            message: "该颜色被工单或BOM表引用，不可删除",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                    }
                });
            },
            //改变颜色值时触发
            colorChange(){
                this.$emit('colorChange', this.searchColorData);
            },
            newColor(){
                //制造点击事件去除下拉框
                $(".bigSel").css('display','none')
                this.newColorVisible = true
            },
            //新建颜色
            newSure(){
                let params = {
                    categoryId:this.selCategoryId,
                    userId:JSON.parse(sessionStorage.getItem('user_login')).userId,
                    type: 1,
                    name:this.colorName,
                    value:this.colorNum,
                }
                addCommonSkuAttr(params).then(
                    res => {
                        if(res.data.code !==0) {
                            this.$message.error(res.data.msg);
                        }else {
                            //添加成功前端直接塞假数据进去
                            this.newGroupData.forEach(item=>{
                                if(item.categoryId === this.selCategoryId){
                                    res.data.data.noName = res.data.data.value+'-'+res.data.data.name
                                    item.colorList.push(res.data.data)
                                }
                            })
                            if(this.SingleElection){
                                //单选
                                this.value=res.data.data.id
                            }else {
                                //多选
                                this.value.push(res.data.data.id)
                            }

                            this.$message.success('新建成功')
                            this.newColorVisible = false
                            this.$emit('isAddAttr')

                        }
                    }
                )
            },
            //分组变化
            selCategoryIdChange(item){
                this.selCategoryId = item.categoryId
                this.category = item.category
            },
        }
    }
</script>

<style  lang="scss">
    .bigSel{
        width: 200px;
        min-width: 200px !important;
        .is-horizontal{
            height: 0;
        }
        .colorSel{
            /*display: flex;*/
            .colorSelGroup{
                display: inline-block;
                width: 200px;
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                padding-left: 10px;
                box-sizing: border-box;
                &:hover{
                    background-color: rgb(228, 230, 241)
                }
            }
            .colorSelGroupActive{
                background-color: rgb(228, 230, 241)
            }
            .colorSelGroupUl{
                position: fixed;
                margin-left: 200px;
                max-height: 274px;
                overflow-y: auto;
                width: 200px;
                background: #fff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                border: 1px solid rgb(209, 216, 229);
                .colorSelGroupLiNew{
                    height: 30px;
                    line-height: 30px;
                    padding-left: 10px;
                    color: #ffa914;
                    cursor: pointer;
                }
            }
        }
    }
    .newColorForm{
        .el-form-item{
            display: block;
            margin-bottom: 22px;
            /*.el-input .el-input__inner{*/
                /*max-width: 300px;*/
            /*}*/
        }
    }

</style>
