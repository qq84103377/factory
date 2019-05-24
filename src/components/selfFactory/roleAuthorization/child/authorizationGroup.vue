<template>
<div class="authorization-group">
    <div class="group-header"  @click.self="isShowDetail=!isShowDetail">
        <span v-if="isDetail">{{authGroup.name}}</span>
        <div v-if="!isDetail">
            <el-checkbox v-model="authGroup.isUsed" @change="handlerFirstTabCheck">{{authGroup.name}}</el-checkbox>
            <!--<span @click="showDialog(authGroup)" style="margin-left: 10px;color: blue;text-decoration: underline;cursor: pointer;" v-if="authGroup.styleDetailBlob">配置字段权限</span>-->
        </div>
        <div v-if="authGroup.childrenMenuList.length">
            <el-checkbox v-if="!isDetail" v-model="authGroup.firstCheckAll" @change="handlerFirstCheckAll">全选</el-checkbox>
            <i @click.self="isShowDetail=!isShowDetail" class = "arrow" :class = "{'el-icon-caret-bottom':!isShowDetail,'el-icon-caret-top':isShowDetail}" ></i>
        </div>
    </div>
    <div v-for="(secItem,secIndex) in authGroup.childrenMenuList" :key="secIndex" v-show="isShowDetail" class="group-body" style="padding:0 0 0 22px;border-top: none;" :class = "{'expand':isShowDetail,'detail':isDetail}">
        <div class="list" v-if="isDetail">
            <div class="item">{{secItem.name}}</div>
            <div v-if="secItem.childrenMenuList.length" style="padding: 10px 0 0 20px;background: #FAFBFC;">
                <div class="item" v-for="(thirdItem,thirdIndex) in secItem.childrenMenuList" :key="thirdIndex">{{thirdItem.name}}</div>
            </div>
        </div>
        <div v-if="!isDetail" class="group-header"  @click.self="$set(secItem,'secondaryShow',!secItem.secondaryShow)">
            <div>
                <el-checkbox v-model="secItem.isUsed" @change="handlerSecondTabCheck($event,secItem)">{{secItem.name}}</el-checkbox>
                <span @click="showDialog(secItem)" style="margin-left: 10px;color: blue;text-decoration: underline;cursor: pointer;" v-if="secItem.styleDetailBlob">配置字段权限</span>
            </div>
            <div v-if="secItem.childrenMenuList.length">
                <el-checkbox v-model="secItem.secondCheckAll" @change="handlerSecondCheckAll($event,secItem)">全选</el-checkbox>
                <i class = "arrow" :class = "{'el-icon-caret-bottom':!secItem.secondaryShow,'el-icon-caret-top':secItem.secondaryShow}" ></i>
            </div>
        </div>
        <div class="group-body" style="border-top: 1px solid #e6eaf0;background: #e6eaf0;" v-if="secItem.secondaryShow&&!isDetail&&secItem.childrenMenuList.length">
            <el-checkbox-group class="list" v-model="secItem.checkedAuth" @change="handleCheckedAuthChange($event,secItem)">
                <el-checkbox class="item" v-for="(thirdItem,thirdIndex) in secItem.childrenMenuList" @change="checkboxChange($event,secItem)" :label="thirdItem.id" :key="thirdIndex">{{thirdItem.name}}
                </el-checkbox>
            </el-checkbox-group>
        </div>
    </div>

    <field-authority-dialog @confirm="handleConfirm" :show.sync="showFieldDialog" :list="fieldList" :titleText="titleText"></field-authority-dialog>
