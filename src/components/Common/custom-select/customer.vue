<template>
    <div>
        <el-select v-model="value" filterable clearable :disabled="isDisabled"  :remote="type==='filter'" :remote-method="remoteMethod"  @change="manGet"  :multiple="single!=='single'"  :placeholder="placeholder"
                   popper-class="customerSel">
            <div    class="colorSel"
                    v-for="(item,index) in customerList"
                    :key="item.groupId">
                <span :class="{'colorSelGroup':true,'colorSelGroupActive':selGroupId === item.groupId}"  @click="selGroupIdChange(item)">{{item.groupName}}
                 <el-checkbox style="float: right;margin-right: 10px;" @change="groupSelAll(item)" v-model="item.checked" v-if="type==='filter'&&selGroupId === item.groupId"></el-checkbox>
                </span>

                <div class="colorSelGroupUl"  v-show="item.groupId === selGroupId" :style="{'margin-top':'-'+(37+index*30)+'px'}">
                    <el-option value="none" style="display: none !important;height: 0;width: 0;opacity: 0"></el-option>
                    <p v-if="type!=='filter'" @click="addGroupVisibleGo" style="color: #eb8d2f;padding-left: 16px;cursor: pointer;line-height: 40px;">+新建</p>
                    <el-option v-show="item.commonCustomers.length>0" v-for="($item,$index) in item.commonCustomers"   :key="$index"  :label="$item.custName"
                               :value="$item.id"></el-option>
                </div>
            </div>
        </el-select>
        <!--新建弹窗-->
        <transition name="right-move">
            <AddCustomer @toggle="toggle" v-if="addCustomerVisible" :selGroupId="selGroupId"></AddCustomer>
        </transition>
        <transition name="opcity">
            <div class="cover" v-show="addCustomerVisible" @click="addCustomerVisible = false">
            </div>
        </transition>
    </div>

</template>

<script>
    import {getCustomerGroupLists} from '@/api'
    import AddCustomer from '@/components/customer/AddCustomer'
    export default {
        name: "customer",
        props:['single','value','type'],
        components:{AddCustomer},
        data(){
            return {
                checked:false,
                manId:'',
                selGroupId:'',
                addCustomerVisible:false,
                customerList:[],
                customerListBf:[],
            }
        },
        computed: {
            // 计算属性
            unitId(){
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
        },
        created(){
            this.getCustomerGroupLists()
        },
        methods:{
            remoteMethod(val){
                if(this.type === 'filter'){
                    this.customerList = JSON.parse(JSON.stringify(this.customerListBf)).filter(item=>{

                        item.commonCustomers = item.commonCustomers.filter($item=>$item.custName.indexOf(val)>-1)
                        return item.commonCustomers.length
                    } )
                }
            },
            getCustomerGroupLists(){
                getCustomerGroupLists({unitId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        this.customerList = res.data.data
                        this.customerListBf = JSON.parse(JSON.stringify(res.data.data))
                        if(this.type === 'filter'){
                            this.customerList = JSON.parse(JSON.stringify(this.customerListBf)).filter(item=> item.commonCustomers.length)}
                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            groupSelAll(item){
                console.log(this.checked);
                if(item.checked){
                    if(item.commonCustomers){
                        item.commonCustomers.forEach(item=>{
                            if(this.value.indexOf(item.id)===-1){
                                this.value.push(item.id)
                            }
                        })
                    }

                }else {
                    if(item.commonCustomers){
                        item.commonCustomers.forEach(item=>{
                            let index = this.value.indexOf(item.id)
                            if(index>-1){
                                this.value.splice(index,1)
                            }
                        })
                    }
                }

                this.$emit('input',this.value)
            },
            manGet(){
                this.$emit('input',this.value)
            },
            // 点击变化分组
            selGroupIdChange(item){
                this.selGroupId = item.groupId;
                this.checked = false
                // this.selGroup = item;
            },
            addGroupVisibleGo(){
                this.addCustomerVisible=true;

                $('.customerSel').css('display','none')
            },
            toggle(val,data) {
                if (val) {
                    this.value = data.id;
                    this.$emit('input',data.id)
                    this.getCustomerGroupLists();
                }
                this.addCustomerVisible = false

            },
        }
    }
</script>

<style scoped>

</style>
<style  lang="scss">
    .customerSel{
        width: 200px;
        height: 274px;
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
                /*display: none;*/
                position: fixed;
                /*right: 383px;*/
                margin-left: 200px;
                height: 272px;
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

</style>
