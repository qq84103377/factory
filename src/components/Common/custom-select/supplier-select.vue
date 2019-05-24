<template>
    <div class="custom-supplier-select">
        <el-select style="width: 100%"
                   v-model="supplierId"
                   :disabled="!canSelect"
                   placeholder="请选择或搜索"
                   filterable
                   clearable
                   remote
                   :remote-method="remoteMethod"
                   :multiple='multiple'
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
        <!--新增和编辑供应商，通用组件-->
        <transition name="right-move">
            <add
                    v-if="addSupplierShow"
                    type="add"
                    @update="getNewSup"
                    @hiddenWindow="cancelAdd"
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
    import { searchSupplier } from '@/api/material.js'
    import add from '@/components/material/materialSupplier/add.vue';
    export default {
        name: "supplier-select",
        // props:['canAdd','canSelect','parentSupplier','value','multiple'],
        props: {
            canAdd: {
                type: Boolean,
                default: false,
            },
            canSelect: {
                type: Boolean,
                default: true,
            },
            parentSupplier: {
                type: Array,
                default: []
            },
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                addSupplierShow: false,
                supplierId: [],
                supOptions: [],
                loading: false,
                selectDisable: false,
                supplierObj: {},
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
            }
        },
        components:{
            add,
        },
        created() {
            this.getList()
        },
        methods:{
            getList(keyword='') {
                let params = {
                    unitId: this.unitId,
                    keyword
                };
                searchSupplier(params).then(res => {
                    if (res.data.code === 0) {
                        this.supOptions = res.data.data;
                    }else{
                        this.supOptions = [];
                    }
                });
            },
            //重置清空筛选框内容
            reset() {
                this.supplierId = []
            },
            //供应商搜索
            remoteMethod(query) {
                // if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        this.getList(query)
                    }, 200);
                // } else {
                //     this.supOptions = [];
                // }
            },
            //回传供应商
            changeSupplierId(){
                this.getSupplierObj();
                this.$emit('getSupplierId',this.supplierObj);
                // 为以后多选做考虑，这里直接返回数组  new Array(this.supplierId)
                this.$emit('input',this.supplierId?this.supplierId:[])
            },
            //关闭供应商侧滑栏
            cancelAdd() {
                this.addSupplierShow = false;
            },
            //展开供应商侧滑栏
            handleAdd(){
                this.addSupplierShow = true;
                console.log(this.$refs);
                // this.$refs.addOption1.handleClose();
            },
            //获取新建的供应商
            getNewSup(val){
                this.supOptions.push(val);
                this.supplierId = val.id;
            },
            //通过select选择的供应商id封装一个供应商对象
            getSupplierObj(){
                if(this.supOptions){
                    this.supplierObj = {}
                    this.supOptions.forEach(item =>{
                        if(item.id === this.supplierId){
                            this.supplierObj.id = item.id;
                            this.supplierObj.name = item.name;
                        }
                    })
                }
            },
            staticSupplier(val){
                this.supOptions = val;
                this.supplierId = val[0].id;
            },
        },
        watch:{
            'canSelect':function (val) {
                if(val){
                    this.selectDisable = false;
                }else {
                    this.selectDisable = true;
                }
            },
            'parentSupplier':function (val) {
                console.log(val);
                if(this.parentSupplier && this.parentSupplier.length){
                    this.staticSupplier(this.parentSupplier);
                }
            }
        },
        mounted(){

            //父组件如果传了供应商数组就进行初始化
            if(this.parentSupplier && this.parentSupplier.length){
                this.staticSupplier(this.parentSupplier);
            }
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

</style>