</div>
</template>
<script>
import fieldAuthorityDialog from '../fieldAuthorityDialog'
import {targetField} from '@/api/sample-centre.js'
export default {
    props: {
        isDetail:{
            type:Boolean,
            default:false
        },
        authGroup:{
            type:Object,
            default:{}
        },
        test:{
            type:Array,
            default:[]
        }
    },
    data() {
        return {
            isShowDetail:false,
            showFieldDialog: false,
            fieldList: [],
            titleText: '',
            index: ''
        }
    },
    components: {
        fieldAuthorityDialog
    },
    methods:{
        handleConfirm(arr,type) {
            this.$emit('confirm',arr,type)
        },
        showDialog(item) {
            this.showFieldDialog = true
            this.fieldList = item.styleDetailBlob
            this.index = item
            this.titleText = item.name
        },
        handlerSecondTabCheck(e,secItem) {
            if(!e.target.checked){
                this.$set(secItem,'checkedAuth',[]);
                this.$set(secItem,'secondCheckAll',false)
                this.$set(this.authGroup,'firstCheckAll',false)
            }else {
                this.$set(this.authGroup,'isUsed',true)
                //二级菜单选中时 联动一级菜单的全选
                this.$set(this.authGroup,'firstCheckAll',this.authGroup.childrenMenuList.every(v =>  (v.childrenMenuList.length&&v.secondCheckAll)||(!v.childrenMenuList.length&&v.isUsed)))
            }
        },
        handlerFirstTabCheck() {
            if(!this.authGroup.isUsed) {
                //一级菜单取消勾选清空二级以下所有勾选
                this.authGroup.childrenMenuList.forEach(secItem => {
                    this.$set(secItem,'checkedAuth',[]);
                    this.$set(secItem,'secondCheckAll',false)
                    this.$set(secItem,'isUsed',false)
                })
                //一级全选也清除
                this.$set(this.authGroup,'firstCheckAll',false)
            }
        },
        handlerFirstCheckAll(event) {
            this.$set(this.authGroup,'firstCheckAll',event.target.checked)
            this.authGroup.childrenMenuList.forEach(secItem => {
                    this.$set(secItem,'checkedAuth',[]);
                    this.$set(secItem,'secondCheckAll',event.target.checked)
                    this.$set(secItem,'isUsed',event.target.checked)
                    if(event.target.checked){
                        secItem.childrenMenuList.forEach(thirdItem => {
                            secItem.checkedAuth.push(thirdItem.id);
                        })
                    }
                })
            this.$set(this.authGroup,'isUsed',true)
            // if(this.authGroup.checkedAuth.length>0||this.isUsed){
            //     this.authGroup.checkedAuth.push(this.authGroup.id)
            // }
            // 1级权限是否选中，要更新到this.authGroup中，因为在父级的时候要根据this.authGroup.checkAll判断要不要将1级权限传给后台
            // this.authGroup.checkAll = this.secondTabCheck
        },
        handlerSecondCheckAll(event,secItem) {
            this.$set(secItem,'checkedAuth',[]);
            if(event.target.checked) {
                secItem.childrenMenuList.forEach(item => {
                    secItem.checkedAuth.push(item.id);
                })
                this.$set(secItem,'isUsed',true)
                this.$set(this.authGroup,'isUsed',true)
                this.$set(this.authGroup,'firstCheckAll',this.authGroup.childrenMenuList.every(v => v.secondCheckAll==true))

            }else {
                this.$set(this.authGroup,'firstCheckAll',false)
            }
            // if(this.authGroup.checkedAuth.length>0||this.isUsed){
            //     this.authGroup.checkedAuth.push(this.authGroup.id)
            // }
            // 1级权限是否选中，要更新到this.authGroup中，因为在父级的时候要根据this.authGroup.checkAll判断要不要将1级权限传给后台
            // this.authGroup.checkAll = this.secondTabCheck
        },
        handleCheckedAuthChange(value,secItem) {
            let checkedCount = value.length;
            console.log(checkedCount,'checkedCount');
            this.$set(secItem,'isUsed',true)
            this.$set(this.authGroup,'isUsed',secItem.isUsed)
            this.$set(secItem,'secondCheckAll',checkedCount == secItem.childrenMenuList.length)
            this.$set(this.authGroup,'firstCheckAll',this.authGroup.childrenMenuList.every(v => v.secondCheckAll==true))
        },
        checkboxChange(event,secItem){
            let value = event.target.value
            console.log(event.target.checked,'event.target.checked');
            let changeIndex;
            // 获取点击的选项所在的索引
            for(let i=0;i<secItem.childrenMenuList.length;i++){
                if(secItem.childrenMenuList[i].id == value){
                    changeIndex=i;
                    console.log(secItem.childrenMenuList[i].name,changeIndex,'ddd')
                    break;
                }
            }
            //产品说：每个选项都必须是单独选中状态的 v2.4改动
            // // 勾选中任意一个选项，自动勾选查询权限
            // if(event.target.checked){
            //     // 勾选isQuery=true并且不在this.authGroup.checkedAuth这里的
            //
            //     secItem.childrenMenuList.forEach(item=>{
            //         if(item.isQuery){
            //             console.log(secItem.checkedAuth,'自动勾选前')
            //             let findIndex=secItem.checkedAuth.indexOf(item.id)
            //             if(findIndex==-1){
            //                 console.log(item,'isQuery=true并且没有选中对item')
            //                 secItem.checkedAuth.push(item.id);
            //             }
            //             console.log(secItem.checkedAuth,'自动勾选后')
            //         }
            //     })
            // }
            // // 取消勾选，并且被取消的刚好的查询权限，把其他所有的权限都取消
            // else {
            //     this.$set(this.authGroup,'firstCheckAll',false)
            //     if(secItem.childrenMenuList[changeIndex].isQuery){
            //         this.$set(secItem,'checkedAuth',[]);
            //
            //     }
            // }
        }
    },
    created(){
    },
    computed: {
        userId() {
            return JSON.parse(sessionStorage.getItem('user_login')).userId
        },
        unitId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId
        },
        bossUnitId() {
            return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
        },
    },
    watch:{
        // 只监听authGroup.childrenMenuList就好，不要监听整个authGroup，不然当1级权限没有子权限的时候，无法取消1级的选中
        // 'authGroup.childrenMenuList':{
        //     handler(newValue, oldValue){
        //         if(this.authGroup.checkedAuth&&this.authGroup.childrenMenuList){
        //             let checkedCount=this.authGroup.checkedAuth.length;
        //             // console.log('初始化是否全选')
        //             // console.log('选中个数',checkedCount)
        //             // console.log('总个数',this.authGroup.childrenMenuList.length)
        //             // if(this.authGroup.childrenMenuList.length){
        //             this.isUsed = checkedCount == this.authGroup.childrenMenuList.length;
        //             this.firstIndeterminate = checkedCount > 0 && checkedCount < this.authGroup.childrenMenuList.length;
        //             // }
        //             this.authGroup.isUsed = this.isUsed
        //
        //         }
        //     },
        //     deep:true
        // }
    }
};
</script>
<style lang="scss" scoped>
    .authorization-group{
        .group-header{
            line-height: 40px;
            padding: 0 24px 0 20px;
            border-top: 1px solid #e6eaf0;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            &:hover{
                background-color:#f0f2f5 ;
            }
            .arrow{
                margin-top: 13px;
                color: #a2abb8;
            }
            .detail-title{

            }
        }
        .group-body{
            padding: 17px 32px 3px 42px;
            &.expand{
                border-top: 1px solid #e6eaf0;
            }
            .list{
                width: 100%;
                padding-top: 10px;
                .item{
                    width: 33.33%;
                    margin-left: 0;
                    margin-bottom: 14px;
                }
            }
            &.detail{
                padding:17px 25px 3px 25px;
                .list{
                    .item{
                        position: relative;
                        display: inline-block;
                        margin-left: -3px;
                        text-indent: 12px;
                        &:before{
                            content: '';
                            position: absolute;
                            left: 0;
                            top: 4px;
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;
                            background-color: #ffa914;
                        }
                    }
                }
            }

        }
    }
</style>


