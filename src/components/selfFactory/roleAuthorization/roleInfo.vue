<template>
    <div class="role-info" :class="{'detail':isDetail}">
        <div class="nf-scroll-container">
            <header class="header_line">
                <div class="header_right">
                    <span v-if="pageType=='new'">新建角色</span>
                    <span v-if="pageType=='detail'&& !isDetail">编辑角色</span>
                    <span v-if="pageType=='detail'&& isDetail">角色权限信息</span>
                </div>
                <div class="header_left">
                    <!--详情模式-->
                    <nf-button class="go-back" v-if="isDetail" @click="$router.push('/home/setting/roleAuthorization')">
                        <i class="icon-left el-icon-arrow-left"></i>返回上级</nf-button>
                    <!--新增模式-->
                    <nf-button v-if="pageType=='new'" @click="$router.push('/home/setting/roleAuthorization')">取消</nf-button>
                    <nf-button v-if="pageType=='new'" class="mgl12" type="warning" @click="saveEdit('ruleForm')" :loading="isSaving">确定</nf-button>
                    <!--编辑模式-->
                    <nf-button v-if="pageType=='detail'&&!isDetail" @click="cancelEdit('ruleForm')">取消</nf-button>
                    <nf-button v-if="pageType=='detail'&&!isDetail" class="mgl12" type="warning" @click="saveEdit('ruleForm')" :loading="isSaving">确定</nf-button>
                </div>
            </header>
            <div class="nf-scroll-view">
                <div class="edit-content box-shadow" v-loading="loading">
                    <div class="yellow-border-title mgb20">
                        <h1 class="title">基本信息</h1>
                        <nf-button v-if="pageType=='detail'&&!roleDetail.disabled&&isDetail" svg="icon-edit1" style="width: 98px;height: 36px;padding: 0;" @click="enterEdit">编辑</nf-button>
                    </div>
                    <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="角色名称" prop="roleName">
                                    <span v-if="isDetail">{{roleDetail.name}}</span>
                                    <el-input v-else  v-model.trim="ruleForm.roleName" :maxlength="12" placeholder="请输入角色名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  label="备注信息" prop="name" label-width="100px">
                                    <span v-if="isDetail">{{roleDetail.remark}}</span>
                                    <el-input v-else style="width: 400px" v-model.trim="ruleForm.remark" :maxlength="50" placeholder="请输入备注信息"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-tabs class="mgt15" v-model="activeTab" @tab-click="handleClick">
                        <el-tab-pane label="操作权限" name="first">
                            <div class="group-list" >
                                <div class="title" :class="{'detail':isDetail}">模块名称
                                    <div v-if="!isDetail" style="width:14px;height:14px;cursor:pointer;display: inline-block" v-popover:popover1>
                                        <icon style="width:14px;height:14px;margin-left:4px;" type="icon-tongyong-tishi"></icon>
                                        <el-popover  popper-class='popover-bg' ref="popover1" placement="top-start" width="276" :offset = "180" height="76" trigger="hover">
                                            <div  style="color:#fff;">在勾选模块下任意一个操作权限后，会自动勾选上“查询”权限；如果把“查询”权限去掉后，整个模块权限也会随之去掉勾选。</div>
                                        </el-popover>
                                    </div>
                                </div>
                                <div v-if="isDetail">
                                    <authorization-group v-for="item in roleDetail.sysMenu" :authGroup="item" :key="item.id"  :isDetail="isDetail"></authorization-group>
                                </div>
                                <div v-else>
                                    <template>
                                    <authorization-group @confirm="handleConfirm" v-for="item in actionAuthList" :test="item.checkedAuth" :authGroup="item" :key="item.id"  :isDetail="isDetail"></authorization-group>
                                    </template>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="数据查看权限" name="second">
                            <div class="scope-table">
                                <el-table
                                        border
                                        :data="dataAuthList">
                                    <el-table-column prop="name" label="模块名称" width="200">
                                    </el-table-column>
                                    <el-table-column label="查看数据范围" width="400">
                                        <template slot-scope="scope">
                                            <span v-if="isDetail">{{scope.row.dataAuthority==0?'查看全部':scope.row.dataAuthority==1?'本人相关':'自定义配置'}}</span>
                                            <div v-else>
                                                <el-radio-group v-model="scope.row.dataAuthority">
                                                    <el-radio :label="0">查看全部</el-radio>
                                                    <el-radio :label="1">本人相关</el-radio>
                                                    <el-radio v-if="scope.row.userDefined" :label="2">自定义配置</el-radio>
                                                </el-radio-group>
                                                <span v-show="scope.row.dataAuthority==2" class="blue pointer" @click="showSetMaterialKind">编辑</span>
                                            <!--<el-radio class="radio" v-model="scope.row.dataAuthority" label="1">本人相关</el-radio>-->
                                            <!--<el-radio class="radio" v-model="scope.row.dataAuthority" label="0">查看全部</el-radio>-->
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="角色成员" name="third">
                            <div class="member-table">
                                <el-table
                                        border
                                        :data="selectedWorkerList">
                                    <el-table-column
                                            prop="userName"
                                            label="员工姓名"
                                            width="200">
                                    </el-table-column>
                                    <el-table-column
                                            prop="loginName"
                                            label="工位号"
                                            width="250">
                                    </el-table-column>
                                    <el-table-column
                                            prop="groupNames"
                                            label="工位分组"
                                            width="320">
                                    </el-table-column>
                                </el-table>
                                <nf-button v-if="!isDetail" @click="showAddWorker" class="add-row" > + 管理成员</nf-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    <div v-if="pageType=='detail'&&roleDetail.disabled" class="close-logo"></div>
                </div>
                <nf-button v-if="pageType=='detail'&&!roleDetail.disabled" class="close-btn" @click="isCloseRoleVisible=true">禁用角色</nf-button>
                <nf-button v-if="pageType=='detail'&&roleDetail.disabled" class="open-btn" @click="isOpenRoleVisible=true">启用角色</nf-button>
                <nf-button v-if="pageType=='detail'&&roleDetail.disabled" class="close-btn" @click="isDeleteRoleVisible=true">删除角色</nf-button>
            </div>
        </div>
        <!--禁用角色权限-->
        <el-dialog class="custom-dialog tip-dialog"
                   :visible.sync="isCloseRoleVisible"
                   :show-close="false"
                   :close-on-click-modal="false"
                   size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确定禁用此角色权限？</p>
                <p class="sub-tip-text">禁用后相应工位里分配了该权限的用户将去掉该权限</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isCloseRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="closeRole">确认</el-button>
            </div>
        </el-dialog>
        <!--启用角色权限-->
        <el-dialog class="custom-dialog tip-dialog"
                   :visible.sync="isOpenRoleVisible"
                   :show-close="false"
                   :close-on-click-modal="false"
                   size="tiny">
            <div class="text-center">
                <div class="open-logo icon"></div>
                <!--<icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>-->
                <p class="tip-text">是否确定启用此角色权限？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isOpenRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="openRole">确认</el-button>
            </div>
        </el-dialog>
        <!--删除-->
        <el-dialog class="custom-dialog tip-dialog"
                   :visible.sync="isDeleteRoleVisible"
                   :show-close="false"
                   :close-on-click-modal="false"
                   size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确定删除此角色权限？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDeleteRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRole">确认</el-button>
            </div>
        </el-dialog>
        <!--添加工位-->
        <el-dialog class="custom-dialog add-worker-dialog"
                   title="添加工位"
                   :visible.sync="addWorkerVisible"
                   :show-close="false"
                   :close-on-click-modal="false"
                   >
            <div class="add-worker-conent">
                <div class="filter">
                    工位分组
                    <el-select @change="getWorkbaysList" style="width: 250px" v-model="workbaysFilter.groupIds" multiple  filterable placeholder="全部">
                        <el-option
                                v-for="item in groupList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-input style="width: 250px" v-model="workbaysFilter.keyword" @change="getWorkbaysList" class="search fr"  placeholder="输入工位搜索" icon="search">
                    </el-input>
                </div>
                <div class="worker-content">
                    <div class="header" v-show="showCheckAllBox">
                        <el-checkbox
                                     v-model="checkAllWorker"
                                     @change="handleCheckAllChange">全选</el-checkbox>
                    </div>
                    <el-checkbox-group class="list" v-model="checkedWorkers" @change="handleCheckedWorkerChange">
                        <el-checkbox @change="checkBoxChange(item.id)" :title="city" class="item" v-for="item in workbaysList" :label="item.id" :key="item.id">{{item.userName}}</el-checkbox>
                    </el-checkbox-group>

                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelWorker">取 消</el-button>
                <el-button  type="primary" @click="addWorker">确 定</el-button>
            </div>
        </el-dialog>
        <!--配置物料分类弹窗-->
        <el-dialog :modal-append-to-body="false" class="custom-dialog set-material-type-dialog" title="配置物料分类"
                   :visible.sync="setMaterialKind.visible" size="tiny">
            <div class="text-center">
                    <span class="fs12">物料分类</span>
                    <el-select style="width: 250px;margin-left: 10px;" v-model="setMaterialKind.configIds" placeholder="全部分类" multiple  filterable >
                        <el-option
                                v-for="item in setMaterialKind.optionList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
            </div>
            <div slot="footer">
                <el-button @click="cancelSetMaterialKind">取 消</el-button>
                <el-button type="primary"
                           @click="confirmSetMaterialKind">确 定
                </el-button>
            </div>
        </el-dialog>

    </div>

