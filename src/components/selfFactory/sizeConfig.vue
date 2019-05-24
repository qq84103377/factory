<template>
    <div class="sizeConfig">
        <page-title title="尺码配比配置">
            <div>
                <nf-button @click="$router.go(-1)">返回</nf-button>
            </div>
        </page-title>
        <div class="sizeGroupConfig">
            <content-wrap title="尺码组配置">
            </content-wrap>
            <div class="size-config-table">
                <div class="size-config-table-title">
                    <div class="size-config-title-name title-bg">中分类</div>
                    <div  class="size-config-title-name title-bg">尺码组</div>
                    <div class="size-config-title-name title-bg">
                        操作 <div style="width:14px;height:14px;cursor:pointer;">
                    </div>
                    </div>
                </div>
                <div class="size-config-table-scroll">
                    <div v-for="(item,index) of attrSizeCategoryList" :key="index" class="size-config-table-title" style="margin-top:-1px;">
                        <!-- 编号 -->
                        <div style="border-right:1px solid #e6eaf0;" class="size-config-title-name">
                            <el-cascader
                                    :disabled="!item.isEdit"
                                    expand-trigger="hover"
                                    :options="categoryMediumList"
                                    :props="categoryProps"
                                    v-model="item.classification"
                                    @change="handleChange($event,item)">
                            </el-cascader>
                        </div>
                        <!-- 名称 -->
                        <div style="border-right:1px solid #e6eaf0;" class="size-config-title-name">
                            <!--<span  v-show="!item.isEdit">{{item.sizeCategory}}</span>-->
                            <el-select :disabled="!item.isEdit"  v-model="item.sizeCategoryId" placeholder="请选择">
                                <el-option
                                        v-for="$item in commonSizeCatagoryList"
                                        :key="$item.categoryId"
                                        :label="$item.category"
                                        :value="$item.categoryId">
                                </el-option>
                            </el-select>
                        </div>
                        <!-- 操作 -->
                        <div v-if="!item.isEdit" class="size-config-title-name size-config-opera handle">
                            <div  @click="editClick(item)" class="size-config-sort"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-edit1"></icon>编辑</div>
                            <div @click="categoryMediumDelete(item,index)" class="size-config-sort" style="border:none;"><span>删除</span></div>
                        </div>
                        <div class="edit-size-config-opera" v-if="item.isEdit">
                            <div  @click="editCancel(item,index)" class="size-config-sort">取消</div>
                            <div @click="editSure(item)" class="size-config-sort" style="color:#ffa914;border:none;background:#fff;"><span>确定</span></div>

                        </div>
                    </div>
                    <div>
                    </div>
                </div>
                <div @click="addSizeGroup"  class="add-color">+添加</div>
            </div>

        </div>
        <div class="sizeGroupConfig" style="margin-top: 10px;">
            <content-wrap title="码比配置">
            </content-wrap>
            <el-table
                    :data="CodeRatioCategoryData"
                    style="width: 1002px;"
                    border
                  >
                <el-table-column
                        align="center"
                        label="码比组名称"
                        width="200">
                    <template slot-scope="scope">
                        <input
                                class="table-size-value"
                                @input="lengthLimit(scope.row)"
                                :disabled="!scope.row.isEdit"
                                v-model.trim="scope.row.name"
                                placeholder="请输入码比组名称">
                        <!--</input>-->
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        width="200"
                        prop="name"
                        label="中分类"
                       >
                    <template slot-scope="scope">
                        <el-cascader
                                :disabled="!scope.row.isEdit"
                                expand-trigger="hover"
                                :options="codeCategoryMediumList"
                                :props="categoryProps"
                                v-model="scope.row.attrIds"
                                @change="classificationChange($event,scope.row)">
                        </el-cascader>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        width="200"
                        label="尺码">
                    <template slot-scope="scope">
                        <span class="table-size" v-for="item in scope.row.sizeCodeRatioCateList" :key="item.sizeId">{{item.sizeName}}</span>
                        <span class="table-size" style="border: none;background: rgb(238, 240, 246);">总计</span>

                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        width="200"
                        prop="address"
                        label="尺码比例">
                    <template slot-scope="scope">
                        <input
                                type="number"
                                min="0"
                                max="9999"
                                @input="numLimit(item)"
                                class="table-size-value"
                                v-for="item in scope.row.sizeCodeRatioCateList" :key="item.sizeId+scope.$index"
                                :disabled="!scope.row.isEdit"
                                v-model.trim="item.sizeRatio"
                                :placeholder="scope.row.isEdit?'请输入尺码比例':''">
                        <!--</input>-->
                        <span class="table-size" style="border: none;background: rgb(238, 240, 246);">{{mergeSizeRatio(scope.row.sizeCodeRatioCateList)}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        width="200"
                        prop="address"
                        label="操作">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.isEdit" class="size-config-opera handle">
                            <div  @click="editClick(scope.row)" class="size-config-sort"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-edit1"></icon>编辑</div>
                            <div @click="codeRatioCategoryDelete(scope.row.id,scope.$index)" class="size-config-sort" style="border:none;">删除</div>
                        </div>
                        <div class="edit-size-config-opera" v-if="scope.row.isEdit" style="width: 100%;">
                            <div  @click="editCodeCancel(scope.row,scope.$index)" class="size-config-sort">取消</div>
                            <div @click="editCodeSure(scope.row)" class="size-config-sort" style="color:#ffa914;border:none;background:#fff;"><span>确定</span></div>

                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div @click="addSize"  class="add-size">+添加</div>
        </div>
        <div class="sizeConfig-btn">
            <nf-button v-if="!enabled" type="warning" size="big" @click="opCodeRatioConfig(true)">启用</nf-button>
        </div>
        <div class="sizeConfig-btn">
            <nf-button v-if="enabled" type="warning" size="big" @click="opCodeRatioConfig(false)">停用</nf-button>
        </div>
        <el-dialog class="custom-dialog tip-dialog" :visible.sync="isDeleteVisible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text" v-if="editChangeType === 'sizeCategory'">该中分类配置的码比组数据将会清空，是否继续？</p>
                <p class="tip-text" v-else>该中分类配置的码比组将会删除，是否继续？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDeleteVisible = false">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" @click="isDeleteSure">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {commonSizeCatagory,categoryMediumNotUsedList,goodsAttrSizeCategoryList,goodsAttrSizeCategoryAdd,goodsAttrSizeCategoryUpdate,categoryMediumDelete,codeRatioCategoryList,
        categoryMediumUsedList,codeRatioCategoryAdd,codeRatioCategoryUpdate,codeRatioCategoryDelete,opCodeRatioConfig,codeRatioConfigInfo} from '@/api'
    export default {
        name: "sizeConfig",
        data(){
            return {
                editObj:{},
                editItem:{},
                editChangeType : 'classification',
                changeType : '',
                isDeleteVisible:false,
                deleteIndex:0,
                deleteId:'',
                categoryMediumList:[],
                categoryProps:{
                    value:'attrId',
                    label:'attrVal',
                    children:'children',
                    disabled:'disabled',
                },
                commonSizeCatagoryList:[],
                attrSizeCategoryList:[],
                tableDataSize:[],


                CodeRatioCategoryData:[],
                codeCategoryMediumList:[],

                enabled:false,
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
       async created(){
           this.getCommonSizeCatagoryList();
           this.getCodeRatioConfigInfo();
           this.getCodeRatioCategoryList();
           this.getCategoryMediumUsedList()
           await this.getCategoryMediumNotUsedList()
           this.getGoodsAttrSizeCategoryList();
        },
        methods:{
            lengthLimit(item){

                if (item.name.length>=17){
                    this.$message.error('值不能大于16个字符');
                    this.$set(item,'name',item.name.slice(0,16));
                }
            },
            numLimit(item){
                // sizeRatio
                if(item.sizeRatio<0){
                    this.$message.error('值不能小于0');
                    this.$set(item,'sizeRatio',0)
                }else if(item.sizeRatio>9999){
                    this.$message.error('值不能大于9999');
                    this.$set(item,'sizeRatio',9999)
                }else {
                    let x = String(item.sizeRatio).indexOf('.') + 1;   //小数点的位置
                    let y = String(item.sizeRatio).length - x;  //小数的位数
                    if(y>3 && x!==0){
                        this.$message.error('值不能大于3位小数');
                        this.$set(item,'sizeRatio',Number(item.sizeRatio).toFixed(3))
                    }
                }
            },
            //码比配置启用，停用
            getCodeRatioConfigInfo(){
                codeRatioConfigInfo({userId:this.userId,facId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        this.enabled = res.data.data.enabled
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            opCodeRatioConfig(enabled){
                opCodeRatioConfig({userId:this.userId,facId:this.unitId,enabled}).then(res=>{
                    if(res.data.code===0){
                        this.getCodeRatioConfigInfo();
                        this.$message.success(res.data.msg)
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //尺码组配置列表接口
            getGoodsAttrSizeCategoryList(){
                goodsAttrSizeCategoryList({userId:this.userId,facId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        let data = res.data.data;
                        data.forEach(item=>{
                            item.classification = [item.parentAttrId,item.attrId]
                            item.sizeCategoryIdBf = item.sizeCategoryId
                            item.attrIdBf = item.attrId
                        });
                        this.attrSizeCategoryList = res.data.data;
                        this.statusDisabledCategory()


                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            //获取尺码组列表
            getCommonSizeCatagoryList(){
                commonSizeCatagory({userId:this.userId}).then(res=>{
                    if(res.data.code===0){
                        this.commonSizeCatagoryList = res.data.commonSizeCategoryList

                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            // 获取中分类
           async getCategoryMediumNotUsedList(){
              await  categoryMediumNotUsedList({userId:this.userId}).then(res=>{
                    if(res.data.code===0){
                        this.categoryMediumList = res.data.data

                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            //已选的二级中分类进行禁用
            statusDisabledCategory(){
                let classificationSel = this.attrSizeCategoryList.map(item=>item.attrId)
                this.categoryMediumList.forEach(item=>{
                    item.children.forEach($item=>{
                        if(classificationSel.indexOf($item.attrId)>-1){
                            $item.disabled = true
                        }else {
                            $item.disabled = false
                        }
                    })
                })
                console.log(this.categoryMediumList);
            },
            editClick(item){
                this.$set(item,'isEdit',!item.isEdit)
                this.$set(item,'type','edit')
            },
            categoryMediumDelete(item,index){

                let attrIdArr = this.CodeRatioCategoryData.map(item=>item.attrId);
                if(attrIdArr.indexOf(item.attrId)>-1){
                    this.deleteId = item.id;
                    this.deleteIndex = index;
                    this.changeType = 'delete';
                    this.isDeleteVisible = true
                    return
                };

                categoryMediumDelete({id:item.id}).then(res=>{
                    if(res.data.code===0){
                        this.attrSizeCategoryList.splice(index,1)
                        this.$message.success(res.data.msg);
                        this.getCodeRatioCategoryList()
                        this.statusDisabledCategory();

                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            isDeleteSure(){
                if(this.changeType === 'edit'){
                    goodsAttrSizeCategoryUpdate(this.editObj).then(res=>{
                        if(res.data.code===0){
                            let item = this.editItem;
                            this.$set(item,'isEdit',!item.isEdit);
                            this.$set(item,'parentAttrId',item.classification[0]);
                            this.$set(item,'attrId',item.classification[1]);
                            this.$set(item,'attrIdBf',item.classification[1]);
                            this.$set(item,'sizeCategoryIdBf',item.sizeCategoryId);
                            if(item.type==='add'){
                                this.$set(item,'id',res.data.data);
                            }
                            this.getCodeRatioCategoryList()
                            this.getCategoryMediumUsedList()
                            this.statusDisabledCategory();
                            this.$message.success(res.data.msg)
                        }else {
                            this.$message.error(res.data.msg)
                        }
                        this.isDeleteVisible = false
                    })
                }else {
                    categoryMediumDelete({id:this.deleteId}).then(res=>{
                        if(res.data.code===0){
                            this.$message.success(res.data.msg);

                            this.attrSizeCategoryList.splice(this.deleteIndex,1);
                            this.statusDisabledCategory();
                            this.getCodeRatioCategoryList()
                        }else {
                            this.$message.error(res.data.msg)
                        }
                        this.isDeleteVisible = false
                    })
                }

            },
            editCancel(item,index){
                this.$set(item,'isEdit',!item.isEdit);
                if(item.type==='add'){

                    this.attrSizeCategoryList.splice(index,1)
                }else {
                    this.$set(item,'sizeCategoryId',item.sizeCategoryIdBf);
                    this.$set(item,'classification',[item.parentAttrId,item.attrId]);
                }
            },
            editSure(item){
                let obj = {
                    facId:this.unitId,
                    userId:this.userId,
                    sizeCategoryId:item.sizeCategoryId,
                    attrIds:item.classification,
                };
                let goodsAttrSizeCategoryApi;
                //添加尺码组配置
                if(item.type==='add'){
                    goodsAttrSizeCategoryApi = goodsAttrSizeCategoryAdd
                }else {
                    //编辑
                    obj.id = item.id;
                    goodsAttrSizeCategoryApi = goodsAttrSizeCategoryUpdate;
                    if(item.attrIdBf===item.classification[1] && item.sizeCategoryId===item.sizeCategoryIdBf){
                        // 值没改变
                        this.$set(item,'isEdit',!item.isEdit);
                        return
                    }else {
                        let attrIdArr = this.CodeRatioCategoryData.map(item=>item.attrId);

                        if(attrIdArr.indexOf(item.attrIdBf)>-1){
                            //选择了上面的中分类
                            this.editObj = obj;
                            this.editItem = item;
                            this.isDeleteVisible = true;
                            this.changeType = 'edit';
                            if(item.attrIdBf!==item.classification[1]){
                                // 中分类改变
                                this.editChangeType = 'classification'

                            } else {
                                //尺码组改变
                                this.editChangeType = 'sizeCategory'
                            }
                            return
                        }

                    }


                }
                goodsAttrSizeCategoryApi(obj).then(res=>{
                    if(res.data.code===0){
                        this.$set(item,'isEdit',!item.isEdit);
                        this.$set(item,'parentAttrId',item.classification[0]);
                        this.$set(item,'attrId',item.classification[1]);
                        this.$set(item,'attrIdBf',item.classification[1]);
                        this.$set(item,'sizeCategoryIdBf',item.sizeCategoryId);
                        if(item.type==='add'){
                            this.$set(item,'id',res.data.data);
                        }
                        this.statusDisabledCategory();
                        this.getCategoryMediumUsedList();
                        this.$message.success(res.data.msg)
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            handleChange(val,item){
                console.log(val);
                this.$set(item,'attrId',val[1])
                this.statusDisabledCategory();
            },
            addSizeGroup(){
                this.attrSizeCategoryList.push({isEdit:true,classification:[],type:'add'})
            },
            //码比配置列表
            getCodeRatioCategoryList(){
                codeRatioCategoryList({userId:this.userId,facId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        this.CodeRatioCategoryData = res.data.data;
                        this.CodeRatioCategoryData.forEach(item=>{
                            item.nameBf = item.name;
                            item.sizeCodeRatioCateListBf = JSON.parse(JSON.stringify(item.sizeCodeRatioCateList));

                        })

                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },

            // 获取已经配置尺码组配置的中分类列表
            getCategoryMediumUsedList(){
                categoryMediumUsedList({userId:this.userId}).then(res=>{
                    if(res.data.code===0){
                        this.codeCategoryMediumList = res.data.data

                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },

            addSize(){
                this.CodeRatioCategoryData.push({isEdit:true,name:'',attrIds:[],sizeCodeRatioCateList:[],type:'add'})
            },
            classificationChange(val,row){
                // codeCategoryMediumList
                console.log(val);
                console.log(this.codeCategoryMediumList);
                this.codeCategoryMediumList.forEach(item=>{
                    item.children.forEach($item=>{
                        if($item.attrId === val[1]){
                            let sizeList = JSON.parse(JSON.stringify($item.sizeList))
                            sizeList.forEach(sizeListItem=>{
                                sizeListItem.sizeRatio=''
                            });
                            this.$set(row,'sizeCodeRatioCateList',sizeList)
                        }
                    })
                });

            },
            // //编辑
            // editCodeClick(item){
            //     this.$set(item,'isEdit',!item.isEdit);
            //     this.$set(item,'type','edit')
            //
            // },
            codeRatioCategoryDelete(id,index){
                codeRatioCategoryDelete({userId:this.userId,id}).then(res=>{
                    if(res.data.code===0){
                        this.$message.success(res.data.msg)
                        this.CodeRatioCategoryData.splice(index,1)

                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            editCodeCancel(row,index){
                this.$set(row,'isEdit',!row.isEdit);
                if(row.type==='add'){

                    this.CodeRatioCategoryData.splice(index,1)
                }else {

                    this.$set(row,'sizeCodeRatioCateList',JSON.parse(JSON.stringify(row.sizeCodeRatioCateListBf)));
                    this.$set(row,'name',row.nameBf);
                    this.$set(row,'attrIds',[row.parentAttrId,row.attrId]);
                }
            },
            //添加
            editCodeSure(row){
                let obj = {
                    facId:this.unitId,
                    userId:this.userId,
                    name:row.name,
                    attrIds:row.attrIds,
                    sizeCodeRatioCateList:row.sizeCodeRatioCateList
                };
                let codeRatioCategoryApi;
                //添加尺码组配置
                if(row.type==='edit'){
                    //编辑
                    obj.id = row.id;
                    codeRatioCategoryApi = codeRatioCategoryUpdate
                }else {
                    codeRatioCategoryApi = codeRatioCategoryAdd
                }
                codeRatioCategoryApi(obj).then(res=>{
                    if(res.data.code===0){
                        this.$set(row,'isEdit',!row.isEdit);
                        this.$set(row,'sizeCodeRatioCateListBf',JSON.parse(JSON.stringify(row.sizeCodeRatioCateList)));
                        this.$set(row,'nameBf',row.name);
                        this.$set(row,'parentAttrId',row.attrIds[0]);
                        this.$set(row,'attrId',row.attrIds[1]);

                        if(row.type==='add'){
                            this.$set(row,'id',res.data.data);
                        }
                        this.$message.success(res.data.msg)
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //合计
            mergeSizeRatio(data){
                console.log(data);
                let sum = 0;
                data.forEach(item=>{
                    sum+=item.sizeRatio?Number(item.sizeRatio):0
                });
                return sum.toFixed(3)
            },

        }
    }
</script>

<style scoped lang="scss">
    .sizeConfig{

        .size-config-table{
            width: 520px;
            margin-left: 14px;
            box-sizing: border-box;


        }
        .size-config-table-title {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 36px;
            color: #a2abb8;
            border: 1px solid #e6eaf0;
        }
        .size-config-title-name{
            width:33.3333%;
            display: flex;
            justify-content: center;
            align-items: center;
            height:36px;
            color: #3b3b3b;
            background: #F7F9FC;
            position: relative;
            // border-right:1px solid rgb(230, 234, 240);
            &:last-child{
                border-right:none;
            }
        }
        .size-config-opera {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height:36px;
        }
        .add-color{
            height:36px;
            display: flex;
            justify-content: center;
            align-items: center;
            width:100%;
            height:36px;
            color:#ffa914;
            border: 1px solid  #e6eaf0;
            margin-top:-1px;
            box-sizing: border-box;
            &:hover{
                background-color: #f7f9fc;
                cursor: pointer;
            }
        }
        .size-config-sort{
            display: flex;
            justify-content: center;
            align-items: center;
            width:50%;
            border-right:1px solid #e6eaf0;
            height:36px;
            color: #808080;
            &:hover {
                color: #3b3b3b;
                cursor: pointer;
            }
        }
        .del-color{
            display: flex;
            justify-content: center;
            align-items: center;
            width:50%;
        }
        .del-text{
            color:#808080;
            &:hover {
                color: #3b3b3b;
            }
        }
        .size-config-table-scroll{
            overflow-y: auto;
            overflow-x: hidden;
            max-height:600px;
        }
        .edit-size-config-opera {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 33.3333%;
            height:100%;
            .edit-size-config-cancel {
                margin-right:24px;
                cursor: pointer;
            }
        }
        .sizeGroupConfig{
            border: 1px solid #e6eaf0;
            padding: 20px;
            background: #fff;
        }
        .add-size{
            height:36px;
            display: flex;
            justify-content: center;
            align-items: center;
            width:1002px;
            color:#ffa914;
            border: 1px solid  #e6eaf0;
            margin-top:-1px;
            box-sizing: border-box;
            &:hover{
                background-color: #f7f9fc;
                cursor: pointer;
            }
        }
        .sizeConfig-btn{
            margin-top: 10px;
        }
    }


</style>
<style lang="scss">
    .sizeConfig{
        .size-config-table-scroll{
            .el-select{
                .el-input__icon{
                    height: 40%;
                }
                .el-input__inner{
                    border: none;
                }
            }
            .el-cascader{
                .el-input__inner{
                    border: none;
                }
                .el-input__icon{
                    transition: none !important;
                }
            }
        }
        .el-input__inner{
            border: none;
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td{
            background-color: transparent
        }
        .el-table .cell, .el-table th > div{
            padding: 0;
        }
        .table-size{
            display: block;
            height: 32px;
            line-height: 32px;
            border-bottom: 1px solid #e6eaf0;
            text-align: center;
        }
        .table-size-value{
            display: block;
            height: 30px;
            line-height: 30px;
            width: 100%;
            text-align: center;
            background: #ffe;
            border-bottom: 1px solid #e6eaf0;
            .el-input__inner{
                text-align: center;
                padding: 0;

                height: 100%;
            }

        }
        input:disabled{
            background-color: #fff !important;
        }

    }

</style>
