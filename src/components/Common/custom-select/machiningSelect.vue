<template>
    <div class="outside-supplier-select">
        <div class="custom-supplier-select">
            <el-select style="width: 100%"
                       :disabled="disabled"
                       popper-class="outside-supplier-bigSel"
                       v-model="value"
                       placeholder="输入名称/编号搜索"
                       filterable
                       clearable
                       :multiple="multiple"
                       :loading="loading"
                       @change="handleChange">
                <el-option v-if="canAdd" :value="''" disabled style="cursor:pointer;">
                    <div style="color: #ff9c38;" @click="addNew">新建</div>
                </el-option>
                <el-option
                        v-for="item in list"
                        :key="item.id"
                        :label="`${item.id==='thisfactory'?item.name:item.code+'-'+item.name}`"
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
                    @hideCover="addSupplierShow=false">
            </add>
        </transition>
        <transition name="opcity">
            <div class="cover" v-if="addSupplierShow" @click="addSupplierShow=false">
            </div>
        </transition>
    </div>
</template>

<script>
    import add from '@/components/outsideFactory/add.vue';
    import {outsideFactoryListForSelect} from '@/api'
    export default {
        name: "machining-select",
        props: ['canAdd','value','multiple','disabled','showSelfFac'],
        components: {add},
        data() {
            return {
                addSupplierShow: false,
                list: [],
                loading: false
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId
            },
            factoryId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },

        },
        methods: {
            addNew() {
                this.addSupplierShow = true;
                $(".outside-supplier-bigSel").css('display','none')
            },
            addSupplierSuccess(val) {
                this.addSupplierShow = false;
                if (val) {
                    this.getList();
                    this.value = val;
                }
            },
            getList() {
                this.loading = true
                outsideFactoryListForSelect({userId: this.userId,factoryId: this.factoryId}).then(res => {
                    this.loading = false
                    this.list = res.data.data || [];
                    if(this.showSelfFac)this.list.unshift({id: 'thisfactory', name: '本厂'});
                })
            },
            handleChange(v) {
                this.$emit('input',v)
            }
        },
        created() {
            this.getList()
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
