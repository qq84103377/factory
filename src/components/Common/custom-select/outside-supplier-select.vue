<template>
    <div class="outside-supplier-select">
        <div class="custom-supplier-select">
            <el-select style="width: 100%"
                popper-class="outside-supplier-bigSel"
                v-model="supplierId"
                :disabled="!canSelect"
                :placeholder="isAll ? '全部' : '请选择或搜索'"
                filterable
                clearable
                :multiple="multiple"
                :loading="loading"
                @change="changeSupplierId">
                <el-option v-if="canAdd" :value="''" disabled style="cursor:pointer;" ref="addOption1">
                    <div style="color: #ff9c38;" @click="handleAdd">新建</div>
                </el-option>
                <el-option
                        ref="addOption2"
                        v-for="item in supOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </div>

        <!--新增和编辑供应商，通用组件-->
        <transition name="right-move">
            <add
                v-if="addSupplierShow"
                type="add"
                @addSuccess="addSupplierSuccess"
                @hideCover="cancelAdd">
            </add>
        </transition>
        <transition name="opcity">
            <div class="cover" v-if="addSupplierShow" @click="cancelAdd">
            </div>
        </transition>
    </div>
</template>

<script>
    import { outsideFactoryListForSelect } from '@/api'
    import add from '@/components/outsideFactory/add.vue';
    export default {
        name: "outside-supplier-select",
        // props:['canAdd','canSelect','parentSupplier','value','multiple','showSelfFac'],
        props: {
            canAdd: {
                type: Boolean,
                default: false,
            },
            canSelect: {
                type: Boolean,
                default: true
            },
            parentSupplier: {
                type: Object,
                default: {}
            },
            multiple: {
                type: Boolean,
                default: false
            },
            showSelfFac: {
                type: Boolean,
                default: false
            }
        },
        /*
            canAdd:是否隐藏新建按钮
            canSelect：是否禁用选择
            parentSupplier： 选中的值（编辑的时候）
            showSelfFac: 是否显示本厂
         */
        data() {
            return {
                addSupplierShow: false,
                supplierId: '',
                supOptions: [],
                loading: false,
                selectDisable: false,
                supplierObj: {},
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
            }
        },
        components:{
            add,
        },
        methods:{
            //供应商搜索
            async remoteMethod() {
                let params = {
                    userId: this.userId,
                    factoryId:JSON.parse(sessionStorage.getItem("last_login")).id,
                };
                await outsideFactoryListForSelect(params).then(res => {
                    if (res.data.code === 0) {
                        this.supOptions = res.data.data;
                        // 如需要显示本厂
                        if(this.showSelfFac)this.supOptions.unshift({id: 'thisfactory', name: '本厂'});
                    }else{
                        this.supOptions = [];
                    }
                });
            },
            //回传供应商
            changeSupplierId(val){

                if(this.multiple){
                    this.$emit('getSupplierId',val);
                    return
                }
                this.getSupplierObj();
                this.$emit('getSupplierId',this.supplierObj);
                // 为以后多选做考虑，这里直接返回数组
                this.$emit('input',this.supplierId?new Array(this.supplierId):[])
            },
            //关闭供应商侧滑栏
            cancelAdd() {

                this.addSupplierShow = false;
            },
            addSupplierSuccess(val) {
                this.addSupplierShow = false;
                if (val) {
                    this.remoteMethod();
                    this.supplierId = val;
                }
            },
            //展开供应商侧滑栏
            handleAdd(){
                //制造点击事件去除下拉框
                // document.querySelector("#app").click()
                $(".outside-supplier-bigSel").css('display','none')
                this.addSupplierShow = true;
            },
            //通过select选择的供应商id封装一个供应商对象
            getSupplierObj(){
                console.log(this.supOptions,'0999')
                if(this.supOptions){
                    this.supplierObj = {}
                    this.supOptions.forEach(item =>{
                        if(item.id == this.supplierId){
                            console.log(1112)
                            this.supplierObj.id = item.id;
                            this.supplierObj.name = item.name;
                            this.supplierObj = {
                                id:item.id,
                                name:item.name
                            }
                        }
                    })
                }
            },
            staticSupplier(val){
                this.supplierId = val.id;
                this.$emit('getSupplierId',val);

            },
            reset() {
                this.supplierId = ''
            }
        },
        watch:{
            'canSelect':function (val) {
                if(val){
                    this.selectDisable = false;
                }else {
                    this.selectDisable = true;
                }
            },
            'parentSupplier.id':function (val) {
                if(this.parentSupplier){
                    this.staticSupplier(this.parentSupplier);

                }
            },
        },
        async mounted(){
            await this.remoteMethod()
            //父组件如果传了供应商数组就进行初始化
            if(this.parentSupplier.id){
                this.staticSupplier(this.parentSupplier);
            }
        },
        async created() {
            await this.remoteMethod()
        }
    }
</script>

<style lang="scss">
    .right-move-enter-active,
    .right-move-leave-active {
        transition: all 0.3s ease;
        transform: translateX(0);
    }

    .right-move-enter,
    .right-move-leave-to {
        transform: translateX(100%);
    }

    .opcity-enter-active,
    .opcity-leave-active {
        transition: all 0.5s ease;
        opacity: 0.5;
    }

    .opcity-enter,
    .opcity-leave-to {
        opacity: 0;
    }

    .cover {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        top: 0;
        left: 0;
        z-index: 2004;
    }
    .outside-supplier-select{
        .el-form-item{
            margin-bottom:22px !important;
        }
    }
</style>