</template>
<script>
import config from "@/config/index";
import authorizationGroup from  '@/components/selfFactory/roleAuthorization/child/authorizationGroup.vue'
import {
    actionAuthList,
    dataAuthList,
    workbays,
    getEasyGroups,
    addRole,
    getRoleDetail,
    validRole,
    invalidRole,
    deleteRole,
    editRole,
    listMaterialsKinds
} from "@/api/api";
const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
import md5 from "js-md5";
export default {
    data() {
        return {a:1,
            isSaving:false,
            pageType:'',
            isDetail:false,
            activeTab:'first',
            isCloseRoleVisible:false,
            isOpenRoleVisible:false,
            isDeleteRoleVisible:false,
            addWorkerVisible:false,
            checkAllWorker: false,
            checkedWorkers: [],//被选中的成员id
            groupList:[],//工厂分组列表
            actionAuthList:[],//操作权限列表
            dataAuthList:[],//数据权限列表
            workbaysList:[],//工厂所有工位
            workbaysFilter:{
                groupIds:[],
                keyword:''
            },
            selectedWorkerList: [],
            ruleForm: {
                roleName:'',
                remark:''
            },
            rules: {
                roleName: [
                    { required: true, type: 'string', message: '角色名称不能为空', trigger: 'blur' }
                ]
            },
            roleDetail:{},

            setMaterialKind:{
                visible:false,
                oldConfigIds:[],
                configIds:[], //配置的物料分类
                optionList:[]
            }, //配置物料分类相关变量
            checkBoxHandleId: '',
            selectedWorkerListCopy: [],     //已选角色成员数据备份
            checkedWorkersCopy:[],      //被选中成员id备份
            showCheckAllBox: true,
            styleConfigs: {},
            loading: false
        };
    },
    computed:{
        userId() {
            return JSON.parse(sessionStorage.getItem("user_login")).userId;
        },
    },
    watch:{
        checkedWorkers(val, oldVal){
            //勾选操作
            if(val.length > oldVal.length){
                this.workbaysList.forEach(item => {
                    if(item.id === this.checkBoxHandleId){
                        this.selectedWorkerListCopy.push(item);
                    }
                });
            }
            //取消勾选操作
            else if(val.length < oldVal.length){
                let index = this.selectedWorkerListCopy.findIndex(item => {
                    return item.id === this.checkBoxHandleId;
                });
                if(index > -1){
                    this.selectedWorkerListCopy.splice(index, 1);
                }
            }
        }
    },
    components: {
        authorizationGroup
    },
    methods: {
        handleConfirm(arr,type) {
            let config = arr.reduce((t,v) => {
                if(v.indeterminate||v.visible) {
                    t.push({id:v.id,editAble:v.editable})
                }
                let childIds = v.childs.reduce((ct,c) => {
                    if(c.visible) {
                        ct.push({id:c.id,editAble:c.editable})
                    }
                    return ct
                },[])
                t.push(...childIds)
                return t
            },[])
            this.styleConfigs[type] = config
        },
        //记录checkbox每次操作的id
        checkBoxChange(id){
            this.checkBoxHandleId = id;
        },
        //关闭管理角色成员弹窗
        cancelWorker(){
            this.checkedWorkers = this.checkedWorkersCopy;
            this.addWorkerVisible = false;
        },
        // 添加角色成员相关方法
        handleCheckAllChange(event) {
            this.checkedWorkers = [];
            this.selectedWorkerListCopy = [];
            if(event.target.checked){
                this.workbaysList.forEach(item=>{
                    this.checkedWorkers.push(item.id)
                })
                this.checkedWorkers.forEach(id => {
                    this.workbaysList.forEach(item => {
                        if(item.id === id){
                            this.selectedWorkerListCopy.push(item);
                        }
                    });
                });
            }
        },
        handleCheckedWorkerChange(value) {
            this.checkAllWorker = value.length === this.workbaysList.length;
        },
        addWorker(){
            //对selectedWorkerListCopy去重
            let obj = {};
            this.selectedWorkerListCopy = this.selectedWorkerListCopy.reduce((cur,next) => {
                obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                return cur;
            },[]);
            this.selectedWorkerList = this.selectedWorkerListCopy;
            this.addWorkerVisible = false;
        },
        async showAddWorker(){
            this.workbaysFilter.groupIds=[]
            this.workbaysFilter.keyword=''
            // 如果处于详情状态，勾选原来已选中对成员
            // this.setSeletedWorkbays()
            this.selectedWorkerListCopy = JSON.parse(JSON.stringify(this.selectedWorkerList));
            this.checkedWorkersCopy = JSON.parse(JSON.stringify(this.checkedWorkers));
            this.addWorkerVisible=true
        },
        // 勾选选中对角色成员
        // setSeletedWorkbays(){
        //     // 如果页面处于编辑状态，勾选选中的角色成员
        //     if(this.selectedWorkerList&&this.selectedWorkerList.length>0){
        //         this.checkedWorkers=[]
        //         this.selectedWorkerList.forEach(item=>{
        //             for(let i=0;i<this.workbaysList.length;i++){
        //                 if(item.id==this.workbaysList[i].id){
        //                     this.checkedWorkers.push(item.id)
        //                     break;
        //                 }
        //             }
        //         })
        //     }
        // },
        // 进入编辑模式
        enterEdit(){
            this.isDetail =false
        },
        async saveEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                        name:this.ruleForm.roleName,
                        remark:this.ruleForm.remark,
                        userIds:this.checkedWorkers,
                        goodsStyleConfigs: this.styleConfigs.goodsStyleConfigs||[], // this.isDetail
                        designStyleConfigs: this.styleConfigs.designStyleConfigs||[]
                    }

                    let sysRoleData=[];
                    let menuIds=[];
                    // 拼接操作权限id
                    this.actionAuthList.forEach(firstItem=>{
                        firstItem.childrenMenuList.forEach(secItem => {
                            if((secItem.checkedAuth &&secItem.checkedAuth.length>0)||secItem.isUsed){
                                //三级菜单有选中或者二级菜单有选中
                                menuIds.push(secItem.id);
                                menuIds.push(...secItem.checkedAuth);
                            }
                        })
                        if(firstItem.isUsed){
                            //一级菜单有勾选过的话,将一级菜单的ID也拼接
                            menuIds.push(firstItem.id)
                        }
                    })
                    // 拼接数据查看权限
                    this.dataAuthList.forEach(item =>{

                        let sysRoleItem = {
                            // 注意：新建的时候，后台返回来的数据和编辑时返回来的数据不一样
                            menuId:this.pageType=='new'?item.id:item.menuId,
                            dataAuthority:item.dataAuthority
                        }
                        if(item.userDefined){
                            sysRoleItem.configIds = this.setMaterialKind.configIds
                        }
                        sysRoleData.push(sysRoleItem)
                    })
                    params.menuIds = menuIds;
                    params.sysRoleData = sysRoleData;
                    // 新增角色
                    if(this.pageType=='new'){
                        console.log(params,'编辑提交前参数')
                        this.isSaving = true
                        addRole(params).then(res => {
                            this.isSaving = false
                            if (res.data.code == 0) {
                                this.$router.push('/home/setting/roleAuthorization')
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })
                    }
                    // 编辑角色
                    if(this.pageType=='detail'&&!this.isDetail){
                        params.id=this.roleDetail.id

                        console.log(params,'编辑提交前参数')
                        this.isSaving = true
                        editRole(params).then(res => {
                            this.isSaving = false
                            if (res.data.code == 0) {
                                this.$message({
                                    message: "编辑成功！",
                                    type: "success",
                                    duration: config.elementUI.duration
                                });

                                this.getRoleDetail();
                                this.isDetail=true
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 取消编辑
        async cancelEdit(formName) {
            this.isDetail = true
            this.ruleForm.roleName=this.roleDetail.name
            this.ruleForm.remark=this.roleDetail.remark
            // this.$refs[formName].resetFields();
            await this.getActionAuthList()
            this.initRuleData()

        },
        // 筛选物料分类
        filterMaterailClassifyList(val) {
            if (val) { //val存在
                this.materialKindList = this.backupMaterialKindList.filter((item) => {
                    if (!!~item.no.toLowerCase().indexOf(val.toLowerCase()) || !!~item.name.toLowerCase().indexOf(val.toLowerCase())) {
                        return true
                    }
                })
            } else { //val为空时，还原数组
                this.materialKindList = this.backupMaterialKindList
            }
        },
        // 获取体系层物料规格列表
        // getMaterialSpecList() {
        //     let params = {
        //         userId: JSON.parse(sessionStorage.getItem("user_login")).userId
        //     };
        //     listCommonMaterialsSpecifications(params).then(res => {
        //         this.materialSpecList = res.data;
        //     });
        //
        // },
        // 获取角色操作权限功能点列表
        async getActionAuthList(){
            let result=await actionAuthList({userId: this.userId});
            this.actionAuthList=result.data.data;
            // 添加checkedAuth属性，用于新增和编辑时设置和获取操 作权限的选中值
            this.actionAuthList.forEach(secItem =>{
                secItem.childrenMenuList.forEach(thirdItem => {
                    this.$set(thirdItem,'checkedAuth',[]);
                })
            })

        },
        // 获取数据查看权限
        async getDataAuthList(){
            let result=await dataAuthList({userId: this.userId});
            this.dataAuthList=result.data.data;
            console.log(this.dataAuthList,'数据查看权限')
            // 添加dataAuthority属性，用于新增和编辑时设置和获取 数据查看权限的选中值
            this.dataAuthList.forEach(item =>{
                this.$set(item,'dataAuthority',1);
            })
        },
        async getWorkbaysList(){
            let params={
                facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                groupIds:this.workbaysFilter.groupIds.length?this.workbaysFilter.groupIds:['ALL'],
                keyword:this.workbaysFilter.keyword
            }
            let result=await workbays(params);
            this.workbaysList=result.data.data;

            //是否显示全选按钮
            if(this.workbaysFilter.groupIds.length || this.workbaysFilter.keyword){
                this.showCheckAllBox = false;
            }else{
                this.showCheckAllBox = true;
            }
            // 勾选原来已选中对成员
            // this.setSeletedWorkbays()

        },
        async getEasyGroups(){
            let params={
                facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                token: ''
            }
            let result = await getEasyGroups(params);
            this.groupList = result.data
        },
        initRuleData() {
            // handleConfirm
            this.roleDetail.sysMenu.forEach(sysFirstItem =>{
                //找到选中的一级菜单的下标
                let firstIndex = this.actionAuthList.findIndex(firstItem => sysFirstItem.id == firstItem.id)
                this.$set(this.actionAuthList[firstIndex],'isUsed',true)
                this.$set(this.actionAuthList[firstIndex],'styleDetailBlob',sysFirstItem.styleDetailBlob)
                if(sysFirstItem.styleDetailBlob&&sysFirstItem.styleDetailBlob.length) {
                    this.handleConfirm(sysFirstItem.styleDetailBlob,'designStyleConfigs')
                }
                sysFirstItem.childrenMenuList.forEach(sysSecItem => {
                    //找到选中的二级菜单的下标
                    let secIndex = this.actionAuthList[firstIndex].childrenMenuList.findIndex(secItem => sysSecItem.id == secItem.id)
                    this.$set(this.actionAuthList[firstIndex].childrenMenuList[secIndex],'isUsed',true)
                    this.$set(this.actionAuthList[firstIndex].childrenMenuList[secIndex],'checkedAuth',[])
                    this.$set(this.actionAuthList[firstIndex].childrenMenuList[secIndex],'styleDetailBlob',sysSecItem.styleDetailBlob)
                    if(sysSecItem.styleDetailBlob&&sysSecItem.styleDetailBlob.length) {
                        this.handleConfirm(sysSecItem.styleDetailBlob,'goodsStyleConfigs')
                    }
                    sysSecItem.childrenMenuList.forEach(sysThirdItem => {
                        //找到选中的三级菜单的id
                        let thirdId = this.actionAuthList[firstIndex].childrenMenuList[secIndex].childrenMenuList.find(thirdItem => sysThirdItem.id == thirdItem.id).id
                        this.actionAuthList[firstIndex].childrenMenuList[secIndex].checkedAuth.push(thirdId)
                    })
                    let bool = this.actionAuthList[firstIndex].childrenMenuList[secIndex].checkedAuth.length == this.actionAuthList[firstIndex].childrenMenuList[secIndex].childrenMenuList.length
                    this.$set(this.actionAuthList[firstIndex].childrenMenuList[secIndex],'secondCheckAll',bool)
                })

            })

            this.actionAuthList.forEach(firstItem => {
                this.$set(firstItem,'firstCheckAll',firstItem.childrenMenuList.every(v => v.secondCheckAll==true))
            })
        },
        // 获取角色详情
        async getRoleDetail(){
            let params={
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                id:this.$route.query.id
            }
            let result = await getRoleDetail(params)

            this.roleDetail=result.data.data
            console.log(this.roleDetail,'角色详情')
            // *****设置详情相关信息*****//
            this.ruleForm.roleName=this.roleDetail.name
            this.ruleForm.remark=this.roleDetail.remark
            // 勾选选中的操作权限
            this.initRuleData()




            // 勾选选中的数据查看权限
            this.dataAuthList=this.roleDetail.sysRoleData
            console.log(this.dataAuthList,'编辑时返回的')
            // 赋值选中的成员
            this.selectedWorkerList=this.roleDetail.sysUser
            this.checkedWorkers=[]
            this.roleDetail.sysUser.forEach(item=>{
                    this.checkedWorkers.push(item.id)
            })
        },
        // 启用角色
        async openRole(){
            let result=await validRole({
                id:this.roleDetail.id
            })
            if(result.data.code==0){
                this.isOpenRoleVisible=false
                this.roleDetail.disabled=false
                this.$message({
                    message: "启用角色权限成功！",
                    type: "success",
                    duration: config.elementUI.duration
                });

            } else{
                this.$message({
                    message: result.data.msg,
                    type: "error"
                });
            }
        },
        // 禁用角色
        async closeRole(){
            let result=await invalidRole({
                id:this.roleDetail.id
            })
            if(result.data.code==0){
                this.isCloseRoleVisible=false
                this.roleDetail.disabled=true
                this.$message({
                    message: "禁用角色权限成功！",
                    type: "success",
                    duration: config.elementUI.duration
                });

            } else{
                this.$message({
                    message: result.data.msg,
                    type: "error"
                });
            }
        },
        // 删除角色
        async deleteRole(){
            let result=await deleteRole({
                id:this.roleDetail.id
            })
            if(result.data.code==0){
                this.$router.push('/home/setting/roleAuthorization')
            } else{
                this.$message({
                    message: result.data.msg,
                    type: "error"
                });
            }
        },
        // 显示配置物料分类弹窗
        showSetMaterialKind(){
            // 第一次弹窗的时候或者this.setMaterialKind.configIds没有值的时候
            if(!this.setMaterialKind.configIds.length){
                // 尝试把数据查看权限里面的"物料档案"配置的物料分类拿出来赋值给setMaterialKind.configIds
                let materialKindItem = this.dataAuthList.find(item =>item.userDefined)
                this.setMaterialKind.configIds = materialKindItem?materialKindItem.configIds:[]
                this.setMaterialKind.oldConfigIds = this.setMaterialKind.configIds
            }
            this.setMaterialKind.visible = true
        },
        // 取消设置配置物料分类，还原原来配置的物料分类
        cancelSetMaterialKind(){
            this.setMaterialKind.visible = false
            this.setMaterialKind.configIds = this.setMaterialKind.oldConfigIds.concat()
        },
        confirmSetMaterialKind(){
            this.setMaterialKind.visible = false
            this.setMaterialKind.oldConfigIds = this.setMaterialKind.configIds.concat()
        },
        // 物料分类列表
        listMaterialsKinds() {
            let params = {
                userId: this.userId,
                pageNum:0,
                pageSize:0
            }
            listMaterialsKinds(params).then(res => {
                this.setMaterialKind.optionList = res.data.kindsList
            })
        },
        // 把数据查看权限里面的"物料档案"配置的物料分类拿出来赋值给setMaterialKind.configIds
        setMaterialKindSelected(){
            let materialKindItem = this.dataAuthList.find(item =>item.userDefined)
            this.setMaterialKind.configIds = materialKindItem?item.configIds:[]
        }
    },
    async created() {
        this.loading = true
        if(this.$route.query.pageType=='detail'){
            this.isDetail = true
        }else {
            this.isDetail = false
        }
        this.pageType = this.$route.query.pageType;
        this.getEasyGroups();
        this.listMaterialsKinds();
        await this.getActionAuthList();
        await this.getDataAuthList();
        await this.getWorkbaysList();
        if(this.isDetail){
            await this.getRoleDetail();
        }
        this.loading = false

    }
};
</script>

<style lang="scss" scoped>
.yellow-border-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
        border-left: 6px solid #ffa914;
        line-height: 20px;
        font-size: 20px;
        padding-left: 12px;
        font-weight: normal;
    }
}
.role-info {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .header_line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        height: 68px;
        .header_right {
            font-size: 24px;
        }
    }
    .edit-content {
        position: relative;
        padding: 32px;
        .group-list{
            width: 714px;
            border: 1px solid #e6eaf0;
            .title{
                line-height: 40px;
                padding-left:42px;
                color: #a2abb8;
                background-color:#F0F2F5;
                &.detail{
                  padding-left: 20px;
                }
            }
        }
        .scope-table{
            width: 600px;
        }
        .member-table{
            width: 770px;
            .delete-btn{
                color:#808080;
                cursor: pointer;
                &:hover{
                    color: #3b3b3b;
                }
            }
            .add-row{
                height: 36px;
                color: #ffa914;
                background-color: #fff;
                border: 1px solid #ffa914;
                margin-top: 16px;

            }
        }

    }
    /*添加工位*/
    .add-worker-conent{
        .worker-content{
            margin-top: 16px;
            border: 1px solid #e6eaf0;
            .header{
                line-height: 36px;
                border-bottom: 1px solid #e6eaf0;
                padding: 0 16px;
            }
            .list{
                max-height: 240px;
                padding: 16px 16px 0 16px;
                overflow: auto;
                .item{
                    display: inline-block;
                    width: 33.33%;
                    margin-left: 0;
                    margin-bottom: 18px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
    .open-btn {
        color: #23c811;
        background-color: #fff;
        margin-top: 16px;
        border: none;
        margin-right: 12px;
    }
    .close-btn {
        color: #fa4150;
        background-color: #fff;
        margin-top: 16px;
        margin-right: 12px;
        border: none;
    }
     .close-logo {
         z-index: 98;
         position: absolute;
         right: 40px;
         top: 40px;
         display: inline-block;
         width: 120px;
         height: 114px;
         transform: rotate(20deg);
         background: url(../../../assets/images/pic_disable.png)
    }
    .open-logo{
        display: inline-block;
        width: 75px;
        height: 75px;
        background: url("../../../assets/images/icon_question.png");
        background-size: contain;
    }
}
</style>

<style lang="scss" >
    .role-info {
        .set-material-type-dialog .el-dialog--tiny{
            width: 400px;
        }
        .edit-content {
            .el-tabs__item{
                font-size: 20px;
                margin-bottom: 0;
            }
            .el-tabs__active-bar{
                background-color: #ffa914;
            }
            .scope-table{
                .el-radio + .el-radio{
                    margin-left: 30px;
                }
            }
            .member-table,.scope-table{
                el-table th,
                .el-table__footer-wrapper thead div,
                .el-table__header-wrapper thead div{
                    color: #a2abb8;
                    background-color: #F0F2F5;
                    font-weight: normal;
                }
                .el-table td{
                    height: 48px;
                }
                .el-table__body tr:hover > td{
                    background-color: #fff !important;
                }
                td.select-content{
                    padding: 0;
                    .cell{
                        padding: 0;
                        .el-select{
                            width: 100%;
                            .el-input__inner{
                                height: 48px;
                                border: 1px solid #fff;
                                &:focus,&:hover{
                                    border: 1px solid #ffa914;
                                }
                            }
                        }
                    }
                }
            }

        }
        /*详情状态下*/
        &.detail{
            .el-form-item__label{
                color: #a2abb8;
                &:before{
                    content: none;
                }
            }
        }

        .add-worker-dialog{
            .el-dialog--small{
                width: 730px;
            }
        }
    }
</style>





